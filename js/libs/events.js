define([ 'jquery', 'underscore', 'bigScreen', 'settings', 'util' ],
    function( $, _, bigScreen, settings, util ){
        return {
            init: function( assets ){
                var audio = assets.audio,
                    stage = assets.stage,
                    loading = assets.loading,
                    menu = assets.menu,
                    game = assets.game,
                    highScores = assets.highScores;

                ( function _keyEvents() {
                    var keys = {
                        w: 87, a: 65, s: 83, d: 68,
                        up: 38, left: 37, down: 40, right: 39,
                        space: 32,
                        f: 70
                    };

                    $( '*' ).keyup( function( key ){
                        key.preventDefault();
                        key.stopPropagation();

                        if ( key.which == keys.f ){
                            if ( bigScreen.enabled ) bigScreen.toggle()
                        }

                        if (( game.state === 'running' || game.state === 'paused' ) &&
                              key.which == keys.space ){

                            if ( game.state === 'running' ){
                                game.state = 'paused';
                                game.paused.moveToTop();
                                game.paused.opacity( 1 )
                            } else {
                                game.state = 'running';
                                game.paused.opacity( 0 )
                            }
                        }

                        if ( game.state === 'starting' ||
                             game.state === 'counting down' ||
                             game.state === 'running' ){

                            handleNewDirection( key.which, [ keys.up, keys.w ], 'up' );
                            handleNewDirection( key.which, [ keys.left, keys.a ], 'left' );
                            handleNewDirection( key.which, [ keys.down, keys.s ], 'down' );
                            handleNewDirection( key.which, [ keys.right, keys.d ], 'right' );
                        }
                    });

                    function handleNewDirection( pressedKey, expectedKeys, direction ){
                        if ( _.indexOf( expectedKeys, pressedKey ) != -1 ){
                            if ( !( game.snake.direction.currentOrLastQueuedIsOppositeOf( direction ) ||
                                    game.snake.direction.lastQueuedIsSameAs( direction ))){

                                game.snake.direction.pushOrInit( direction );
                            }
                        }
                    }
                })();

                ( function _mouseAndTouchEvents() {
                    menu.options.singlePlayer.hitBox.on( 'mouseover', function() {
                        if ( menu.isNotStoppingOrStopped() ){
                            menu.options.singlePlayer.mouseOver = true
                        }
                    });

                    menu.options.singlePlayer.hitBox.on( 'mouseout', function() {
                        if ( menu.isNotStoppingOrStopped() ){
                            menu.options.singlePlayer.shape.getChildren().each( function( node ){
                                node.fill(
                                    settings.menu.options.font.color.enabled.hex
                                );
                            });

                            menu.options.singlePlayer.mouseOver = false
                        }
                    });

                    menu.options.singlePlayer.hitBox.on( 'click touchstart', function() {
                        if ( menu.isNotStoppingOrStopped() ){
                            menu.state = 'stopping';
                        }
                    });

                    menu.options.gear.hitBox.on( 'mouseover', function() {
                        if ( menu.isNotStoppingOrStopped() ){
                            menu.options.gear.mouseOver = true
                        }
                    });

                    menu.options.gear.hitBox.on( 'mouseout', function() {
                        if ( menu.isNotStoppingOrStopped() ){
                            menu.options.gear.shape.fill(
                                settings.menu.options.font.color.enabled.hex
                            );

                            menu.options.gear.mouseOver = false
                        }
                    });

                    menu.options.gear.hitBox.on( 'click touchstart', function() {
                        if ( menu.isNotStoppingOrStopped() ){
                            if ( menu.state === 'running' ) menu.state = 'settings';
                            else menu.state = 'running';
                        }
                    });

                    menu.options.settings.volume.hitBox.on( 'mouseover', function() {
                        if ( menu.state === 'settings' ){
                            menu.options.settings.volume.mouseOver = true
                        }
                    });

                    menu.options.settings.volume.hitBox.on( 'mouseout', function() {
                        if ( menu.state === 'settings' ){
                            menu.options.settings.volume.shape.fill(
                                settings.menu.options.settings.font.color.enabled.hex
                            );

                            menu.options.settings.volume.mouseOver = false
                        }
                    });

                    menu.options.settings.volume.hitBox.on( 'click touchstart', function() {
                        if ( menu.state === 'settings' ){
                            audio.song.mp3.toggleMute()
                        }
                    });

                    menu.options.settings.fullScreen.hitBox.on( 'mouseover', function() {
                        if ( menu.state === 'settings' ){
                            menu.options.settings.fullScreen.mouseOver = true
                        }
                    });

                    menu.options.settings.fullScreen.hitBox.on( 'mouseout', function() {
                        if ( menu.state === 'settings' ){
                            menu.options.settings.fullScreen.shape.fill(
                                settings.menu.options.settings.font.color.enabled.hex
                            );

                            menu.options.settings.fullScreen.mouseOver = false
                        }
                    });

                    menu.options.settings.fullScreen.hitBox.on( 'click touchstart', function() {
                        if ( menu.state === 'settings' ){
                            if ( bigScreen.enabled ) bigScreen.toggle()
                        }
                    });
                })();

                ( function _databaseEvents() {
                    highScores.database.highest.on( 'value', function( scores ){
                        highScores.database.scores = [];

                        scores.forEach( function( score ){
                            highScores.database.scores.push({
                                name: score.val().name,
                                score: score.val().score
                            })
                        });

                        highScores.database.scores.sort( function( a, b ) {
                            return b.score - a.score
                        })
                    })
                })();

                ( function _transitionListener() {
                    ( function listener() {
                        transition( loading, menu );
                        transition( menu, game );
                        transition( game, menu );

                        setTimeout( function() { listener() }, 100 )
                    })();

                    function transition( fromModule, toModule ){
                        if ( !toModule.layer.getParent() && fromModule.state === 'stopping' ){
                            start( toModule );

                            if ( settings.debug )
                                console.log( 'Starting module "' + toModule.name + '"' );
                        }

                        if ( fromModule.layer.opacity() === 0 && fromModule.state === 'stopping' ){
                            stop( fromModule );

                            if ( settings.debug )
                                console.log( 'Stopping module "' + fromModule.name + '"' );

                            if ( toModule === game ){
                                toModule.state = 'counting down';
                            }

                        }

                        function start( module ){
                            stage.add( module.layer );

                            module.layer.opacity( 1 );

                            module.layer.moveToBottom();

                            stage.scale({
                                x: util.calculate.dimensions.scale(),
                                y: util.calculate.dimensions.scale()
                            });

                            module.animation.start();

                            module.state = 'starting';
                        }

                        function stop( module ){
                            module.animation.stop();

                            module.layer.remove();

                            if ( module.cleanUp ) module.cleanUp();

                            module.state = 'stopped';
                        }
                    }
                })();

                ( function _transitionToMenu() {
                    assets.audio.song.mp3.play().loop();
                    loading.state = 'stopping'
                })()
            }
        }
    }
);