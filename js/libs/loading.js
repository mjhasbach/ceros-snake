define([ 'underscore', 'backbone', 'Kinetic', 'settings', 'util', 'viewport', 'background' ],
    function( _, Backbone, Kinetic, settings, util, viewport, background ){
        var loading = {
                name: 'loading',

                state: new Backbone.Model({ current: 'stopped' }),

                layer: new Kinetic.Layer,

                background: background.loading,

                text: new Kinetic.Text({
                    x: util.calculate.absolute.x( 3 ),
                    y: util.calculate.absolute.y( 2.35 ),
                    text: 'Loading',
                    fontSize: util.calculate.absolute.x( 11 ),
                    fontFamily: settings.loading.text.family,
                    fill: settings.loading.text.color
                }),

                wheel: new Kinetic.Shape({
                    stroke: settings.loading.wheel.color,
                    strokeWidth: util.calculate.absolute.x( 35 ) * 2
                }),

                animation: new Kinetic.Animation( function( frame ){
                    loading.wheel.setDrawFunc( function( context ){
                        context.beginPath();
                        context.arc(
                            util.calculate.absolute.x( 1.99 ),
                            util.calculate.absolute.y( 1.99 ),
                            util.calculate.absolute.x( 4.5 ),
                            util.calculate.pi(( Math.sin( frame.time / 500 ))),
                            util.calculate.pi(( Math.sin( frame.time / 500 )) * 2 ),
                            true
                        );
                        context.stroke();
                        context.strokeShape( this )
                    });

                    if ( loading.background.isReadyToCycle( Math.sin( frame.time / 500 )))
                        loading.background.draw.randomize( frame );

                    if ( loading.state.get( 'current' ) === 'stopping' )
                        util.module.stop( loading, frame )
                }),

                init: function() {
                    ( function _layer() {
                        loading.layer.add( loading.background.group );

                        loading.layer.add( loading.text );

                        loading.layer.add( loading.wheel );

                        loading.animation.setLayers( loading.layer );
                    })();

                    util.module.start( loading );

                    require([ 'assets' ], function( assets ){
                        assets.waitForAsync( function() {
                            assets.init( function( gameAssets ){
                                require([ 'events' ], function( events ){
                                    events.init({
                                        audio: assets.audio,
                                        viewport: viewport,
                                        loading: loading,
                                        menu: gameAssets.menu,
                                        game: gameAssets.game,
                                        highScores: gameAssets.highScores
                                    })
                                })
                            })
                        })
                    })
                }
            };

        loading.init()
    }
);