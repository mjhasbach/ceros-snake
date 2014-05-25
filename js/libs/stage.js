define([ 'jquery', 'underscore', 'Kinetic', 'settings', 'util' ],
    function( $, _, Kinetic, settings, util ){
        var originalWidth = util.calculate.dimensions.width();

        var stage = new Kinetic.Stage({
            container: settings.stage.container.name,
            width: originalWidth,
            height: util.calculate.dimensions.height()
        });

        $( window ).resize( function() {
            var scale = window.innerWidth / originalWidth;

            stage.size({ width: window.innerWidth, height: window.innerHeight });
            stage.scale({ x: scale, y: scale });
        });

        return stage
    }
);