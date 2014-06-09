define([ 'Kinetic', 'settings', 'util' ], function( Kinetic, settings, util ){
    var game = {
        name: 'game',

        state: 'stopped',

        layer: new Kinetic.Layer(),

        collision: function( options ){
            var i;

            if ( options.shape ){
                if ( options.list ){
                    for ( i = 0; i < options.list.length; i++ ){
                        if ( options.shape != options.list[ i ] &&
                             options.list[ i ].x().toCoord() == options.shape.x().toCoord() &&
                             options.list[ i ].y().toCoord() == options.shape.y().toCoord() ){

                            return i;
                        }
                    }
                } else throwListError();

            } else if ( options.coords ){
                if ( options.list ){
                    for ( i = 0; i < options.list.length; i++ ){
                        if ( options.list[ i ].x().toCoord() == options.coords.x &&
                             options.list[ i ].y().toCoord() == options.coords.y ){

                            return i;
                        }
                    }
                } else throwListError();

            } else throw new Error( 'The collision detector was provided neither a coordinate pair nor shape to search for');

            return -1;

            function throwListError() {
                throw new Error( 'The collision detector was not provided a list in which to search for the provided shape')
            }
        },

        cleanUp: function() {
            game.snake.segment.list.forEach( function( segment ){ segment.destroy() });
            game.heart.list.forEach( function( heart ){ heart.destroy() });

            game.snake.segment.list = [];
            game.snake.segment.queue = [];
            game.heart.list = [];
            game.snake.direction.queue = [ settings.game.snake.initial.direction ];
            game.snake.direction.current = settings.game.snake.initial.direction;

            game.background.cleanUp()
        }
    };

    game.init = function( options ){
        ( function _prototypes() {
            Number.prototype.toCoord = function() {
                return ( this / game.background.tile.size ) + 2
            };

            Number.prototype.fromCoord = function() {
                return ( this - 2 ) * game.background.tile.size
            };

            Array.prototype.last = function() {
                return this[ this.length - 1 ];
            }
        })();

        ( function _bg() {
            game.background = options.background.game;
            game.layer.add( game.background.group )
        })();

        ( function _boundary() {
            game.boundaries = {};

            ( function( color ){
                game.boundaries.top = new Kinetic.Rect({
                    x: game.background.tile.size / 4,
                    y: game.background.tile.size / 4,
                    width: ( game.background.tile.size * game.background.tile.quantity.x ) -
                        game.background.tile.size ,
                    height: game.background.tile.size / 2,
                    fill: color
                });

                game.boundaries.left = new Kinetic.Rect({
                    x: game.background.tile.size / 4,
                    y: game.background.tile.size / 4,
                    width: game.background.tile.size / 2,
                    height: ( game.background.tile.size * game.background.tile.quantity.y ) -
                        game.background.tile.size,
                    fill: color
                });

                game.boundaries.bottom = new Kinetic.Rect({
                    x: game.background.tile.size / 4,
                    y: game.background.tile.size * ( game.background.tile.quantity.y - 0.75 ),
                    width: ( game.background.tile.size * game.background.tile.quantity.x ) -
                        game.background.tile.size ,
                    height: game.background.tile.size / 2,
                    fill: color
                });

                game.boundaries.right = new Kinetic.Rect({
                    x: util.calculate.dimensions.original.width() -
                        ( game.background.tile.size * 0.75 ),
                    y: game.background.tile.size / 4,
                    width: game.background.tile.size / 2,
                    height: ( game.background.tile.size * ( game.background.tile.quantity.y - 0.5 )),
                    fill: color
                })
            })( game.background.random.color.tile() );

            game.layer.add( game.boundaries.top );
            game.layer.add( game.boundaries.left );
            game.layer.add( game.boundaries.bottom );
            game.layer.add( game.boundaries.right );

            game.boundaries.lastCycleTime = 0;

            game.boundaries.areReadyToCycle = function( frame ){
                return frame.time - game.boundaries.lastCycleTime >= settings.animation.period / 8
            };

            game.boundaries.animation = function( frame ){
                ( function( color ){
                    game.boundaries.top.fill( color );
                    game.boundaries.left.fill( color );
                    game.boundaries.bottom.fill( color );
                    game.boundaries.right.fill( color );
                })( game.background.random.color.tile() );

                game.boundaries.lastCycleTime = frame.time
            }
        })();

        ( function _heart() {
            game.heart = {};

            game.heart.list = [];

            game.heart.generate = function() {
                var x = util.calculate.random.int( 2, game.background.tile.quantity.x - 1 ),
                    y = util.calculate.random.int( 2, game.background.tile.quantity.y - 1 );

                if ( game.collision({ coords: { x: x, y: y }, list: game.heart.list }) === -1 &&
                     game.collision({ coords: { x: x, y: y }, list: game.snake.segment.list }) === -1 ){

                    var heart = game.heart.proto.clone({
                        x: x.fromCoord(),
                        y: y.fromCoord()
                    });

                    game.heart.list.push( heart );
                    game.layer.add( heart );
                    heart.setZIndex( 2 );

                } else game.heart.generate();
            };

            game.heart.regenerate = function() {
                game.heart.generate();

                for ( var i = 0; i < settings.game.heart.maximum - 1; i++ ){
                    if ( util.calculate.random.float( 0, 100 ) < settings.game.heart.spawnProbability * 100 ){
                        game.heart.generate()
                    }
                }
            };

            game.heart.destroy = function( index ){
                game.heart.list[ index ].destroy();
                game.heart.list.splice( index, 1 )
            };

            game.heart.proto = new Kinetic.Group();

            var color = settings.game.heart.initial.color;

            for ( var i = 0; i < settings.game.heart.amountOfInnerHearts + 1; i++ ){
                var innerHeart = new Kinetic.Text({
                    x: game.background.tile.size + i * (( game.background.tile.size * 0.33 ) / 2 ),
                    y: game.background.tile.size + i * (( game.background.tile.size * 0.33 ) / 2 ),
                    fontSize: game.background.tile.size - i * ( game.background.tile.size * 0.33 ),
                    fontFamily: 'FontAwesome',
                    text: '\uf004',
                    fill: 'hsl(' +
                        color.h + ', ' +
                        color.s + '%, ' +
                        color.l + '%)'
                });

                color.l += 8;

                game.heart.proto.add( innerHeart )
            }
        })();

        ( function _snake() {
            game.snake = {};

            game.snake.segment = {
                queue: [],

                list: [],

                queueNew: function() {
                    var segment = {};

                    if ( game.snake.segment.list.length > 0 ){
                        segment.x = game.snake.segment.list.last().x();
                        segment.y = game.snake.segment.list.last().y();
                    } else {
                        segment.x = settings.game.snake.initial.coords.x.fromCoord();
                        segment.y = settings.game.snake.initial.coords.y.fromCoord();
                    }

                    segment.shape = game.snake.proto.clone({ x: segment.x, y: segment.y });
                    game.snake.segment.queue.push( segment.shape );
                },

                addNewIfNecessary: function() {
                    if ( game.snake.segment.queue.length > 0 ){
                        var segment = game.snake.segment.queue.shift();

                        game.snake.segment.list.push( segment );

                        game.layer.add( segment )
                    }
                }
            };

            game.snake.direction = {
                queue: [ settings.game.snake.initial.direction ],

                current: settings.game.snake.initial.direction,

                changeIfNecessary: function() {
                    if ( game.snake.direction.queue.length > 0 ){
                        game.snake.direction.current = game.snake.direction.queue.shift()
                    }
                },

                currentOrLastQueuedIsOppositeOf: function( direction ){
                    if ( game.snake.segment.list.length === 1 ){
                        return false
                    } else {
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
                    if ( game.state === 'running' ){
                        game.snake.direction.queue.push( direction )

                    } else game.snake.direction.queue[0] = direction
                }
            };

            game.snake.lastMovementTime = 0;

            game.snake.isReadyToMove = function( frame ){
                return frame.time - game.snake.lastMovementTime >= ( settings.animation.period -
                    ( game.snake.segment.list.length * settings.game.snake.speedIncrement )) / 2
            };

            game.snake.move = function( frame ){
                game.snake.direction.changeIfNecessary();

                if ( game.snake.segment.list.length > 1 ){
                    game.snake.segment.list.unshift( game.snake.segment.list.pop() );
                    move( game.snake.segment.list[1] )
                } else {
                    move( game.snake.segment.list[0] )
                }

                game.snake.lastMovementTime = frame.time;

                function move( to ){
                    if ( game.snake.direction.current === 'up' ){
                        game.snake.segment.list[0].x( to.x() );
                        game.snake.segment.list[0].y( to.y() - game.background.tile.size );

                    } else if ( game.snake.direction.current === 'right' ){
                        game.snake.segment.list[0].x( to.x() + game.background.tile.size );
                        game.snake.segment.list[0].y( to.y() )

                    } else if ( game.snake.direction.current === 'down' ){
                        game.snake.segment.list[0].x( to.x() );
                        game.snake.segment.list[0].y( to.y() + game.background.tile.size )

                    } else {
                        game.snake.segment.list[0].x( to.x() - game.background.tile.size );
                        game.snake.segment.list[0].y( to.y() );
                    }
                }
            };

            game.snake.isCollidingWith = {
                itself: function() {
                    return game.collision({ shape: game.snake.segment.list[ 0 ],
                        list: game.snake.segment.list }) !== -1;
                },

                boundary: function() {
                    return game.snake.segment.list[ 0 ].x().toCoord() == 1 ||
                        game.snake.segment.list[ 0 ].x().toCoord() == game.background.tile.quantity.x ||
                        game.snake.segment.list[ 0 ].y().toCoord() == 1 ||
                        game.snake.segment.list[ 0 ].y().toCoord() == game.background.tile.quantity.y;
                },

                heart: function( cb ){
                    cb( game.collision({ shape: game.snake.segment.list[ 0 ], list: game.heart.list }) )
                }
            };

            game.snake.proto = new Kinetic.Group();

            var palette = settings.game.snake.colors;

            for ( var i = 0; i < settings.game.snake.amountOfInnerRectangles + 1; i++ ){
                var rect = new Kinetic.Rect({
                    x: game.background.tile.size + i * (( game.background.tile.size * 0.33 ) / 2 ),
                    y: game.background.tile.size + i * (( game.background.tile.size * 0.33 ) / 2 ),
                    width: game.background.tile.size - i * ( game.background.tile.size * 0.33 ),
                    height: game.background.tile.size - i * ( game.background.tile.size * 0.33 ),
                    fill: palette[ i ]
                });

                game.snake.proto.add( rect )
            }
        })();

        ( function _paused() {
            game.paused = new Kinetic.Text({
                x: util.calculate.absolute.x( settings.game.paused.x ),
                y: util.calculate.absolute.y( settings.game.paused.y ),
                text: 'Paused',
                fontSize: util.calculate.absolute.size( settings.game.paused.size ),
                fontFamily: settings.font.ui,
                fill: settings.game.paused.font.color,
                shadowColor: settings.game.paused.shadow.color,
                shadowBlur: util.calculate.absolute.size( settings.game.paused.shadow.blur ),
                opacity: 0
            });

            game.layer.add( game.paused )
        })();

        ( function _animation() {
            game.animation = new Kinetic.Animation( function( frame ){

                if ( game.state === 'starting' ){
                    game.snake.segment.queueNew();
                    game.snake.segment.addNewIfNecessary();

                    game.heart.regenerate();

                    game.state = 'waiting'

                } else if ( game.state === 'counting down' ){

                    game.background.count.down.animation( frame );

                    if ( game.background.count.down.number === 1 )

                        game.state = 'running';

                } else if ( game.state === 'running' ){
                    if ( game.boundaries.areReadyToCycle( frame )){
                        game.boundaries.animation( frame );
                    }

                    if ( game.snake.isReadyToMove( frame )){

                        game.snake.move( frame );
                        game.snake.segment.addNewIfNecessary();

                        if ( game.snake.isCollidingWith.itself() ) game.state = 'stopping';
                        if ( game.snake.isCollidingWith.boundary() ) game.state = 'stopping';

                        game.snake.isCollidingWith.heart( function( index ){
                            if ( index !== -1 ){
                                game.heart.destroy( index );

                                game.background.animation.randomize( frame );

                                game.background.count.segments( game.snake.segment.list );

                                game.snake.segment.queueNew();

                                if ( game.heart.list.length === 0 ) game.heart.regenerate()
                            }
                        })
                    }
                }

                else if ( game.state === 'stopping' )

                    util.animation.stop( game, frame )

            }, game.layer )
        })();
    };

    return game;
});