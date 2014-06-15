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

            background.game.count.down = {};

            background.game.count.down.queue = [
                background.game.animation.draw.number.three,
                background.game.animation.draw.number.two,
                background.game.animation.draw.number.one
            ];

            background.game.count.down.number = background.game.count.down.queue.length + 1;

            background.game.count.down.isReadyToCycle = function ( frame ){
                return frame.time - background.game.lastCycleTime >= settings.animation.period * 2
            };

            background.game.count.down.animation = function ( frame ){
                ( function ( countDown ){
                    if ( countDown.isReadyToCycle( frame )){

                        background.game.draw.randomize( frame );

                        if ( countDown.number > 1 ){

                            countDown.queue[ 0 ](
                                settings.background.countDown.coords.x,
                                settings.background.countDown.coords.y
                            );

                            countDown.queue.push( countDown.queue.shift() )
                        }

                        countDown.number--;

                        if ( settings.debug )
                            console.log( 'Countdown at "' + countDown.number + '"' )
                    }
                })( background.game.count.down )
            };


            background.menu = new Background();


            background.highScores = new Background();


            function Background() {
                var bg = {
                    group: new Kinetic.Group,

                    lastCycleTime: 0,

                    tile: {
                        list: [],

                        quantity: background.tile.quantity,

                        size: background.tile.size,

                        color: {
                            base: {
                                random: function() {
                                    return settings.background.colors.base[
                                        Math.round( Math.random() * ( settings.background.colors.base.length - 1 ))
                                    ]
                                }
                            },

                            number: {
                                random: function() {
                                    return settings.background.colors.number[
                                        Math.round( Math.random() * ( settings.background.colors.number.length - 1 ))
                                    ]
                                }
                            }
                        }
                    },

                    count: function( numbers ){
                        var i;

                        numbers = numbers.toString();

                        background.game.draw.randomize();

                        if ( numbers.length === 1 ){
                            background.game.animation.draw.number[ util.number.toText( numbers )](
                                settings.background.countDown.coords.x,
                                settings.background.countDown.coords.y
                            )
                        } else if ( numbers.length === 2 ){
                            for ( i = 0; i < numbers.length; i++ ){
                                if ( i === 0 ){
                                    background.game.animation.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 9, 6 )
                                } else {
                                    background.game.animation.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 19, 6 )
                                }
                            }
                        } else if ( numbers.length === 3 ){
                            for ( i = 0; i < numbers.length; i++ ){
                                if ( i === 0 ){
                                    background.game.animation.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 4, 6 )
                                } else if ( i === 1 ){
                                    background.game.animation.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 14, 6 )
                                } else {
                                    background.game.animation.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 24, 6 )
                                }
                            }
                        } else throw new Error( 'The number passed to background.count was greater than three digits' );

                        if ( settings.debug )
                            console.log( 'Background changed to number ' + numbers )
                    },

                    draw: {
                        randomize: function( frame ){
                            bg.tile.list.forEach( function( tile ){
                                tile.fill( bg.tile.color.base.random() )
                            });

                            if ( frame ) bg.lastCycleTime = frame.time
                        }
                    },

                    animation: {
                        draw: {
                            // Randomly change the color of background tiles into
                            // shapes of numbers at the specified coordinates
                            number: {
                                zero: function( xCoord, yCoord ){
                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Left
                                    for( x = xCoord; x < xCoord + 2; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 8; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Right
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
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
                                },

                                one: function( xCoord, yCoord ){
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
                                },

                                two: function( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Right
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

                                    // Left
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
                                },

                                three: function( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Right
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
                                },

                                four: function( xCoord, yCoord ){
                                    var x, y;

                                    // Left
                                    for( x = xCoord; x < xCoord + 2; x++ ){
                                        for ( y = yCoord; y < yCoord + 6; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Middle
                                    for( x = xCoord + 2; x < xCoord + 6; x++ ){
                                        for ( y = yCoord + 4; y < yCoord + 6; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Right
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }
                                },

                                five: function( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Left
                                    for( x = xCoord; x < xCoord + 2; x++ ){
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

                                    // Right
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
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
                                },

                                six: function( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord + 2; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Left
                                    for( x = xCoord; x < xCoord + 2; x++ ){
                                        for ( y = yCoord; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Middle
                                    for( x = xCoord + 2; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 4; y < yCoord + 6; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Right
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 6; y < yCoord + 8; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Bottom
                                    for( x = xCoord + 2; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 8; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }
                                },

                                seven: function( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Right
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }
                                },

                                eight: function( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Left
                                    for( x = xCoord; x < xCoord + 2; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Right
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Middle
                                    for( x = xCoord + 2; x < xCoord + 6; x++ ){
                                        for ( y = yCoord + 4; y < yCoord + 6; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Bottom
                                    for( x = xCoord + 2; x < xCoord + 6; x++ ){
                                        for ( y = yCoord + 8; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }
                                },

                                nine: function( xCoord, yCoord ){
                                    var x, y;

                                    // Top
                                    for( x = xCoord; x < xCoord + 8; x++ ){
                                        for ( y = yCoord; y < yCoord + 2; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Left
                                    for( x = xCoord; x < xCoord + 2; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 6; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Right
                                    for( x = xCoord + 6; x < xCoord + 8; x++ ){
                                        for ( y = yCoord + 2; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Middle
                                    for( x = xCoord + 2; x < xCoord + 6; x++ ){
                                        for ( y = yCoord + 4; y < yCoord + 6; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }

                                    // Bottom
                                    for( x = xCoord; x < xCoord + 6; x++ ){
                                        for ( y = yCoord + 8; y < yCoord + 10; y++ ){
                                            randomDrawColor( x, y )
                                        }
                                    }
                                }
                            }
                        }
                    },

                    cleanUp: function() {
                        bg.draw.randomize();

                        bg.lastCycleTime = 0;

                        if ( typeof bg.count.down.number === 'number' )
                            bg.count.down.number = background.game.count.down.queue.length + 1
                    }
                };

                function randomDrawColor( xCoord, yCoord ){
                    bg.tile.list.forEach( function( tile ){
                        if ( tile.x().toCoord() == xCoord &&
                             tile.y().toCoord() == yCoord ){

                            tile.fill( bg.tile.color.number.random() )
                        }
                    })
                }

                for ( var x = 0; x < background.tile.quantity.x; x++ ){
                    for ( var y = 0; y < background.tile.quantity.y; y++ ){
                        bg.tile.list.unshift(
                            background.tile.proto.clone({
                                x: x * background.tile.size,
                                y: y * background.tile.size,
                                fill: bg.tile.color.base.random()
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