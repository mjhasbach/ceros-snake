define([ 'jquery', 'underscore', 'settings', 'util', 'bigScreen' ],
    function( $, _, settings, util, bigScreen ){
        return {
            init: function( assets ){
                var audio = assets.audio;
                var stage = assets.stage;
                var menu = assets.menu;
                var game = assets.game;
                var loading = assets.loading;

                ( function _keyEvents() {
                    var keys = {
                        w: 87, a: 65, s: 83, d: 68,
                        up: 38, left: 37, down: 40, right: 39,
                        space: 32
                    };

                    $( "*" ).keyup( function( key ){
                        key.preventDefault();
                        key.stopPropagation();

                        if (( game.state === 'running' || game.state === 'paused' ) &&
                              key.which == keys.space ){

                            if ( game.state === 'running' ) game.state = 'paused';
                            else game.state = 'running'
                        }

                        if ( game.state === 'running' || game.state === 'starting' ){
                            handleNewDirection( key.which, [ keys.up, keys.w ], 'up');
                            handleNewDirection( key.which, [ keys.left, keys.a ], 'left');
                            handleNewDirection( key.which, [ keys.down, keys.s ], 'down');
                            handleNewDirection( key.which, [ keys.right, keys.d ], 'right');
                        }
                    });

                    function handleNewDirection( pressedKey, expectedKeys, direction ){
                        if ( _.indexOf( expectedKeys, pressedKey ) != -1 &&
                            game.snake.direction.currentIsNotOppositeOf( direction ) &&
                            game.snake.direction.lastQueuedIsNotSameAs( direction )){

                            game.snake.direction.pushOrInit( direction );
                        }
                    }
                })();

                ( function _mouseEvents() {
                    menu.options.singlePlayer.hitBox.on( 'mouseover', function() {
                        if ( menu.state !== 'stopping' && menu.state !== 'stopped' ){
                            menu.options.singlePlayer.mouseOver = true
                        }
                    });

                    menu.options.singlePlayer.hitBox.on( 'mouseout', function() {
                        if ( menu.state !== 'stopping' && menu.state !== 'stopped' ){
                            menu.options.singlePlayer.shape.getChildren().each( function( node ){
                                node.fill( settings.menu.options.font.color.enabled.hex );
                            });

                            menu.options.singlePlayer.mouseOver = false
                        }
                    });

                    menu.options.singlePlayer.hitBox.on( 'click touchstart', function() {
                        if ( menu.state !== 'stopping' && menu.state !== 'stopped' ){
                            menu.state = 'stopping';
                        }
                    });

                    menu.options.gear.hitBox.on( 'mouseover', function() {
                        if ( menu.state !== 'stopping' && menu.state !== 'stopped' ){
                            menu.options.gear.mouseOver = true
                        }
                    });

                    menu.options.gear.hitBox.on( 'mouseout', function() {
                        if ( menu.state !== 'stopping' && menu.state !== 'stopped' ){
                            menu.options.gear.shape.fill( settings.menu.options.font.color.enabled.hex );
                            menu.options.gear.mouseOver = false
                        }
                    });

                    menu.options.gear.hitBox.on( 'click touchstart', function() {
                        if ( menu.state !== 'stopping' && menu.state !== 'stopped' ){
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
                            menu.options.settings.volume.shape.fill( settings.menu.options.settings.font.color.enabled.hex );
                            menu.options.settings.volume.mouseOver = false
                        }
                    });

                    menu.options.settings.volume.hitBox.on( 'click touchstart', function() {
                        if ( menu.state === 'settings' ){
                            audio.song.mp3.toggleMute();
                            menu.state = 'running';
                        }
                    });

                    menu.options.settings.fullScreen.hitBox.on( 'mouseover', function() {
                        if ( menu.state === 'settings' ){
                            menu.options.settings.fullScreen.mouseOver = true
                        }
                    });

                    menu.options.settings.fullScreen.hitBox.on( 'mouseout', function() {
                        if ( menu.state === 'settings' ){
                            menu.options.settings.fullScreen.shape.fill( settings.menu.options.settings.font.color.enabled.hex );
                            menu.options.settings.fullScreen.mouseOver = false
                        }
                    });

                    menu.options.settings.fullScreen.hitBox.on( 'click touchstart', function() {
                        if ( menu.state === 'settings' ){
                            if ( bigScreen.enabled ) bigScreen.toggle();

                            menu.state = 'running'
                        }
                    });
                })();

                ( function _transitionListener() {
                    ( function listener() {
                        transition( loading, menu );
                        transition( menu, game );
                        transition( game, menu );

                        setTimeout( function () { listener() }, 100 )
                    })();

                    function transition( fromModule, toModule ){
                        if ( !toModule.layer.getParent() && fromModule.state === 'stopping' ){

                            stage.add( toModule.layer );
                            stage.scale({
                                x: util.calculate.dimensions.scale(),
                                y: util.calculate.dimensions.scale()
                            });

                            if ( fromModule.name === 'loading' ) fromModule.layer.moveToTop();
                            else if ( toModule.name === 'game' ) toModule.layer.moveToBottom();

                            toModule.layer.draw();
                        }


                        if ( fromModule.name === 'loading' &&
                             fromModule.state === 'stopping' &&
                             !toModule.animation.isRunning() ){

                            start( toModule );
                        }

                        else if ( fromModule.state === 'to game' ){
                            start( toModule );
                            fromModule.state = 'stopped'
                        }

                        else if ( fromModule.state === 'to menu' ){
                            start( toModule );
                            fromModule.state = 'stopped';
                        }

                        function start( module ){
                            module.state = 'starting';
                            module.animation.start()
                        }
                    }
                })();

                ( function _transitionToMenu() {
                    loading.state = 'stopping'
                })()
            }
        }
    }
);


