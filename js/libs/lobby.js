define([ 'backbone', 'Kinetic', 'util', 'background' ],
    function( Backbone, Kinetic, util, background ){
        var lobby = {
                name: 'lobby',

                isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                state: new Backbone.Model({ current: 'stopped' }),

                layer: new Kinetic.Layer,

                background: background.lobby,

                animation: new Kinetic.Animation( function( frame ){
                    lobby.background.cycleCheck( frame )
                }),

                init: function() {
                    lobby.layer.add( lobby.background.group );

                    lobby.animation.setLayers( lobby.layer )
                }
            };

        lobby.init();

        return lobby
    }
);