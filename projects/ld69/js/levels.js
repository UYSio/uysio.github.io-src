define([
    'logic',
    'config',
    'calcs',
], function(logic, config, calcs) {
    "use strict";

    // our planet is a cube, hence 6 faces, hence 6 stencils required.
    // difficulty can increase along these axes:
    // - levelNumber
    // - stencil difficulty
    // - stencil size (once the size increases, use the easier stencils again)
    // - stencil rotation (this can be binary random, i.e. rotate or not)
    function getStencils(levelNumber, levelConfig) {
        var stencilParams = calcs.params(
            levelNumber,
            logic.stencils.length,
            config.level.initStencilWidth
        );

        var stencils = [];
        var stencilsUsed = [];
        var stencilIndices = [];

        // for each of the 6 planet faces
        _.times(6, function () {
            // for each level up to the number of stencils available, bias
            // towards the level number, then cycle
            var randomStencilIndex = calcs.rand(
                levelNumber,
                logic.stencils.length,
                stencilParams.idx);

            if (randomStencilIndex > logic.stencils.length - 1) {
                // TODO fix the bug in calcs.rand where the stencil index is too big
                randomStencilIndex = logic.stencils.length - 1;
            }
            stencilIndices.push(randomStencilIndex);
            var stencilObj = logic.stencils[randomStencilIndex];
            stencilsUsed.push(stencilObj.name);
            var stencil = logic.faces.initFace(stencilParams.width, stencilObj.fn);
            // randomly rotate stencil first (tx prankard@LD)
            stencil = logic.faces.rotate(stencil, calcs.rndRange(0,3));

            stencils.push(stencil);

            // TODO see note on logic.js L133
            // unless this stencil is 'all', also add its inverse.
            // (this means a level can be perfectly completed)
            if (stencilObj.name !== 'all') {
                var inverse = logic.faces.toggle(stencil);
                stencilsUsed.push(stencilObj.name + '.inv');
                stencils.push(inverse);
            }
        });

        // make it fun
        stencils = _.shuffle(stencils);

        // most of the below is for debugging, and the caller will mostly
        // be interested in 'stencils' and 'appliedStencils'.
        // We save the numberOfStencils, because at some point in the animation
        // it is good to know this value, but it can't be derived from
        // stencils.length anymore, because 'stencils' are mutated.
        return {
            level: levelNumber,
            stencilWidth: stencilParams.width,
            stencils: stencils,
            numberOfStencils: stencils.length,
            appliedStencils: logic.faces.initFaces(6, stencilParams.width),
            debug: {
                stencilsUsed: stencilsUsed,
                stencilIndices: stencilIndices,
                noOfStencilsAvailable: logic.stencils.length
            }
        };
    }

    var level = function(world) {
        var levelNumber = world.progress.levelNumber;
        // get stencils
        var stencils = getStencils(levelNumber, config.level);

        var planes = _.map(stencils.stencils, function(stencil, idx) {
            var plane = getPlaneFromStencil(idx, stencil, config.width, stencils.stencils.length);
            world.props.container.add(plane.mesh);
            return plane;
        });

        return {
            planes: planes,
            stencils: stencils
        };
    };

    // reusable materials
    var visibleMaterial = new THREE.MeshBasicMaterial({
        color: config.stencilColour,
        side: THREE.DoubleSide
    });
    var invisibleMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    var materials = [
        visibleMaterial,
        invisibleMaterial
    ];

    function getPlaneFromStencil(idx, stencil, width, numberOfStencils) {
        // draw a plane based on stencil
        var geometry = new THREE.PlaneGeometry(
            width,
            width,
            stencil.length,
            stencil.length);

        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        var z = calcs.stencilZ(idx, numberOfStencils);
        mesh.position.set(0, 0, z);

        // faces are triangles, but we want squares (i.e. pairs of triangles)
        var squareCount = geometry.faces.length / 2;

        // flatten the stencil from 2-dim array so we can easily index it.
        var flatStencil = _.flatten(stencil);
        for (var i = 0; i < squareCount; i++) {
            var j = i * 2;
            geometry.faces[j].materialIndex = flatStencil[i] ? 0 : 1;
            geometry.faces[j + 1].materialIndex = flatStencil[i] ? 0 : 1;
        }

        return {
            name: 'plane',
            geometry: geometry,
            mesh: mesh
        };
    }

    var creepGain = function (levelNumber) {
        var g = config.level.creepGain;
        return (levelNumber + 1) * g;
    };

    return {
        getLevel: level,
        getGain: creepGain
    };
});
