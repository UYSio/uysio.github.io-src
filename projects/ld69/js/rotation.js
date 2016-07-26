define([], function() {
    "use strict";

    /**
     *

A cube's face indeces are:


       +-----+
       |     |
       |  1  |
       |     |
 +-----+-----+-----+-----+
 |     |     |     |     |
 |  5  |  3  |  4  |  2  |
 |     |     |     |     |
 +-----+-----+-----+-----+
       |     |
       |  0  |
       |     |
       +-----+

The starting position is:

     \  2
      \_______
      |
    1 |  4
      |

     */
    function get(world) {
        var planet = world.props.planet.mesh;
        var rcFront = world.props.raycasters.front;
        var rcSide = world.props.raycasters.side;

        // front face index
        var intersectFront = rcFront.intersectObject(planet)[0];
        var frontIndex = norm(intersectFront.faceIndex);

        // side face index
        var intersectSide = rcSide.intersectObject(planet)[0];
        var sideIndex = norm(intersectSide.faceIndex);

        // nested array order isn't important, but the number order is
        // (the starting number also isn't important)
        var lookup = [
            [4, 2, 5, 3], //0
            [4, 3, 5, 2], //1
            [4, 1, 5, 0], //2
            [4, 0, 5, 1], //3
            [2, 0, 3, 1], //4
            [2, 1, 3, 0], //5
        ];

        return {
            face: frontIndex,
            rotations: lookup[frontIndex].indexOf(sideIndex)
        };
    }

    // A cube's face has 2 triangles, so e.g. we might get
    // 8 or 9 for the same face, which we convert to a 4.
    function norm(fi) {
        return (fi % 2 == 0 ? fi : fi - 1) / 2;
    }

    return {
        get: get
    };
});
