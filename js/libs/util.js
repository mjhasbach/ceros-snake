define([ 'underscore', 'Kinetic', 'kineticEditableText', 'settings', 'database' ],
    function( _, Kinetic, kineticEditableText, settings, database ){
        var util = {
                PlayerName: function( options ){
                    if ( typeof Kinetic.EditableText === 'undefined' )
                        kineticEditableText.init( Kinetic );

                    return {
                        label: new Kinetic.Text({
                            x: util.calculate.absolute.x( settings.playerName.label.x ),
                            y: util.calculate.absolute.y( options.y ),
                            text: 'Name:',
                            fontSize: util.calculate.absolute.size( settings.playerName.size ),
                            fontFamily: 'Fira Mono',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        field: new Kinetic.EditableText({
                            y: util.calculate.absolute.y( options.y ),
                            fontSize: util.calculate.absolute.size( settings.playerName.size ),
                            fontFamily: 'Fira Mono',
                            fill: settings.font.colors.fill.enabled.hex,
                            stroke: settings.font.colors.stroke.enabled.hex,
                            strokeWidth: util.calculate.absolute.size( settings.font.stroke.width )
                        }),

                        move: function() {
                            var playerName = this;

                            setTimeout( function() {
                                var x = util.calculate.absolute.x,
                                    nameLength = playerName.field.text().length;

                                playerName.label.x(
                                    x( settings.playerName.label.x ) - ( nameLength * x( 42.7 ))
                                );

                                var fieldX = playerName.label.x() + playerName.label.width();

                                playerName.field.x( fieldX );
                                playerName.field.tempText[ 0 ].x( fieldX )
                            }, 0 )
                        },

                        init: function( layer ){
                            this.move();

                            layer.add( this.label );
                            layer.add( this.field )
                        }
                    }
                },

                SineHelper: function() {
                    var sine = {
                        lastDirection: 'up',

                        lastSine: 0,

                        getDirection: function( s ){
                            if ( s > sine.lastSine ) return 'up';
                            else return 'down'
                        },

                        update: function( s ){
                            sine.lastDirection = sine.getDirection( s );
                            sine.lastSine = s
                        },

                        directionChanged: function( s ){
                            if ( sine.lastDirection !== sine.getDirection( s )){
                                sine.update( s );

                                return true
                            } else {
                                sine.update( s );

                                return false
                            }
                        },

                        isAtMaximum: function( s ){
                            if ( sine.lastDirection !== sine.getDirection( s ) && s > 0 ){
                                sine.update( s );

                                return true
                            } else {
                                sine.update( s );

                                return false
                            }
                        }
                    };

                    return sine
                },

                calculate: {
                    absolute: {
                        size: function( i ){ return width / i },
                        x: function( i ){ return width / i },
                        y: function( i ){ return height / i }
                    },

                    brightnessVariance: function( frame ){
                        return Math.abs(
                            Math.cos( frame.time * Math.PI / settings.animation.period() ) *
                                settings.mouseOver.brightnessVariance
                        )
                    },

                    pi: function( i ){ return i * Math.PI },

                    random: {
                        float: function( min, max ){
                            return Math.random() * ( max - min ) + min
                        },

                        int: function ( min, max ){
                            return Math.floor( Math.random() * ( max - min + 1 )) + min
                        }
                    },

                    dimensions: {
                        original: {
                            width: function() { return width },
                            height: function() { return height }
                        },

                        aspect: function() {
                            var dimensions = {
                                width: window.innerWidth,
                                height: window.innerHeight
                            };

                            if ( 9 * dimensions.width / 16 < dimensions.height )
                                dimensions.height = Math.floor( 9 * dimensions.width / 16 );
                            else
                                dimensions.width = Math.floor(( dimensions.height / 9 ) * 16 );

                            return dimensions
                        },

                        scale: function() {
                            return util.calculate.dimensions.aspect().width /
                                util.calculate.dimensions.original.width()
                        }
                    }
                },

                module: {
                    start: function( module, stage ){
                        if ( settings.debug )
                            console.log( 'Starting module "' + module.name + '"');

                        stage.add( module.layer );

                        if ( module.playerName && module.playerName.field ){
                            module.playerName.field.focus();

                            module.playerName.field.text(
                                database.player.me.get( 'name' ) || ''
                            );

                            module.playerName.move()
                        }

                        module.layer.opacity( 1 );

                        module.layer.moveToBottom();

                        stage.scale({
                            x: util.calculate.dimensions.scale(),
                            y: util.calculate.dimensions.scale()
                        });

                        module.animation.start();

                        module.state.set( 'current', 'starting' )
                    },

                    stop: function( module, frame ){
                        util.animation.fade( module.layer, frame, 'out', function() {
                            if ( settings.debug )
                                console.log( 'Stopping module "' + module.name + '"');

                            if ( module.cleanUp ) module.cleanUp();

                            module.animation.stop();

                            module.layer.remove();

                            module.state.set( 'current', 'stopped' )
                        })
                    },

                    isNotStoppingOrStopped: function() {
                        return this.state.get( 'current' ).indexOf( 'stop' ) === -1
                    }
                },

                animation: {
                    fade: function( node, frame, type, after ){
                        var opacity;

                        if ( type === 'in' ){
                            opacity = node.opacity() +
                                ( frame.timeDiff / settings.animation.transition.speed );

                            if ( opacity < 1 )
                                node.opacity( opacity );
                            else
                                node.opacity( 1 );

                            if ( node.opacity() === 1 && after ) after()
                        } else {
                            opacity = node.opacity() -
                                ( frame.timeDiff / settings.animation.transition.speed );

                            if ( opacity > 0 )
                                node.opacity( opacity );
                            else
                                node.opacity( 0 );

                            if ( node.opacity() === 0 && after ) after()
                        }
                    }
                },

                color: {
                    fillAndStroke: function( options ){
                        if ( options.fill.hex ){
                            options.node.fill( options.fill.hex );
                            options.node.stroke( options.stroke.hex )
                        } else {
                            options.node.fill( 'hsl(' +
                                options.fill.h + ', ' +
                                options.fill.s + '%, ' +
                                options.fill.l + '%)'
                            );

                            options.node.stroke( 'hsl(' +
                                options.stroke.h + ', ' +
                                options.stroke.s + '%, ' +
                                options.stroke.l + '%)'
                            )
                        }
                    }
                },

                number: {
                    isBetween: function( number, min, max ){
                        return number > min && number < max;
                    },

                    toText: function( number ){
                        if ( util.number.isBetween( number, -1, 10 ))
                            return [
                                'zero', 'one', 'two', 'three', 'four',
                                'five', 'six', 'seven', 'eight', 'nine'
                            ][ parseFloat( number )];

                        else throw new Error( 'util.number.toText() can only handle numbers 0-9' )
                    }
                },

                mouse: {
                    isOverNode: function( node ){
                        var stage = node.getStage();

                        if ( stage ){
                            var pos = stage.getPointerPosition();

                            if ( pos )
                                return stage.getIntersection({
                                    x: pos.x,
                                    y: pos.y
                                }) == node;

                            else return false

                        } else return false;
                    }
                },
    
                isKineticObject: function( shape ){
                    return _.isObject( shape ) && _.isString( shape.nodeType )
                }
            };

        var width = util.calculate.dimensions.aspect().width,
            height = util.calculate.dimensions.aspect().height;

        return util
    }
);