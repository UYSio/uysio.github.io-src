define([], function() {
    "use strict";

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    // Returns a random number between min (inclusive) and max (exclusive)
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function addPlanet(size, pos) {
        size = size || 200;
        pos = pos || 0;
        var geometry = new THREE.BoxGeometry(size, size, size);
        geometry.name = "planet";
        // 100 - 256
        var r = getRandomArbitrary(100, 256); // green to blue for planets with LIFE!

        // TODO use one colour, and a point light!
        var colors = _.times(6, function(i) {
            return new THREE.Color("hsl(" + r + ", 100%, " + ((i+1) * 10) + "%)");
        });

        for (var i = 0; i < 6; i++) {
            geometry.faces[2 * i].color = colors[i];
            geometry.faces[2 * i + 1].color = colors[i];
        }

        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            vertexColors: THREE.FaceColors,
            side: THREE.DoubleSide // raycast from within planet
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = "planet";
        mesh.position.set(pos, 0, 0);

        return {
            name: 'planet',
            geometry: geometry,
            mesh: mesh
        };
    };

    function getRaycaster(container, direction) {
        var matrix = new THREE.Matrix4();
        matrix = matrix.extractRotation(container.matrix);

        direction = direction.applyMatrix4(matrix).normalize();

        var raycaster = new THREE.Raycaster();
        raycaster.set(container.position, direction);
        return raycaster;
    }

    var addProps = function(scene) {
        var container = new THREE.Object3D();

        var planet = addPlanet();
        container.add(planet.mesh);

        // tilt the container
        container.rotateX(Math.PI / 180 * 15);
        container.rotateY(Math.PI / 180 * 60);
        container.position.set(-500, 0, 0);

        scene.add(container);
        scene.updateMatrixWorld(true);

        // get raycaster from origin (where planet will be)
        // now that the container has been rotated
        var frontCaster = getRaycaster(container, new THREE.Vector3(0, 0, 1));
        var sideCaster = getRaycaster(container, new THREE.Vector3(0, 1, 0));

        return {
            container: container,
            planet: planet,
            raycasters: {
                front: frontCaster,
                side: sideCaster
            }
        };
    };

    return {
        addToScene: addProps
    };
});
