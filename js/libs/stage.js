define([ 'jquery', 'underscore', 'Kinetic', 'settings', 'util' ],
    function( $, _, Kinetic, settings, util ){
        var stage = new Kinetic.Stage({
            container: settings.stage.container.name,
            width: util.calculate.dimensions.original.width(),
            height: util.calculate.dimensions.original.height()
        });

        $( window ).resize( function() {
            stage.size({ width: window.innerWidth, height: window.innerHeight });

            stage.scale({
                x: util.calculate.dimensions.scale(),
                y: util.calculate.dimensions.scale()
            })
        });

        return stage
    }
);