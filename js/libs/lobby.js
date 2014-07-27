define([ 'jquery', 'backbone', 'Kinetic', 'settings', 'util', 'database', 'background' ],
    function( $, Backbone, Kinetic, settings, util, database, background ){
        var lobby = {
                name: 'lobby',

                isNotStoppingOrStopped: util.module.isNotStoppingOrStopped,

                state: new Backbone.Model({ current: 'stopped' }),

                layer: new Kinetic.Layer,

                background: background.lobby,

                playerName: new util.PlayerName({
                    y: settings.lobby.playerName.y
                }),

                players: {
                    page: 0,

                    container: {
                        group: new Kinetic.Group({
                            x: background.lobby.tile.size(),
                            y: background.lobby.tile.size() * 3,
                            opacity: 0.92
                        }),

                        init: function() {
                            var container = this,
                                tileSize = lobby.background.tile.size();

                            for ( var i = 0; i < 6; i++ ){
                                container.group.add(
                                    new Kinetic.Rect({
                                        y: ( tileSize * 2 ) * i,
                                        width: ( lobby.background.tile.quantity.x - 5 ) * tileSize,
                                        height: tileSize * 2,
                                        fill: settings.lobby.players.container.colors[( i % 2 === 0 ) | 0 ]
                                    })
                                )
                            }

                            lobby.layer.add( container.group );

                            container.hasBeenInitialized = true
                        }
                    },

                    header: {
                        group: new Kinetic.Group({
                            y: util.calculate.absolute.y( settings.lobby.players.header.y )
                        }),

                        name: new Kinetic.Text({
                            text: 'Name',
                            align: 'center',
                            fontSize: util.calculate.absolute.x( settings.lobby.players.font.size ),
                            fontFamily: settings.font.face,
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                            listening: false
                        }),

                        available: new Kinetic.Text({
                            text: 'Available',
                            align: 'center',
                            y: util.calculate.absolute.y( settings.lobby.players.header.available.yOffset ),
                            fontSize: util.calculate.absolute.x( settings.lobby.players.font.size ),
                            fontFamily: settings.font.face,
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                            listening: false
                        }),

                        init: function() {
                            var header = this;

                            if ( !lobby.players.container.hasBeenInitialized )
                                throw new Error( 'lobby.players.container has not been initialized' );
                            else {
                                var rowWidth = lobby.players.container.group.getChildren()[ 0 ].width();

                                header.name.x( lobby.players.container.group.x() );
                                header.name.width( rowWidth * 0.7 );

                                header.available.x( header.name.x() + header.name.width() );
                                header.available.width( rowWidth * 0.3 );

                                header.group.add( header.name );
                                header.group.add( header.available );

                                lobby.layer.add( header.group );

                                header.hasBeenInitialized = true
                            }
                        }
                    },

                    rows: {
                        group: new Kinetic.Group({
                            y: ( background.lobby.tile.size() * 5 )
                        }),

                        init: function() {
                            if ( !lobby.players.container.hasBeenInitialized )
                                throw new Error( 'lobby.players.container has not been initialized' );
                            else if ( !lobby.players.header.hasBeenInitialized )
                                throw new Error( 'lobby.players.header has not been initialized' );
                            else {
                                for ( var i = 0; i < lobby.players.container.group.getChildren().length - 1; i++ ){
                                    var row = new Kinetic.Group({
                                        y: ( background.lobby.tile.size() * 2 ) *
                                           ( i + settings.lobby.players.row.yOffset )
                                    });

                                    row.add(
                                        new Kinetic.Text({
                                            align: 'center',
                                            fontFamily: 'Fira Mono',
                                            fontSize: util.calculate.absolute.x( settings.lobby.players.font.size ),
                                            x: lobby.players.header.name.x(),
                                            width: lobby.players.header.name.width(),
                                            fill: settings.font.colors.fill.enabled.hex,
                                            stroke: settings.font.colors.stroke.enabled.hex,
                                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                                            listening: false
                                        })
                                    );

                                    row.add(
                                        new Kinetic.Text({
                                            align: 'center',
                                            fontFamily: 'Fira Mono',
                                            fontSize: util.calculate.absolute.x( settings.lobby.players.font.size ),
                                            x: lobby.players.header.available.x(),
                                            width: lobby.players.header.available.width(),
                                            fill: settings.font.colors.fill.enabled.hex,
                                            stroke: settings.font.colors.stroke.enabled.hex,
                                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                                            listening: false
                                        })
                                    );

                                    lobby.players.rows.group.add( row )
                                }

                                lobby.layer.add( lobby.players.rows.group )
                            }
                        }
                    },

                    current: function() {
                        var players = lobby.players,
                            namesPerPage = players.rows.group.getChildren().length;

                        return database.player.list.models.slice(
                            players.page * namesPerPage,
                            ( players.page * namesPerPage ) + namesPerPage
                        )
                    },

                    update: function( options ){
                        var rows = lobby.players.rows.group.getChildren();

                        if ( options ){
                            if ( options.previous ) lobby.players.page -= 1;
                            else if ( options.next ) lobby.players.page += 1
                        }

                        if ( lobby.players.page === 0 ){
                            lobby.options.previous.shape.remove();
                            lobby.options.previous.hitBox.remove()
                        } else {
                            lobby.layer.add( lobby.options.previous.shape );
                            lobby.layer.add( lobby.options.previous.hitBox )
                        }

                        if ( !( database.player.list.at(( lobby.players.page + 1 ) *
                                lobby.players.rows.group.getChildren().length ))){

                            lobby.options.next.shape.remove();
                            lobby.options.next.hitBox.remove()
                        } else {
                            lobby.layer.add( lobby.options.next.shape );
                            lobby.layer.add( lobby.options.next.hitBox )
                        }

                        for ( var i = 0; i < rows.length; i++ ){
                            var player = lobby.players.current()[ i ],
                                columns = rows[ i ].getChildren(),
                                nameField = columns[ 0 ],
                                availableField = columns[ 1 ];

                            if ( player ){
                                var playerName = $.trim( player.get( 'name' ));

                                if ( playerName === '' )
                                    nameField.text( 'Anonymous' );
                                else
                                    nameField.text( playerName );

                                if ( player.get( 'id' ) === database.player.me.get( 'id' ))
                                    nameField.text( nameField.text() + ' (You)' );

                                if ( player.get( 'available' ))
                                    availableField.text( 'Yes' );
                                else
                                    availableField.text( 'No' )
                            } else {
                                nameField.text( '' );
                                availableField.text( '' )
                            }
                        }
                    },

                    init: function() {
                        lobby.players.container.init();
                        lobby.players.header.init();
                        lobby.players.rows.init()
                    }
                },

                options: {
                    container: {
                        shape: new Kinetic.Rect({
                            x: ( background.lobby.tile.quantity.x - 4 ) * background.lobby.tile.size(),
                            y: background.lobby.tile.size() * 3,
                            width: background.lobby.tile.size() * 3,
                            height: background.lobby.tile.size() * 12,
                            fill: settings.lobby.players.container.colors[ 0 ],
                            listening: false
                        }),

                        init: function() {
                            lobby.layer.add( lobby.options.container.shape )
                        }
                    },

                    back: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( lobby.options.back.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( settings.lobby.options.x ),
                            y: util.calculate.absolute.y( settings.lobby.options.back.y ),
                            text: '\uf057',
                            fontSize: util.calculate.absolute.size( settings.lobby.options.circular.font.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                            listening: false
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( settings.lobby.options.x ),
                            y: util.calculate.absolute.y( 5.4 ),
                            width: util.calculate.absolute.size( 13.6 ),
                            height: util.calculate.absolute.size( 13.6 ),
                            opacity: 0
                        }),

                        init: function() {
                            lobby.layer.add( lobby.options.back.shape );
                            lobby.layer.add( lobby.options.back.hitBox )
                        }
                    },

                    previous: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( lobby.options.previous.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( settings.lobby.options.x ),
                            y: util.calculate.absolute.y( settings.lobby.options.previous.y ),
                            text: '\uf0aa',
                            fontSize: util.calculate.absolute.size( settings.lobby.options.circular.font.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                            listening: false
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( settings.lobby.options.x ),
                            y: util.calculate.absolute.y( 2.7 ),
                            width: util.calculate.absolute.size( 13.6 ),
                            height: util.calculate.absolute.size( 13.6 ),
                            opacity: 0
                        }),

                        init: function() {
                            lobby.layer.add( lobby.options.previous.shape );
                            lobby.layer.add( lobby.options.previous.hitBox )
                        }
                    },

                    next: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( lobby.options.next.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( settings.lobby.options.x ),
                            y: util.calculate.absolute.y( settings.lobby.options.next.y ),
                            text: '\uf0ab',
                            fontSize: util.calculate.absolute.size( settings.lobby.options.circular.font.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                            listening: false
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( settings.lobby.options.x ),
                            y: util.calculate.absolute.y( 1.81 ),
                            width: util.calculate.absolute.size( 13.6 ),
                            height: util.calculate.absolute.size( 13.6 ),
                            opacity: 0
                        }),

                        init: function() {
                            lobby.layer.add( lobby.options.next.shape );
                            lobby.layer.add( lobby.options.next.hitBox )
                        }
                    },

                    keyboard: {
                        mouseOver: function() {
                            return util.mouse.isOverNode( lobby.options.keyboard.hitBox )
                        },

                        shape: new Kinetic.Text({
                            x: util.calculate.absolute.x( settings.lobby.options.x ),
                            y: util.calculate.absolute.y( settings.lobby.options.keyboard.y ),
                            text: '\uf11c',
                            fontSize: util.calculate.absolute.size( settings.lobby.options.keyboard.font.size ),
                            fontFamily: 'FontAwesome',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.lobby.players.font.strokeWidth ),
                            listening: false
                        }),

                        hitBox: new Kinetic.Rect({
                            x: util.calculate.absolute.x( settings.lobby.options.x ),
                            y: util.calculate.absolute.y( 1.36 ),
                            width: util.calculate.absolute.size( 13.8 ),
                            height: util.calculate.absolute.size( 22 ),
                            opacity: 0
                        }),

                        init: function() {
                            lobby.layer.add( lobby.options.keyboard.shape );
                            lobby.layer.add( lobby.options.keyboard.hitBox )
                        }
                    },

                    init: function() {
                        lobby.options.container.init();
                        lobby.options.back.init();
                        lobby.options.previous.init();
                        lobby.options.next.init();
                        lobby.options.keyboard.init()
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

                    if ( lobby.options.back.mouseOver() )
                        util.color.fillAndStroke({
                            node: lobby.options.back.shape,
                            fill: { h: hF, s: sF, l: lF },
                            stroke: { h: hS, s: sS, l: lS }
                        });

                    else if ( lobby.options.previous.mouseOver() )
                        util.color.fillAndStroke({
                            node: lobby.options.previous.shape,
                            fill: { h: hF, s: sF, l: lF },
                            stroke: { h: hS, s: sS, l: lS }
                        });

                    else if ( lobby.options.next.mouseOver() )
                        util.color.fillAndStroke({
                            node: lobby.options.next.shape,
                            fill: { h: hF, s: sF, l: lF },
                            stroke: { h: hS, s: sS, l: lS }
                        });

                    else if ( lobby.options.keyboard.mouseOver() )
                        util.color.fillAndStroke({
                            node: lobby.options.keyboard.shape,
                            fill: { h: hF, s: sF, l: lF },
                            stroke: { h: hS, s: sS, l: lS }
                        })
                },

                init: function() {
                    lobby.layer.add( lobby.background.group );

                    lobby.players.init();

                    lobby.options.init();

                    lobby.playerName.init( lobby.layer );

                    lobby.layer.add( lobby.title );

                    lobby.animation.setLayers( lobby.layer );
                },

                cleanUp: function() {
                    lobby.playerName.field.unfocus()
                }
            };

        lobby.init();

        return lobby
    }
);