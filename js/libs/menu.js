define([ 'underscore', 'backbone', 'Kinetic', 'settings', 'util' ], function( _, Backbone, Kinetic, settings, util ){
    var x = util.calculate.absolute.x,
        y = util.calculate.absolute.y,
        pi = util.calculate.pi,
        menu = {
            name: 'menu',

            isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

            state: new Backbone.Model({ current: 'stopped' }),

            layer: new Kinetic.Layer,

            title: {
                ceros: {
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
                        context.strokeShape( this )
                    },
                        stroke: settings.menu.title.color,
                        strokeWidth: x( settings.menu.title.stroke.width ),
                        listening: false
                    })
                },

                snake: {
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
                        context.strokeShape( this )
                    },
                        stroke: settings.menu.title.color,
                        strokeWidth: x( settings.menu.title.stroke.width ),
                        listening: false
                    })
                },

                bounce: function( frame ){
                    var bounciness = settings.menu.title.bounciness *
                        ( Math.sin( frame.time * 2 * Math.PI / settings.animation.period ));

                    menu.title.ceros.shape.strokeWidth(
                        util.calculate.absolute.size( settings.menu.title.stroke.width + bounciness )
                    );

                    menu.title.snake.shape.strokeWidth(
                        util.calculate.absolute.size( settings.menu.title.stroke.width + bounciness )
                    )
                }
            },

            options: {
                singlePlayer: {
                    mouseOver: false,

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 62 ),
                        y: util.calculate.absolute.y( 1.214 ),
                        width: util.calculate.absolute.x( 6.25 ),
                        height: util.calculate.absolute.y( 8.46 ),
                        opacity: 0
                    })
                },

                gear: {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 2.51 ),
                        y: util.calculate.absolute.y( settings.menu.options.y ),
                        text: '\uf013',
                        fontSize: util.calculate.absolute.x( settings.menu.options.font.size ),
                        fontFamily: 'FontAwesome',
                        fill: settings.font.colors.fill.enabled.hex,
                        stroke: settings.font.colors.stroke.enabled.hex,
                        strokeWidth: util.calculate.absolute.size( settings.font.stroke.width ),
                        listening: false
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 2.518 ),
                        y: util.calculate.absolute.y( 1.23 ),
                        width: util.calculate.absolute.x( 12.39 ),
                        height: util.calculate.absolute.y( 6.92 ),
                        opacity: 0
                    })
                },

                highScores: {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 1.97 ),
                        y: util.calculate.absolute.y( settings.menu.options.y ),
                        text: 'High Scores',
                        fontSize: util.calculate.absolute.x( settings.menu.options.font.size ),
                        fontFamily: settings.font.face,
                        fill: settings.font.colors.fill.enabled.hex,
                        stroke: settings.font.colors.stroke.enabled.hex,
                        strokeWidth: util.calculate.absolute.size( settings.font.stroke.width ),
                        listening: false
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 1.97 ),
                        y: util.calculate.absolute.y( 1.235 ),
                        width: util.calculate.absolute.size( 2.125 ),
                        height: util.calculate.absolute.size( 10.3 ),
                        opacity: 0
                    })
                },

                numberControllerGroup: function( number, numberX, controllerX, fill, stroke ){
                    var shapes = {
                        group: new Kinetic.Group({ listening: false }),

                        number: new Kinetic.Text({
                            x: numberX,
                            y: util.calculate.absolute.y( settings.menu.options.y ),
                            text: number.toString(),
                            fontSize: util.calculate.absolute.size( settings.menu.options.font.size ),
                            fontFamily: settings.font.face,
                            fill: fill,
                            stroke: stroke,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        controller: new Kinetic.Text({
                            x: controllerX,
                            y: util.calculate.absolute.y( 1.295 ),
                            text: '\uf11b',
                            fontSize: util.calculate.absolute.size( settings.menu.options.controller.size ),
                            fontFamily: 'FontAwesome',
                            fill: fill,
                            stroke: stroke,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        })
                    };

                    shapes.group.add( shapes.number );
                    shapes.group.add( shapes.controller );

                    return shapes.group
                },

                mouseOverCheck: function( frame ){
                    var brightnessVariance = util.calculate.brightnessVariance( frame),
                        hF = settings.font.colors.fill.enabled.h,
                        sF = settings.font.colors.fill.enabled.s,
                        lF = settings.font.colors.fill.enabled.l - brightnessVariance,
                        hS = settings.font.colors.stroke.enabled.h,
                        sS = settings.font.colors.stroke.enabled.s,
                        lS = settings.font.colors.stroke.enabled.l - brightnessVariance;

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

                    else if ( menu.options.highScores.mouseOver )
                        util.color.fillAndStroke({
                            node: menu.options.highScores.shape,
                            fill: { h: hF, s: sF, l: lF },
                            stroke: { h: hS, s: sS, l: lS }
                        })
                }
            },

            settings: {
                group: new Kinetic.Group({ opacity: 0 }),

                volume: {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 32 ),
                        y: util.calculate.absolute.y( 5.9 ),
                        text: '\uf028',
                        fontSize: util.calculate.absolute.size( settings.menu.settings.font.size ),
                        fontFamily: 'FontAwesome',
                        fill: settings.menu.settings.font.color.enabled.hex,
                        listening: false
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 32 ),
                        y: util.calculate.absolute.y( 4.67 ),
                        width: util.calculate.absolute.x( 4.31 ),
                        height: util.calculate.absolute.y( 2.845 ),
                        opacity: 0
                    })
                },

                fullScreen: {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 3.31 ),
                        y: util.calculate.absolute.y( 5.36 ),
                        text: '\uf0b2',
                        fontSize: util.calculate.absolute.size( settings.menu.settings.font.size ) * 0.922,
                        fontFamily: 'FontAwesome',
                        fill: settings.menu.settings.font.color.enabled.hex,
                        listening: false
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 3.31 ),
                        y: util.calculate.absolute.y( 4.67 ),
                        width: util.calculate.absolute.x( 5.07 ),
                        height: util.calculate.absolute.y( 2.85 ),
                        opacity: 0
                    })
                },

                help: {
                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 1.86 ),
                        y: util.calculate.absolute.y( 5.35 ),
                        text: '\uf059',
                        fontSize: util.calculate.absolute.size( settings.menu.settings.font.size ) * 0.922,
                        fontFamily: 'FontAwesome',
                        fill: settings.menu.settings.font.color.disabled,
                        listening: false
                    })
                },

                credits: {
                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 1.32 ),
                        y: util.calculate.absolute.y( 6.1 ),
                        text: '\u00A9',
                        fontSize: util.calculate.absolute.size( settings.menu.settings.font.size ) * 1.089,
                        fontFamily: settings.font.face,
                        fill: settings.menu.settings.font.color.disabled,
                        listening: false
                    })
                },

                mouseOverCheck: function( frame ){
                    var brightnessVariance = util.calculate.brightnessVariance( frame ) * 2,
                        h = settings.menu.settings.font.color.enabled.h,
                        s = settings.menu.settings.font.color.enabled.s,
                        l = settings.menu.settings.font.color.enabled.l + brightnessVariance;

                    if ( menu.settings.volume.mouseOver )
                        menu.settings.volume.shape.fill( 'hsl('+ h +', '+ s +'%, '+ l +'%)' );

                    else if ( menu.settings.fullScreen.mouseOver )
                        menu.settings.fullScreen.shape.fill( 'hsl('+ h +', '+ s +'%, '+ l +'%)' )
                }
            },

            animation: new Kinetic.Animation( function( frame ){

                menu.title.bounce( frame );

                menu.options.mouseOverCheck( frame );

                menu.settings.mouseOverCheck( frame );

                if ( menu.state.get( 'current' ) === 'starting' )
                    util.animation.fade( menu.layer, frame, 'in', function() {
                        menu.state.set( 'current', 'running' )
                    });

                else if ( menu.state.get( 'current' ) === 'stopping' )
                    util.module.stop( menu, frame );

                else if ( menu.state.get( 'current' ) === 'settings' ){
                    if ( menu.settings.group.opacity() < 1 )
                        util.animation.fade( menu.settings.group, frame, 'in' );
                }

                else if ( menu.settings.group.opacity() > 0 )
                    util.animation.fade( menu.settings.group, frame, 'out', function() {
                        menu.settings.volume.mouseOver = false;
                        menu.settings.fullScreen.mouseOver = false
                    })
            }),

            init: function ( options ){
                menu.background = options.background.menu;

                ( function _numberControllerGroups() {
                    menu.options.singlePlayer.shape = menu.options.numberControllerGroup(
                        1,
                        util.calculate.absolute.x( 50 ),
                        util.calculate.absolute.x( 18 ),
                        settings.font.colors.fill.enabled.hex,
                        settings.font.colors.stroke.enabled.hex
                    );

                    menu.options.multiPlayer = {
                        shape: menu.options.numberControllerGroup(
                            2,
                            util.calculate.absolute.x( 5 ),
                            util.calculate.absolute.x( 3.99 ),
                            settings.font.colors.fill.disabled,
                            settings.font.colors.stroke.disabled
                        )
                    }
                })();

                ( function _settingsGroup() {
                    menu.settings.group.add( menu.settings.volume.shape );
                    menu.settings.group.add( menu.settings.volume.hitBox );

                    menu.settings.group.add( menu.settings.fullScreen.shape );
                    menu.settings.group.add( menu.settings.fullScreen.hitBox );

                    menu.settings.group.add( menu.settings.help.shape );

                    menu.settings.group.add( menu.settings.credits.shape )
                })();

                ( function _layer() {
                    menu.layer.add( menu.background.group );

                    menu.layer.add( menu.title.ceros.shape );

                    menu.layer.add( menu.title.snake.shape );

                    menu.layer.add( menu.options.singlePlayer.shape );
                    menu.layer.add( menu.options.singlePlayer.hitBox );

                    menu.layer.add( menu.options.multiPlayer.shape );

                    menu.layer.add( menu.options.gear.shape );
                    menu.layer.add( menu.options.gear.hitBox );

                    menu.layer.add( menu.options.highScores.shape );
                    menu.layer.add( menu.options.highScores.hitBox );

                    menu.layer.add( menu.settings.group );

                    menu.animation.setLayers( menu.layer )
                })();

                ( function _cache() {
                    menu.settings.volume.hitBox.cache();
                    menu.settings.fullScreen.hitBox.cache()
                })()
            },

            cleanUp: function() {
                var hF = settings.font.colors.fill.enabled.h,
                    sF = settings.font.colors.fill.enabled.s,
                    lF = settings.font.colors.fill.enabled.l,
                    hS = settings.font.colors.stroke.enabled.h,
                    sS = settings.font.colors.stroke.enabled.s,
                    lS = settings.font.colors.stroke.enabled.l;

                menu.options.singlePlayer.mouseOver = false;
                menu.options.highScores.mouseOver = false;

                menu.settings.group.opacity( 0 );

                menu.options.singlePlayer.shape.getChildren().each( function( node ){
                    util.color.fillAndStroke({
                        node: node,
                        fill: { h: hF, s: sF, l: lF },
                        stroke: { h: hS, s: sS, l: lS }
                    })
                });

                util.color.fillAndStroke({
                    node: menu.options.highScores.shape,
                    fill: { h: hF, s: sF, l: lF },
                    stroke: { h: hS, s: sS, l: lS }
                })
            }
        };

    return menu
});