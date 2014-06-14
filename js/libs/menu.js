define([ 'Kinetic', 'underscore', 'settings', 'util' ], function( Kinetic, _, settings, util ){
    var menu = {
        name: 'menu',

        state: 'starting',

        layer: new Kinetic.Layer(),

        title: {
            bounce: function( frame ){
                menu.title.bounciness =
                    ( Math.sin( frame.time * 2 * Math.PI / settings.animation.period )) *
                    settings.menu.title.bounciness;

                menu.title.ceros.shape.strokeWidth(
                    util.calculate.absolute.size( settings.menu.title.stroke.width + menu.title.bounciness )
                );

                menu.title.snake.shape.strokeWidth(
                    util.calculate.absolute.size( settings.menu.title.stroke.width + menu.title.bounciness )
                )
            }
        },

        options: {
            settings: {},

            mouseOverCheck: function( frame ){
                var brightnessVariance = util.calculate.brightnessVariance( frame );
                
                ( function( hF, sF, lF, hS, sS, lS ){
                    if ( menu.options.singlePlayer.mouseOver )

                        menu.options.singlePlayer.shape.getChildren().each( function( node ){
                            util.color.fillAndStroke({
                                node: node,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            })
                        });

                    else if ( menu.options.gear.mouseOver )

                        util.color.fillAndStroke({
                            node: menu.options.gear.shape,
                            fill: { h: hF, s: sF, l: lF },
                            stroke: { h: hS, s: sS, l: lS }
                        });

                })( settings.menu.options.font.color.enabled.h,
                    settings.menu.options.font.color.enabled.s,
                    settings.menu.options.font.color.enabled.l - brightnessVariance,

                    settings.menu.options.stroke.color.enabled.h,
                    settings.menu.options.stroke.color.enabled.s,
                    settings.menu.options.stroke.color.enabled.l - brightnessVariance
                );

                ( function( h, s, l ){
                    if ( menu.options.settings.volume.mouseOver )

                        menu.options.settings.volume.shape.fill( 'hsl('+ h +', '+ s +'%, '+ l +'%)' );

                    else if ( menu.options.settings.fullScreen.mouseOver )

                        menu.options.settings.fullScreen.shape.fill( 'hsl('+ h +', '+ s +'%, '+ l +'%)' );

                })( settings.menu.options.settings.font.color.enabled.h,
                    settings.menu.options.settings.font.color.enabled.s,
                    settings.menu.options.settings.font.color.enabled.l + ( brightnessVariance * 2 )
                );
            }
        },

        isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

        cleanUp: function() {
            menu.options.singlePlayer.mouseOver = false;
            menu.options.gear.mouseOver = false;
            menu.options.settings.volume.mouseOver = false;
            menu.options.settings.fullScreen.mouseOver = false;

            menu.options.singlePlayer.shape.getChildren().each( function( node ){
                node.fill( settings.menu.options.font.color.enabled.hex );
            });

            menu.options.gear.shape.fill( settings.menu.options.font.color.enabled.hex );
            menu.options.settings.volume.shape.fill( settings.menu.options.settings.font.color.enabled.hex );
            menu.options.settings.fullScreen.shape.fill( settings.menu.options.settings.font.color.enabled.hex );

            menu.options.settings.group.opacity( 0 );
        },

        init: function ( options ){
            ( function _bg() {
                menu.background = options.background.menu;
                menu.layer.add( menu.background.group )
            })();

            ( function _ceros() {
                var x = util.calculate.absolute.x,
                    y = util.calculate.absolute.y,
                    pi = util.calculate.pi;

                menu.title.ceros = {
                    shape: new Kinetic.Shape({ sceneFunc: function( context ){
                        context.beginPath();
                        context.arc( x( 8.7 ), y( 5 ), x( 11.5 ), pi( 1.85 ), pi( 0.2 ), true );
                        context.lineTo( x( 4.0185 ), y( 8 ));
                        context.moveTo( x( 4 ), y( 3.35 ));
                        context.arc( x( 3.07 ), y( 5 ), x( 11.5 ), pi( 1.75 ), pi( 0.0 ), true );
                        context.moveTo( x( 2.42 ), y( 2.65 ));
                        context.arc( x( 2 ), y( 5 ), x( 11.5 ), pi( 1 ), pi( 1.9 ));
                        context.arc( x( 1.486 ), y( 5 ), x( 11.5 ), pi( 3 ), pi( 1 ), true );
                        context.arc( x( 1.486 ), y( 5 ), x( 11.5 ), pi( 3 ), pi( 2.2 ), true );
                        context.arc( x( 1.13 ), y( 5 ), x( 11.5 ), pi( 1.2 ), pi( 0.81 ));
                        context.stroke();
                        context.strokeShape( this );
                    },
                        stroke: settings.menu.title.stroke.color,
                        strokeWidth: x( settings.menu.title.stroke.width )
                    })
                };

                menu.layer.add( menu.title.ceros.shape )
            })();

            ( function _snake() {
                var x = util.calculate.absolute.x,
                    y = util.calculate.absolute.y,
                    pi = util.calculate.pi;

                menu.title.snake = {
                    shape: new Kinetic.Shape({ sceneFunc: function( context ){
                        context.beginPath();
                        context.arc( x( 8.7 ), y( 1.72 ), x( 11.5 ), pi( 1.15 ), pi( 0.81 ));
                        context.arc( x( 8.7 ), y( 1.72 ), x( 11.5 ), pi( 0.81 ), pi( 0.2 ), true );
                        context.arc( x( 3.07 ), y( 1.72 ), x( 11.5 ), pi( 1.2 ), pi( 2 ));
                        context.arc( x( 3.07 ), y( 1.72 ), x( 11.5 ), pi( 0 ), pi( 1 ), true );
                        context.lineTo( x( 4.19 ), y( 1.318 ));
                        context.moveTo( x( 2.423 ), y( 1.318 ));
                        context.lineTo( x( 2.423 ), y( 1.318 ));
                        context.lineTo( x( 2.423 ), y( 1.72 ));
                        context.arc( x( 1.99 ), y( 1.72 ), x( 11.5 ), pi( 1 ), pi( 2 ));
                        context.lineTo( x( 1.695 ), y( 1.318 ));
                        context.lineTo( x( 1.695 ), y( 2.47 ));
                        context.moveTo( x( 1.695 ), y( 1.71 ));
                        context.lineTo( x( 2.413 ), y( 1.71 ));
                        context.lineTo( x( 1.695 ), y( 1.71 ));
                        context.quadraticCurveTo( x( 1.308 ), y( 1.71 ), x( 1.308 ), y( 2.45 ));
                        context.moveTo( x( 1.695 ), y( 1.71 ));
                        context.quadraticCurveTo( x( 1.39 ), y( 1.71 ), x( 1.287 ), y( 1.3825 ));
                        context.arc( x( 1.12 ), y( 1.72 ), x( 11.5 ), pi( 1.75 ), pi( 0 ), true );
                        context.stroke();
                        context.strokeShape( this );
                    },
                        stroke: settings.menu.title.stroke.color,
                        strokeWidth: x( settings.menu.title.stroke.width )
                    })
                };

                menu.layer.add( menu.title.snake.shape )
            })();

            ( function _numberControllerGroups() {
                menu.options.singlePlayer = {};

                menu.options.singlePlayer.mouseOver = false;

                menu.options.singlePlayer.shape = numberControllerGroup(
                    1,
                    util.calculate.absolute.x( 50 ),
                    util.calculate.absolute.x( 18 ),
                    settings.menu.options.font.color.enabled.hex,
                    settings.menu.options.stroke.color.enabled.hex
                );

                menu.options.singlePlayer.hitBox = new Kinetic.Rect({
                    x: util.calculate.absolute.x( 62 ),
                    y: util.calculate.absolute.y( 1.214 ),
                    width: util.calculate.absolute.x( 6.25 ),
                    height: util.calculate.absolute.y( 8.46 ),
                    opacity: 0
                });

                menu.layer.add( menu.options.singlePlayer.hitBox );

                menu.options.multiPlayer = {
                    shape: numberControllerGroup(
                        2,
                        util.calculate.absolute.x( 5 ),
                        util.calculate.absolute.x( 3.99 ),
                        settings.menu.options.font.color.disabled,
                        settings.menu.options.stroke.color.disabled
                    )
                };

                function numberControllerGroup( number, numberX, controllerX, fill, stroke ){
                    var shapes = {
                        group: new Kinetic.Group(),

                        number: new Kinetic.Text({
                            x: numberX,
                            y: util.calculate.absolute.y( settings.menu.options.y ),
                            text: number.toString(),
                            fontSize: util.calculate.absolute.size( settings.menu.options.font.size ),
                            fontFamily: settings.font.ui,
                            fill: fill,
                            stroke: stroke,
                            strokeWidth: util.calculate.absolute.size( settings.menu.options.stroke.width )
                        }),

                        controller: new Kinetic.Text({
                            x: controllerX,
                            y: util.calculate.absolute.y( 1.295 ),
                            text: '\uf11b',
                            fontSize: util.calculate.absolute.size( settings.menu.options.controller.size ),
                            fontFamily: 'FontAwesome',
                            fill: fill,
                            stroke: stroke,
                            strokeWidth: util.calculate.absolute.size( settings.menu.options.stroke.width )
                        })
                    };

                    shapes.group.add( shapes.number );
                    shapes.group.add( shapes.controller );

                    menu.layer.add( shapes.group );

                    return shapes.group
                }
            })();

            ( function _gear() {
                menu.options.gear = {};

                menu.options.gear.mouseOver = false;

                menu.options.gear.shape = new Kinetic.Text({
                    x: util.calculate.absolute.x( 2.51 ),
                    y: util.calculate.absolute.y( settings.menu.options.y ),
                    text: '\uf013',
                    fontSize: util.calculate.absolute.x( settings.menu.options.font.size ),
                    fontFamily: 'FontAwesome',
                    fill: settings.menu.options.font.color.enabled.hex,
                    stroke: settings.menu.options.stroke.color.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.menu.options.stroke.width )
                });

                menu.layer.add( menu.options.gear.shape );

                menu.options.gear.hitBox = new Kinetic.Rect({
                    x: util.calculate.absolute.x( 2.518 ),
                    y: util.calculate.absolute.y( 1.23 ),
                    width: util.calculate.absolute.x( 12.39 ),
                    height: util.calculate.absolute.y( 6.92 ),
                    opacity: 0
                });

                menu.layer.add( menu.options.gear.hitBox );
            })();

            ( function _highScores() {
                menu.options.highScores = {
                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 1.97 ),
                        y: util.calculate.absolute.y( settings.menu.options.y ),
                        text: 'High Scores',
                        fontSize: util.calculate.absolute.x( settings.menu.options.font.size ),
                        fontFamily: settings.font.ui,
                        fill: settings.menu.options.font.color.disabled,
                        stroke: settings.menu.options.stroke.color.disabled,
                        strokeWidth: util.calculate.absolute.size( settings.menu.options.stroke.width )
                    })
                };

                menu.layer.add( menu.options.highScores.shape )
            })();

            ( function _settingsGroup() {
                ( function _volume() {
                    menu.options.settings.volume = {};

                    menu.options.settings.volume.mouseOver = false;

                    menu.options.settings.volume.shape = new Kinetic.Text({
                        x: util.calculate.absolute.x( 32 ),
                        y: util.calculate.absolute.y( 5.9 ),
                        text: '\uf028',
                        fontSize: util.calculate.absolute.size( settings.menu.options.settings.font.size ),
                        fontFamily: 'FontAwesome',
                        fill: settings.menu.options.settings.font.color.enabled.hex
                    });

                    menu.options.settings.volume.hitBox = new Kinetic.Rect({
                        x: util.calculate.absolute.x( 32 ),
                        y: util.calculate.absolute.y( 4.67 ),
                        width: util.calculate.absolute.x( 4.31 ),
                        height: util.calculate.absolute.y( 2.845 ),
                        opacity: 0
                    });
                })();

                ( function _fullScreen() {
                    menu.options.settings.fullScreen = {};

                    menu.options.settings.fullScreen.mouseOver = false;

                    menu.options.settings.fullScreen.shape = new Kinetic.Text({
                        x: util.calculate.absolute.x( 3.31 ),
                        y: util.calculate.absolute.y( 5.36 ),
                        text: '\uf0b2',
                        fontSize: util.calculate.absolute.size( settings.menu.options.settings.font.size ) * 0.922,
                        fontFamily: 'FontAwesome',
                        fill: settings.menu.options.settings.font.color.enabled.hex
                    });

                    menu.options.settings.fullScreen.hitBox = new Kinetic.Rect({
                        x: util.calculate.absolute.x( 3.31 ),
                        y: util.calculate.absolute.y( 4.67 ),
                        width: util.calculate.absolute.x( 5.07 ),
                        height: util.calculate.absolute.y( 2.85 ),
                        opacity: 0
                    });
                })();

                ( function _help() {
                    menu.options.settings.help = {
                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( 1.86 ),
                            y: util.calculate.absolute.y( 5.35 ),
                            text: '\uf059',
                            fontSize: util.calculate.absolute.size( settings.menu.options.settings.font.size ) * 0.922,
                            fontFamily: 'FontAwesome',
                            fill: settings.menu.options.settings.font.color.disabled
                        })
                    }
                })();

                ( function _credits() {
                    menu.options.settings.credits = {
                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( 1.32 ),
                            y: util.calculate.absolute.y( 6.1 ),
                            text: '\u00A9',
                            fontSize: util.calculate.absolute.size( settings.menu.options.settings.font.size ) * 1.089,
                            fontFamily: settings.font.ui,
                            fill: settings.menu.options.settings.font.color.disabled
                        })
                    }
                })();

                menu.options.settings.group = new Kinetic.Group({ opacity: 0 });

                menu.options.settings.group.add( menu.options.settings.volume.shape );
                menu.options.settings.group.add( menu.options.settings.volume.hitBox );
                menu.options.settings.group.add( menu.options.settings.fullScreen.shape );
                menu.options.settings.group.add( menu.options.settings.fullScreen.hitBox );
                menu.options.settings.group.add( menu.options.settings.help.shape );
                menu.options.settings.group.add( menu.options.settings.credits.shape );

                menu.layer.add( menu.options.settings.group );

                menu.options.settings.volume.hitBox.cache();
                menu.options.settings.fullScreen.hitBox.cache()
            })();

            ( function _animation() {
                menu.animation = new Kinetic.Animation( function( frame ){

                    menu.title.bounce( frame );
                    menu.options.mouseOverCheck( frame );

                    if ( menu.state === 'starting' ){

                        util.animation.fade( menu.layer, frame, 'in', function() {
                            menu.state = 'running'
                        })
                    } else if ( menu.state === 'stopping' ){

                        util.animation.stop( menu, frame )

                    } else if ( menu.state === 'settings' ){

                        if ( menu.options.settings.group.opacity() < 1 ){

                            util.animation.fade( menu.options.settings.group, frame, 'in' )
                        }
                    } else if ( menu.options.settings.group.opacity() > 0 ){

                        util.animation.fade( menu.options.settings.group, frame, 'out', function() {
                            menu.options.settings.volume.mouseOver = false;
                            menu.options.settings.fullScreen.mouseOver = false
                        });
                    }
                }, menu.layer )
            })()
        }
    };

    return menu
});