define([ 'Kinetic', 'underscore', 'settings', 'util' ], function( Kinetic, _, settings, util ){
    var background = {};

    ( function _init() {
        ( function _calculations() {
            background.tile = {};

            background.tile.quantity = { x: 32, y: 18 };

            background.tile.size = util.calculate.dimensions.original.width() /
                background.tile.quantity.x;
        })();

        ( function _tile() {
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
                    group: new Kinetic.Group,

                    tile: {
                        list: [],

                        quantity: background.tile.quantity,

                        size: background.tile.size
                    }
                };

                bg.cycleColors = function() {
                    this.forEach( function( tile ){
                        tile.fill( settings.background.tile.color.random() )
                    })
                }.bind( bg.tile.list );

                for ( var x = 0; x < background.tile.quantity.x; x++ ){
                    for ( var y = 0; y < background.tile.quantity.y; y++ ){
                        bg.tile.list.unshift(
                            background.tile.proto.clone({
                                x: x * background.tile.size,
                                y: y * background.tile.size,
                                fill: settings.background.tile.color.random()
                            })
                        );

                        bg.group.add( bg.tile.list[ 0 ])
                    }
                }

                return bg
            }
        })()
    })();

    return background;
});