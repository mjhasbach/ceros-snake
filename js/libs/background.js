define([ 'Kinetic', 'underscore', 'settings', 'util', 'viewport' ], function( Kinetic, _, settings, util, viewport ){
    var _s = settings.background,
        background = {
            Constructor: function() {
                var bg = {
                    group: new Kinetic.Group({ listening: false }),

                    sine: new util.SineHelper(),

                    lastCycleTime: 0,

                    tile: {
                        list: [],

                        color: {
                            base: {
                                random: function() {
                                    return _s.colors.base[
                                        Math.round( Math.random() *
                                            ( _s.colors.base.length - 1 ))
                                    ]
                                }
                            },

                            number: {
                                random: function() {
                                    return _s.colors.number[
                                        Math.round( Math.random() *
                                            ( _s.colors.number.length - 1 ))
                                    ]
                                }
                            }
                        }
                    },

                    count: function( numbers ){
                        var i;

                        numbers = numbers.toString();

                        bg.draw.randomize();

                        if ( numbers.length === 1 ){
                            bg.draw.number[ util.number.toText( numbers )](
                                _s.countDown.coords.x,
                                _s.countDown.coords.y
                            )
                        } else if ( numbers.length === 2 ){
                            for ( i = 0; i < numbers.length; i++ ){
                                if ( i === 0 ){
                                    bg.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 9, 6 )
                                } else {
                                    bg.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 19, 6 )
                                }
                            }
                        } else if ( numbers.length === 3 ){
                            for ( i = 0; i < numbers.length; i++ ){
                                if ( i === 0 ){
                                    bg.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 4, 6 )
                                } else if ( i === 1 ){
                                    bg.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 14, 6 )
                                } else {
                                    bg.draw.number[
                                        util.number.toText( numbers[ i ])
                                    ]( 24, 6 )
                                }
                            }
                        } else throw new Error( 'The number passed to background.count ' +
                                                'was greater than three digits' );

                        if ( settings.debug )
                            console.log( 'Background changed to number ' + numbers )
                    },

                    draw: {
                        randomize: function( frame ){
                            bg.tile.list.forEach( function( tile ){
                                tile.fill( bg.tile.color.base.random() )
                            });

                            if ( frame ) bg.lastCycleTime = frame.time
                        },

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
                    },

                    cycleCheck: function( frame, number ){
                        if ( bg.sine.isAtMaximum(
                                Math.sin( frame.time * 2 * Math.PI / settings.animation.period() ))
                            ){
                            bg.draw.randomize();

                            if ( number ) bg.count( number )
                        }
                    },

                    cleanUp: function() {
                        bg.draw.randomize();

                        bg.lastCycleTime = 0;

                        if ( typeof bg.countDown.number === 'number' )
                            bg.countDown.number = background.game.countDown.queue.length + 1
                    }
                };

                function randomDrawColor( xCoord, yCoord ){
                    bg.tile.list.forEach( function( tile ){
                        if ( util.number.toCoord( tile.x() ) === xCoord &&
                             util.number.toCoord( tile.y() ) === yCoord ){

                            tile.fill( bg.tile.color.number.random() )
                        }
                    })
                }

                for ( var x = 0; x < settings.background.tile.quantity.x; x++ ){
                    for ( var y = 0; y < settings.background.tile.quantity.y; y++ ){
                        bg.tile.list.unshift(
                            new Kinetic.Rect({
                                x: x * util.calculate.tile.size(),
                                y: y * util.calculate.tile.size(),
                                width: util.calculate.tile.size(),
                                height: util.calculate.tile.size(),
                                fill: bg.tile.color.base.random(),
                                listening: false
                            })
                        );

                        bg.group.add( bg.tile.list[ 0 ])
                    }
                }

                return bg
            },

            init: function() {
                background.loading = new background.Constructor();

                background.menu = new background.Constructor();

                background.game = new background.Constructor();

                background.highScores = {
                    add: new background.Constructor(),
                    view: new background.Constructor()
                };

                ( function _loading() {
                    background.loading.isReadyToCycle = function( sine ){
                        return background.loading.sine.directionChanged( sine )
                    }
                })();

                ( function _game() {
                    background.game.countDown = {};

                    background.game.countDown.queue = [
                        background.game.draw.number.three,
                        background.game.draw.number.two,
                        background.game.draw.number.one
                    ];

                    background.game.countDown.number = background.game.countDown.queue.length + 1;

                    background.game.countDown.isReadyToCycle = function ( frame ){
                        return frame.time - background.game.lastCycleTime >=
                            settings.animation.period() * 2
                    };

                    background.game.countDown.animation = function ( frame ){
                        var countDown = background.game.countDown;

                        if ( countDown.isReadyToCycle( frame )){
                            background.game.draw.randomize( frame );

                            if ( countDown.number > 1 ){
                                countDown.queue[ 0 ](
                                    _s.countDown.coords.x,
                                    _s.countDown.coords.y
                                );

                                countDown.queue.push( countDown.queue.shift() )
                            }

                            countDown.number--;

                            if ( settings.debug )
                                console.log( 'Countdown at "' + countDown.number + '"' )
                        }
                    };
                })()
            }
        };

    background.init();

    return background
});