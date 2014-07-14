define([ 'audio', 'webFonts' ],
    function( audio, webFonts ){
        return {
            audio: audio,

            waitForAsync: function wait( cb ){
                if ( audio.song.isLoaded && webFonts.areLoaded ) cb();
                else setTimeout( wait, 100, cb )
            },

            init: function( cb ){
                require([ 'game', 'highScores', 'lobby', 'menu' ],
                    function( game, highScores, lobby, menu ){
                        cb({
                            game: game,
                            highScores: highScores,
                            lobby: lobby,
                            menu: menu
                        })
                    }
                );
            }
        }
    }
);