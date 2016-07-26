define([], function () {
    "use strict";

    // string representation of a 2 or 3 nested array of booleans
    function draw(arr) {
        var tostring = _.reduce(arr, function (acco, st) {
            return acco + '\n' + _.reduce(st, function (acci, s) {
                if (s instanceof Array) {
                    return acci + '\n' + _.reduce(s, function (acc, r) {
                        return acc + (r ? "+" : "o");
                    }, '');
                } else {
                    return acci + (s ? "+" : "o");
                }
            }, '');
        }, '');
        return tostring;
    }
    return {
        toString: draw
    };
});
