define([ 'underscore', 'backbone', 'Kinetic', 'settings', 'util' ],
    function( _, Backbone, Kinetic, settings, util ){
        var Menu = Backbone.Model.extend({
            defaults: function() {
                return {
                    name: 'menu',

                    state: 'stopped',

                    layer: new Kinetic.Layer(),

                    title: {
                        ceros: {
                            shape: new Kinetic.Shape({ sceneFunc: function( context ){
                                var x = util.calculate.absolute.x,
                                    y = util.calculate.absolute.y,
                                    pi = util.calculate.pi;

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
                                stroke: settings.font.colors.fill.enabled.hex,
                                strokeWidth: util.calculate.absolute.x( settings.menu.title.stroke.width )
                            })
                        },

                        snake: {
                            shape: new Kinetic.Shape({ sceneFunc: function( context ){
                                var x = util.calculate.absolute.x,
                                    y = util.calculate.absolute.y,
                                    pi = util.calculate.pi;

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
                                stroke: settings.font.colors.fill.enabled.hex,
                                strokeWidth: util.calculate.absolute.x( settings.menu.title.stroke.width )
                            })
                        },

                        bounce: function( frame ){
                            var bounciness = settings.menu.title.bounciness *
                                ( Math.sin( frame.time * 2 * Math.PI / settings.animation.period ));

                            this.ceros.shape.strokeWidth(
                                util.calculate.absolute.size( settings.menu.title.stroke.width + bounciness )
                            );

                            this.snake.shape.strokeWidth(
                                util.calculate.absolute.size( settings.menu.title.stroke.width + bounciness )
                            )
                        }
                    },

                    options: {
                        singlePlayer:{
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
                                strokeWidth: util.calculate.absolute.size( settings.menu.options.stroke.width )
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
                            shape: new Kinetic.Text({
                                x: util.calculate.absolute.x( 1.97 ),
                                y: util.calculate.absolute.y( settings.menu.options.y ),
                                text: 'High Scores',
                                fontSize: util.calculate.absolute.x( settings.menu.options.font.size ),
                                fontFamily: settings.font.face,
                                fill: settings.font.colors.fill.disabled,
                                stroke: settings.font.colors.stroke.disabled,
                                strokeWidth: util.calculate.absolute.size( settings.menu.options.stroke.width )
                            })
                        },

                        numberControllerGroup: function( number, numberX, controllerX, fill, stroke ){
                            var shapes = {
                                group: new Kinetic.Group(),

                                number: new Kinetic.Text({
                                    x: numberX,
                                    y: util.calculate.absolute.y( settings.menu.options.y ),
                                    text: number.toString(),
                                    fontSize: util.calculate.absolute.size( settings.menu.options.font.size ),
                                    fontFamily: settings.font.face,
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

                            return shapes.group
                        },

                        mouseOverCheck: function( frame ){
                            var brightnessVariance = util.calculate.brightnessVariance( frame );

                            ( function( hF, sF, lF, hS, sS, lS ){
                                if ( this.singlePlayer.mouseOver )

                                    this.singlePlayer.shape.getChildren().each( function( node ){
                                        util.color.fillAndStroke({
                                            node: node,
                                            fill: { h: hF, s: sF, l: lF },
                                            stroke: { h: hS, s: sS, l: lS }
                                        })
                                    });

                                else if ( this.gear.mouseOver )

                                    util.color.fillAndStroke({
                                        node: this.gear.shape,
                                        fill: { h: hF, s: sF, l: lF },
                                        stroke: { h: hS, s: sS, l: lS }
                                    });

                            })( settings.font.colors.fill.enabled.h,
                                settings.font.colors.fill.enabled.s,
                                settings.font.colors.fill.enabled.l - brightnessVariance,

                                settings.font.colors.stroke.enabled.h,
                                settings.font.colors.stroke.enabled.s,
                                settings.font.colors.stroke.enabled.l - brightnessVariance
                            )
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
                                fill: settings.menu.settings.font.color.enabled.hex
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
                                fill: settings.menu.settings.font.color.enabled.hex
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
                                fill: settings.menu.settings.font.color.disabled
                            })
                        },

                        credits: {
                            shape: new Kinetic.Text({
                                x: util.calculate.absolute.x( 1.32 ),
                                y: util.calculate.absolute.y( 6.1 ),
                                text: '\u00A9',
                                fontSize: util.calculate.absolute.size( settings.menu.settings.font.size ) * 1.089,
                                fontFamily: settings.font.face,
                                fill: settings.menu.settings.font.color.disabled
                            })
                        },

                        mouseOverCheck: function( frame ){
                            var brightnessVariance = util.calculate.brightnessVariance( frame ) * 2;

                            ( function( h, s, l ){
                                if ( this.volume.mouseOver )

                                    this.volume.shape.fill( 'hsl('+ h +', '+ s +'%, '+ l +'%)' );

                                else if ( this.fullScreen.mouseOver )

                                    this.fullScreen.shape.fill( 'hsl('+ h +', '+ s +'%, '+ l +'%)' );

                            })( settings.menu.settings.font.color.enabled.h,
                                settings.menu.settings.font.color.enabled.s,
                                settings.menu.settings.font.color.enabled.l + ( brightnessVariance )
                            );
                        }
                    },

                    isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                    cleanUp: function() {
                        var menu = this;

                        menu.options.singlePlayer.mouseOver = false;
                        menu.options.gear.mouseOver = false;
                        menu.options.settings.volume.mouseOver = false;
                        menu.options.settings.fullScreen.mouseOver = false;

                        menu.options.singlePlayer.shape.getChildren().each( function( node ){
                            node.fill( settings.menu.options.font.color.enabled.hex );
                        });

                        menu.options.gear.shape.fill(
                            settings.menu.options.font.color.enabled.hex
                        );

                        menu.options.settings.volume.shape.fill(
                            settings.menu.options.settings.font.color.enabled.hex
                        );

                        menu.options.settings.fullScreen.shape.fill(
                            settings.menu.options.settings.font.color.enabled.hex
                        );

                        menu.options.settings.group.opacity( 0 );
                    }.bind( this ),

                    init: function( options ){
                        this.set( 'background', options.background.menu );
                        this.get( 'layer' ).add( this.get( 'background' ).group );
                    }.bind( this )
                };
            },

            initialize: function() {
                var menu = this,
                    layer = menu.get( 'layer' ),
                    state = menu.get( 'state' ),
                    title = menu.get( 'title' ),
                    options = menu.get( 'options' ),
                    menuSettings = menu.get( 'settings' ),
                    settingsGroup = menuSettings.group;

                options.singlePlayer.shape = options.numberControllerGroup(
                    1,
                    util.calculate.absolute.x( 50 ),
                    util.calculate.absolute.x( 18 ),
                    settings.font.colors.fill.enabled.hex,
                    settings.font.colors.stroke.enabled.hex
                );

                options.multiPlayer = {
                    shape: options.numberControllerGroup(
                        2,
                        util.calculate.absolute.x( 5 ),
                        util.calculate.absolute.x( 3.99 ),
                        settings.font.colors.fill.disabled,
                        settings.font.colors.stroke.disabled
                    )
                };

                menu.set( 'animation', new Kinetic.Animation( function( frame ){
                    title.bounce( frame );
                    options.mouseOverCheck( frame );
                    menuSettings.mouseOverCheck( frame );

                    if ( state === 'starting' ){
                        util.animation.fade( layer, frame, 'in', function() {
                            menu.set( 'state', 'running' )
                        })
                    }

                    else if ( state === 'stopping' ){
                        util.animation.stop( menu, frame );
                    }

                    else if ( state === 'settings' ){
                        if ( settingsGroup.opacity() < 1 ){
                            util.animation.fade( settingsGroup, frame, 'in' );
                        }
                    }

                    else if ( settingsGroup.opacity() > 0 ){
                        util.animation.fade( settingsGroup, frame, 'out', function() {
                            menuSettings.volume.mouseOver = false;
                            menuSettings.fullScreen.mouseOver = false;
                        });
                    }
                }, layer ));

                ( function _initSettingsGroup() {
                    settingsGroup.add( menuSettings.volume.shape );
                    settingsGroup.add( menuSettings.volume.hitBox );
                    settingsGroup.add( menuSettings.fullScreen.shape );
                    settingsGroup.add( menuSettings.fullScreen.hitBox );
                    settingsGroup.add( menuSettings.help.shape );
                    settingsGroup.add( menuSettings.credits.shape );
                })();

                ( function _initLayer() {
                    layer.add( title.ceros.shape );
                    layer.add( title.snake.shape );
                    layer.add( options.singlePlayer.shape );
                    layer.add( options.singlePlayer.hitBox );
                    layer.add( options.multiPlayer.shape );
                    layer.add( options.gear.shape );
                    layer.add( options.gear.hitBox );
                    layer.add( options.highScores.shape );
                    layer.add( settingsGroup );
                })();

                ( function _cacheHitBoxes() {
                    options.singlePlayer.hitBox.cache();
                    options.gear.hitBox.cache();
                    menuSettings.volume.hitBox.cache();
                    menuSettings.fullScreen.hitBox.cache();
                })();
            }
        }
    );

    return new Menu();
});