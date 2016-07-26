define([
    'tween',
    'animation',
    'levels',
    'config'
], function(tween, animation, levels, config) {
    "use strict";

    var setup = function (world) {
        world.stage.background.then(function (result) {

            world.stage.background = result;

            loop(world);
        }, function (err) {
            console.error('Game loop aborted.');
        });
    };

    var deathMessage;

    var loop = function (world) {
        requestAnimationFrame(function() {
            loop(world);
        });

        // load level
        if (!world.level) {

            // set the level number
            if (!('progress' in world)) {
                world.progress = {
                    levelNumber: 0,
                    scores: [],
                    missed: 0
                };
            } else {
                ++world.progress.levelNumber;
            }

            var level = levels.getLevel(world);
            world.level = level;
            console.log(
                'LEVEL',
                world.level.stencils.level,
                world.level.stencils.debug.stencilsUsed
            );
        }

        world.stage.hud.missed.innerHTML = world.progress.missed;

        if (world.progress.missed > config.threshold) {
            // Lost...
            var x = -0.005;
            var y = 0.01;
            var z = 0.005;


            if (!deathMessage) {
                deathMessage = _.sample(config.loose);
            }
            world.stage.hud.message.innerHTML = deathMessage + "<br>You were ejected. Rejected. YOU LOOSE!";
            world.props.planet.mesh.rotation.x += x;
            world.props.planet.mesh.rotation.y += y;
            world.props.planet.mesh.rotation.z += z;
            _.each(world.level.planes, function (plane, idx) {
                var m = idx == 0 ? 0.01 : idx / 100;
                plane.mesh.rotation.x += x + m;
                plane.mesh.rotation.y += y + m;
                plane.mesh.rotation.z += z + m;
            });
            world.props.container.rotation.x += x;
            world.props.container.rotation.y += y;
            world.props.container.rotation.z += z;
        } else {
            // STILL IN PLAY
            _.each(['a', 'd', 'w', 's', 'q', 'e', 'space'], function (direction) {
                if (world.keyboard.pressed(direction)) {
                    if (direction === 'space') {
                        // slam the colonisers
                        animation.slam(world);
                    } else {
                        // rotate the world
                        animation.rotatePlanet(world, direction);
                    }
                    return false; // break
                }
            });

            // update hud
            world.stage.hud.level.innerHTML = world.progress.levelNumber;
            var score = _.reduce(world.progress.scores, function (acc, score) {
                if (score) {
                    acc.on += score.on;
                    acc.off += score.off;
                }

                return acc;
            }, {on: 0, off: 0});

            world.stage.hud.score.innerHTML = score.on;
        }



        tween.update();

        world.stage.renderer.autoClear = false;
        world.stage.renderer.clear();
        world.stage.renderer.render(
            world.stage.background.scene,
            world.stage.background.camera
        );
        world.stage.renderer.render(world.stage.scene, world.stage.camera);
    };


    return {
        setup: setup
    };
});
