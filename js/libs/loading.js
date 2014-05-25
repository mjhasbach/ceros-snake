define([ 'underscore', 'Kinetic', 'settings', 'util', 'stage', 'background' ],
    function( _, Kinetic, settings, util, stage, background ){
        var loading = {
            name: 'loading',

            state: 'stopped',

            layer: new Kinetic.Layer(),

            start: function() {

            }
        };

        var init = [
            _.once( function _background() {
                loading.background = background.loading;
                loading.layer.add( loading.background )
            }),

            _.once( function _loadingText() {
                loading.text = new Kinetic.Text({
                    x: util.calculate.absolute.x( 3 ),
                    y: util.calculate.absolute.y( 2.35 ),
                    text: 'Loading',
                    fontSize: util.calculate.absolute.x( 11 ),
                    fontFamily: settings.loading.text.family,
                    fill: settings.loading.text.color
                });

                loading.layer.add( loading.text )
            }),

            _.once( function _wheel() {
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
            }),

            _.once( function _animation() {
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

                        //if ( Math.sin( frame.time / 500 ) === 0 ) background.tile.cycleColors();

                        context.stroke();
                        context.strokeShape( this );
                    });



                    if ( loading.state === 'stopping' ) util.animation.fadeAndStop( loading, frame );

                }, loading.layer );
            }),

            _.once( function _layer() {
                stage.add( loading.layer );
                loading.state = 'running';
                loading.animation.start();
            })
        ];

        init.forEach( function( init ) { init() });

        require([ 'assets' ], function( assets ){

            assets.init({ background: background });

            assets.waitForAsync( function() {
                loading.state = 'stopping';

                require([ 'events' ], function( events ){
                    events.start({
                        loading: loading,
                        stage: stage,
                        audio: assets.audio,
                        menu: assets.menu,
                        game: assets.game
                    })
                })
            });
        })
    }
);