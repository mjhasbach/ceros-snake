define([ 'backbone', 'Kinetic', 'util', 'background' ],
    function( Backbone, Kinetic, util, background ){
        var lobby = {
                name: 'lobby',

                isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                state: new Backbone.Model({ current: 'stopped' }),

                layer: new Kinetic.Layer,

                background: background.lobby
            };

        return lobby
    }
);