define([ 'Kinetic', 'underscore', 'settings' ], function( Kinetic, _, settings ){
    var background = {
        tile: {
            list: []
        }
    };

    background.tile.cycleColors = function() {
        background.tile.list.forEach( function( tile ){
            tile.fill( settings.background.tile.color.random() )
        });
    };

    var init = [
        _.once( function _tilePrototype() {
            background.tile.proto = new Kinetic.Rect({
                width: settings.background.tile.size,
                height: settings.background.tile.size
            });
        }),

        _.once( function _backgrounds() {
            var tile;

            background.loading = new Kinetic.Group;

            for ( var x = 0; x < settings.background.tile.quantity.x; x++ ){
                for ( var y = 0; y < settings.background.tile.quantity.y; y++ ){
                    tile = background.tile.proto.clone({
                        x: x * settings.background.tile.size,
                        y: y * settings.background.tile.size,
                        fill: settings.background.tile.color.random()
                    });

                    background.tile.list.push( tile );
                    background.loading.add( tile );
                }
            }

            background.menu = background.loading.clone();
            background.game = background.loading.clone();
        })
    ];

    init.forEach( function( constructor ){ constructor() });

    return background
});