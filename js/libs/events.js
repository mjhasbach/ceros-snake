define([ 'jquery', 'underscore', 'bigScreen', 'settings', 'util', 'database' ],
    function( $, _, bigScreen, settings, util, database ){
        return {
            init: function( assets ){
                var audio = assets.audio,
                    game = assets.game,
                    highScores = assets.highScores,
                    loading = assets.loading,
                    lobby = assets.lobby,
                    menu = assets.menu,
                    stage = assets.stage;

                ( function _keyEvents() {
                    var keys = {
                        w: 87, a: 65, s: 83, d: 68,
                        up: 38, left: 37, down: 40, right: 39,
                        space: 32,
                        backtick: 192,
                        enter: 13
                    };

                    $( document ).keydown( function( key ){
                        if ( key.which == keys.backtick && bigScreen.enabled )
                            bigScreen.toggle();

                        else if ( game.isNotStoppingOrStopped() ){
                            if ( key.which == keys.space ){
                                var gameState = game.state.get( 'current' );

                                if ( gameState === 'running' ){
                                    game.paused.moveToTop();
                                    game.state.set( 'current', 'paused' );
                                    
                                } else if ( gameState === 'paused' )
                                    game.state.set( 'current', 'running' );
                            }

                            handleNewDirection( key.which, [ keys.up, keys.w ], 'up' );
                            handleNewDirection( key.which, [ keys.left, keys.a ], 'left' );
                            handleNewDirection( key.which, [ keys.down, keys.s ], 'down' );
                            handleNewDirection( key.which, [ keys.right, keys.d ], 'right' )

                        } else if ( highScores.add.isNotStoppingOrStopped() ){
                            database.player.name.update( highScores.add );
                            highScores.add.playerName.move();

                            if ( key.which == keys.enter )
                                database.submitScore( highScores )

                        } else if ( highScores.view.isNotStoppingOrStopped() ){
                            if ( key.which == keys.left && highScores.view.index !== 0 ){

                                highScores.view.index -= 1;
                                highScores.view.update()

                            } else if ( key.which == keys.right &&
                                        highScores.view.index !== database.scores.length - 1 ){

                                highScores.view.index += 1;
                                highScores.view.update()
                            }
                        } else if ( lobby.isNotStoppingOrStopped() ){
                            database.player.name.update( lobby );
                            lobby.playerName.move()
                        }
                    });

                    function handleNewDirection( pressedKey, expectedKeys, direction ){
                        if ( _.indexOf( expectedKeys, pressedKey ) != -1 ){
                            if ( !( game.snake.direction.currentOrLastQueuedIsOppositeOf( direction ) ||
                                    game.snake.direction.lastQueuedIsSameAs( direction ))){

                                game.snake.direction.pushOrInit( direction )
                            }
                        }
                    }
                })();

                ( function _mouseAndTouchEvents() {
                    ( function _menu() {
                        ( function _singlePlayer() {
                            menu.options.singlePlayer.hitBox.on( 'mouseout', function() {
                                menu.options.singlePlayer.shape.getChildren().each( function( node ){
                                    util.color.fillAndStroke({
                                        node: node,
                                        fill: { hex: settings.font.colors.fill.enabled.hex },
                                        stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                    })
                                })
                            });

                            menu.options.singlePlayer.hitBox.on( 'click touchstart', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    menu.state.set( 'current', 'stopping' );
                                    game.state.set( 'current', 'starting' )
                                }
                            })
                        })();

                        ( function _multiPlayer() {
                            menu.options.multiPlayer.hitBox.on( 'mouseout', function() {
                                menu.options.multiPlayer.shape.getChildren().each( function( node ){
                                    util.color.fillAndStroke({
                                        node: node,
                                        fill: { hex: settings.font.colors.fill.enabled.hex },
                                        stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                    })
                                })
                            });

                            menu.options.multiPlayer.hitBox.on( 'click touchstart', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    menu.state.set( 'current', 'stopping' );
                                    lobby.state.set( 'current', 'starting' )
                                }
                            })
                        })();

                        ( function _gear() {
                            menu.options.gear.hitBox.on( 'mouseout', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    util.color.fillAndStroke({
                                        node: menu.options.gear.shape,
                                        fill: { hex: settings.font.colors.fill.enabled.hex },
                                        stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                    })
                                }
                            });

                            menu.options.gear.hitBox.on( 'click touchstart', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    if ( menu.state.get( 'current' ) === 'running' )
                                        menu.state.set( 'current', 'settings' );

                                    else menu.state.set( 'current', 'running' )
                                }
                            })
                        })();

                        ( function _highScores() {
                            menu.options.highScores.hitBox.on( 'mouseout', function() {
                                util.color.fillAndStroke({
                                    node: menu.options.highScores.shape,
                                    fill: { hex: settings.font.colors.fill.enabled.hex },
                                    stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                })
                            });

                            menu.options.highScores.hitBox.on( 'click touchstart', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    menu.state.set( 'current', 'stopping' );
                                    highScores.view.state.set( 'current', 'starting' )
                                }
                            })
                        })();

                        ( function _volume() {
                            menu.settings.volume.hitBox.on( 'mouseout', function() {
                                if ( menu.state.get( 'current' ) === 'settings' ){
                                    menu.settings.volume.shape.fill(
                                        settings.menu.settings.font.color.enabled.hex
                                    )
                                }
                            });

                            menu.settings.volume.hitBox.on( 'click touchstart', function() {
                                if ( menu.state.get( 'current' ) === 'settings' )
                                    audio.song.mp3.toggleMute()
                            })
                        })();

                        ( function _fullScreen() {
                            menu.settings.fullScreen.hitBox.on( 'mouseout', function() {
                                if ( menu.state.get( 'current' ) === 'settings' ){
                                    menu.settings.fullScreen.shape.fill(
                                        settings.menu.settings.font.color.enabled.hex
                                    )
                                }
                            });

                            menu.settings.fullScreen.hitBox.on( 'click touchstart', function() {
                                if ( menu.state.get( 'current' ) === 'settings' )
                                    if ( bigScreen.enabled ) bigScreen.toggle()
                            })
                        })();
                    })();

                    ( function _highScores() {
                        ( function _add() {
                            ( function _keyboard() {
                                highScores.add.keyboard.hitBox.on( 'mouseout', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() ){
                                        util.color.fillAndStroke({
                                            node: highScores.add.keyboard.shape,
                                            fill: { hex: settings.font.colors.fill.enabled.hex },
                                            stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                        })
                                    }
                                });

                                highScores.add.keyboard.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() ){
                                        var name = prompt( 'What is your name, hero?' );

                                        if ( name.length > 15 )
                                            alert( 'Your name can only have a maximum of 15 characters!' );
                                        else {
                                            highScores.add.playerName.field.text( name );

                                            highScores.add.playerName.move()
                                        }
                                    }
                                })
                            })();

                            ( function _submit() {
                                highScores.add.submit.hitBox.on( 'mouseout', function() {
                                    util.color.fillAndStroke({
                                        node: highScores.add.submit.shape,
                                        fill: { hex: settings.font.colors.fill.enabled.hex },
                                        stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                    })
                                });

                                highScores.add.submit.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() )
                                        database.submitScore( highScores )
                                })
                            })();

                            ( function _back() {
                                highScores.add.back.hitBox.on( 'mouseout', function() {
                                    util.color.fillAndStroke({
                                        node: highScores.add.back.shape,
                                        fill: { hex: settings.font.colors.fill.enabled.hex },
                                        stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                    })
                                });

                                highScores.add.back.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() )
                                        highScores.add.state.set( 'current', 'stopping' );
                                })
                            })();
                        })();

                        ( function _view() {
                            ( function _previous() {
                                highScores.view.previous.hitBox.on( 'mouseout', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        util.color.fillAndStroke({
                                            node: highScores.view.previous.shape,
                                            fill: { hex: settings.font.colors.fill.enabled.hex },
                                            stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                        })
                                    }
                                });

                                highScores.view.previous.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        highScores.view.index -= 1;

                                        highScores.view.update()
                                    }
                                })
                            })();

                            ( function _next() {
                                highScores.view.next.hitBox.on( 'mouseout', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        util.color.fillAndStroke({
                                            node: highScores.view.next.shape,
                                            fill: { hex: settings.font.colors.fill.enabled.hex },
                                            stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                        })
                                    }
                                });

                                highScores.view.next.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        highScores.view.index += 1;

                                        highScores.view.update()
                                    }
                                })
                            })();

                            ( function _back() {
                                highScores.view.back.hitBox.on( 'mouseout', function() {
                                    util.color.fillAndStroke({
                                        node: highScores.view.back.shape,
                                        fill: { hex: settings.font.colors.fill.enabled.hex },
                                        stroke: { hex: settings.font.colors.stroke.enabled.hex }
                                    })
                                });

                                highScores.view.back.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() )
                                        highScores.view.state.set( 'current', 'stopping' )
                                })
                            })();
                        })();
                    })();

                    ( function _lobby() {
                        ( function _back() {
                            lobby.options.back.hitBox.on( 'mouseout', function() {
                                lobby.options.back.shape.fill( settings.font.colors.fill.enabled.hex );
                                lobby.options.back.shape.stroke( settings.font.colors.stroke.enabled.hex )
                            });

                            lobby.options.back.hitBox.on( 'click touchstart', function() {
                                if ( lobby.isNotStoppingOrStopped() )
                                    lobby.state.set( 'current', 'stopping' )
                            })
                        })();

                        ( function _keyboard() {
                            lobby.options.keyboard.hitBox.on( 'mouseout', function() {
                                lobby.options.keyboard.shape.fill( settings.font.colors.fill.enabled.hex );
                                lobby.options.keyboard.shape.stroke( settings.font.colors.stroke.enabled.hex )
                            })
                        })()
                    })();
                })();

                ( function _transitionListener() {
                    var start = util.module.start;

                    loading.state.on( 'change:current', function( state, current ){
                        if ( current === 'stopping' ) start( menu, stage )
                    });

                    game.state.on( 'change:current', function( state, current ){
                        if ( current === 'starting' ){
                            start( game, stage );

                            ( function waitForMenuOut() {
                                if ( menu.layer.opacity() === 0 )
                                    game.state.set( 'current', 'counting down' );

                                else setTimeout( waitForMenuOut, 10 )
                            })()
                        } else if ( current === 'stopping' )
                            highScores.add.start( game.snake.segment.list.length )
                    });

                    highScores.add.state.on( 'change:current', function( state, current ){
                        if ( current === 'stopping' ) start( menu, stage )
                    });

                    highScores.view.state.on( 'change:current', function( state, current ){
                        if ( current === 'starting' ){
                            highScores.view.update();

                            start( highScores.view, stage )
                        }
                        else if ( current === 'stopping' ) start( menu, stage )
                    });

                    lobby.state.on( 'change:current', function( state, current ){
                        if ( current === 'starting' )
                            start( lobby, stage );
                        else if ( current === 'stopping' )
                            start( menu, stage )
                    });
                })();

                ( function _databaseEvents() {
                    database.connected.on( 'value', function( status ){
                        if ( status.val() === true ){
                            database.player.me = database.player.list.get(
                                database.player.list.create().id
                            );

                            database.player.removeMeOnDisconnect();

                            if ( loading.isNotStoppingOrStopped() ){
                                assets.audio.song.mp3.play().loop();
                                loading.state.set({ current: 'stopping' })
                            }
                        }
                    });

                    database.scores.on( 'add', function( record ){
                        if ( highScores.view.state.get( 'current' ) === 'running' )
                            if ( record.get( 'score' ) > highScores.view.current.get( 'score' ))
                                highScores.view.index++
                    })
                })();
            }
        }
    }
);