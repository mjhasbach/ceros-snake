require.config({
    paths: {
        // Dependencies
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
        Kinetic: '../deps/kinetic-v5.1.0',
        kineticEditableText: '../deps/kinetic.editable-mjhasbach-fork',
        underscore: '../deps/underscore-v1.6.0.min',

        // Modules
        assets: 'assets',
        audio: 'audio',
        background: 'background',
        events: 'events',
        game: 'game',
        highScores: 'highScores',
        loading: 'loading',
        menu: 'menu',
        settings: 'settings',
        stage: 'stage',
        util: 'util',
        webFonts: 'webFonts'
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

requirejs([ 'loading' ]);