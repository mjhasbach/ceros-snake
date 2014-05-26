define([ 'audio', 'webFonts', 'menu', 'game' ],
    function( audio, webFonts, menu, game ){
        var assets = { menu: menu, game: game, audio: audio };

        _.extend( assets, {
            waitForAsync: function wait( cb ){
                if ( audio.song.isLoaded && webFonts.areLoaded ) cb();
                else setTimeout( wait, 100, cb )
            },

            init: _.once( function( options ){
                assets.game.init( options );
                assets.menu.init( options )
            })
        });

        return assets
    }
);