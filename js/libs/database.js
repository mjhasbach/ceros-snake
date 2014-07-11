define([ 'backbone', 'firebase', 'settings', 'backfire' ],
    function( Backbone, Firebase, settings ){
        var _s = settings.database,
            database = {
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

                waitUntilConnected: function wait( cb ){
                    if ( database.scores.at( 0 )) cb();
                    else setTimeout( wait, 100, cb )
                },

                init: function() {
                    database.TopScores = Backbone.Firebase.Collection.extend({
                        model: database.Score,

                        firebase: new Firebase( _s.scores.address )
                            .limit( _s.scores.limit ).endAt(),

                        comparator: function( model ){
                            return -model.get( 'score' )
                        }
                    });

                    database.scores = new database.TopScores
                }
            };

        database.init();

        return database
    }
);