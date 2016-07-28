define([], function () {
    "use strict";

    return {
        background: 'img/stars.jpg',
        // everything is square, so we'll re-use width.
        width: 200,
        // how far the stencils are from the planet
        distance: 400,
        stencilColour: 0xffff00,
        level: {
            // the number of levels after which stencil size and difficulty changes
            threshold: 7,
            initStencilWidth: 3,
            creepGain: 0.05
        },
        // number of misses at which player looses
        threshold: 42, // change this in index.html too...
        loose: [
            "Coloniser? Colonoscopy!",
            "A colony felony...",
            "A colony comedy. But, I cry.",
            "Colony prodigy? Colony wannabe!",
            "Honestly, a colony irony.",
            "You're in the colony family NO MORE.",
            "Ugh."
        ]
    };
});
