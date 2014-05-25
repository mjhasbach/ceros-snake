require.config({
    paths: {
        // Dependencies
        async: '../deps/requirejs-plugins-v1.0.3/async',
        goog: '../deps/requirejs-plugins-v1.0.3/goog',
        font: '../deps/requirejs-plugins-v1.0.3/font',
        propertyParser: '../deps/requirejs-plugins-v1.0.3/propertyParser',
        buzz: '../deps/buzz-v1.1.0.min',
        jquery: '../deps/jquery-v1.11.1.min',
        Kinetic: '../deps/kinetic-v5.1.0',
        screenFull: '../deps/screenfull-v1.1.1.min',
        underscore: '../deps/underscore-v1.6.0.min',

        // Modules
        assets: 'assets',
        audio: 'audio',
        background: 'background',
        events: 'events',
        game: 'game',
        loading: 'loading',
        menu: 'menu',
        settings: 'settings',
        stage: 'stage',
        util: 'util',
        webFonts: 'webFonts'
    }
});

requirejs([ 'loading' ]);