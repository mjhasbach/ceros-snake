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

                        if ( key.which == keys.f )
                            if ( bigScreen.enabled ) bigScreen.toggle();

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

                        if ( highScores.add.playerName.field.currentWordCursorPos != highScores.add.playerName.lastLength ){
                            highScores.add.playerName.move()
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

                        ( function _highScores() {
                            menu.options.highScores.hitBox.on( 'mouseover', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    menu.options.highScores.mouseOver = true
                                }
                            });

                            menu.options.highScores.hitBox.on( 'mouseout', function() {
                                if ( menu.isNotStoppingOrStopped() ){
                                    menu.options.highScores.shape.fill(
                                        settings.font.colors.fill.enabled.hex
                                    );

                                    menu.options.highScores.mouseOver = false
                                }
                            });

                            menu.options.highScores.hitBox.on( 'click touchstart', function() {
                                if ( menu.isNotStoppingOrStopped() )
                                    menu.state.set( 'current', 'stopping' );
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
                        ( function _add() {
                            ( function _keyboard() {
                                highScores.add.keyboard.hitBox.on( 'mouseover', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() )
                                        highScores.add.keyboard.mouseOver = true
                                });

                                highScores.add.keyboard.hitBox.on( 'mouseout', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() ){
                                        highScores.add.keyboard.shape.fill(
                                            settings.font.colors.fill.enabled.hex
                                        );

                                        highScores.add.keyboard.mouseOver = false
                                    }
                                });

                                highScores.add.keyboard.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() ){
                                        ( function( name ){
                                            highScores.add.playerName.field.text( name );

                                            highScores.add.playerName.move()

                                        })( prompt( 'What is your name, hero?' ))
                                    }
                                })
                            })();

                            ( function _submit() {
                                highScores.add.submit.hitBox.on( 'mouseover', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() )
                                        highScores.add.submit.mouseOver = true
                                });

                                highScores.add.submit.hitBox.on( 'mouseout', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() ){
                                        highScores.add.submit.shape.fill(
                                            settings.font.colors.fill.enabled.hex
                                        );

                                        highScores.add.submit.mouseOver = false
                                    }
                                });

                                highScores.add.submit.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() ){
                                        if ( highScores.add.playerName.field.text().length > 0 ){
                                            highScores.database.scores.add(
                                                new highScores.database.Score({
                                                    score: highScores.score,
                                                    name: highScores.add.playerName.field.text()
                                                })
                                            );

                                            highScores.add.state.set( 'current', 'stopping' )

                                        } else alert( 'Please provide your name, or click the "X" icon ' +
                                                      'if you do not wish to record your high score.' )
                                    }
                                })
                            })();

                            ( function _back() {
                                highScores.add.back.hitBox.on( 'mouseover', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() )
                                        highScores.add.back.mouseOver = true
                                });

                                highScores.add.back.hitBox.on( 'mouseout', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() ){
                                        highScores.add.back.shape.fill(
                                            settings.font.colors.fill.enabled.hex
                                        );

                                        highScores.add.back.mouseOver = false
                                    }
                                });

                                highScores.add.back.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.add.isNotStoppingOrStopped() )
                                        highScores.add.state.set( 'current', 'stopping' );
                                })
                            })();
                        })();

                        ( function _view() {
                            ( function _previous() {
                                highScores.view.previous.hitBox.on( 'mouseover', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() )
                                        highScores.view.previous.mouseOver = true
                                });

                                highScores.view.previous.hitBox.on( 'mouseout', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        highScores.view.previous.shape.fill(
                                            settings.font.colors.fill.enabled.hex
                                        );

                                        highScores.view.previous.mouseOver = false
                                    }
                                });

                                highScores.view.previous.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        highScores.view.index -= 1;

                                        highScores.view.update();

                                        if ( highScores.view.index === 0 ){
                                            highScores.view.previous.shape.remove();
                                            highScores.view.previous.hitBox.remove()
                                        }

                                        if ( !highScores.view.next.shape.getParent() ){
                                            highScores.view.layer.add( highScores.view.next.shape );
                                            highScores.view.layer.add( highScores.view.next.hitBox );
                                        }
                                    }
                                })
                            })();

                            ( function _next() {
                                highScores.view.next.hitBox.on( 'mouseover', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() )
                                        highScores.view.next.mouseOver = true
                                });

                                highScores.view.next.hitBox.on( 'mouseout', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        highScores.view.next.shape.fill(
                                            settings.font.colors.fill.enabled.hex
                                        );

                                        highScores.view.next.mouseOver = false
                                    }
                                });

                                highScores.view.next.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        highScores.view.index += 1;

                                        highScores.view.update();

                                        if ( highScores.view.index === settings.highScores.limit - 1 ){
                                            highScores.view.next.shape.remove();
                                            highScores.view.next.hitBox.remove()
                                        }

                                        if ( !highScores.view.previous.shape.getParent() ){
                                            highScores.view.layer.add( highScores.view.previous.shape );
                                            highScores.view.layer.add( highScores.view.previous.hitBox );
                                        }
                                    }
                                })
                            })();

                            ( function _back() {
                                highScores.view.back.hitBox.on( 'mouseover', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() )
                                        highScores.view.back.mouseOver = true
                                });

                                highScores.view.back.hitBox.on( 'mouseout', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() ){
                                        highScores.view.back.shape.fill(
                                            settings.font.colors.fill.enabled.hex
                                        );

                                        highScores.view.back.mouseOver = false
                                    }
                                });

                                highScores.view.back.hitBox.on( 'click touchstart', function() {
                                    if ( highScores.view.isNotStoppingOrStopped() )
                                        highScores.view.state.set( 'current', 'stopping' )
                                })
                            })();
                        })();
                    })();
                })();

                ( function _databaseEvents() {
                    highScores.database.scores.on( 'add', function( record ){
                        if ( highScores.view.state.get( 'current' ) === 'running' )
                            if ( record.score > highScores.score )
                                highScores.view.index++
                    })
                })();

                ( function _transitionListener() {
                    var start = util.module.start;

                    loading.state.on( 'change:current', function( state, current ){
                        if ( current === 'stopping' ) start( menu, stage )
                    });

                    menu.state.on( 'change:current', function( state, current ){
                        if ( current === 'stopping' ){
                            if ( menu.options.singlePlayer.mouseOver ){
                                start( game, stage );

                                ( function waitForMenuOut() {
                                    if ( menu.layer.opacity() === 0 )
                                        game.state.set( 'current', 'counting down' );

                                    else setTimeout( waitForMenuOut, 10 )
                                })();
                            } else {
                                start( highScores.view, stage );
                            }
                        }
                    });

                    game.state.on( 'change:current', function( state, current ){
                        if ( current === 'stopping' ){
                            highScores.add.start( game.snake.segment.list.length );

                            start( highScores.add, stage );

                            highScores.add.playerName.field.focus()
                        }
                    });

                    highScores.add.state.on( 'change:current', function( state, current ){
                        if ( current === 'stopping' ) start( menu, stage );
                    });

                    highScores.view.state.on( 'change:current', function( state, current ){
                        if ( current === 'stopping' ) start( menu, stage );
                    })
                })();

                ( function _transitionToMenu() {
                    assets.audio.song.mp3.play().loop();
                    loading.state.set( 'current', 'stopping' )
                })()
            }
        }
    }
);