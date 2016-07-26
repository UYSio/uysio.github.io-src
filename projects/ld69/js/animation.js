define([
    'config',
    'tween',
    'slammer',
    'rotation',
    'util',
    'logic',
    'calcs'
], function(config, tween, slammer, rotation, util, logic, calcs) {
    "use strict";

    var isAnimatingCube = false;
    var isAnimatingPlanes = false;

    function getDeltaForDirection(direction) {
        var state = {};
        switch (direction) {
            case 'a': // left
                state = {
                    axis: new THREE.Vector3(0, -1, 0)
                };
                break;
            case 'd': // right
                state = {
                    axis: new THREE.Vector3(0, 1, 0)
                };
                break;
            case 'w': // up
                state = {
                    axis: new THREE.Vector3(-1, 0, 0)
                };
                break;
            case 's': // down
                state = {
                    axis: new THREE.Vector3(1, 0, 0)
                };
                break;
            case 'q': // roll left
                state = {
                    axis: new THREE.Vector3(0, 0, 1)
                };
                break
            case 'e': // roll right
                state = {
                    axis: new THREE.Vector3(0, 0, -1)
                };
                break
        }
        return state;
    }
    // Rotate a mesh around an arbitrary axis in world space
    // From http://stackoverflow.com/a/11060965/51280
    function rotateAroundWorldAxis(mesh, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        rotWorldMatrix.multiply(mesh.matrix);

        mesh.matrix = rotWorldMatrix;
        mesh.rotation.setFromRotationMatrix(mesh.matrix);
    }

    var rotatePlanet = function(world, direction) {
        if (!isAnimatingCube) {
            var state = getDeltaForDirection(direction);

            var previous = 0; // for rotation tweening, not motion tweening
            new tween.Tween({
                    pos: 0
                })
                .to({
                    pos: Math.PI / 2
                }, 200)
                .onStart(function() {
                    isAnimatingCube = true;
                })
                .onUpdate(function() {
                    rotateAroundWorldAxis(world.props.planet.mesh, state.axis, this.pos - previous);
                    previous = this.pos;
                })
                .onComplete(function() {
                    isAnimatingCube = false;
                    world.stage.scene.updateMatrixWorld();
                }).start();
        }
    };

    var slam = function(world) {
        if (!isAnimatingPlanes && !isAnimatingCube && world.level.planes.length > 0) {

            var positions = _.reduce(world.level.planes, function(acc, plane, idx) {
                var z = plane.mesh.position.z;
                var endPos = calcs.stencilZ(idx, world.level.stencils.numberOfStencils);
                if (idx == 0) {
                    // right above planet's surface
                    endPos = (config.width / 2) + 1;
                }
                return {
                    start: _.concat(acc.start, z),
                    end: _.concat(acc.end, endPos)
                };
            }, {
                start: [],
                end: []
            });

            var tweenStart = Object.assign({}, positions.start);
            var tweenEnd = Object.assign({}, positions.end);

            new tween.Tween(tweenStart)
                .to(tweenEnd, 200)
                .onStart(function() {
                    isAnimatingPlanes = true;
                })
                .onUpdate(function() {
                    var self = this;
                    _.each(world.level.planes, function(plane, idx) {
                        plane.mesh.position.set(0, 0, self[idx]);
                    });
                })
                .onComplete(function() {
                    isAnimatingPlanes = false;
                    world.stage.scene.updateMatrixWorld();

                    // the plane/stencil to slam into the planet
                    var stencil = _.head(world.level.stencils.stencils);
                    var plane = _.head(world.level.planes);

                    var rots = rotation.get(world);
                    var appliedIdx = rots.face;
                    var rotations = rots.rotations;

                    // mutate 'appliedStencils'
                    slammer.slamStencil(
                        world.level.stencils.appliedStencils,
                        appliedIdx,
                        stencil,
                        rotations);

                    // mutate the planet to reflect 'appliedStencils'
                    slammer.slamPlane(world, plane);

                    // the first plane/stencil is now used up
                    world.level.planes = _.tail(world.level.planes);
                    world.level.stencils.stencils = _.tail(world.level.stencils.stencils);


                    world.progress.scores[world.progress.levelNumber] = logic.faces.calc(world.level.stencils.appliedStencils);

                    if (_.isEmpty(world.level.planes)) {
                        world.progress.missed += world.progress.scores[world.progress.levelNumber].off;
                        world.level = null; // done with this level
                        slammer.unslam(world);
                    }
                })
                .start();
        }
    };

    return {
        rotatePlanet: rotatePlanet,
        slam: slam
    };
});
