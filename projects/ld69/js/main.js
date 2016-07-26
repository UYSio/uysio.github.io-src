requirejs.config({
    baseUrl: 'js',
    shim: {
        'vendor/three': {
            exports: 'THREE'
        }
    },
    paths: {
        lodash: 'vendor/lodash/lodash',
        tween: 'vendor/tween',
        promise: 'vendor/es6-promise/es6-promise.min'
    }
});
requirejs(['app'], function(App) {
    "use strict";

    App.start();
});
