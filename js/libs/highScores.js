define([ 'Kinetic', 'kineticEditableText', 'backbone', 'firebase', 'settings', 'util', 'backfire' ],
    function( Kinetic, kineticEditableText, Backbone, Firebase, settings, util ){
        var highScores = {},
            _s = settings.highScores;

        highScores.init = function( options ){
            ( function _database() {
                highScores.database = {};

                highScores.database.Score = Backbone.Model.extend({
                    defaults: function() {
                        return {
                            time: new Date().getTime()
                        };
                    },

                    initialize: function() {
                        if ( !this.get( 'name' )){
                            throw new Error( 'A name must be provided when initializing a highScores.database.Score' )
                        }

                        if ( !this.get( 'score' )){
                            throw new Error( 'A score must be provided when initializing a highScores.database.Score' )
                        }
                    }
                });

                highScores.database.TopScores = Backbone.Firebase.Collection.extend({
                    model: highScores.database.Score,

                    firebase: new Firebase( _s.database ).limit( _s.limit ).endAt(),

                    comparator: function( model ){
                        return -model.get( 'score' );
                    }
                });

                highScores.database.scores = new highScores.database.TopScores;
            })();

            highScores.isNotStoppingOrStopped = function() {
                return highScores.add.isNotStoppingOrStopped() ||
                       highScores.view.isNotStoppingOrStopped()
            };

            highScores.cleanUp = function() {
                highScores.submit.shape.fill( _s.submit.fill );
                highScores.back.shape.fill( _s.back.fill );
                highScores.previous.fill( _s.previous.fill );
                highScores.next.fill( _s.next.fill );
            };

            highScores.back = {
                mouseOver: false,

                shape: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.back.x ),
                    y: util.calculate.absolute.y( _s.back.y ),
                    text: '\uf057',
                    fontSize: util.calculate.absolute.size( _s.back.size ),
                    fontFamily: settings.font.face,
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
            };

            ( function _layers() {
                highScores.add.layer = new Kinetic.Layer();
                highScores.view.layer = new Kinetic.Layer();

                highScores.add.layer.add( highScores.back.shape );
                highScores.add.layer.add( highScores.back.hitBox );
                highScores.view.layer.add( highScores.back.shape );
                highScores.view.layer.add( highScores.back.hitBox );
            })();

            highScores.add.init( options );

            highScores.view.init( options )
        };

        highScores.add = {
            name: 'highScores.add',

            state: new Backbone.Model({ current: 'stopped' }),

            cleanUp: highScores.cleanUp,

            isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

            scoreLabel: new Kinetic.Text({
                x: util.calculate.absolute.x( _s.scoreLabel.x ),
                y: util.calculate.absolute.y( _s.scoreLabel.y ),
                text: 'Score',
                fontSize: util.calculate.absolute.size( _s.scoreLabel.size ),
                fontFamily: settings.font.face,
                fill: settings.font.colors.fill.enabled.hex,
                stroke: settings.font.colors.stroke.enabled.hex,
                strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
            }),

            playerName: {
                label: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.name.label.x ),
                    y: util.calculate.absolute.y( _s.name.label.y ),
                    text: 'Name:',
                    fontSize: util.calculate.absolute.size( _s.name.label.size ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                })
            },

            submit: {
                mouseOver: false,

                shape: new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.submit.x ),
                    y: util.calculate.absolute.y( _s.submit.y ),
                    text: '\uf058',
                    fontSize: util.calculate.absolute.size( _s.submit.size ),
                    fontFamily: settings.font.face,
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

            animation: new Kinetic.Animation( function( frame ){
                if ( highScores.add.state.get( 'current' ) === 'stopping' ){

                    util.module.stop( highScores.add, frame )
                }
            }, highScores.add.layer ),

            start: function( score ){
                highScores.score = score;

                highScores.add.background.count( score )
            },

            init: function( options ){
                kineticEditableText.init( Kinetic );

                highScores.add.background = options.background.highScores.add;

                highScores.add.playerName.field = new Kinetic.EditableText({
                    x: util.calculate.absolute.x( _s.name.field.x ),
                    y: util.calculate.absolute.y( _s.name.field.y ),
                    fontSize: util.calculate.absolute.size( _s.name.field.size ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.font.stroke.width ),
                    focusLayer: highScores.add.layer,
                    stage: options.stage
                });

                ( function _layer() {
                    highScores.add.layer.add( highScores.add.background.group );

                    highScores.add.layer.add( highScores.add.playerName.label );
                    highScores.add.layer.add( highScores.add.playerName.field );

                    highScores.add.layer.add( highScores.add.scoreLabel );

                    highScores.add.layer.add( highScores.submit.shape );
                    highScores.add.layer.add( highScores.submit.hitBox );


                })();
            }
        };

        highScores.view = {
            name: 'highScores.view',

            state: new Backbone.Model({ current: 'stopped' }),

            cleanUp: highScores.cleanUp,

            isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

            scoreLabel: highScores.add.scoreLabel.clone(),

            playerName: { label: highScores.add.playerName.label.clone() },

            init: function( options ){
                highScores.view.background = options.background.highScores.view;

                highScores.view.playerName.scoreHolder = new Kinetic.Text({
                    x: util.calculate.absolute.x( _s.name.scoreHolder.x ),
                    y: util.calculate.absolute.y( _s.name.scoreHolder.y ),
                    text: 'Name:',
                    fontSize: util.calculate.absolute.size( _s.name.scoreHolder.size ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                });

                highScores.previous = {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( _s.previous.x ),
                        y: util.calculate.absolute.y( _s.previous.y ),
                        text: '\uf060',
                        fontSize: util.calculate.absolute.size( _s.previous.size ),
                        fontFamily: settings.font.face,
                        fill: settings.font.colors.fill.enabled.hex
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 2.518 ),
                        y: util.calculate.absolute.y( 1.23 ),
                        width: util.calculate.absolute.x( 12.39 ),
                        height: util.calculate.absolute.y( 6.92 ),
                        opacity: 0
                    })
                };

                highScores.next = {
                    mouseOver: false,

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( _s.next.x ),
                        y: util.calculate.absolute.y( _s.next.y ),
                        text: '\uf061',
                        fontSize: util.calculate.absolute.size( _s.next.size ),
                        fontFamily: settings.font.face,
                        fill: settings.font.colors.fill.enabled.hex
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 2.518 ),
                        y: util.calculate.absolute.y( 1.23 ),
                        width: util.calculate.absolute.x( 12.39 ),
                        height: util.calculate.absolute.y( 6.92 ),
                        opacity: 0
                    })
                };

                highScores.index = 0;

                highScores.view.update = function() {
                    highScores.score = highScores.database.scores.at( highScores.index ).score;

                    highScores.view.background.count( highScores.score );

                    highScores.view.playerName.scoreHolder.text(
                        highScores.database.scores.at( highScores.index ).name
                    )
                };

                highScores.view.mouseOverCheck = function( frame ){
                    var brightnessVariance = util.calculate.brightnessVariance( frame );

                    ( function( hF, sF, lF, hS, sS, lS ){
                        if ( highScores.previous.mouseOver )
                            highScores.previous.shape.fill(
                                'hsl(' + hF + ', ' + sF + '%, ' + lF + '%)'
                            );

                        else if ( highScores.next.mouseOver )
                            highScores.next.shape.fill(
                                'hsl(' + hF + ', ' + sF + '%, ' + lF + '%)'
                            );

                        else if ( highScores.back.mouseOver )
                            util.color.fillAndStroke({
                                node: highScores.back.shape,
                                fill: { h: hF, s: sF, l: lF },
                                stroke: { h: hS, s: sS, l: lS }
                            });

                    })( settings.font.colors.fill.enabled.h,
                        settings.font.colors.fill.enabled.s,
                        settings.font.colors.fill.enabled.l - brightnessVariance,

                        settings.font.colors.stroke.enabled.h,
                        settings.font.colors.stroke.enabled.s,
                        settings.font.colors.stroke.enabled.l - brightnessVariance
                    );
                };

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
                }, highScores.view.layer );

                ( function _layer() {
                    highScores.view.layer.add( highScores.view.background.group );

                    highScores.view.layer.add( highScores.view.scoreLabel );

                    highScores.view.layer.add( highScores.view.playerName.label );
                    highScores.view.layer.add( highScores.view.playerName.scoreHolder );

                    highScores.view.layer.add( highScores.previous.shape );
                    highScores.view.layer.add( highScores.previous.hitBox );

                    highScores.view.layer.add( highScores.next.shape );
                    highScores.view.layer.add( highScores.next.hitBox );
                })();
            }
        };

        return highScores
    }
);