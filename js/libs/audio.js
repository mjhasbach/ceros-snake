define([ 'buzz', 'settings' ], function( buzz, settings ){
    var audio = {
        song: {
            isLoaded: false,

            mp3: new buzz.sound( settings.song.path )
                .bind( 'loadeddata', function() {
                    audio.song.isLoaded = true
                }
            )
        }
    };

    return audio
});