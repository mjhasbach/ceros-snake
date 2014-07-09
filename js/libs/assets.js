define([ 'audio', 'webFonts', 'menu', 'game', 'highScores' ],
    function( audio, webFonts, menu, game, highScores ){
        return {
            audio: audio,

            menu: menu,

            game: game,

            highScores: highScores,

            waitForAsync: function wait( cb ){
                if ( audio.song.isLoaded && webFonts.areLoaded ) cb();
                else setTimeout( wait, 100, cb )
            },

            init: function( options ){

            }
        }
    }
);