define([ 'Kinetic', 'underscore', 'settings', 'util' ], function( Kinetic, _, settings, util ){
    var background = {};

    ( function _init() {
        ( function _calculations() {
            background.tile = {};

            background.tile.quantity = { x: 32, y: 18 };

            background.tile.size = util.calculate.dimensions.original.width() /
                background.tile.quantity.x;
        })();

        ( function _tilePrototype() {
            background.tile.proto = new Kinetic.Rect({
                width: background.tile.size,
                height: background.tile.size
            })
        })();

        ( function _backgrounds() {
            background.loading = new Background();
            background.menu = new Background();
            background.game = new Background();

            function Background() {
                var bg = {
                    list: [],
                    group: new Kinetic.Group,
                    cycleColors: cycleColors,
                    tile: {
                        quantity: background.tile.quantity,
                        size: background.tile.size
                    }
                };

                for ( var x = 0; x < background.tile.quantity.x; x++ ){
                    for ( var y = 0; y < background.tile.quantity.y; y++ ){
                        bg.list.unshift(
                            background.tile.proto.clone({
                                x: x * background.tile.size,
                                y: y * background.tile.size,
                                fill: settings.background.tile.color.random()
                            })
                        );

                        bg.group.add( bg.list[ 0 ])
                    }
                }

                return bg
            }

            function cycleColors( list ){
                list.forEach( function( tile ){
                    tile.fill( settings.background.tile.color.random() )
                });
            }
        })()
    })();

    return background;
});