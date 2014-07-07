define([ 'underscore', 'backbone', 'Kinetic', 'settings', 'util' ], function( _, Backbone, Kinetic, settings, util ){
    var _s = settings.game,
        game = {
            name: 'game',

            isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

            state: new Backbone.Model({ current: 'stopped' }),

            layer: new Kinetic.Layer,

            snake: {
                segment: {
                    queue: [],

                    list: [],

                    queueNew: function() {
                        var segment = {};

                        if ( game.snake.segment.list.length > 0 ){
                            segment.x = game.snake.segment.list.last().x();
                            segment.y = game.snake.segment.list.last().y()
                        } else {
                            segment.x = _s.snake.initial.coords.x.fromCoord();
                            segment.y = _s.snake.initial.coords.y.fromCoord()
                        }

                        segment.shape = new Kinetic.Group({ x: segment.x, y: segment.y });

                        for ( var i = 0; i < _s.snake.amountOfInnerRectangles + 1; i++ ){
                            segment.shape.add(
                                new Kinetic.Rect({
                                    x: game.background.tile.size() + i *
                                        (( game.background.tile.size() * 0.33 ) / 2 ),
                                    y: game.background.tile.size() + i *
                                        (( game.background.tile.size() * 0.33 ) / 2 ),
                                    width: game.background.tile.size() - i *
                                        ( game.background.tile.size() * 0.33 ),
                                    height: game.background.tile.size() - i *
                                        ( game.background.tile.size() * 0.33 ),
                                    fill: _s.snake.colors[ i ],
                                    listening: false
                                })
                            )
                        }

                        game.snake.segment.queue.push( segment.shape )
                    },

                    addNewIfNecessary: function() {
                        if ( game.snake.segment.queue.length > 0 ){
                            var segment = game.snake.segment.queue.shift();

                            game.snake.segment.list.push( segment );

                            game.layer.add( segment );

                            segment.cache()
                        }
                    }
                },

                direction: {
                    queue: [ _s.snake.initial.direction ],

                    current: _s.snake.initial.direction,

                    changeIfNecessary: function() {
                        if ( game.snake.direction.queue.length > 0 )
                            game.snake.direction.current = game.snake.direction.queue.shift()
                    },

                    currentOrLastQueuedIsOppositeOf: function( direction ){
                        if ( game.snake.segment.list.length === 1 )
                            return false;
                        else {
                            var opposite;

                            if ( direction === 'up' ) opposite = 'down';
                            else if ( direction === 'down' ) opposite = 'up';
                            else if ( direction === 'left' ) opposite = 'right';
                            else if ( direction === 'right' ) opposite = 'left';

                            return game.snake.direction.current == opposite ||
                                   game.snake.direction.queue.last() == opposite
                        }
                    },

                    lastQueuedIsSameAs: function( direction ){
                        return game.snake.direction.queue.last() == direction
                    },

                    pushOrInit: function( direction ){
                        if ( game.state.get( 'current' ) === 'running' )
                            game.snake.direction.queue.push( direction );

                        else game.snake.direction.queue[ 0 ] = direction
                    }
                },

                isReadyToMove: function( frame ){
                    return frame.time - ( game.snake.lastMovementTime || 0 ) >= ( settings.animation.period -
                        ( game.snake.segment.list.length * _s.snake.speedIncrement )) / 2
                },

                move: function( frame ){
                    game.snake.direction.changeIfNecessary();

                    if ( game.snake.segment.list.length > 1 ){
                        game.snake.segment.list.unshift( game.snake.segment.list.pop() );
                        move( game.snake.segment.list[ 1 ])

                    } else move( game.snake.segment.list[ 0 ]);

                    game.snake.lastMovementTime = frame.time;

                    function move( to ){
                        if ( game.snake.direction.current === 'up' ){
                            game.snake.segment.list[ 0 ].x( to.x() );
                            game.snake.segment.list[ 0 ].y( to.y() - game.background.tile.size() )

                        } else if ( game.snake.direction.current === 'right' ){
                            game.snake.segment.list[ 0 ].x( to.x() + game.background.tile.size() );
                            game.snake.segment.list[ 0 ].y( to.y() )

                        } else if ( game.snake.direction.current === 'down' ){
                            game.snake.segment.list[ 0 ].x( to.x() );
                            game.snake.segment.list[ 0 ].y( to.y() + game.background.tile.size() )

                        } else {
                            game.snake.segment.list[ 0 ].x( to.x() - game.background.tile.size() );
                            game.snake.segment.list[ 0 ].y( to.y() )
                        }
                    }
                },

                isCollidingWith: {
                    itself: function() {
                        return game.collision({
                            shape: game.snake.segment.list[ 0 ],
                            list: game.snake.segment.list
                        }) !== -1
                    },

                    boundary: function() {
                        return game.snake.segment.list[ 0 ].x().toCoord() == 1 ||
                               game.snake.segment.list[ 0 ].x().toCoord() == game.background.tile.quantity.x ||
                               game.snake.segment.list[ 0 ].y().toCoord() == 1 ||
                               game.snake.segment.list[ 0 ].y().toCoord() == game.background.tile.quantity.y
                    },

                    heart: function( cb ){
                        var index = game.collision({
                            shape: game.snake.segment.list[ 0 ],
                            list: game.heart.list
                        });

                        var collision = index !== -1;

                        cb( collision, index )
                    }
                }
            },

            heart: {
                list: [],

                generate: function() {
                    var x = util.calculate.random.int( 2, game.background.tile.quantity.x - 1 ),
                        y = util.calculate.random.int( 2, game.background.tile.quantity.y - 1),
                        noCollisionAtProposedCoordinates =
                            game.collision({
                                coords: { x: x, y: y },
                                list: game.heart.list
                            }) === -1 &&

                            game.collision({
                                coords: { x: x, y: y },
                                list: game.snake.segment.list
                            }) === -1;

                    if ( noCollisionAtProposedCoordinates ){
                        var color = _.extend( {}, _s.heart.initial.color ),
                            heart = new Kinetic.Group({ x: x.fromCoord(), y: y.fromCoord() });

                        for ( var i = 0; i < _s.heart.amountOfInnerHearts + 1; i++ ){
                            heart.add(
                                new Kinetic.Text({
                                    x: game.background.tile.size() + i *
                                        (( game.background.tile.size() * 0.33 ) / 2 ),
                                    y: game.background.tile.size() + i *
                                        (( game.background.tile.size() * 0.33 ) / 2 ),
                                    fontSize: game.background.tile.size() - i *
                                        ( game.background.tile.size() * 0.33 ),
                                    fontFamily: 'FontAwesome',
                                    text: '\uf004',
                                    fill: 'hsl(' + color.h + ', ' + color.s + '%, ' + color.l + '%)',
                                    listening: false
                                })
                            );

                            color.l += 8;
                        }

                        game.heart.list.push( heart );

                        game.layer.add( heart );

                        heart.setZIndex( 2 )

                    } else game.heart.generate()
                },

                regenerate: function() {
                    game.heart.generate();

                    for ( var i = 0; i < _s.heart.maximum - 1; i++ )
                        if ( util.calculate.random.float( 0, 100 ) <
                             _s.heart.spawnProbability * 100 )

                            game.heart.generate()
                },

                destroy: function( index ){
                    game.heart.list[ index ].destroy();
                    game.heart.list.splice( index, 1 )
                }
            },

            paused: new Kinetic.Text({
                x: util.calculate.absolute.x( _s.paused.x ),
                y: util.calculate.absolute.y( _s.paused.y ),
                text: 'Paused',
                fontSize: util.calculate.absolute.size( _s.paused.size ),
                fontFamily: settings.font.face,
                fill: _s.paused.font.color,
                shadowColor: _s.paused.shadow.color,
                shadowBlur: util.calculate.absolute.size( _s.paused.shadow.blur ),
                opacity: 0
            }),

            animation: new Kinetic.Animation( function( frame ){
                var state = game.state.get( 'current' );

                if ( state === 'starting' ){
                    game.snake.segment.queueNew();
                    game.snake.segment.addNewIfNecessary();

                    game.heart.regenerate();

                    game.state.set( 'current', 'waiting' )

                } else if ( state === 'counting down' ){

                    game.background.countDown.animation( frame );

                    if ( game.background.countDown.number === 1 )
                        game.state.set( 'current', 'running' )

                } else if ( state === 'running' ){
                    if ( game.boundaries.areReadyToCycle( frame ))
                        game.boundaries.animation( frame );

                    if ( game.snake.isReadyToMove( frame )){
                        game.snake.move( frame );

                        game.snake.segment.addNewIfNecessary();

                        if ( game.snake.isCollidingWith.itself() )
                            game.state.set( 'current', 'stopping' );

                        else if ( game.snake.isCollidingWith.boundary() )
                            game.state.set( 'current', 'stopping' );

                        else {
                            game.snake.isCollidingWith.heart( function( collision, index ){
                                if ( collision ){
                                    game.heart.destroy( index );

                                    game.background.count( game.snake.segment.list.length + 1 );

                                    game.snake.segment.queueNew();

                                    if ( game.heart.list.length === 0 ) game.heart.regenerate()
                                }
                            })
                        }
                    }
                } else if ( state === 'stopping' )
                    util.module.stop( game, frame )
            }),

            collision: function( options ){
                var i;

                if ( options.shape ){
                    if ( options.list ){
                        for ( i = 0; i < options.list.length; i++ ){
                            if ( options.shape != options.list[ i ] &&
                                 options.list[ i ].x().toCoord() == options.shape.x().toCoord() &&
                                 options.list[ i ].y().toCoord() == options.shape.y().toCoord() ){

                                return i
                            }
                        }
                    } else throwListError()

                } else if ( options.coords ){
                    if ( options.list ){
                        for ( i = 0; i < options.list.length; i++ ){
                            if ( options.list[ i ].x().toCoord() == options.coords.x &&
                                 options.list[ i ].y().toCoord() == options.coords.y ){

                                return i
                            }
                        }
                    } else throwListError()

                } else throw new Error( 'The collision detector was provided neither ' +
                                        'a coordinate pair nor shape to search for' );

                return -1;

                function throwListError() {
                    throw new Error( 'The collision detector was not provided a list ' +
                                     'in which to search for the provided shape' )
                }
            },

            init: function( options ){
                game.background = options.background.game;

                ( function _boundaries() {
                    game.boundaries = {
                        top: new Kinetic.Rect({
                            x: game.background.tile.size() / 4,
                            y: game.background.tile.size() / 4,
                            width: ( game.background.tile.size() * game.background.tile.quantity.x ) -
                                game.background.tile.size(),
                            height: game.background.tile.size() / 2
                        }),

                        left: new Kinetic.Rect({
                            x: game.background.tile.size() / 4,
                            y: game.background.tile.size() / 4,
                            width: game.background.tile.size() / 2,
                            height: ( game.background.tile.size() * game.background.tile.quantity.y ) -
                                game.background.tile.size()
                        }),

                        bottom: new Kinetic.Rect({
                            x: game.background.tile.size() / 4,
                            y: game.background.tile.size() *
                                ( game.background.tile.quantity.y - 0.75 ),
                            width: ( game.background.tile.size() * game.background.tile.quantity.x ) -
                                game.background.tile.size() ,
                            height: game.background.tile.size() / 2
                        }),

                        right: new Kinetic.Rect({
                            x: util.calculate.dimensions.original.width() -
                                ( game.background.tile.size() * 0.75 ),
                            y: game.background.tile.size() / 4,
                            width: game.background.tile.size() / 2,
                            height: ( game.background.tile.size() *
                                ( game.background.tile.quantity.y - 0.5 ))
                        }),

                        fillWithDefaultColor: function() {
                            var color = settings.background.colors.base[ 0 ];

                            game.boundaries.top.fill( color );
                            game.boundaries.left.fill( color );
                            game.boundaries.bottom.fill( color );
                            game.boundaries.right.fill( color )
                        },

                        areReadyToCycle: function( frame ){
                            return frame.time - ( game.boundaries.lastCycleTime || 0 ) >=
                                settings.animation.period / 8
                        },

                        animation: function( frame ){
                            var color = game.background.tile.color.base.random();

                            game.boundaries.top.fill( color );
                            game.boundaries.left.fill( color );
                            game.boundaries.bottom.fill( color );
                            game.boundaries.right.fill( color );

                            game.boundaries.lastCycleTime = frame.time
                        }
                    };

                    game.boundaries.fillWithDefaultColor()
                })();

                ( function _prototypes() {
                    Number.prototype.toCoord = function() {
                        return ( this / game.background.tile.size() ) + 2
                    };

                    Number.prototype.fromCoord = function() {
                        return ( this - 2 ) * game.background.tile.size()
                    };

                    Array.prototype.last = function() {
                        return this[ this.length - 1 ]
                    };

                    ( function _heart() {

                    })()
                })();

                ( function _layer() {
                    game.layer.add( game.background.group );

                    game.layer.add( game.boundaries.top );
                    game.layer.add( game.boundaries.left );
                    game.layer.add( game.boundaries.bottom );
                    game.layer.add( game.boundaries.right );

                    game.layer.add( game.paused );

                    game.animation.setLayers( game.layer )
                })();
            },

            cleanUp: function() {
                game.snake.segment.list.forEach( function( segment ){ segment.destroy() });
                game.snake.segment.list = [];
                game.snake.segment.queue = [];
                game.snake.direction.queue = [ _s.snake.initial.direction ];
                game.snake.direction.current = _s.snake.initial.direction;

                game.heart.list.forEach( function( heart ){ heart.destroy() });
                game.heart.list = [];

                game.boundaries.fillWithDefaultColor();

                game.background.cleanUp()
            }
        };

    return game;
});