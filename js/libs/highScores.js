define([ 'Kinetic', 'kineticEditableText', 'backbone', 'firebase', 'settings', 'util', 'backfire' ],
    function( Kinetic, kineticEditableText, Backbone, Firebase, settings, util ){
        var highScores = {},
            _s = settings.highScores,
            stage;

        highScores.init = function( options ){
            ( function _database() {
                highScores.database = {};

                highScores.database.Score = Backbone.Model.extend({
                    defaults: function() {
                        return {
                            time: new Date().getTime()
                        }
                    },

                    initialize: function() {
                        if ( !this.get( 'name' ))
                            throw new Error( 'A name must be provided when initializing a highScores.database.Score' );

                        if ( !this.get( 'score' ))
                            throw new Error( 'A score must be provided when initializing a highScores.database.Score' )
                    }
                });

                highScores.database.TopScores = Backbone.Firebase.Collection.extend({
                    model: highScores.database.Score,

                    firebase: new Firebase( _s.database ).limit( _s.limit ).endAt(),

                    comparator: function( model ){
                        return -model.get( 'score' )
                    }
                });

                highScores.database.scores = new highScores.database.TopScores;
            })();

            highScores.add.init( options );

            highScores.view.init( options )
        };

        highScores.add = {
            name: 'highScores.add',

            state: new Backbone.Model({ current: 'stopped' }),

            layer: new Kinetic.Layer(),

            cleanUp: function() {
                highScores.score = 0;

                highScores.add.playerName.field.text( '' );

                highScores.add.playerName.move();

                highScores.add.playerName.field.unfocus();

                highScores.add.submit.shape.fill( settings.font.colors.fill.enabled.hex );

                highScores.add.back.shape.fill( settings.font.colors.fill.enabled.hex );

                highScores.add.back.shape.fill( settings.font.colors.fill.enabled.hex )
            },

            isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

            playerName: {
                lastLength: 0,

                label: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.name.label.x ),
                    y: util.calculate.absolute.y( _s.name.y ),
                    text: 'Name:',
                    fontSize: util.calculate.absolute.size( _s.name.label.size ),
                    fontFamily: 'Fira Mono',
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                }),

                calculate: {
                    field: {
                        x: function() {
                            return highScores.add.playerName.label.x() + util.calculate.absolute.x( 3.8 )
                        }
                    }
                },

                move: function() {
                    var nameLength = highScores.add.playerName.field.currentWordCursorPos;

                    highScores.add.playerName.label.x(
                        util.calculate.absolute.x( settings.highScores.name.label.x ) -
                            ( nameLength * util.calculate.absolute.x( 40.7 ))
                    );

                    highScores.add.playerName.field.tempText[ 0 ].x(
                        highScores.add.playerName.calculate.field.x()
                    );

                    highScores.add.playerName.lastLength = nameLength
                }
            },

            keyboard: {
                mouseOver: false,

                shape: new Kinetic.Text({
                    x: util.calculate.absolute.x( settings.highScores.add.keyboard.x ),
                    y: util.calculate.absolute.y( settings.highScores.add.keyboard.y ),
                    text: '\uf11c',
                    fontSize: util.calculate.absolute.size( settings.highScores.add.keyboard.size ),
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
                mouseOver: false,

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
                mouseOver: false,

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

            start: function( score ){
                highScores.score = score;

                highScores.add.background.count( score )
            },

            init: function( options ){
                stage = options.stage;

                kineticEditableText.init( Kinetic );

                highScores.add.background = options.background.highScores.add;

                highScores.add.playerName.field = new Kinetic.EditableText({
                    x: highScores.add.playerName.calculate.field.x(),
                    y: util.calculate.absolute.y( _s.name.y ),
                    fontSize: util.calculate.absolute.size( _s.name.field.size ),
                    fontFamily: 'Fira Mono',
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.font.stroke.width ),
                    focusLayer: highScores.add.layer,
                    stage: stage
                });

                ( function _layer() {
                    highScores.add.layer.add( highScores.add.background.group );

                    highScores.add.layer.add( highScores.add.playerName.label );
                    highScores.add.layer.add( highScores.add.playerName.field );

                    highScores.add.layer.add( highScores.add.keyboard.shape );
                    highScores.add.layer.add( highScores.add.keyboard.hitBox );

                    highScores.add.layer.add( highScores.add.submit.shape );
                    highScores.add.layer.add( highScores.add.submit.hitBox );

                    highScores.add.layer.add( highScores.add.back.shape );
                    highScores.add.layer.add( highScores.add.back.hitBox );
                })();

                highScores.add.animation = new Kinetic.Animation( function( frame ){

                    if ( highScores.add.state.get( 'current' ) === 'starting' ){

                        highScores.add.playerName.field.focus();

                        highScores.add.state.set( 'current', 'running' )
                    }
                    else if ( highScores.add.state.get( 'current' ) === 'stopping' ){

                        util.module.stop( highScores.add, frame )
                    }
                }, highScores.add.layer )
            }
        };

        highScores.view = {
            name: 'highScores.view',

            state: new Backbone.Model({ current: 'stopped' }),

            layer: new Kinetic.Layer(),

            cleanUp: function() {
                highScores.score = 0;

                highScores.view.back.shape.fill( settings.font.colors.fill.enabled.hex );

                highScores.view.previous.fill( settings.font.colors.fill.enabled.hex );

                highScores.view.next.fill( settings.font.colors.fill.enabled.hex )
            },

            isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

            playerName: {
                label: highScores.add.playerName.label.clone(),

                scoreHolder: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.name.scoreHolder.x ),
                    y: util.calculate.absolute.y( _s.name.scoreHolder.y ),
                    text: 'Name:',
                    fontSize: util.calculate.absolute.size( _s.name.scoreHolder.size ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                })
            },

            previous: {
                mouseOver: false,

                shape: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.view.previous.x ),
                    y: util.calculate.absolute.y( _s.view.previous.y ),
                    text: '\uf060',
                    fontSize: util.calculate.absolute.size( _s.view.previous.size ),
                    fontFamily: 'FontAwesome',
                    fill: settings.font.colors.fill.enabled.hex
                }),

                hitBox: new Kinetic.Rect({
                    x: util.calculate.absolute.x( 2.518 ),
                    y: util.calculate.absolute.y( 1.23 ),
                    width: util.calculate.absolute.x( 12.39 ),
                    height: util.calculate.absolute.y( 6.92 ),
                    opacity: 0
                })
            },

            next: {
                mouseOver: false,

                shape: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.view.next.x ),
                    y: util.calculate.absolute.y( _s.view.next.y ),
                    text: '\uf061',
                    fontSize: util.calculate.absolute.size( _s.view.next.size ),
                    fontFamily: 'FontAwesome',
                    fill: settings.font.colors.fill.enabled.hex
                }),

                hitBox: new Kinetic.Rect({
                    x: util.calculate.absolute.x( 2.518 ),
                    y: util.calculate.absolute.y( 1.23 ),
                    width: util.calculate.absolute.x( 12.39 ),
                    height: util.calculate.absolute.y( 6.92 ),
                    opacity: 0
                })
            },

            back: {
                mouseOver: false,

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
                    x: util.calculate.absolute.x( 2.518 ),
                    y: util.calculate.absolute.y( 1.23 ),
                    width: util.calculate.absolute.x( 12.39 ),
                    height: util.calculate.absolute.y( 6.92 ),
                    opacity: 0
                })
            },

            init: function( options ){
                highScores.view.background = options.background.highScores.view;

                highScores.view.index = 0;

                highScores.view.update = function() {
                    highScores.score = highScores.database.scores.at( highScores.view.index ).get( 'score' );

                    highScores.view.background.count( highScores.score );

                    highScores.view.playerName.scoreHolder.text(
                        highScores.database.scores.at( highScores.view.index ).get( 'name' )
                    )
                };

                highScores.view.mouseOverCheck = function( frame ){
                    var brightnessVariance = util.calculate.brightnessVariance( frame );

                    ( function( hF, sF, lF, hS, sS, lS ){
                        if ( highScores.view.previous.mouseOver )
                            highScores.view.previous.shape.fill(
                                'hsl(' + hF + ', ' + sF + '%, ' + lF + '%)'
                            );

                        else if ( highScores.view.next.mouseOver )
                            highScores.view.next.shape.fill(
                                'hsl(' + hF + ', ' + sF + '%, ' + lF + '%)'
                            );

                        else if ( highScores.view.back.mouseOver )
                            util.color.fillAndStroke({
                                node: highScores.view.back.shape,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            })

                    })( settings.font.colors.fill.enabled.h,
                        settings.font.colors.fill.enabled.s,
                        settings.font.colors.fill.enabled.l - brightnessVariance,

                        settings.font.colors.stroke.enabled.h,
                        settings.font.colors.stroke.enabled.s,
                        settings.font.colors.stroke.enabled.l - brightnessVariance
                    )
                };

                ( function _layer() {
                    highScores.view.layer.add( highScores.view.background.group );

                    highScores.view.layer.add( highScores.view.playerName.label );
                    highScores.view.layer.add( highScores.view.playerName.scoreHolder );

                    highScores.view.layer.add( highScores.view.previous.shape );
                    highScores.view.layer.add( highScores.view.previous.hitBox );

                    highScores.view.layer.add( highScores.view.next.shape );
                    highScores.view.layer.add( highScores.view.next.hitBox );

                    highScores.add.layer.add( highScores.view.back.shape );
                    highScores.add.layer.add( highScores.view.back.hitBox )
                })();

                highScores.view.animation = new Kinetic.Animation( function( frame ){
                    var state = highScores.view.state.get( 'current' );

                    if ( state === 'starting' ){
                        highScores.view.update();

                        highScores.view.state.set( 'current', 'running' )

                    } else if ( state === 'running' ){
                        highScores.view.mouseOverCheck( frame )

                    } else if ( state === 'stopping' ){
                        util.module.stop( highScores.view, frame )
                    }
                }, highScores.view.layer )
            }
        };

        return highScores
    }
);