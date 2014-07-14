define([ 'backbone', 'Kinetic', 'settings', 'util', 'background' ],
    function( Backbone, Kinetic, settings, util, background ){
        var lobby = {
                name: 'lobby',

                isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                state: new Backbone.Model({ current: 'stopped' }),

                layer: new Kinetic.Layer,

                background: background.lobby,

                players: {
                    container: {
                        group: new Kinetic.Group({
                            x: background.lobby.tile.size(),
                            y: background.lobby.tile.size() * 4,
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
                        }
                    },

                    header: {
                        group: new Kinetic.Group({
                            x: util.calculate.absolute.x( settings.lobby.players.header.x ),
                            y: util.calculate.absolute.y( settings.lobby.players.header.y )
                        })
                    }
                },

                title: new Kinetic.Text({
                    x: util.calculate.absolute.x( 6.8 ),
                    y: util.calculate.absolute.y( 50 ),
                    text: 'Multiplayer Lobby',
                    fontSize: util.calculate.absolute.x( 11 ),
                    fontFamily: settings.font.face,
                    fill: settings.font.colors.fill.enabled.hex,
                    stroke: settings.font.colors.stroke.enabled.hex,
                    strokeWidth: util.calculate.absolute.size( settings.font.stroke.width ),
                    listening: false
                }),

                animation: new Kinetic.Animation( function( frame ){
                    lobby.background.cycleCheck( frame )
                }),

                init: function() {
                    lobby.players.container.init();

                    lobby.layer.add( lobby.background.group );

                    lobby.layer.add( lobby.players.container.group );

                    lobby.layer.add( lobby.title );

                    lobby.animation.setLayers( lobby.layer );
                }
            };

        lobby.init();

        return lobby
    }
);