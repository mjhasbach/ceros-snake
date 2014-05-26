define([ 'Kinetic', 'underscore', 'settings' ], function( Kinetic, _, settings ){
    var background = {};

    ( function _init() {
        ( function _tilePrototype() {
            background.tile = {
                proto: new Kinetic.Rect({
                    width: settings.background.tile.size,
                    height: settings.background.tile.size
                })
            }
        })();

        ( function _backgrounds() {
            background.loading = new Background();
            background.menu = new Background();
            background.game = new Background();

            function Background() {
                var bg = {
                    list: [],
                    group: new Kinetic.Group,
                    cycleColors: cycleColors
                };

                for ( var x = 0; x < settings.background.tile.quantity.x; x++ ){
                    for ( var y = 0; y < settings.background.tile.quantity.y; y++ ){
                        bg.list.unshift(
                            background.tile.proto.clone({
                                x: x * settings.background.tile.size,
                                y: y * settings.background.tile.size,
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