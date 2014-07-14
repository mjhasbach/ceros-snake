define([ 'backbone', 'Kinetic', 'util' ],
    function( Backbone, Kinetic, util ){
        var lobby = {
                name: 'lobby',

                isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                state: new Backbone.Model({ current: 'stopped' }),

                layer: new Kinetic.Layer
            };

        return lobby
    }
);