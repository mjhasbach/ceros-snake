define([], function() {
    var settings = {
            debug: false,

            font: {
                face: 'New Rocker',

                stroke: { width: 300 },

                colors: {
                    fill: {
                        enabled: {
                            hex: '#372a50',
                            h: 261,
                            s: 31,
                            l: 24
                        },

                        disabled: '#171221'
                    },

                    stroke: {
                        enabled: {
                            hex: '#5b4686',
                            h: 260,
                            s: 31,
                            l: 40
                        },

                        disabled: '#3b2e57'
                    }
                }
            },

            animation: {
                transition: { speed: 1000 },

                period: function() { return ( 60 / settings.song.bpm ) * 1000 }
            },

            mouseOver: { brightnessVariance: 8 },

            stage: { container: { name: 'game' }},

            song: {
                bpm: 140,
                path: 'audio/song.mp3'
            },

            background: {
                countDown: { coords: { x: 14, y: 6 }},

                tile: {
                    quantity: { x: 32, y: 18 }
                },

                colors: {
                    base: [
                        '#27212d', '#131019', '#272331', '#1e1b26', '#16151b', '#1e1c27',
                        '#2c2535', '#1d1721', '#23222a', '#191621', '#191725', '#171721',
                        '#1e1822', '#221c2a', '#1c1922', '#1c171e', '#211b25', '#1d1a25',
                        '#1b1926', '#10101a', '#0c0912', '#0d0a13', '#12101b', '#181526',
                        '#12121a', '#100f17', '#131218', '#151219', '#201a26', '#1e1a29',
                        '#15131e', '#14121d'
                    ],

                    number: [
                        '#525075', '#726f8e', '#7e789c', '#5c587b', '#4b4867', '#6c6988',
                        '#807d9c', '#6b678a', '#827ea3', '#63607f', '#6d698a', '#625e81',
                        '#7a759d', '#9a96bb', '#b0aad0', '#565574', '#6b678c', '#a4a0bb',
                        '#a09cbf', '#928bb5', '#545073', '#555473', '#7879a7', '#5d5c7e',
                        '#686487', '#484560', '#665f80', '#8988c1', '#535176', '#4b4b65',
                        '#5a5979'
                    ]
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
                    color: '#372a50',

                    bounciness: 7,

                    stroke: { width: 35 }
                },

                options: {
                    y: 1.24,

                    controller: { size: 9 },

                    settings: { font: { size: 4 }},

                    font: { size: 11 }
                },

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
                }
            },

            game: {
                snake: {
                    colors: [ '#4A374B', '#713E4F', '#8B4045' ],

                    initial: {
                        coords: { x: 16, y: 10 },
                        direction: 'up'
                    },

                    amountOfInnerRectangles: 2,

                    speedIncrement: 4
                },

                heart: {
                    colors: [ '#680d0e', '#8d1113', '#ac1518' ],

                    amountOfInnerHearts: 2,

                    maximum: 10,

                    spawnProbability: 0.3
                },

                paused: {
                    x: 18.5,

                    y: 4,

                    size: 3.55,

                    font: { color: '#12101b' },

                    shadow: {
                        color: '#7878a7',
                        blur: 15
                    }
                }
            },

            highScores: {
                name: {
                    y: 19.5,
                    size: 13,
                    label: { x: 2.55 },
                    scoreHolder: { x: 1 }
                },

                add: {
                    keyboard: {
                        x: 3.63,
                        y: 1.285,
                        size: 8.4
                    },

                    submit: {
                        x: 2.17,
                        y: 1.233,
                        size: 11.2
                    },

                    back: {
                        x: 1.677,
                        y: 1.233,
                        size: 11.2
                    }
                },

                view: {
                    previous: {
                        x: 3.03,
                        y: 1.239,
                        size: 11.33
                    },

                    next: {
                        x: 1.677,
                        y: 1.239,
                        size: 11.33
                    },

                    back: {
                        x: 2.17,
                        y: 1.233,
                        size: 11.2
                    }
                }
            },

            database: {
                scores: {
                    address: 'https://ceros-snake.firebaseio.com/scores',

                    limit: 100
                }
            }
        };

    return settings
});