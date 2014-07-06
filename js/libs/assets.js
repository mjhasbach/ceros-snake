define([ 'audio', 'webFonts', 'menu', 'game', 'highScores' ],
    function( audio, webFonts, menu, game, highScores ){
        var assets = {
            audio: audio,

            menu: menu,

            game: game,

            highScores: highScores,

            waitForAsync: function wait( cb ){
                if ( audio.song.isLoaded && webFonts.areLoaded ) cb();
                else setTimeout( wait, 100, cb )
            },

            init: function( options ){
                assets.game.init( options );
                assets.menu.init( options );
                assets.highScores.init( options )
            }
        };

        return assets
    }
);