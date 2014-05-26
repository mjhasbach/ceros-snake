define([], function() {
    var settings = {
        font: { ui: 'New Rocker' },

        animation: { transition: { speed: 1000 }},

        stage: { container: { name: 'game' }},

        song: {
            bpm: 140,
            path: 'audio/song.mp3'
        },

        background: {
            tile: {
                color: {
                    palette: [
                        "#27212d", "#131019", "#272331", "#1e1b26", "#16151b", "#1e1c27",
                        "#2c2535", "#1d1721", "#23222a", "#191621", "#191725", "#171721",
                        "#1e1822", "#221c2a", "#1c1922", "#1c171e", "#211b25", "#1d1a25",
                        "#1b1926", "#10101a", "#0c0912", "#0d0a13", "#12101b", "#181526",
                        "#12121a", "#100f17", "#131218", "#151219", "#201a26", "#1e1a29",
                        "#15131e", "#14121d"
                    ]
                },

                size: window.innerWidth / 32
            }
        },

        loading: {
            background: { color: '#4C5F49' },

            wheel: {
                color: '#372a50',
                radius: 0
            },

            text: {
                color: '#5b4686',
                family: 'Georgia'
            }
        },

        menu: {
            title: {
                bounciness: 7,

                stroke: {
                    color: '#372a50',
                    width: 35
                }
            },

            options: {
                y: 1.24,

                brightnessVariance: 8,

                controller: { size: 9 },

                settings: {
                    font: {
                        size: 4,

                        color: {
                            enabled: {
                                hex: '#5d4686',
                                h: 261,
                                s: 31,
                                l: 40
                            },

                            disabled: '#171221'
                        }
                    }
                },

                font: {
                    size: 11,

                    color: {
                        enabled: {
                            hex: '#372a50',
                            h: 261,
                            s: 31,
                            l: 24
                        },

                        disabled: '#171221'
                    }
                },

                stroke: {
                    width: 300,

                    color: {
                        enabled: '#5b4686',
                        disabled: '#3b2e57'
                    }
                }
            }
        },

        game: {
            snake: {
                color: { palete: [ '#4A374B', '#713E4F', '#8B4045' ]},
                initial: {
                    coords: { x: 14, y: 8 },
                    direction: 'up'
                },

                amountOfInnerRectangles: 2,

                speedIncrement: 4
            },

            heart: {
                initial: {
                    color: { h: 352, s: 96, l: 38 },
                    coords: { x: 13, y: 13, l: 17 }
                },

                amountOfInnerHearts: 2,

                maximum: 10,

                spawnProbability: 0.3
            },

            boundary: {
                scale: 21250
            },

            counter: {
                font: { color: '#713E4F' },

                shadow: { color: '#4A374B' }
            }
        }
    };

    settings.game.boundary.color = { palette: settings.background.tile.color.palette };

    settings.background.tile.quantity = {
        x: Math.round( window.innerWidth / settings.background.tile.size ),
        y: Math.round( 9 * ( window.innerWidth / settings.background.tile.size ) / 16)
    };

    settings.background.tile.color.random = function() {
        return settings.background.tile.color.palette[ Math.round( Math.random() * ( settings.background.tile.color.palette.length - 1 ))]
    };

    settings.animation.period = ( 60 / settings.song.bpm ) * 1000;

    return settings
});