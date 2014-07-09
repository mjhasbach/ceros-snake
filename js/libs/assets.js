define([ 'audio', 'webFonts' ],
    function( audio, webFonts ){
        return {
            audio: audio,

            waitForAsync: function wait( cb ){
                if ( audio.song.isLoaded && webFonts.areLoaded ) cb();
                else setTimeout( wait, 100, cb )
            },

            init: function( cb ){
                require([ 'menu', 'game', 'highScores' ],
                    function( menu, game, highScores ){
                        cb({
                            menu: menu,
                            game: game,
                            highScores: highScores
                        })
                    }
                );
            }
        }
    }
);