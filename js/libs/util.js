define([ 'underscore', 'settings' ], function( _, settings ){
    var width = window.innerWidth;

    var util = {
        calculate: {
            pi: function( i ){ return i * Math.PI },

            random: {
                float: function( min, max ){ return Math.random() * ( max - min ) + min },
                int: function ( min, max ){ return Math.floor( Math.random() * ( max - min + 1 )) + min }
            },

            dimensions: {
                width: function() {
                    return width
                },

                height: function() {
                    return 9 * width / 16
                }
            }
        },

        animation: {
            fade: function( node, frame, type ){
                if ( type === 'in' ){
                    node.opacity(
                        node.opacity() + frame.timeDiff / settings.animation.transition.speed < 1 ?
                            node.opacity() + frame.timeDiff / settings.animation.transition.speed : 1
                    );
                } else {
                    node.opacity(
                        node.opacity() - frame.timeDiff / settings.animation.transition.speed > 0 ?
                            node.opacity() - frame.timeDiff / settings.animation.transition.speed : 0
                    );
                }
            }
        }
    };

    _.extend( util.calculate, {
        absolute: {
            size: function( i ){ return util.calculate.dimensions.width() / i },
            x: function( i ){ return util.calculate.dimensions.width() / i },
            y: function( i ){ return util.calculate.dimensions.height() / i }
        }
    });

    _.extend( util.animation, {
        fadeAndStop: function( module, frame, after ){
            util.animation.fade( module.layer, frame, 'out' );

            if ( module.layer.opacity() === 0 ){

                if ( module.name === 'menu' ){
                    module.state = 'to game';
                } else if ( module.name === 'game' ){
                    module.state = 'to menu';
                } else {
                    module.state = 'stopped';
                }

                module.animation.stop();
                module.layer.remove();
                if ( after ) after()
            }
        }
    });

    return util
});