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