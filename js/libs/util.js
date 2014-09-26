define([ 'underscore', 'settings', 'viewport' ], function( _, settings, viewport ){
    var dimensions = viewport.dimensions.original,
        util = {
            calculate: {
                absolute: {
                    size: function( i ){ return dimensions.width / i },
                    x: function( i ){ return dimensions.width / i },
                    y: function( i ){ return dimensions.height / i }
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

                tile: {
                    size: function() {
                        return dimensions.width /
                            settings.background.tile.quantity.x
                    }
                }
            },

            module: {
                start: function( module ){
                    if ( settings.debug )
                        console.log( 'Starting module "' + module.name + '"');

                    viewport.stage.add( module.layer );

                    module.layer.opacity( 1 );

                    module.layer.moveToBottom();

                    viewport.stage.scale({
                        x: viewport.scale(),
                        y: viewport.scale()
                    });

                    module.animation.start();

                    module.state.set( 'current', 'starting' )
                },

                stop: function( module, frame ){
                    util.animation.fade( module.layer, frame, 'out' );

                    if ( module.layer.opacity() === 0 ){
                        if ( settings.debug )
                            console.log( 'Stopping module "' + module.name + '"');

                        module.animation.stop();

                        module.layer.remove();

                        if ( module.cleanUp ) module.cleanUp();

                        module.state.set( 'current', 'stopped' )
                    }
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
                        if (sine.lastDirection !== sine.getDirection( s ) && s > 0){
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

                    else throw new Error( 'util.numberToText() can only handle numbers 0-9' )
                },

                toCoord: function( number ) {
                    return ( number / util.calculate.tile.size() ) + 2
                },

                fromCoord: function( number ) {
                    return ( number - 2 ) * util.calculate.tile.size()
                }
            },

            mouse: {
                isOverNode: function( node ){
                    var pos = viewport.stage.getPointerPosition();

                    if ( pos )
                        return viewport.stage.getIntersection({
                            x: pos.x,
                            y: pos.y
                        }) == node;

                    else return false
                }
            },

            isKineticObject: function( shape ){
                return _.isObject( shape ) && _.isString( shape.nodeType )
            }
        };

    return util
});