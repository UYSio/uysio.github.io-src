define(['controls', 'config', 'promise'], function(controls, config, promise) {
    "use strict";

    // background returns its own camera, because we
    // might decide to start moving the game camera at some point.
    function background() {
        // Load the background texture
        // (courtesy https://www.pexels.com/search/milky%20way/)
        var loader = new THREE.TextureLoader();

        var promise = new Promise(function(resolve, reject) {
            loader.load(
                // resource URL
                config.background,
                // Function when resource is loaded
                function(texture) {
                    var mesh = new THREE.Mesh(
                        new THREE.PlaneGeometry(2, 2, 0),
                        new THREE.MeshBasicMaterial({
                            map: texture
                        }));

                    mesh.material.depthTest = false;
                    mesh.material.depthWrite = false;

                    // Create your background scene
                    var scene = new THREE.Scene();
                    var camera = new THREE.Camera();
                    scene.add(camera);
                    scene.add(mesh);
                    var result = {
                        scene: scene,
                        camera: camera
                    };
                    resolve(result);
                },
                // Function called when download progresses
                function(xhr) {
                    //console.log('Background image', (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // Function called when download errors
                function(xhr) {
                    reject(Error("could not download", config.background));
                }
            );
        });

        return promise;
    }

    var init = function() {
        var scene, camera, renderer;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);

        var container = document.getElementById('world');
        container.appendChild(renderer.domElement);

        return {
            scene: scene,
            camera: camera,
            background: background(),
            renderer: renderer,
            hud: {
                level: document.getElementById('level'),
                score: document.getElementById('score'),
                missed: document.getElementById('missed'),
                message: document.getElementById('message'),
                info: document.getElementById('info')
            }
        };
    };

    return {
        getStage: init,
        getKeyboard: function() {
            return new controls.keyboard();
        }
    };
});
