define([ 'backbone', 'Kinetic', 'settings', 'util', 'background' ],
    function( Backbone, Kinetic, settings, util, background ){
        var lobby = {
                name: 'lobby',

                isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                state: new Backbone.Model({ current: 'stopped' }),

                layer: new Kinetic.Layer,

                background: background.lobby,

                playerName: new util.PlayerName({
                    y: settings.lobby.playerName.y
                }),

                keyboard: {
                    mouseOver: function() {
                        return util.mouse.isOverNode( lobby.keyboard.hitBox )
                    },

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 2.709 ),
                        y: util.calculate.absolute.y( 1.444 ),
                        text: '\uf11c',
                        fontSize: util.calculate.absolute.size( 11 ),
                        fontFamily: 'FontAwesome',
                        fill: settings.font.colors.fill.enabled.hex,
                        stroke: settings.font.colors.stroke.enabled.hex,
                        strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 2.718 ),
                        y: util.calculate.absolute.y( 1.384 ),
                        width: util.calculate.absolute.size( 9.9 ),
                        height: util.calculate.absolute.size( 16 ),
                        opacity: 0
                    }),

                    init: function() {
                        lobby.layer.add( lobby.keyboard.shape );
                        lobby.layer.add( lobby.keyboard.hitBox )
                    }
                },

                back: {
                    mouseOver: function() {
                        return util.mouse.isOverNode( lobby.back.hitBox )
                    },

                    shape: new Kinetic.Text({
                        x: util.calculate.absolute.x( 1.875 ),
                        y: util.calculate.absolute.y( 1.392 ),
                        text: '\uf057',
                        fontSize: util.calculate.absolute.size( 14.7 ),
                        fontFamily: 'FontAwesome',
                        fill: settings.font.colors.fill.enabled.hex,
                        stroke: settings.font.colors.stroke.enabled.hex,
                        strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                    }),

                    hitBox: new Kinetic.Rect({
                        x: util.calculate.absolute.x( 1.88 ),
                        y: util.calculate.absolute.y( 1.384 ),
                        width: util.calculate.absolute.size( 16.1 ),
                        height: util.calculate.absolute.size( 16.2 ),
                        opacity: 0
                    }),

                    init: function() {
                        lobby.layer.add( lobby.back.shape );
                        lobby.layer.add( lobby.back.hitBox )
                    }
                },

                players: {
                    previous: new Kinetic.Text({
                        x: util.calculate.absolute.x( settings.lobby.players.arrows.x ),
                        y: util.calculate.absolute.y( settings.lobby.players.header.y ),
                        text: '\uf0aa',
                        fontSize: util.calculate.absolute.size( settings.lobby.players.arrows.font.size ),
                        fontFamily: 'FontAwesome',
                        fill: settings.font.colors.fill.enabled.hex,
                        stroke: settings.font.colors.stroke.enabled.hex,
                        strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth )
                    }),

                    next: new Kinetic.Text({
                        x: util.calculate.absolute.x( settings.lobby.players.arrows.x ),
                        y: util.calculate.absolute.y( settings.lobby.players.arrows.next.y ),
                        text: '\uf0ab',
                        fontSize: util.calculate.absolute.size( settings.lobby.players.arrows.font.size ),
                        fontFamily: 'FontAwesome',
                        fill: settings.font.colors.fill.enabled.hex,
                        stroke: settings.font.colors.stroke.enabled.hex,
                        strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth )
                    }),

                    container: {
                        group: new Kinetic.Group({
                            x: background.lobby.tile.size(),
                            y: background.lobby.tile.size() * 3,
                            opacity: 0.92
                        }),

                        init: function() {
                            var tileSize = lobby.background.tile.size();

                            for ( var i = 0; i < 5; i++ ){
                                lobby.players.container.group.add(
                                    new Kinetic.Rect({
                                        y: ( tileSize * 2 ) * i,
                                        width: ( lobby.background.tile.quantity.x -2 ) * tileSize,
                                        height: tileSize * 2,
                                        fill: settings.lobby.players.container.colors[( i % 2 === 0 ) | 0 ]
                                    })
                                )
                            }

                            lobby.layer.add( lobby.players.container.group )
                        }
                    },

                    header: {
                        group: new Kinetic.Group({
                            x: util.calculate.absolute.x( settings.lobby.players.header.x ),
                            y: util.calculate.absolute.y( settings.lobby.players.header.y )
                        }),

                        name: new Kinetic.Text({
                            text: 'Name',
                            fontSize: util.calculate.absolute.x( settings.lobby.players.font.size ),
                            fontFamily: settings.font.face,
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                            listening: false
                        }),

                        available: new Kinetic.Text({
                            text: 'Available',
                            x: util.calculate.absolute.x( settings.lobby.players.header.available.x ),
                            y: util.calculate.absolute.y( settings.lobby.players.header.available.yOffset ),
                            fontSize: util.calculate.absolute.x( settings.lobby.players.font.size ),
                            fontFamily: settings.font.face,
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                            listening: false
                        }),

                        init: function() {
                            lobby.players.header.group.add( lobby.players.header.name );
                            lobby.players.header.group.add( lobby.players.header.available );

                            lobby.layer.add( lobby.players.header.group )
                        }
                    },

                    init: function() {
                        lobby.players.container.init();
                        lobby.players.header.init();

                        lobby.layer.add( lobby.players.previous );
                        lobby.layer.add( lobby.players.next )
                    }
                },

                title: new Kinetic.Text({
                    x: util.calculate.absolute.x( 4.33 ),
                    y: util.calculate.absolute.y( 80 ),
                    text: 'Multiplayer Lobby',
                    fontSize: util.calculate.absolute.x( 14.4 ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.font.stroke.width ),
                    listening: false
                }),

                animation: new Kinetic.Animation( function( frame ){
                    lobby.background.cycleCheck( frame );

                    if ( lobby.isNotStoppingOrStopped() )
                        lobby.mouseOverCheck( frame );

                    else util.module.stop( lobby, frame )
                }),

                mouseOverCheck: function( frame ){
                    var brightnessVariance = util.calculate.brightnessVariance( frame ),
                        hF = settings.font.colors.fill.enabled.h,
                        sF = settings.font.colors.fill.enabled.s,
                        lF = settings.font.colors.fill.enabled.l - brightnessVariance,
                        hS = settings.font.colors.stroke.enabled.h,
                        sS = settings.font.colors.stroke.enabled.s,
                        lS = settings.font.colors.stroke.enabled.l - brightnessVariance;

                    if ( lobby.keyboard.mouseOver() )
                        util.color.fillAndStroke({
                            node: lobby.keyboard.shape,
                            fill: { h: hF, s: sF, l: lF },
                            stroke: { h: hS, s: sS, l: lS }
                        });

                    if ( lobby.back.mouseOver() )
                        util.color.fillAndStroke({
                            node: lobby.back.shape,
                            fill: { h: hF, s: sF, l: lF },
                            stroke: { h: hS, s: sS, l: lS }
                        })
                },

                init: function() {
                    lobby.layer.add( lobby.background.group );

                    lobby.players.init();

                    lobby.keyboard.init();

                    lobby.back.init();

                    lobby.playerName.init( lobby.layer );

                    lobby.layer.add( lobby.title );

                    lobby.animation.setLayers( lobby.layer );
                },

                cleanUp: function() {
                    lobby.playerName.field.clear();
                    lobby.playerName.move();
                    lobby.playerName.field.unfocus()
                }
            };

        lobby.init();

        return lobby
    }
);