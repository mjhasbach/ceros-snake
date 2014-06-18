define([ 'underscore', 'settings' ], function( _, settings ){
    var width, height;

    var util = {
        calculate: {
            absolute: {
                size: function( i ){ return width / i },
                x: function( i ){ return width / i },
                y: function( i ){ return height / i }
            },

            brightnessVariance: function( frame ){
                return Math.abs(((
                    Math.cos( frame.time * Math.PI / settings.animation.period ) *
                    settings.mouseOver.brightnessVariance
                )));
            },

            pi: function( i ){ return i * Math.PI },

            random: {
                float: function( min, max ){ return Math.random() * ( max - min ) + min },
                int: function ( min, max ){ return Math.floor( Math.random() * ( max - min + 1 )) + min }
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

                    if ( 9 * dimensions.width / 16 < dimensions.height ){
                        dimensions.height = Math.floor( 9 * dimensions.width / 16 )
                    } else {
                        dimensions.width = Math.floor(( dimensions.height / 9 ) * 16 )
                    }

                    return dimensions
                }
            }
        },

        module: {
            start: function( module, stage ){
                stage.add( module.layer );

                module.layer.opacity( 1 );

                module.layer.moveToBottom();

                stage.scale({
                    x: util.calculate.dimensions.scale(),
                    y: util.calculate.dimensions.scale()
                });

                module.animation.start();

                module.state = 'starting'
            },

            stop: function( module, frame ){
                util.animation.fade( module.layer, frame, 'out' );

                if ( module.layer.opacity() === 0 ){
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
                if ( type === 'in' ){
                    node.opacity(
                        node.opacity() + frame.timeDiff / settings.animation.transition.speed < 1 ?
                            node.opacity() + frame.timeDiff / settings.animation.transition.speed : 1
                    );

                    if ( node.opacity() === 1 && after ) after()
                } else {
                    node.opacity(
                        node.opacity() - frame.timeDiff / settings.animation.transition.speed > 0 ?
                            node.opacity() - frame.timeDiff / settings.animation.transition.speed : 0
                    );

                    if ( node.opacity() === 0 && after ) after()
                }
            }
        },

        color: {
            fillAndStroke: function( options ){
                options.node.fill( 'hsl(' +
                    options.fill.h + ', ' +
                    options.fill.s + '%, ' +
                    options.fill.l + '%)'
                );

                options.node.stroke( 'hsl(' +
                    options.stroke.h + ', ' +
                    options.stroke.s + '%, ' +
                    options.stroke.l + '%)'
                );
            }
        },

        SineHelper: function() {
            var sine = this;

            this.lastDirection = 'up';

            this.lastSine = 0;

            this.getDirection = function( s ){
                if ( s > sine.lastSine ) return 'up';
                else return 'down'
            };

            this.update = function( s ){
                sine.lastDirection = sine.getDirection( s );
                sine.lastSine = s;
            };

            this.directionChanged = function( s ){
                if ( sine.lastDirection !== sine.getDirection( s )){
                    sine.update( s );
                    return true
                } else {
                    sine.update( s );
                    return false
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

                else throw new Error( 'util.numberToText() can only handle numbers 0-9')
            }
        }
    };

    util.calculate.dimensions.scale = function() {
        return util.calculate.dimensions.aspect().width / util.calculate.dimensions.original.width()
    };

    width = util.calculate.dimensions.aspect().width;

    height = util.calculate.dimensions.aspect().height;

    return util
});