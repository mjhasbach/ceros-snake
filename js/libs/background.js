define([ 'Kinetic', 'underscore', 'settings', 'util' ], function( Kinetic, _, settings, util ){
    var background = {};

    ( function _init() {
        ( function _tile() {
            background.tile = {};

            background.tile.quantity = { x: 32, y: 18 };

            background.tile.size = util.calculate.dimensions.original.width() /
                background.tile.quantity.x;

            background.tile.proto = new Kinetic.Rect({
                width: background.tile.size,
                height: background.tile.size
            })
        })();

        ( function _backgrounds() {
            background.loading = new Background();

            background.loading.sine = new util.SineHelper();

            background.loading.isReadyToCycle = function( sine ){
                return background.loading.sine.directionChanged( sine )
            };


            background.game = new Background();

            background.game.countDown = {};

            background.game.countDown.queue = [
                background.game.animation.draw.number.three,
                background.game.animation.draw.number.two,
                background.game.animation.draw.number.one
            ];

            background.game.countDown.isReadyToCycle = function( frame ){
                return frame.time - background.game.lastCycleTime >= settings.animation.period * 2
            };

            background.game.countDown.number = background.game.countDown.queue.length + 1;

            background.game.countDown.animation = function( frame ){
                if ( background.game.countDown.isReadyToCycle( frame ) &&
                     background.game.countDown.number > 0 ){

                    background.game.animation.randomize( frame );

                    if ( background.game.countDown.number > 1 ){
                        background.game.countDown.queue.push(
                            background.game.countDown.queue.shift()(
                                settings.background.countDown.coords.x,
                                settings.background.countDown.coords.y
                            )
                        );
                    }

                    background.game.countDown.number--;

                    if ( settings.debug && background.game.countDown.number > 0 )
                        console.log( 'Countdown at "' + background.game.countDown.number + '"' );

                    else console.log( 'Stopping countdown' )
                }
            };

            background.menu = new Background();

            function Background() {
                var bg = {
                    group: new Kinetic.Group,

                    lastCycleTime: 0,

                    tile: {
                        list: [],

                        quantity: background.tile.quantity,

                        size: background.tile.size
                    },

                    random: {
                        color: {
                            tile: function() {
                                return settings.background.tile.colors[ Math.round( Math.random() * ( settings.background.tile.colors.length - 1 ))]
                            },

                            draw: function() {
                                return settings.background.draw.colors[ Math.round( Math.random() * ( settings.background.draw.colors.length - 1 ))]
                            }
                        }
                    },

                    animation: {
                        randomize: function( frame ){
                            bg.tile.list.forEach( function( tile ){
                                tile.fill( bg.random.color.tile() )
                            });

                            bg.lastCycleTime = frame.time;
                        },

                        draw: {
                            number: { // Randomly change the color of background tiles into shapes of numbers at the specified coordinates
                                one: function one( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 5; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Middle
                                    for( x = xCoord + 3; x < xCoord + 5; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 8; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Bottom
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 8; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    return one
                                },

                                two: function two( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // "Top-Middle Connector"
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 4; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Middle
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 4; y < yCoord + 6; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // "Middle-Bottom Connector"
                                    for( x = xCoord; x < xCoord + 2; x++ ){
                                        for ( y = yCoord + 6; y < yCoord + 8; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Bottom
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 8; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    return two
                                },

                                three: function three( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Back
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 8; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Middle
                                    for( x = xCoord + 3; x < xCoord + 6; x++ ){
                                        for ( y = yCoord + 4; y < yCoord + 6; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Bottom
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 8; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    return three
                                }
                            }
                        }
                    },

                    cleanUp: function() {
                        bg.lastCycleTime = 0;

                        if ( typeof bg.countDown.number === 'number' )
                            bg.countDown.number = background.game.countDown.queue.length + 1
                    }
                };

                function randomDrawColor( xCoord, yCoord ){
                    bg.tile.list.forEach( function( tile ){
                        if ( tile.x().toCoord() == xCoord &&
                             tile.y().toCoord() == yCoord ){

                            tile.fill( bg.random.color.draw() )
                        }
                    })
                }

                for ( var x = 0; x < background.tile.quantity.x; x++ ){
                    for ( var y = 0; y < background.tile.quantity.y; y++ ){
                        bg.tile.list.unshift(
                            background.tile.proto.clone({
                                x: x * background.tile.size,
                                y: y * background.tile.size,
                                fill: bg.random.color.tile()
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