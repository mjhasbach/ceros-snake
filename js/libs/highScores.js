define([ 'underscore', 'Kinetic', 'kineticEditableText', 'settings', 'util', 'database', 'viewport', 'background' ],
    function( _, Kinetic, kineticEditableText, settings, util, database, viewport, background ){
        kineticEditableText.init( Kinetic );

        var _s = settings.highScores,
            highScores = {
                add: {
                    name: 'highScores.add',

                    isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                    state: new Backbone.Model({ current: 'stopped' }),

                    layer: new Kinetic.Layer,

                    background: background.highScores.add,

                    playerName: {
                        label: new Kinetic.Text({
                            x: util.calculate.absolute.x( _s.name.label.x ),
                            y: util.calculate.absolute.y( _s.name.y ),
                            text: 'Name:',
                            fontSize: util.calculate.absolute.size( _s.name.size ),
                            fontFamily: 'Fira Mono',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        field: new Kinetic.EditableText({
                            y: util.calculate.absolute.y( _s.name.y ),
                            fontSize: util.calculate.absolute.size( _s.name.size ),
                            fontFamily: 'Fira Mono',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        move: function() {
                            var playerName = this;

                            _.defer( function() {
                                var nameLength = playerName.field.text().length;

                                playerName.label.x(
                                    util.calculate.absolute.x( _s.name.label.x ) -
                                        ( nameLength * util.calculate.absolute.x( 40.7 ))
                                );

                                playerName.field.tempText[ 0 ].x(
                                    highScores.add.playerName.label.x() +
                                        util.calculate.absolute.x( 3.8 )
                                )
                            })
                        }
                    },

                    keyboard: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( highScores.add.keyboard.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x(_s.add.keyboard.x ),
                            y: util.calculate.absolute.y( _s.add.keyboard.y ),
                            text: '\uf11c',
                            fontSize: util.calculate.absolute.size( _s.add.keyboard.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( 3.64 ),
                            y: util.calculate.absolute.y( 1.222 ),
                            width: util.calculate.absolute.size( 7.7 ),
                            height: util.calculate.absolute.size( 12.6 ),
                            opacity: 0
                        })
                    },

                    submit: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( highScores.add.submit.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( _s.add.submit.x ),
                            y: util.calculate.absolute.y( _s.add.submit.y ),
                            text: '\uf058',
                            fontSize: util.calculate.absolute.size( _s.add.submit.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( 2.177 ),
                            y: util.calculate.absolute.y( 1.22 ),
                            width: util.calculate.absolute.size( 12.6 ),
                            height: util.calculate.absolute.size( 12.6 ),
                            opacity: 0
                        })
                    },

                    back: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( highScores.add.back.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( _s.add.back.x ),
                            y: util.calculate.absolute.y( _s.add.back.y ),
                            text: '\uf057',
                            fontSize: util.calculate.absolute.size( _s.add.back.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( 1.68 ),
                            y: util.calculate.absolute.y( 1.22 ),
                            width: util.calculate.absolute.size( 12.6 ),
                            height: util.calculate.absolute.size( 12.6 ),
                            opacity: 0
                        })
                    },

                    animation: new Kinetic.Animation( function( frame ){
                        if ( highScores.add.isNotStoppingOrStopped() ){
                            highScores.add.mouseOverCheck( frame );
                            highScores.add.background.cycleCheck( frame, highScores.add.score )

                        } else if ( highScores.add.state.get( 'current' ) === 'stopping' )
                            util.module.stop( highScores.add, frame )
                    }),

                    mouseOverCheck: function( frame ){
                        var brightnessVariance = util.calculate.brightnessVariance( frame ),
                            hF = settings.font.colors.fill.enabled.h,
                            sF = settings.font.colors.fill.enabled.s,
                            lF = settings.font.colors.fill.enabled.l - brightnessVariance,
                            hS = settings.font.colors.stroke.enabled.h,
                            sS = settings.font.colors.stroke.enabled.s,
                            lS = settings.font.colors.stroke.enabled.l - brightnessVariance;

                        if ( highScores.add.keyboard.mouseOver() )
                            util.color.fillAndStroke({
                                node: highScores.add.keyboard.shape,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            });

                        else if ( highScores.add.submit.mouseOver() )
                            util.color.fillAndStroke({
                                node: highScores.add.submit.shape,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            });

                        else if ( highScores.add.back.mouseOver() )
                            util.color.fillAndStroke({
                                node: highScores.add.back.shape,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            })
                    },

                    start: function( score ){
                        highScores.add.score = score;

                        highScores.add.background.count( score );

                        util.module.start( highScores.add );

                        highScores.add.playerName.field.focus();

                        highScores.add.playerName.move()
                    },

                    init: function() {
                        highScores.add.layer.add( highScores.add.background.group );

                        highScores.add.layer.add( highScores.add.playerName.label );
                        highScores.add.layer.add( highScores.add.playerName.field );

                        highScores.add.layer.add( highScores.add.keyboard.shape );
                        highScores.add.layer.add( highScores.add.keyboard.hitBox );

                        highScores.add.layer.add( highScores.add.submit.shape );
                        highScores.add.layer.add( highScores.add.submit.hitBox );

                        highScores.add.layer.add( highScores.add.back.shape );
                        highScores.add.layer.add( highScores.add.back.hitBox );

                        highScores.add.animation.setLayers( highScores.add.layer )
                    },

                    cleanUp: function() {
                        highScores.add.score = 0;

                        highScores.add.playerName.field.clear();
                        highScores.add.playerName.field.unfocus();

                        highScores.add.submit.hitBox.fire( 'mouseout' );
                        highScores.add.back.hitBox.fire( 'mouseout' )
                    }
                },

                view: {
                    name: 'highScores.view',

                    isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                    state: new Backbone.Model({ current: 'stopped' }),

                    layer: new Kinetic.Layer,

                    background: background.highScores.view,

                    playerName: {
                        label: new Kinetic.Text({
                            x: util.calculate.absolute.x( _s.name.label.x ),
                            y: util.calculate.absolute.y( _s.name.y ),
                            text: 'Name:',
                            fontSize: util.calculate.absolute.size( _s.name.size ),
                            fontFamily: 'Fira Mono',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        scoreHolder: new Kinetic.Text({
                            x: util.calculate.absolute.x( _s.name.scoreHolder.x ),
                            y: util.calculate.absolute.y( _s.name.y ),
                            text: 'Name:',
                            fontSize: util.calculate.absolute.size( _s.name.size ),
                            fontFamily: 'Fira Mono',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        move: function() {
                            var nameLength = highScores.view.current.get( 'name' ).length;

                            this.label.x(
                                util.calculate.absolute.x( _s.name.label.x ) -
                                    ( nameLength * util.calculate.absolute.x( 40.7 ))
                            );

                            this.scoreHolder.x(
                                highScores.view.playerName.label.x() +
                                    util.calculate.absolute.x( 3.8 )
                            )
                        }
                    },

                    previous: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( highScores.view.previous.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( _s.view.previous.x ),
                            y: util.calculate.absolute.y( _s.view.previous.y ),
                            text: '\uf060',
                            fontSize: util.calculate.absolute.size( _s.view.previous.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( 3.02 ),
                            y: util.calculate.absolute.y( 1.222 ),
                            width: util.calculate.absolute.size( 13.2 ),
                            height: util.calculate.absolute.size( 12.5 ),
                            opacity: 0
                        })
                    },

                    back: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( highScores.view.back.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( _s.view.back.x ),
                            y: util.calculate.absolute.y( _s.view.back.y ),
                            text: '\uf057',
                            fontSize: util.calculate.absolute.size( _s.view.back.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( 2.177 ),
                            y: util.calculate.absolute.y( 1.22 ),
                            width: util.calculate.absolute.size( 12.6 ),
                            height: util.calculate.absolute.size( 12.6 ),
                            opacity: 0
                        })
                    },

                    next: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( highScores.view.next.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( _s.view.next.x ),
                            y: util.calculate.absolute.y( _s.view.next.y ),
                            text: '\uf061',
                            fontSize: util.calculate.absolute.size( _s.view.next.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( 1.681 ),
                            y: util.calculate.absolute.y( 1.222 ),
                            width: util.calculate.absolute.size( 13.2 ),
                            height: util.calculate.absolute.size( 12.5 ),
                            opacity: 0
                        })
                    },

                    animation: new Kinetic.Animation( function( frame ){
                        if ( highScores.view.isNotStoppingOrStopped() ){
                            highScores.view.mouseOverCheck( frame );
                            highScores.view.background.cycleCheck(
                                frame,
                                highScores.view.current.get( 'score' )
                            )
                        }

                        else if ( highScores.view.state.get( 'current' ) === 'stopping' )
                            util.module.stop( highScores.view, frame )
                    }),

                    mouseOverCheck: function( frame ){
                        var brightnessVariance = util.calculate.brightnessVariance( frame ),
                            hF = settings.font.colors.fill.enabled.h,
                            sF = settings.font.colors.fill.enabled.s,
                            lF = settings.font.colors.fill.enabled.l - brightnessVariance,
                            hS = settings.font.colors.stroke.enabled.h,
                            sS = settings.font.colors.stroke.enabled.s,
                            lS = settings.font.colors.stroke.enabled.l - brightnessVariance;

                        if ( highScores.view.previous.mouseOver() )
                            util.color.fillAndStroke({
                                node: highScores.view.previous.shape,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            });

                        else if ( highScores.view.next.mouseOver() )
                            util.color.fillAndStroke({
                                node: highScores.view.next.shape,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            });

                        else if ( highScores.view.back.mouseOver() )
                            util.color.fillAndStroke({
                                node: highScores.view.back.shape,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            })
                    },

                    update: function( options ){
                        var o = options;

                        if ( o.reset || !highScores.view.current )
                            highScores.view.current = database.scores.at( 0 );
                        else {
                            var x = o && o.previous ? -1 : o && o.next ? 1 : 0;

                            highScores.view.current = database.scores.at(
                                database.scores.indexOf( highScores.view.current ) + x
                            )
                        }

                        var layer = highScores.view.layer,
                            previous = highScores.view.previous,
                            next = highScores.view.next,
                            current = highScores.view.current,
                            playerName = highScores.view.playerName;

                        highScores.view.background.count( current.get( 'score' ));

                        playerName.scoreHolder.text( current.get( 'name' ));

                        playerName.move();

                        if ( current == database.scores.at( 0 )){
                            previous.shape.remove();
                            previous.hitBox.remove()
                        } else if ( !previous.shape.getParent() ){
                            layer.add( previous.shape );
                            layer.add( previous.hitBox )
                        }

                        if ( current == database.scores.at( database.scores.length - 1 )){
                            next.shape.remove();
                            next.hitBox.remove()
                        } else if ( !next.shape.getParent() ){
                            layer.add( next.shape );
                            layer.add( next.hitBox )
                        }
                    },

                    init: function() {
                        highScores.view.layer.add( highScores.view.background.group );

                        highScores.view.layer.add( highScores.view.playerName.label );
                        highScores.view.layer.add( highScores.view.playerName.scoreHolder );

                        highScores.view.layer.add( highScores.view.previous.shape );
                        highScores.view.layer.add( highScores.view.previous.hitBox );

                        highScores.view.layer.add( highScores.view.next.shape );
                        highScores.view.layer.add( highScores.view.next.hitBox );

                        highScores.view.layer.add( highScores.view.back.shape );
                        highScores.view.layer.add( highScores.view.back.hitBox );

                        highScores.view.animation.setLayers( highScores.view.layer )
                    },

                    cleanUp: function() {
                        highScores.view.back.hitBox.fire( 'mouseout' )
                    }
                },

                init: function() {
                    highScores.add.init();

                    highScores.view.init()
                }
            };

        highScores.init();

        return highScores
    }
);