define([ 'underscore', 'Kinetic', 'settings', 'util', 'stage', 'background' ],
    function( _, Kinetic, settings, util, stage, background ){
        var loading = {
            name: 'loading',

            layer: new Kinetic.Layer()
        };

        ( function _init() {
            ( function _background() {
                loading.background = background.loading;
                loading.layer.add( loading.background.group )
            })();

            ( function _loadingText() {
                loading.text = new Kinetic.Text({
                    x: util.calculate.absolute.x( 3 ),
                    y: util.calculate.absolute.y( 2.35 ),
                    text: 'Loading',
                    fontSize: util.calculate.absolute.x( 11 ),
                    fontFamily: settings.loading.text.family,
                    fill: settings.loading.text.color
                });

                loading.layer.add( loading.text )
            })();

            ( function _wheel() {
                loading.wheel = new Kinetic.Shape({
                    sceneFunc: function( context ){
                        context.beginPath();
                        context.arc(
                            util.calculate.absolute.x( 1.99 ),
                            util.calculate.absolute.y( 1.99 ),
                            util.calculate.absolute.x( 4.5 ),
                            util.calculate.pi( 1 ),
                            util.calculate.pi( 2 ),
                            true
                        );

                        context.stroke();
                        context.strokeShape( this );
                    },

                    stroke: settings.loading.wheel.color,
                    strokeWidth: util.calculate.absolute.x( 35 ) * 2
                });

                loading.layer.add( loading.wheel );
            })();

            ( function _animation() {
                loading.animation = new Kinetic.Animation( function( frame ){
                    loading.wheel.setDrawFunc( function( context ){
                        context.beginPath();

                        context.arc(
                            util.calculate.absolute.x( 1.99 ),
                            util.calculate.absolute.y( 1.99 ),
                            util.calculate.absolute.x( 4.5 ),
                            util.calculate.pi(( Math.sin( frame.time / 500 ))),
                            util.calculate.pi(( Math.sin( frame.time / 500 )) * 2),
                            true
                        );

                        context.stroke();
                        context.strokeShape( this );
                    });

                    if ( loading.background.isReadyToCycle( Math.sin( frame.time / 500 ))){
                        loading.background.cycleColors( frame );
                    }

                    if ( loading.state === 'stopping' ) util.animation.stop( loading, frame );

                }, loading.layer )
            })();

            ( function _start() {
                stage.add( loading.layer );

                loading.state = 'running';
                loading.animation.start();

                require([ 'assets' ], function( assets ){
                    assets.waitForAsync( function() {
                        assets.init({ background: background });

                        assets.audio.song.mp3.play().loop();

                        require([ 'events' ], function( events ){
                            events.init({
                                loading: loading,
                                stage: stage,
                                audio: assets.audio,
                                menu: assets.menu,
                                game: assets.game
                            });
                        })
                    })
                })
            })()
        })()
    }
);