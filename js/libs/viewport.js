define([ 'jquery', 'underscore', 'Kinetic', 'settings' ],
    function( $, _, Kinetic, settings ){
        var viewport = {
            stage: new Kinetic.Stage({
                container: settings.stage.container.name,
                width: window.innerWidth,
                height: window.innerHeight
            }),

            scale: function() {
                return viewport.dimensions.aspect().width /
                    viewport.dimensions.original.width
            },

            dimensions: {
                aspect: function() {
                    var dimensions = {
                        width: window.innerWidth,
                        height: window.innerHeight
                    };

                    if ( 9 * dimensions.width / 16 < dimensions.height )
                        dimensions.height = Math.floor( 9 * dimensions.width / 16 );
                    else
                        dimensions.width = Math.floor(( dimensions.height / 9 ) * 16 );

                    return dimensions
                }
            }
        };

        viewport.dimensions.original = viewport.dimensions.aspect();

        $( window ).resize( function() {
            viewport.stage.size({
                width: window.innerWidth,
                height: window.innerHeight
            });

            viewport.stage.scale({
                x: viewport.scale(),
                y: viewport.scale()
            })
        });

        return viewport;
    }
);