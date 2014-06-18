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
                        var gameState = game.state.get( 'current' );

                        key.preventDefault();
                        key.stopPropagation();

                        if ( key.which == keys.f ){
                            if ( bigScreen.enabled ) bigScreen.toggle()
                        }

                        if (( gameState === 'running' || gameState === 'paused' ) &&
                              key.which == keys.space ){

                            if ( gameState === 'running' ){
                                game.state.set( 'current', 'paused' );
                                game.paused.moveToTop();
                                game.paused.opacity( 1 )
                            } else {
                                game.state.set( 'current', 'running' );
                                game.paused.opacity( 0 )
                            }
                        }

                        if ( gameState === 'starting' ||
                             gameState === 'counting down' ||
                             gameState === 'running' ){

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
                    ( function _menu() {
                        ( function _singlePlayer() {
                            menu.options.singlePlayer.hitBox.on( 'mouseover', function() {
                                if ( menu.isNotStoppingOrStopped() )
                                    menu.options.singlePlayer.mouseOver = true
                            });

                            menu.options.singlePlayer.hitBox.on( 'mouseout', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    menu.options.singlePlayer.shape.getChildren().each( function( node ){
                                        node.fill(
                                            settings.font.colors.fill.enabled.hex
                                        );
                                    });

                                    menu.options.singlePlayer.mouseOver = false
                                }
                            });

                            menu.options.singlePlayer.hitBox.on( 'click touchstart', function() {
                                if ( menu.isNotStoppingOrStopped() )
                                    menu.state.set( 'current', 'stopping' );
                            })
                        })();

                        ( function _gear() {
                            menu.options.gear.hitBox.on( 'mouseover', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    menu.options.gear.mouseOver = true
                                }
                            });

                            menu.options.gear.hitBox.on( 'mouseout', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    menu.options.gear.shape.fill(
                                        settings.font.colors.fill.enabled.hex
                                    );

                                    menu.options.gear.mouseOver = false
                                }
                            });

                            menu.options.gear.hitBox.on( 'click touchstart', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    if ( menu.state.get( 'current' ) === 'running' )
                                        menu.state.set( 'current', 'settings' );

                                    else menu.state.set( 'current', 'running' );
                                }
                            });
                        })();

                        ( function _volume() {
                            menu.settings.volume.hitBox.on( 'mouseover', function() {
                                if ( menu.state.get( 'current' ) === 'settings' )
                                    menu.settings.volume.mouseOver = true
                            });

                            menu.settings.volume.hitBox.on( 'mouseout', function() {
                                if ( menu.state.get( 'current' ) === 'settings' ){
                                    menu.settings.volume.shape.fill(
                                        settings.menu.settings.font.color.enabled.hex
                                    );

                                    menu.settings.volume.mouseOver = false
                                }
                            });

                            menu.settings.volume.hitBox.on( 'click touchstart', function() {
                                if ( menu.state.get( 'current' ) === 'settings' )
                                    audio.song.mp3.toggleMute()
                            })
                        })();

                        ( function _fullScreen() {
                            menu.settings.fullScreen.hitBox.on( 'mouseover', function() {
                                if ( menu.state.get( 'current' ) === 'settings' )
                                    menu.settings.fullScreen.mouseOver = true
                            });

                            menu.settings.fullScreen.hitBox.on( 'mouseout', function() {
                                if ( menu.state.get( 'current' ) === 'settings' ){
                                    menu.settings.fullScreen.shape.fill(
                                        settings.menu.settings.font.color.enabled.hex
                                    );

                                    menu.settings.fullScreen.mouseOver = false
                                }
                            });

                            menu.settings.fullScreen.hitBox.on( 'click touchstart', function() {
                                if ( menu.state.get( 'current' ) === 'settings' )
                                    if ( bigScreen.enabled ) bigScreen.toggle()
                            })
                        })();
                    })();

                    ( function _highScores() {
                        ( function _submit() {
                            highScores.submit.hitBox.on( 'mouseover', function() {
                                if ( highScores.add.isNotStoppingOrStopped() )
                                    highScores.submit.mouseOver = true
                            });

                            highScores.submit.hitBox.on( 'mouseout', function() {
                                if ( highScores.add.isNotStoppingOrStopped() ){
                                    highScores.submit.shape.fill(
                                        settings.font.colors.fill.enabled.hex
                                    );

                                    highScores.submit.mouseOver = false
                                }
                            });

                            highScores.submit.hitBox.on( 'click touchstart', function() {
                                if ( highScores.add.isNotStoppingOrStopped() ){
                                    highScores.database.scores.add({
                                        score: highScores.score,
                                        name: highScores.name.field.text()
                                    });

                                    highScores.add.state = 'stopping'
                                }
                            })
                        })();

                        ( function _back() {
                            highScores.back.hitBox.on( 'mouseover', function() {
                                if ( highScores.isNotStoppingOrStopped() )
                                    highScores.back.mouseOver = true
                            });

                            highScores.back.hitBox.on( 'mouseout', function() {
                                if ( highScores.isNotStoppingOrStopped() ){
                                    highScores.back.shape.fill(
                                        settings.font.colors.fill.enabled.hex
                                    );

                                    highScores.back.mouseOver = false
                                }
                            });

                            highScores.back.hitBox.on( 'click touchstart', function() {
                                if ( highScores.add.isNotStoppingOrStopped() )
                                    highScores.add.state = 'stopping';

                                else if ( highScores.view.isNotStoppingOrStopped() )
                                    highScores.view.state = 'stopping';
                            })
                        })();

                        ( function _previous() {
                            highScores.previous.hitBox.on( 'mouseover', function() {
                                if ( highScores.view.isNotStoppingOrStopped() )
                                    highScores.previous.mouseOver = true
                            });

                            highScores.previous.hitBox.on( 'mouseout', function() {
                                if ( highScores.view.isNotStoppingOrStopped() ){
                                    highScores.previous.shape.fill(
                                        settings.font.colors.fill.enabled.hex
                                    );

                                    highScores.previous.mouseOver = false
                                }
                            });

                            highScores.previous.hitBox.on( 'click touchstart', function() {
                                if ( highScores.view.isNotStoppingOrStopped() ){
                                    highScores.index -= 1;

                                    highScores.view.update();

                                    if ( highScores.index === 0 ){
                                        highScores.previous.shape.remove();
                                        highScores.previous.hitBox.remove()
                                    }

                                    if ( !highScores.next.shape.getParent() ){
                                        highScores.view.layer.add( highScores.next.shape );
                                        highScores.view.layer.add( highScores.next.hitBox );
                                    }
                                }
                            })
                        })();

                        ( function _next() {
                            highScores.next.hitBox.on( 'mouseover', function() {
                                if ( highScores.view.isNotStoppingOrStopped() )
                                    highScores.next.mouseOver = true
                            });

                            highScores.next.hitBox.on( 'mouseout', function() {
                                if ( highScores.view.isNotStoppingOrStopped() ){
                                    highScores.next.shape.fill(
                                        settings.font.colors.fill.enabled.hex
                                    );

                                    highScores.next.mouseOver = false
                                }
                            });

                            highScores.next.hitBox.on( 'click touchstart', function() {
                                if ( highScores.view.isNotStoppingOrStopped() ){
                                    highScores.index += 1;

                                    highScores.view.update();

                                    if ( highScores.index === settings.highScores.limit - 1 ){
                                        highScores.next.shape.remove();
                                        highScores.next.hitBox.remove()
                                    }

                                    if ( !highScores.previous.shape.getParent() ){
                                        highScores.view.layer.add( highScores.previous.shape );
                                        highScores.view.layer.add( highScores.previous.hitBox );
                                    }
                                }
                            })
                        })();
                    })();
                })();

                ( function _databaseEvents() {
                    highScores.database.scores.on( 'add', function( record ){
                        if ( highScores.view.state === 'running' )
                            if ( record.score > highScores.score )
                                highScores.index++
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
                                console.log( 'Starting module "' + toModule.name + '"' )
                        }

                        if ( fromModule.layer.opacity() === 0 && fromModule.state === 'stopping' ){
                            stop( fromModule );

                            if ( toModule === game )
                                toModule.state = 'counting down';

                            if ( settings.debug )
                                console.log( 'Stopping module "' + fromModule.name + '"' )
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

                            module.state = 'starting'
                        }

                        function stop( module ){
                            module.animation.stop();

                            module.layer.remove();

                            if ( module.cleanUp ) module.cleanUp();

                            module.state = 'stopped'
                        }
                    }
                })();

                ( function _transitionToMenu() {
                    assets.audio.song.mp3.play().loop();
                    loading.state.set( 'current', 'stopping' )
                })()
            }
        }
    }
);