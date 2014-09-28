define([ 'underscore', 'backbone', 'Kinetic', 'settings', 'util', 'viewport', 'background'],
    function( _, Backbone, Kinetic, settings, util, viewport, background ){
        var _s = settings.game,
            game = {
                name: 'game',

                isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                state: new Backbone.Model({ current: 'stopped' }),

                layer: new Kinetic.Layer,

                background: background.game,

                boundaries: {
                    top: new Kinetic.Rect({
                        x: util.calculate.tile.size() / 4,
                        y: util.calculate.tile.size() / 4,
                        width: ( util.calculate.tile.size() * settings.background.tile.quantity.x ) -
                            util.calculate.tile.size(),
                        height: util.calculate.tile.size() / 2
                    }),

                    left: new Kinetic.Rect({
                        x: util.calculate.tile.size() / 4,
                        y: util.calculate.tile.size() / 4,
                        width: util.calculate.tile.size() / 2,
                        height: ( util.calculate.tile.size() * settings.background.tile.quantity.y ) -
                            util.calculate.tile.size()
                    }),

                    bottom: new Kinetic.Rect({
                        x: util.calculate.tile.size() / 4,
                        y: util.calculate.tile.size() *
                            ( settings.background.tile.quantity.y - 0.75 ),
                        width: ( util.calculate.tile.size() * settings.background.tile.quantity.x ) -
                            util.calculate.tile.size(),
                        height: util.calculate.tile.size() / 2
                    }),

                    right: new Kinetic.Rect({
                        x: viewport.dimensions.original.width -
                            ( util.calculate.tile.size() * 0.75 ),
                        y: util.calculate.tile.size() / 4,
                        width: util.calculate.tile.size() / 2,
                        height: ( util.calculate.tile.size() *
                            ( settings.background.tile.quantity.y - 0.5 ))
                    }),

                    fill: function fill( color ){
                        if ( typeof color === 'string' ){
                            color = color.toLowerCase();

                            if ( color === 'default' )
                                fill( settings.background.colors.base[ 0 ] );
                            else if ( color === 'random' )
                                fill( game.background.tile.color.base.random() );
                            else {
                                game.boundaries.top.fill( color );
                                game.boundaries.left.fill( color );
                                game.boundaries.bottom.fill( color );
                                game.boundaries.right.fill( color );
                            }
                        }
                        else throw new Error( 'game.boundaries.fill() requires a string argument' );
                    },

                    areReadyToCycle: function( frame ){
                        return frame.time - ( game.boundaries.lastCycleTime || 0 ) >=
                            settings.animation.period() / 8
                    },

                    animation: function( frame ){
                        game.boundaries.fill( 'random' );

                        game.boundaries.lastCycleTime = frame.time
                    }
                },

                snake: {
                    segment: {
                        queue: [],

                        list: [],

                        queueNew: function() {
                            var segment = {};

                            if ( game.snake.segment.list.length > 0 ){
                                segment.x = _.last( game.snake.segment.list ).x();
                                segment.y = _.last( game.snake.segment.list ).y()
                            } else {
                                segment.x = util.number.fromCoord( _s.snake.initial.coords.x );
                                segment.y = util.number.fromCoord( _s.snake.initial.coords.y )
                            }

                            segment.shape = new Kinetic.Group({
                                x: segment.x,
                                y: segment.y,
                                listening: false
                            });

                            for ( var i = 0; i < _s.snake.amountOfInnerRectangles + 1; i++ ){
                                segment.shape.add(
                                    new Kinetic.Rect({
                                        x: util.calculate.tile.size() + i *
                                            (( util.calculate.tile.size() * 0.33 ) / 2 ),
                                        y: util.calculate.tile.size() + i *
                                            (( util.calculate.tile.size() * 0.33 ) / 2 ),
                                        width: util.calculate.tile.size() - i *
                                            ( util.calculate.tile.size() * 0.33 ),
                                        height: util.calculate.tile.size() - i *
                                            ( util.calculate.tile.size() * 0.33 ),
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

                                game.layer.add( segment )
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

                                return game.snake.direction.current === opposite ||
                                       _.last( game.snake.direction.queue ) === opposite
                            }
                        },

                        lastQueuedIsSameAs: function( direction ){
                            return _.last( game.snake.direction.queue ) === direction
                        },

                        pushOrInit: function( direction ){
                            if ( game.state.get( 'current' ) === 'running' )
                                game.snake.direction.queue.push( direction );

                            else game.snake.direction.queue[ 0 ] = direction
                        }
                    },

                    isReadyToMove: function( frame ){
                        return frame.time - ( game.snake.lastMovementTime || 0 ) >= ( settings.animation.period() -
                            ( game.snake.segment.list.length * _s.snake.speedIncrement )) / 2
                    },

                    move: function( frame ){
                        game.snake.direction.changeIfNecessary();

                        var firstSegment = game.snake.segment.list[ 0 ],
                            lastSegment = _.last( game.snake.segment.list ),
                            currentDirection = game.snake.direction.current;

                        if ( currentDirection === 'up' ){
                            lastSegment.x( firstSegment.x() );
                            lastSegment.y( firstSegment.y() - util.calculate.tile.size() )

                        } else if ( currentDirection === 'right' ){
                            lastSegment.x( firstSegment.x() + util.calculate.tile.size() );
                            lastSegment.y( firstSegment.y() )

                        } else if ( currentDirection === 'down' ){
                            lastSegment.x( firstSegment.x() );
                            lastSegment.y( firstSegment.y() + util.calculate.tile.size() )

                        } else {
                            lastSegment.x( firstSegment.x() - util.calculate.tile.size() );
                            lastSegment.y( firstSegment.y() )
                        }

                        if ( game.snake.segment.list.length > 1 )
                            game.snake.segment.list.unshift( game.snake.segment.list.pop() );

                        game.snake.lastMovementTime = frame.time;
                    },

                    isCollidingWith: {
                        itself: function() {
                            return game.collision({
                                shape: game.snake.segment.list[ 0 ],
                                list: game.snake.segment.list
                            })
                        },

                        boundary: function() {
                            return util.number.toCoord( game.snake.segment.list[ 0 ].x() ) === 1 ||
                                   util.number.toCoord( game.snake.segment.list[ 0 ].x() ) === settings.background.tile.quantity.x ||
                                   util.number.toCoord( game.snake.segment.list[ 0 ].y() ) === 1 ||
                                   util.number.toCoord( game.snake.segment.list[ 0 ].y() ) === settings.background.tile.quantity.y
                        }
                    }
                },

                heart: {
                    list: [],

                    generate: function() {
                        var x = util.calculate.random.int( 2, settings.background.tile.quantity.x - 1 ),
                            y = util.calculate.random.int( 2, settings.background.tile.quantity.y - 1 ),
                            collisionAtProposedCoordinates = game.collision({
                                coords: { x: x, y: y },
                                list: [ game.snake.segment.list, game.heart.list ]
                            });

                        if ( !collisionAtProposedCoordinates ){
                            var heart = new Kinetic.Group({
                                x: util.number.fromCoord( x ),
                                y: util.number.fromCoord( y ) }
                            );

                            for ( var i = 0; i < _s.heart.amountOfInnerHearts + 1; i++ ){
                                heart.add(
                                    new Kinetic.Text({
                                        x: util.calculate.tile.size() + i *
                                            (( util.calculate.tile.size() * 0.33 ) / 2 ),
                                        y: util.calculate.tile.size() + i *
                                            (( util.calculate.tile.size() * 0.33 ) / 2 ),
                                        fontSize: util.calculate.tile.size() - i *
                                            ( util.calculate.tile.size() * 0.33 ),
                                        fontFamily: 'FontAwesome',
                                        text: '\uf004',
                                        fill: _s.heart.colors[ i ],
                                        listening: false
                                    })
                                )
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

                            if ( game.snake.isCollidingWith.itself() ||
                                 game.snake.isCollidingWith.boundary() )

                                game.state.set( 'current', 'stopping' );
                            else {
                                game.collision(
                                    {
                                        shape: game.snake.segment.list[ 0 ],
                                        list: game.heart.list
                                    },
                                    function( i ){
                                        game.heart.destroy( i );

                                        game.background.count( game.snake.segment.list.length + 1 );

                                        game.snake.segment.queueNew();

                                        if ( game.heart.list.length === 0 ) game.heart.regenerate()
                                    }
                                )
                            }
                        }
                    } else if ( state === 'stopping' )
                        util.module.stop( game, frame );

                    if ( state === 'paused' ){
                        if ( game.paused.opacity() < 1 )
                            util.animation.fade( game.paused, frame, 'in' )

                    } else if ( game.paused.opacity() > 0 ){
                        game.paused.moveToTop();
                        util.animation.fade( game.paused, frame, 'out' )
                    }
                }),

                collision: function( options, cb ){
                    var collisions = [],
                        errPrefix = 'game.collision.filter() - ';

                    if ( !_.isObject( options ))
                        throw new TypeError(
                            errPrefix + 'The options argument must be an object'
                        );
                    else if ( !_.isArray( options.list ))
                        throw new TypeError(
                            errPrefix + 'options.list must be a single or nested array of KineticJS shapes'
                        );
                    else if (
                        !(
                            util.isKineticObject( options.shape ) ||
                            _.isArray( options.shape )
                        )
                        &&
                        !(
                            _.isObject( options.coords ) ||
                            _.isArray( options.coords )
                        )
                    )
                        throw new TypeError(
                            errPrefix + 'Either options.shape or options.coords must be supplied. ' +
                            'options.shape can be a KineticJS shape or an array of KineticJS shapes. ' +
                            'options.coords can be an object containing x and y integer properties or ' +
                            'an array of objects containing x and y integer properties.'
                        );
                    else {
                        if ( util.isKineticObject( options.list[ 0 ]))
                            options.list = [ options.list ];

                        if ( options.shape && !_.isArray( options.shape ))
                            options.shape = [ options.shape ];

                        if ( options.coords && !_.isArray( options.coords ))
                            options.coords = [ options.coords ];

                        _.each( options.list, function( list ){
                            _.each( list, function( shape, listIndex ){
                                if ( !util.isKineticObject( shape ))
                                    throw new TypeError(
                                        errPrefix + 'Encountered a non-Kinetic object in options.list'
                                    );

                                else {
                                    if ( _.isArray( options.shape ) && options.shape.length > 0 ){
                                        _.each( options.shape, function( _shape ){
                                            if ( !util.isKineticObject( _shape ))
                                                throw new TypeError(
                                                    errPrefix + 'Encountered a non-Kinetic object in options.shape'
                                                );

                                            if ( util.number.toCoord( shape.x() ) === util.number.toCoord( _shape.x() ) &&
                                                 util.number.toCoord( shape.y() ) === util.number.toCoord( _shape.y() ) &&
                                                 shape !== _shape ){

                                                collisions.push( listIndex );
                                            }
                                        })
                                    }
                                    if ( _.isArray( options.coords ) && options.coords.length > 0 ){
                                        _.each( options.coords, function( coords ){
                                            if ( !( _.isObject( coords ) &&
                                                    _.isNumber( coords.x ) &&
                                                    _.isNumber( coords.y ))
                                            )
                                                throw new TypeError(
                                                    errPrefix + 'Encountered non-integer coordinate(s) in options.coords'
                                                );

                                            if ( util.number.toCoord( shape.x() ) === coords.x &&
                                                 util.number.toCoord( shape.y() ) === coords.y ){

                                                collisions.push( listIndex );
                                            }
                                        })
                                    }
                                }
                            })
                        })
                    }

                    if ( _.isFunction( cb ))
                        _.each( collisions, function( listIndex ){
                            cb( listIndex );
                        });

                    return collisions.length > 0;
                },

                init: function() {
                    game.boundaries.fill( 'default' );

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

                    game.boundaries.fill( 'default' );

                    game.background.cleanUp()
                }
            };

        game.init();

        return game
    }
);