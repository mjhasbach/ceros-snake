var webFontLoader = document.createElement('script');

webFontLoader.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';
webFontLoader.type = 'text/javascript';
webFontLoader.async = 'true';

var scripts = document.getElementsByTagName('script')[0];
scripts.parentNode.insertBefore(webFontLoader, scripts);

$(function(){
    function Config() {
        var self = this;

        this.stage = {
            height: self.calculateStageHeight,
            width: self.calculateStageWidth
        };

        this.song = {
            bpm: 132,
            path: 'audio/soundtrack'
        };

        this.tiles = {
            horizontalAmount: 32,
            verticalAmount: 18
        };

        this.tiles.width = self.calculateTileWidth();
        this.tiles.height = self.calculateTileHeight();

        this.animations = {
            period: (60 / self.song.bpm) * 1000,
            mouseOver1Player: false,
            mouseOver2Player: false,
            mouseOverSettings: false,
            mouseOverHighScores: false,
            transitioningToNewGame: false,
            transitioningToMenu: false,
            snakeIsMoving: true,
            snakeMove: self.snakeMove,
            queuedMovements: [],
            snakeCurrentDirection: 'up',
            snakePreviousDirection: 'up',
            transitionSpeed: 0.025,
            lastMovementTime: 0,
            frameCount: 0,
            menuTitleBounciness: 7,
            menuTextBrightnessVariance: 5,
            loops: {}
        };

        this.layers = {
            bg: new Kinetic.Layer(),
            foreground: new Kinetic.Layer(),
            menu: new Kinetic.Layer(),
            loading: new Kinetic.Layer()
        };

        this.shapes = {
            loadingShapesOpacity: 1,
            menuShapesOpacity: 1,
            doneGenerating: false,
            loading: {},
            tiles: [],
            boundary: [],
            menu: {},
            game: {
                hearts: {
                    inPlay: [], coords: [], maximumPossible: 10,
                    probability: 30, existOnTheStage: false
                },
                snake: {
                    inPlay: [], coords: [],
                    queue: {}, counters: {},
                    defaultStartCoords: {
                        x: 13,
                        y: 13
                    }
                }
            }
        };

        this.font = {
            menu: 'New Rocker',
            loading: 'Georgia',
            color: '#005F6B',
            disabledColor: '#0c3a40',
            preLoad: '\uf071\uf11b\uf013\uf013',
            size: self.absX(11),
            gamepadSize: self.absX(9),
            optionRowY: self.absY(1.24),
            optionRowGamePadY: self.absY(1.295),
            strokeWidth: self.absX(35)
        };

        this.colors = {
            bgPalette: [ '#00B4CC', '#00DFFC', '#00A8C6', '#25b2cb', '#28bdd7' ],
            simpleScreenBg: '#00B4CC',
            boundary: '#008C9E',
            counter: '#007180',
            menuText: { hue: 187, sat: 100, lum: 21 },
            snake: { hue: 187, sat: 100, lum: 21 },
            heart: { hue: 187, sat: 100, lum: 21 }
        };

        this.firstLoad = true;
        this.doneLoadingAssets = false;
        this.cyclingBackgroundColors = false;
        this.gameStarted = false;
        this.gameOver = true;
    }

    Config.prototype.calculateStageWidth = function() {
        return window.innerWidth
    };

    Config.prototype.calculateStageHeight = function() {
        return (9 * window.innerWidth / 16)
    };

    Config.prototype.calculateTileWidth = function() {
        return Math.ceil(Config.prototype.calculateStageWidth() / this.tiles.horizontalAmount)
    };

    Config.prototype.calculateTileHeight = function() {
        return Math.ceil(Config.prototype.calculateStageHeight() / this.tiles.verticalAmount)
    };

    Config.prototype.absX = function(pos) {
        return Math.ceil(Config.prototype.calculateStageWidth() / pos)
    };

    Config.prototype.absY = function(pos) {
        return Math.ceil(Config.prototype.calculateStageHeight() / pos)
    };

    Config.prototype.randomBgColor = function() {
        return this.colors.bgPalette[Math.round(Math.random() * (this.colors.bgPalette.length - 1))]
    };

    Config.prototype.snakeMove = function(direction) {
        var firstSegment = this.shapes.game.snake.inPlay[0],
            lastSegment = this.shapes.game.snake.inPlay.pop(),
            lastSegmentCoords = this.shapes.game.snake.coords.pop();

        if (direction == 'up') {
            lastSegment.x( firstSegment.x() );
            lastSegment.y( firstSegment.y() - this.tiles.height );
        } else if (direction == 'right') {
            lastSegment.x( firstSegment.x() + this.tiles.width );
            lastSegment.y( firstSegment.y() )
        } else if (direction == 'down') {
            lastSegment.x( firstSegment.x() );
            lastSegment.y( firstSegment.y() + this.tiles.height )
        } else {
            lastSegment.x( firstSegment.x() - this.tiles.width );
            lastSegment.y( firstSegment.y());
        }

        lastSegmentCoords.x = Math.round( lastSegment.x() / this.tiles.width ) + 1;
        lastSegmentCoords.y = Math.round( lastSegment.y() / this.tiles.height ) + 1;

        lastSegment.lastMoveDir = direction;

        this.animations.snakePreviousDirection = direction;
        this.shapes.game.snake.inPlay.unshift(lastSegment);
        this.shapes.game.snake.coords.unshift(lastSegmentCoords);
    };

    initialize();

    function initialize() {
        var config = new Config(),
            soundtrack = new buzz.sound( config.song.path, { formats: [ "ogg", "mp3", "aac" ] });

        config.stage = new Kinetic.Stage({
            container: 'game',
            width: config.stage.width(),
            height: config.stage.height()
        });

        if (config.firstLoad) {
            $( window ).resize(initialize);
            config.firstLoad = false;

            WebFontConfig = {
                google: {
                    families: ['New Rocker']
                },

                custom: {
                    families: ['FontAwesome'],
                    urls: ['http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css'],
                    testStrings: {
                        'FontAwesome': config.font.preLoad
                    }
                },

                loading: function() {
                    generateLoadingShapes();
                    createLoadingLoop();
                    config.animations.loops.loading.start();

                    addLayersToStage();
                    initializeRemainingShapes();
                },

                active: function() {
                    soundtrack.play().loop();
                    config.doneLoadingAssets = true;
                    config.animations.loops.background.start();
                    config.animations.loops.menu.start();
                }
            };

            $("*").keyup(function(event) {
                event.preventDefault();
                event.stopPropagation();

                console.log('Key code ' + event.which + ' pressed!');

                // Space bar and Escape
                if (event.which == 32 || event.which == 27) {
                    config.animations.snakeIsMoving = !config.animations.snakeIsMoving
                }

                if (!config.gameOver) {
                    // Up Arrow or W Key
                    if (event.which == 38 || event.which == 87) {
                        if (config.animations.queuedMovements.last() != 'up' && config.animations.snakeCurrentDirection != 'down') {
                            config.animations.queuedMovements.push('up')
                        }
                    }

                    // Right Arrow or D Key
                    else if (event.which == 39 || event.which == 68) {
                        if (config.animations.queuedMovements.last() != 'right' && config.animations.snakeCurrentDirection != 'left') {
                            config.animations.queuedMovements.push('right')
                        }
                    }

                    // Down Arrow or S Key
                    else if (event.which == 40 || event.which == 83) {
                        if (config.animations.queuedMovements.last() != 'down' && config.animations.snakeCurrentDirection != 'up') {
                            config.animations.queuedMovements.push('down')
                        }
                    }

                    // Left Arrow or A Key
                    else if (event.which == 37 || event.which == 65) {
                        if (config.animations.queuedMovements.last() != 'left' && config.animations.snakeCurrentDirection != 'right') {
                            config.animations.queuedMovements.push('left')
                        }
                    }
                }
            });
        } else {
            generateLoadingShapes();
            createLoadingLoop();
            config.animations.loops.loading.start();

            addLayersToStage();
            initializeRemainingShapes();

            config.doneLoadingAssets = true;
            config.animations.loops.background.start();
            config.animations.loops.menu.start();
        }

        function addLayersToStage() {
            config.stage.add(config.layers.bg);
            config.stage.add(config.layers.foreground);
            config.stage.add(config.layers.menu);
            config.stage.add(config.layers.loading);
        }

        function initializeRemainingShapes() {
            generateBackgroundTiles();
            generateTitle();
            generateMenuOptions();

            createMenuLoop();
            createGameLoop();
            createBackgroundLoop();

            generateHeartPrototype();
            generateSnakePrototype();
            generateCounterPrototype();
        }

        function generateLoadingShapes() {
            config.shapes.loading.bg = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: config.stage.width(),
                height: config.stage.height(),
                fill: config.colors.simpleScreenBg
            });

            config.shapes.loading.text = new Kinetic.Text({
                x: config.absX(3),
                y: config.absY(2.35),
                text: 'Loading',
                fontSize: config.font.size,
                fontFamily: config.font.loading,
                fill: config.font.color
            });

            config.shapes.loading.wheel = new Kinetic.Shape({
                sceneFunc: function(context) {
                    context.beginPath();
                    context.arc(config.absX(1.99), config.absY(1.99), config.absX(4.5), pi(0), pi(0), true);
                    context.stroke();
                    context.strokeShape(this);
                },
                stroke: config.font.color,
                strokeWidth: config.font.strokeWidth * 2
            });

            config.layers.loading.add(config.shapes.loading.bg);
            config.layers.loading.add(config.shapes.loading.text);
            config.layers.loading.add(config.shapes.loading.wheel);

            config.stage.add(config.layers.loading);
        }

        function generateBackgroundTiles() {
            var tile = null;

            for (var x = 0; x < config.tiles.horizontalAmount; x++) {
                for (var y = 0; y < config.tiles.verticalAmount; y++) {
                    tile = new Kinetic.Rect({
                        x: x * config.tiles.width,
                        y: y * config.tiles.height,
                        width: config.tiles.width,
                        height: config.tiles.height,
                        fill: config.randomBgColor()
                    });

                    config.shapes.tiles.push(tile);
                    config.layers.bg.add(tile);

                    if (x == 0 || x == config.tiles.horizontalAmount - 1 ||
                        y == 0 || y == config.tiles.verticalAmount - 1 ){

                        tile = new Kinetic.Text({
                            x: x * config.tiles.width,
                            y: y * config.tiles.height,
                            text: '\uf071',
                            fontSize: config.tiles.width,
                            fontFamily: 'FontAwesome',
                            fill: config.colors.boundary
                        });

                        config.shapes.boundary.push(tile);
                        config.layers.foreground.add(tile);
                    }
                }
            }
        }

        function generateTitle() {
            var absX = config.absX, absY = config.absY;
            config.shapes.menu.ceros = new Kinetic.Shape({
                sceneFunc: function(context) {
                    context.beginPath();
                    context.arc(absX(8.7), absY(5), absX(11.5), pi(1.85), pi(0.2), true);
                    context.lineTo(absX(4.0185), absY(8));
                    context.moveTo(absX(4), absY(3.35));
                    context.arc(absX(3.07), absY(5), absX(11.5), pi(1.75), pi(0.0), true);
                    context.moveTo(absX(2.42), absY(2.65));
                    context.arc(absX(2), absY(5), absX(11.5), pi(1), pi(1.9));
                    context.arc(absX(1.486), absY(5), absX(11.5), pi(3), pi(1), true);
                    context.arc(absX(1.486), absY(5), absX(11.5), pi(3), pi(2.2), true);
                    context.arc(absX(1.13), absY(5), absX(11.5), pi(1.2), pi(0.81));
                    context.stroke();
                    context.strokeShape(this);
                },
                stroke: config.font.color,
                strokeWidth: config.font.strokeWidth
            });

            config.layers.menu.add(config.shapes.menu.ceros);

            config.shapes.menu.snake = new Kinetic.Shape({
                sceneFunc: function(context) {
                    context.beginPath();
                    context.arc(absX(8.7), absY(1.72), absX(11.5), pi(1.15), pi(0.81));
                    context.arc(absX(8.7), absY(1.72), absX(11.5), pi(0.81), pi(0.2), true);
                    context.arc(absX(3.07), absY(1.72), absX(11.5), pi(1.2), pi(2));
                    context.arc(absX(3.07), absY(1.72), absX(11.5), pi(0), pi(1), true);
                    context.lineTo(absX(4.19), absY(1.318));
                    context.moveTo(absX(2.423), absY(1.318));
                    context.lineTo(absX(2.423), absY(1.318));
                    context.lineTo(absX(2.423), absY(1.72));
                    context.arc(absX(1.99), absY(1.72), absX(11.5), pi(1), pi(2));
                    context.lineTo(absX(1.695), absY(1.318));
                    context.lineTo(absX(1.695), absY(2.47));
                    context.moveTo(absX(1.695), absY(1.71));
                    context.lineTo(absX(2.413), absY(1.71));
                    context.lineTo(absX(1.695), absY(1.71));
                    context.quadraticCurveTo(absX(1.308), absY(1.71), absX(1.308), absY(2.45));
                    context.moveTo(absX(1.695), absY(1.71));
                    context.quadraticCurveTo(absX(1.39), absY(1.71), absX(1.287), absY(1.3825));
                    context.arc(absX(1.12), absY(1.72), absX(11.5), pi(1.75), pi(0), true);
                    context.stroke();
                    context.strokeShape(this);
                },
                stroke: config.font.color,
                strokeWidth: config.font.strokeWidth
            });

            config.layers.menu.add(config.shapes.menu.snake);
        }

        function generateMenuOptions() {
            var absX = config.absX;

            config.shapes.menu.number1 = new Kinetic.Text({
                x: absX(50),
                y: config.font.optionRowY,
                text: '1',
                fontSize: config.font.size,
                fontFamily: config.font.menu,
                fill: config.font.color
            });

            config.shapes.menu.number1.on('mouseover', function() {
                config.animations.mouseOver1Player = true
            });

            config.shapes.menu.number1.on('mouseout', function() {
                config.shapes.menu.controller1.fill(config.font.color);
                config.shapes.menu.number1.fill(config.font.color);
                config.animations.mouseOver1Player = false
            });

            config.shapes.menu.number1.on('mouseup', function() {
                config.animations.transitioningToNewGame = true;
            });

            config.shapes.menu.controller1 = new Kinetic.Text({
                x: absX(18),
                y: config.font.optionRowGamePadY,
                text: '\uf11b',
                fontSize: config.font.gamepadSize,
                fontFamily: 'FontAwesome',
                fill: config.font.color
            });

            config.shapes.menu.controller1.on('mouseover', function() {
                config.animations.mouseOver1Player = true
            });

            config.shapes.menu.controller1.on('mouseout', function() {
                config.shapes.menu.controller1.fill(config.font.color);
                config.shapes.menu.number1.fill(config.font.color);
                config.animations.mouseOver1Player = false
            });

            config.shapes.menu.controller1.on('mouseup', function() {
                config.animations.transitioningToNewGame = true;
            });

            config.shapes.menu.number2 = new Kinetic.Text({
                x: absX(5),
                y: config.font.optionRowY,
                text: '2',
                fontSize: config.font.size,
                fontFamily: config.font.menu,
                fill: config.font.disabledColor
            });

//            config.shapes.menu.number2.on('mouseover', function() {
//                config.animations.mouseOver2Player = true
//            });
//
//            config.shapes.menu.number2.on('mouseout', function() {
//                config.shapes.menu.number2.fill(config.font.color);
//                config.shapes.menu.controller2.fill(config.font.color);
//                config.animations.mouseOver2Player = false
//            });

            config.shapes.menu.controller2 = new Kinetic.Text({
                x: absX(3.99),
                y: config.font.optionRowGamePadY,
                text: '\uf11b',
                fontSize: config.font.gamepadSize,
                fontFamily: 'FontAwesome',
                fill: config.font.disabledColor
            });

//            config.shapes.menu.controller2.on('mouseover', function() {
//                config.animations.mouseOver2Player = true
//            });
//
//            config.shapes.menu.controller2.on('mouseout', function() {
//                config.shapes.menu.number2.fill(config.font.color);
//                config.shapes.menu.controller2.fill(config.font.color);
//                config.animations.mouseOver2Player = false
//            });

            // uf013 is gear
            config.shapes.menu.settings = new Kinetic.Text({
                x: absX(2.5),
                y: config.font.optionRowY,
                text: '\uf028',
                fontSize: config.font.size,
                fontFamily: 'FontAwesome',
                fill: config.font.color
            });

            config.shapes.menu.settings.on('mouseover', function() {
                config.animations.mouseOverSettings = true
            });

            config.shapes.menu.settings.on('mouseout', function() {
                config.shapes.menu.settings.fill(config.font.color);
                config.animations.mouseOverSettings = false
            });

            config.shapes.menu.settings.on('mouseup', function() {
                buzz.sounds[0].toggleMute();
            });

            config.shapes.menu.highScores = new Kinetic.Text({
                x: absX(1.97),
                y: config.font.optionRowY,
                text: 'High Scores',
                fontSize: config.font.size,
                fontFamily: config.font.menu,
                fill: config.font.disabledColor
            });

//            config.shapes.menu.highScores.on('mouseover', function() {
//                config.animations.mouseOverHighScores = true
//            });
//
//            config.shapes.menu.highScores.on('mouseout', function() {
//                config.shapes.menu.highScores.fill(config.font.color);
//                config.animations.mouseOverHighScores = false
//            });

            config.layers.menu.add(config.shapes.menu.number1);
            config.layers.menu.add(config.shapes.menu.controller1);
            config.layers.menu.add(config.shapes.menu.number2);
            config.layers.menu.add(config.shapes.menu.controller2);
            config.layers.menu.add(config.shapes.menu.settings);
            config.layers.menu.add(config.shapes.menu.highScores);
        }

        function generateSnakePrototype() {
            var subSegment = null,
                group = new Kinetic.Group({
                    x: -1000,
                    y: -1000
                });

            group.lastMoveDir = config.animations.snakeCurrentDirection;

            subSegment = new Kinetic.Rect({
                x: config.tiles.width,
                y: config.tiles.height,
                width: config.tiles.width,
                height: config.tiles.height,
                fill: 'hsl(' +
                    config.colors.snake.hue + ', ' +
                    config.colors.snake.sat + '%, ' +
                    config.colors.snake.lum + '%)'
            });

            group.add(subSegment);

            subSegment = new Kinetic.Rect({
                x: ((config.tiles.width) + (config.tiles.width * 0.2)),
                y: ((config.tiles.height) + (config.tiles.height * 0.2)),
                width: (config.tiles.width * 0.6),
                height: (config.tiles.height * 0.6),
                fill: 'hsl(' +
                    config.colors.snake.hue + ', ' +
                    config.colors.snake.sat + '%, ' +
                    (config.colors.heart.lum / 1.4) + '%)'
            });

            group.add(subSegment);

            subSegment = new Kinetic.Rect({
                x: ((config.tiles.width) + (config.tiles.width * 0.4)),
                y: ((config.tiles.height) + (config.tiles.height * 0.4)),
                width: (config.tiles.width * 0.2),
                height: (config.tiles.height * 0.2),
                fill: 'hsl(' +
                    config.colors.snake.hue + ', ' +
                    config.colors.snake.sat + '%, ' +
                    (config.colors.heart.lum / 1.8) + '%)'
            });

            group.add(subSegment);
            config.shapes.game.snake.proto = group
        }

        function addSnakeSegment() {
            var xPos = config.shapes.game.snake.queue.x,
                yPos = config.shapes.game.snake.queue.y;

            var segment = config.shapes.game.snake.proto.clone({ x: xPos, y: yPos });

            segment.id(config.shapes.game.snake.inPlay.length);
            config.shapes.game.snake.inPlay.push(segment);
            config.shapes.game.snake.queue = null;
            config.shapes.game.snake.coords.push({
                id: segment.id(), x: xPos / config.tiles.width, y: yPos / config.tiles.height });

            config.layers.foreground.add(segment)
        }

        function queueNewSnakeSegment() {
            config.shapes.game.snake.queue = {};
            if (config.shapes.game.snake.inPlay.length == 0) {
                config.shapes.game.snake.queue.x = config.shapes.game.snake.defaultStartCoords.x * config.tiles.width;
                config.shapes.game.snake.queue.y = config.shapes.game.snake.defaultStartCoords.y * config.tiles.height;
            } else {
                config.shapes.game.snake.queue.x = config.shapes.game.snake.inPlay.last().x();
                config.shapes.game.snake.queue.y = config.shapes.game.snake.inPlay.last().y();
            }
        }

        function generateHeartPrototype() {
            var group = new Kinetic.Group();

            var shape = new Kinetic.Text({
                x: 0,
                y: 0,
                text: '\uf004',
                fontSize: config.tiles.width,
                fontFamily: 'FontAwesome',
                fill: 'hsl(' +
                    config.colors.heart.hue + ', ' +
                    config.colors.heart.sat + '%, ' +
                    config.colors.heart.lum + '%)'
            });

            group.add(shape);

            shape = new Kinetic.Text({
                x: ((config.tiles.width * 0.2)),
                y: ((config.tiles.height * 0.2)),
                text: '\uf004',
                fontSize: (config.tiles.width * 0.6),
                fontFamily: 'FontAwesome',
                fill: 'hsl(' +
                    config.colors.heart.hue + ', ' +
                    config.colors.heart.sat + '%, ' +
                    (config.colors.heart.lum / 1.4) + '%)'
            });

            group.add(shape);

            shape = new Kinetic.Text({
                x: ((config.tiles.width * 0.4)),
                y: ((config.tiles.height * 0.4)),
                text: '\uf004',
                fontSize: (config.tiles.width * 0.2),
                fontFamily: 'FontAwesome',
                fill: 'hsl(' +
                    config.colors.heart.hue + ', ' +
                    config.colors.heart.sat + '%, ' +
                    (config.colors.heart.lum / 1.8) + '%)'
            });

            group.add(shape);

            config.shapes.game.hearts.proto = group
        }

        function regenerateHearts() {
            var coords = config.shapes.game.hearts.coords,
                snakes = config.shapes.game.snake.coords,
                collision = false;

            generateHeart(function(heart, x, y) {
                snakes.forEach(function(snake) {
                    if (heart.x == snake.x && heart.y == snake.y) {
                        collision = true
                    }
                });

                coords.forEach(function(otherHeart) {
                    if (heart.x == otherHeart.x && heart.y == otherHeart.y) {
                        collision = true
                    }
                });

                if (collision) regenerateHearts();
                else {
                    config.shapes.game.hearts.existOnTheStage = true;
                    heart.id(config.shapes.game.hearts.inPlay.length);
                    coords.push({ id: heart.id(), x: x, y: y });
                    config.shapes.game.hearts.inPlay.push(heart);
                    config.layers.foreground.add(heart);

                    for (var i = 0; i < config.shapes.game.hearts.maximumPossible - 1; i++) {
                        if (getRandomFloat(0, 100) < config.shapes.game.hearts.probability) {
                            generateHeart(function(heart, x, y) {
                                snakes.forEach(function(snake) {
                                    if (heart.x == snake.x && heart.y == snake.y) collision = true
                                });

                                coords.forEach(function(otherHeart) {
                                    if (heart.x == otherHeart.x && heart.y == otherHeart.y) collision = true
                                });

                                if (!collision) {
                                    heart.id(config.shapes.game.hearts.inPlay.length);
                                    coords.push({ id: heart.id(), x: x, y: y });
                                    config.shapes.game.hearts.inPlay.push(heart);
                                    config.layers.foreground.add(heart);
                                } else collision = false
                            });
                        }
                    }
                }
            });

            function generateHeart(cb) {
                var x = getRandomInt(1, config.tiles.horizontalAmount - 2),
                    y = getRandomInt(1, config.tiles.verticalAmount - 2),
                    heart = config.shapes.game.hearts.proto.clone({
                        x: x * config.tiles.width, y: y * config.tiles.height });

                cb(heart, x, y)
            }
        }

        function generateCounterPrototype() {
            config.shapes.game.snake.counters.proto = new Kinetic.Text({
                fontSize: config.font.size * 2,
                fontFamily: config.font.menu,
                fill: config.colors.counter
            });
        }

        function displaySegmentCounter() {
            if (typeof config.shapes.game.snake.counters.active == 'undefined')
                config.shapes.game.snake.counters.active = [];

            var snakes = config.shapes.game.snake.inPlay,
                activeCounters = config.shapes.game.snake.counters.active,
                xOffset = 0;

            if (snakes.length > 10) xOffset = config.tiles.width * 1.25;
            else if (snakes.length > 100) xOffset = config.tiles.width * 2.5;

            activeCounters.push(config.shapes.game.snake.counters.proto.clone({
                x: snakes[0].x() - xOffset, y: (snakes[0].y()) - config.tiles.height * 1.2, text: snakes.length + 1
            }));

            config.layers.foreground.add(activeCounters.last())
        }

        function createGameLoop() {
            var x = 0, y = 0, i = 0;
            config.animations.loops.game = new Kinetic.Animation(function(frame) {
                if (config.gameStarted) {
                    config.gameStarted = !config.gameStarted;
                    config.gameOver = false;
                    config.animations.loops.background.start();
                    regenerateHearts();
                    queueNewSnakeSegment();
                }

                if (!config.gameOver) {
                    if (frame.time - config.animations.lastMovementTime >=
                        (config.animations.period - ( config.shapes.game.snake.inPlay.length * 2 )) / 2 ){

                        if (config.animations.snakeIsMoving) {
                            config.animations.lastMovementTime = frame.time;

                            if (config.shapes.game.snake.queue) addSnakeSegment();

                            if (config.animations.queuedMovements.length > 0) {
                                config.animations.snakeCurrentDirection = config.animations.queuedMovements.shift();
                            } else config.animations.snakeCurrentDirection = config.animations.snakePreviousDirection;

                            if (config.animations.snakeCurrentDirection == 'up') config.snakeMove('up');
                            else if (config.animations.snakeCurrentDirection == 'right') config.snakeMove('right');
                            else if (config.animations.snakeCurrentDirection == 'down') config.snakeMove('down');
                            else if (config.animations.snakeCurrentDirection == 'left') config.snakeMove('left');

                            // Collision handling
                            config.shapes.game.snake.coords.forEach(function(snakeCoord) {
                                for (x = 0; x < config.shapes.game.hearts.coords.length; x++) {
                                    if (snakeCoord.x == config.shapes.game.hearts.coords[x].x &&
                                        snakeCoord.y == config.shapes.game.hearts.coords[x].y ){

                                        displaySegmentCounter();
                                        config.cyclingBackgroundColors = true;

                                        for ( y = 0; y < config.shapes.game.hearts.inPlay.length; y++ ) {
                                            if ( config.shapes.game.hearts.coords[x].id == config.shapes.game.hearts.inPlay[y].id() ){
                                                config.shapes.game.hearts.inPlay[y].destroy();
                                                config.shapes.game.hearts.inPlay.splice(y, 1);
                                            }
                                        }

                                        config.shapes.game.hearts.coords.splice(x, 1);

                                        queueNewSnakeSegment();
                                    }
                                }

                                // Collided with self
                                config.shapes.game.snake.coords.forEach(function(segment) {
                                    if (snakeCoord.x == segment.x && snakeCoord.y == segment.y &&
                                        snakeCoord.id != segment.id) {
                                        config.gameOver = true
                                    }
                                })
                            });

                            // Collied with boundary
                            if (config.shapes.game.snake.coords[0].x == 0 || config.shapes.game.snake.coords[0].y == 0 ||
                                config.shapes.game.snake.coords[0].x == config.tiles.horizontalAmount - 1 ||
                                config.shapes.game.snake.coords[0].y == config.tiles.verticalAmount - 1 ){

                                config.gameOver = true
                            }

                            config.shapes.game.hearts.existOnTheStage = false;

                            // Regenerate hearts if there are none on the stage
                            config.shapes.game.hearts.coords.forEach(function(heartCoord) {
                                if ( !(heartCoord.x == -1 && heartCoord.y == -1) ) config.shapes.game.hearts.existOnTheStage = true
                            });

                            if ( !config.shapes.game.hearts.existOnTheStage ) regenerateHearts();
                        }
                    }
                }

                if (config.shapes.game.snake.counters.active) {
                    config.shapes.game.snake.counters.active.forEach(function(counter) {
                        x = counter.opacity() - config.animations.transitionSpeed;

                        if (x <= 0) counter.destroy();
                        else counter.opacity(x);
                    })
                }

                if (config.gameOver) {
                    config.shapes.game.snake.inPlay.forEach(function(segment) {
                        i = segment.opacity() - config.animations.transitionSpeed;

                        if (i <= 0) { segment.destroy() }
                        else segment.opacity(i);
                    });

                    config.shapes.game.hearts.inPlay.forEach(function(heart) {
                        i = heart.opacity() - config.animations.transitionSpeed;

                        if (i <= 0) { y = 'done'; heart.destroy() }
                        else heart.opacity(i);
                    });

                    config.shapes.boundary.forEach(function(boundary) {
                        i = boundary.opacity() - config.animations.transitionSpeed;
                        if (i <= 0) {
                            i = 0;
                            boundary.opacity(i);
                            config.animations.loops.background.stop();
                            config.animations.transitioningToMenu = true
                        }
                        boundary.opacity(i)
                    });

                    if (config.animations.transitioningToMenu) {
                        if ( !( config.animations.loops.menu.isRunning() )) config.animations.loops.menu.start();
                        if ( config.animations.loops.game.isRunning() ) config.animations.loops.game.stop();

                        config.animations.snakeCurrentDirection = 'up';
                        config.animations.snakePreviousDirection = 'up';

                        config.shapes.game.snake.inPlay = [];
                        config.shapes.game.snake.coords = [];
                        config.shapes.game.hearts.inPlay = [];
                        config.shapes.game.hearts.coords = [];

                        config.gameOver = false;
                    }
                }

                config.animations.frameCount++

            }, config.layers.foreground);
        }

        function createMenuLoop() {
            var bounciness = null,
                brightnessOffset = null;

            config.animations.loops.menu = new Kinetic.Animation(function(frame) {
                bounciness = (Math.sin(frame.time * 2 * Math.PI / config.animations.period)) * config.animations.menuTitleBounciness;
                brightnessOffset = ((Math.sin(frame.time * 2 * Math.PI / config.animations.period) * config.animations.menuTextBrightnessVariance));

                config.shapes.menu.ceros.strokeWidth(config.font.strokeWidth + bounciness);
                config.shapes.menu.snake.strokeWidth(config.font.strokeWidth + bounciness);

                if (config.animations.mouseOver1Player) {
                    config.shapes.menu.number1.fill( 'hsl(' + config.colors.menuText.hue + ', ' +
                        config.colors.menuText.sat + '%, ' + (config.colors.menuText.lum + brightnessOffset) + '%)' );

                    config.shapes.menu.controller1.fill( 'hsl(' + config.colors.menuText.hue + ', ' +
                        config.colors.menuText.sat + '%, ' + (config.colors.menuText.lum + brightnessOffset) + '%)' );
                }

                if (config.animations.mouseOver2Player) {
                    config.shapes.menu.number2.fill( 'hsl(' + config.colors.menuText.hue + ', ' +
                        config.colors.menuText.sat + '%, ' + (config.colors.menuText.lum + brightnessOffset) + '%)' );

                    config.shapes.menu.controller2.fill( 'hsl(' + config.colors.menuText.hue + ', ' +
                        config.colors.menuText.sat + '%, ' + (config.colors.menuText.lum + brightnessOffset) + '%)' );
                }

                if (config.animations.mouseOverSettings) {
                    config.shapes.menu.settings.fill( 'hsl(' + config.colors.menuText.hue + ', ' +
                        config.colors.menuText.sat + '%, ' + (config.colors.menuText.lum + brightnessOffset) + '%)' );
                }

                if (config.animations.mouseOverHighScores) {
                    config.shapes.menu.highScores.fill( 'hsl(' + config.colors.menuText.hue + ', ' +
                        config.colors.menuText.sat + '%, ' + (config.colors.menuText.lum + brightnessOffset) + '%)' );
                }

                if ( config.animations.transitioningToMenu || config.animations.transitioningToNewGame ){
                    if ( config.animations.transitioningToMenu) config.shapes.menuShapesOpacity += config.animations.transitionSpeed;
                    if ( config.animations.transitioningToNewGame) config.shapes.menuShapesOpacity -= config.animations.transitionSpeed;

                    if ( config.shapes.menuShapesOpacity >= 1) {
                        config.shapes.menuShapesOpacity = 1;
                        config.animations.transitioningToMenu = false;
                    } else if ( config.shapes.menuShapesOpacity <= 0) {
                        config.shapes.menuShapesOpacity = 0;
                        config.animations.transitioningToNewGame = false;
                    }

                    config.shapes.menu.ceros.opacity(config.shapes.menuShapesOpacity);
                    config.shapes.menu.snake.opacity(config.shapes.menuShapesOpacity);
                    config.shapes.menu.number1.opacity(config.shapes.menuShapesOpacity);
                    config.shapes.menu.controller1.opacity(config.shapes.menuShapesOpacity);
                    config.shapes.menu.number2.opacity(config.shapes.menuShapesOpacity);
                    config.shapes.menu.controller2.opacity(config.shapes.menuShapesOpacity);
                    config.shapes.menu.settings.opacity(config.shapes.menuShapesOpacity);
                    config.shapes.menu.highScores.opacity(config.shapes.menuShapesOpacity);
                }

                if ( config.animations.transitioningToNewGame ){
                    if ( !(config.animations.loops.game.isRunning()) ) {
                        if (config.shapes.menu.ceros.opacity() - config.animations.transitionSpeed <= 0) {
                            config.animations.loops.game.start();
                            config.gameStarted = true;
                        }
                    }
                }

                if ( config.animations.transitioningToMenu ){
                    if ( !(config.animations.loops.game.isRunning()) ) {
                        config.animations.loops.menu.start();
                    }
                }

            }, config.layers.menu);
        }

        function createBackgroundLoop() {
            var i = null;
            config.animations.loops.background = new Kinetic.Animation(function() {
                if (config.cyclingBackgroundColors) {
                    config.shapes.tiles.forEach(function(tile) {
                        tile.fill(config.randomBgColor())
                    })
                }

                if (!config.gameOver && config.shapes.boundary[0].opacity() < 1) {
                    config.shapes.boundary.forEach(function(boundary) {
                        i = boundary.opacity() + config.animations.transitionSpeed;
                        if (i >= 1) {
                            i = 1;
                            boundary.opacity(i);
                        }
                        boundary.opacity(i)
                    });
                }
                config.cyclingBackgroundColors = false

            }, config.layers.bg);
        }

        function createLoadingLoop() {
            var wheelRadius = getRandomFloat(0, 2);

            config.animations.loops.loading = new Kinetic.Animation(function() {
                wheelRadius -= 0.01;
                if (wheelRadius <= 0) wheelRadius = 2;

                if (config.doneLoadingAssets) {
                    config.shapes.loadingShapesOpacity -= config.animations.transitionSpeed;

                    if (config.shapes.loadingShapesOpacity <= 0) {
                        config.animations.loops.loading.stop();
                        config.layers.loading.remove()
                    } else {
                        for (var shape in config.shapes.loading) {
                            if (config.shapes.loading.hasOwnProperty(shape)) {
                                config.shapes.loading[shape].opacity(config.shapes.loadingShapesOpacity);
                            }
                        }
                    }
                }

                config.shapes.loading.wheel.setDrawFunc(function(context) {
                    context.beginPath();
                    context.arc(config.absX(1.99), config.absY(1.99), config.absX(4.5), pi(wheelRadius), pi(wheelRadius*2), true);
                    context.stroke();
                    context.strokeShape(this);
                });

            }, config.layers.loading);
        }
    }

    function pi(x) {
        return x * Math.PI
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    Array.prototype.last = function() {
        return this[this.length - 1];
    };
});