define([ 'backbone', 'firebase', 'settings', 'backfire' ],
    function( Backbone, Firebase, settings ){
        var _s = settings.database,
            database = {
                connected: new Firebase( _s.address + '.info/connected' ),

                player: {
                    Model: Backbone.Model.extend({
                        defaults: function() {
                            return {
                                name: '',

                                available: true
                            }
                        }
                    }),

                    removeMeOnDisconnect: function() {
                        new Firebase( _s.address + 'players/' + database.player.me.get( 'id' ))
                            .onDisconnect().remove()
                    },

                    name: {
                        update: function( module ){
                            database.player.me.set( 'name', module.playerName.field.text() );
                        }
                    }
                },

                Score: Backbone.Model.extend({
                    defaults: function() {
                        return {
                            time: new Date().getTime()
                        }
                    },

                    initialize: function() {
                        if ( !this.get( 'name' ))
                            throw new Error( 'A name must be provided when ' +
                                             'initializing a database.Score' );

                        if ( !this.get( 'score' ))
                            throw new Error( 'A score must be provided when ' +
                                             'initializing a database.Score' );
                    }
                }),

                submitScore: function( highScores ){
                    if ( highScores.add.playerName.field.text().length > 0 ){
                        database.scores.add(
                            new database.Score({
                                score: highScores.add.score,
                                name: highScores.add.playerName.field.text()
                            })
                        );

                        highScores.add.state.set( 'current', 'stopping' )

                    } else alert( 'Please provide your name, or click the "X" icon ' +
                                  'if you do not wish to record your high score.' )
                },

                init: function() {
                    database.player.Collection = Backbone.Firebase.Collection.extend({
                        model: database.player.Model,

                        firebase: new Firebase( _s.address + 'players' )
                    });

                    database.TopScores = Backbone.Firebase.Collection.extend({
                        model: database.Score,

                        firebase: new Firebase( _s.address + 'scores' )
                            .limit( _s.scores.limit ).endAt(),

                        comparator: function( model ){
                            return -model.get( 'score' )
                        }
                    });

                    database.player.list = new database.player.Collection;

                    database.scores = new database.TopScores
                }
            };

        database.init();

        return database
    }
);