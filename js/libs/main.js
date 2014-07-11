require.config({
    paths: {
        async: '../deps/requirejs-plugins-v1.0.3/async',
        goog: '../deps/requirejs-plugins-v1.0.3/goog',
        font: '../deps/requirejs-plugins-v1.0.3/font',
        propertyParser: '../deps/requirejs-plugins-v1.0.3/propertyParser',
        backbone: '../deps/backbone-v.1.1.2.min',
        backfire: '../deps/backfire',
        bigScreen: '../deps/BigScreen-mjhasbach-fork',
        buzz: '../deps/buzz-v1.1.0.min',
        firebase: '../deps/firebase-v1.0.15.min',
        jquery: '../deps/jquery-v1.11.1.min',
        Kinetic: '../deps/kinetic.min',
        kineticEditableText: '../deps/kinetic.editable',
        underscore: '../deps/underscore-v1.6.0.min'
    },

    shim: {
        'firebase': {
            exports: 'Firebase'
        },

        'underscore': {
            exports: '_'
        },

        'backbone': {
            deps: [ 'underscore', 'jquery' ],
            exports: 'Backbone'
        },

        'backfire': {
            deps: [ 'backbone', 'firebase', 'underscore' ]
        }
    }
});

require([ 'loading' ]);