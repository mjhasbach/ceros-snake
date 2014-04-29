var webFontLoader = document.createElement( 'script' );

webFontLoader.src = ( 'https:' == document.location.protocol ? 'https' : 'http' ) +
    '://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';
webFontLoader.type = 'text/javascript';
webFontLoader.async = 'true';

var scripts = document.getElementsByTagName( 'script' )[ 0 ];
scripts.parentNode.insertBefore( webFontLoader, scripts );

$( function() {
    function Config() {
        var self = this;

        this.window = { originalDimensions: {} };

        this.song = {
            bpm: 140,
            doneLoading: false,
            path: 'audio/soundtrack.mp3'
        };

        this.tiles = { size: window.innerWidth / 32 };
        this.tiles.verticalAmount = Math.round( window.innerHeight / this.tiles.size );
        this.tiles.horizontalAmount = Math.round( window.innerWidth / this.tiles.size );

        this.animations = {
            period: ( 60 / self.song.bpm ) * 1000,
            loops: {},
            transitionSpeed: 0.05,

            menu: {
                transitioningToGame: false,
                mouseOver1Player: false,
                mouseOverSettings: false,
                mouseOverVolume: false,
                mouseOverFullScreen: false,
                mouseOverHelp: false,
                mouseOverCredits: false,
                settingsIn: false,
                titleBounciness: 7,
                textBrightnessVariance: 8
            },

            game: {
                isOngoing: false,
                transitioningToGame: false,
                transitioningToMenu: false,
                fadingOutShapes: false,
                snakeIsMoving: true,
                speedIncrement: 2,
                snake: {
                    queuedMovements: [],
                    lastMovementTime: 0,
                    currentDirection: 'up',
                    previousDirection: 'up'
                }
            }
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
            settingShapesOpacity: 0,
            doneGenerating: false,
            loading: {},
            tiles: [],
            boundaries: [],
            menu: {},
            game: {
                counters: [],
                hearts: {
                    list: [], coords: [], maximumPossible: 10,
                    numberOfInner: 2, probability: 30, existOnTheStage: false
                },
                snake: {
                    segments: [], coords: [], queue: [],
                    counters: {}, numberOfInner: 2,
                    defaultStartCoords: {
                        x: 13,
                        y: 13
                    }
                }
            }
        };

        this.fonts = {
            loaded: false,
            face: { main: 'New Rocker', loading: 'Georgia' },
            size: { menu: self.absX( 11 ), settings: self.absX( 4 ), gamePad: self.absX( 9 )},
            strokeWidth: { menu: self.absX( 300 ), title: self.absX( 35 ) },
            preLoad: '\uf11b\uf013\uf028\uf0b2\uf059',
            optionRowY: self.absY( 1.24 ),
            optionRowGamePadY: self.absY( 1.295 ),
            counterShadowBlur: self.absX( 100 )
        };

        this.colors = {
            title: '#006370',
            menu: { enabledHSL: { h: 187, s: 100, l: 17 }, enabled: '#004d57', disabled: '#003238' },
            stroke: { enabled: '#007a8a', disabled: '#00606b' },
            counter: { face: '#0099ad', shadow: '#00292e' },
            background: { loading: '#00B4CC' },
            boundary: '#00606b',
            bgPalette: [ '#00B4CC', '#00DFFC', '#00A8C6', '#25b2cb', '#28bdd7' ],
            snake: { hue: 187, sat: 100, lum: 17 },
            heart: { hue: 187, sat: 100, lum: 17 }
        };

        this.doneLoadingAssets = false;
        this.cyclingBackgroundColors = false;
    }

    Config.prototype.absX = function( pos ){
        return window.innerWidth / pos
    };

    Config.prototype.absY = function( pos ){
        return ( 9 * window.innerWidth / 16 ) / pos
    };

    Config.prototype.randomBgColor = function() {
        return this.colors.bgPalette[ Math.round( Math.random() * ( this.colors.bgPalette.length - 1 ) )]
    };

    var config = new Config(),
        soundtrack = new buzz.sound(config.song.path);

    config.stage = new Kinetic.Stage({
        container: 'game',
        width: window.innerWidth,
        height: 9 * window.innerWidth / 16
    });

    config.window.originalDimensions.width = window.innerWidth;
    config.window.originalDimensions.height = 9 * window.innerWidth / 16;

    $( window ).resize( function() {
        var newStageScale = window.innerWidth / config.window.originalDimensions.width;
        var newTitleScale = config.window.originalDimensions.width / window.innerWidth;

        config.stage.size({ width: window.innerWidth, height: window.innerHeight });
        config.stage.scale({ x: newStageScale, y: newStageScale });

        config.fonts.strokeWidth.title = config.absX( 35 );

        config.shapes.menu.ceros.scale({ x: newTitleScale, y: newTitleScale });
        config.shapes.menu.snake.scale({ x: newTitleScale, y: newTitleScale });
    });

    $( "*" ).keyup( function( event ){
        event.preventDefault();
        event.stopPropagation();

        if ( config.animations.game.isOngoing ){
            // Space bar
            if ( event.which == 32){
                config.animations.game.snakeIsMoving = !config.animations.game.snakeIsMoving
            }

            if ( config.animations.game.snakeIsMoving ) {
                // Up Arrow or W Key
                if ( event.which == 38 || event.which == 87 ){
                    if ( config.animations.game.snake.queuedMovements.last() != 'up' &&
                        config.animations.game.snake.currentDirection != 'down' ){

                        config.animations.game.snake.queuedMovements.push('up')
                    }
                }

                // Right Arrow or D Key
                else if ( event.which == 39 || event.which == 68 ){
                    if ( config.animations.game.snake.queuedMovements.last() != 'right' &&
                        config.animations.game.snake.currentDirection != 'left' ){

                        config.animations.game.snake.queuedMovements.push( 'right' )
                    }
                }

                // Down Arrow or S Key
                else if ( event.which == 40 || event.which == 83 ){
                    if ( config.animations.game.snake.queuedMovements.last() != 'down' &&
                        config.animations.game.snake.currentDirection != 'up' ){

                        config.animations.game.snake.queuedMovements.push( 'down' )
                    }
                }

                // Left Arrow or A Key
                else if ( event.which == 37 || event.which == 65 ){
                    if ( config.animations.game.snake.queuedMovements.last() != 'left' &&
                        config.animations.game.snake.currentDirection != 'right' ){

                        config.animations.game.snake.queuedMovements.push('left')
                    }
                }
            }
        }
    });

    WebFontConfig = {
        google: {
            families: [ 'New Rocker' ]
        },

        custom: {
            families: [ 'FontAwesome' ],
            urls: [ 'http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css' ],
            testStrings: {
                'FontAwesome': config.fonts.preLoad
            }
        },

        active: function() { config.fonts.loaded = true }
    };

    soundtrack.bind("loadeddata", function() {
        config.song.doneLoading = true
    });

    generateLoadingShapes();
    startLoadingLoop();

    addLayersToStage();
    initializeRemainingShapes();

    waitUntilAssetsHaveLoaded( function() {
        console.log( 'Assets loaded!' );
        soundtrack.play().loop();
        config.doneLoadingAssets = true;
        config.animations.loops.background.start();
        config.animations.loops.menu.start();
    });

    function waitUntilAssetsHaveLoaded( cb ) {
        if ( !config.song.doneLoading || !config.fonts.loaded  ){
            setTimeout( waitUntilAssetsHaveLoaded, 200, cb );
        } else cb()
    }

    function addLayersToStage() {
        config.stage.add( config.layers.bg );
        config.stage.add( config.layers.foreground );
        config.stage.add( config.layers.menu );
        config.stage.add( config.layers.loading );
    }

    function initializeRemainingShapes() {
        generateBackgroundTiles();
        generateTitle();
        generateMenuOptions();
        generateSettings();

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
            fill: config.colors.background.loading
        });

        config.shapes.loading.text = new Kinetic.Text({
            x: config.absX( 3 ),
            y: config.absY( 2.35 ),
            text: 'Loading',
            fontSize: config.fonts.size.menu,
            fontFamily: config.fonts.face.loading,
            fill: config.colors.menu.enabled
        });

        config.shapes.loading.wheel = new Kinetic.Shape({
            sceneFunc: function( context ){
                context.beginPath();
                context.arc( config.absX(1.99), config.absY(1.99), config.absX(4.5), pi(0), pi(0), true );
                context.stroke();
                context.strokeShape( this );
            },
            stroke: config.colors.menu.enabled,
            strokeWidth: config.fonts.strokeWidth.title * 2
        });

        config.layers.loading.add( config.shapes.loading.bg );
        config.layers.loading.add( config.shapes.loading.text );
        config.layers.loading.add( config.shapes.loading.wheel );

        config.stage.add( config.layers.loading );
    }

    function generateBackgroundTiles() {
        var tile = null;

        for ( var x = 0; x < config.tiles.horizontalAmount; x++ ){
            for ( var y = 0; y < config.tiles.verticalAmount; y++ ){
                tile = new Kinetic.Rect({
                    x: x * config.tiles.size,
                    y: y * config.tiles.size,
                    width: config.tiles.size,
                    height: config.tiles.size,
                    fill: config.randomBgColor()
                });

                config.shapes.tiles.push( tile );
                config.layers.bg.add( tile );

                if ( x == 0 || x == config.tiles.horizontalAmount - 1 ||
                    y == 0 || y == config.tiles.verticalAmount - 1 ){

                    tile = new Kinetic.Path({
                        x: x * config.tiles.size - config.absX( 500 ),
                        y: y * config.tiles.size - config.absY( 75 ),
                        data: 'm 394.5,506.98718 c 0,13.60001 -11.02499,24.625 -24.625,24.625 -13.60001,0 -24.625,-11.02499 -24.625,-24.625 0,-13.60001 11.02499,-24.625 24.625,-24.625 13.60001,0 24.625,11.02499 24.625,24.625 z m -21.06694,-302.85264 -7.875,1.4375 -0.34375,2.875 -20.71875,5.71875 c 0,0 -12.67367,12.68118 -19.28125,18.1875 -6.42857,5.35715 -13.56697,5.72321 -19.28125,3.9375 -6.95274,-2.17273 -8.22768,-6.41518 -9.65625,-10.34375 -1.42857,-3.92857 -0.35075,-12.85825 -0.34375,-12.84375 l -7.21875,3.40625 0.40625,2.875 -18.53125,10.875 c 0,0 -8.98021,15.56489 -13.9375,22.59375 -4.82299,6.83845 -11.61201,9.02715 -17.59375,8.78125 -7.27818,-0.2992 -9.60332,-4.10628 -12,-7.53125 -2.38927,-3.41437 -3.64839,-12.22653 -3.65625,-12.28125 l -6.09375,5.15625 1.125,2.65625 -15.09375,15.3125 c 0,0 -4.62458,17.33385 -7.59375,25.40625 -2.88873,7.85371 -8.90843,11.72058 -14.75,13.03125 -7.10761,1.59473 -10.29854,-1.43703 -13.5,-4.125 -3.20147,-2.68794 -6.7633,-10.97775 -6.75,-10.96875 l -4.53125,6.59375 1.78125,2.25 -10.625,18.6875 c 0,0 0.0287,17.96544 -0.75,26.53125 -0.75762,8.33377 -5.54046,13.62834 -10.84375,16.40625 -6.45269,3.37998 -10.36818,1.26776 -14.15625,-0.5 -3.78806,-1.76778 -9.3299,-8.85175 -9.3125,-8.84375 l -2.6875,7.53125 2.3125,1.75 -5.40625,20.78125 c 0,0 4.66017,17.33701 6.125,25.8125 1.42514,8.24587 -1.84639,14.63163 -6.25,18.6875 -5.35801,4.93487 -9.664724,3.88336 -13.781254,3.15625 -4.11651,-0.7271 -11.3287,-6.126 -11.3125,-6.125 l -0.625,7.96875 2.65625,1.09375 0.15625,21.46875 c 0,0 9.01647,15.53619 12.625,23.34375 3.51078,7.59606 1.98508,14.59885 -1.21875,19.65625 -3.8982,6.15349 -8.33555,6.2619 -12.5,6.625 -4.16443,0.3631 -12.48955,-2.97075 -12.46875,-2.96875 l 1.4375,7.84375 2.84375,0.375 5.71875,20.71875 c 0,0 12.71242,12.67367 18.21875,19.28125 5.357154,6.42857 5.723204,13.56696 3.937504,19.28125 -2.172745,6.95273 -6.446444,8.22768 -10.375004,9.65625 -3.92857,1.42858 -12.85815,0.35075 -12.84375,0.34375 l 3.4375,7.21875 2.84375,-0.40625 10.90625,18.53125 c 0,0 15.533654,8.94896 22.562504,13.90625 6.83846,4.82299 9.02714,11.64326 8.78125,17.625 -0.2992,7.27819 -4.07503,9.60333 -7.5,12 -3.42496,2.39668 -12.3279,3.66745 -12.3125,3.65625 l 5.1875,6.0625 2.65625,-1.125 15.3125,15.09375 c 0,0 17.33384,4.62458 25.40625,7.59375 7.85371,2.88873 11.72058,8.90844 13.03125,14.75 1.59473,7.10762 -1.43705,10.32979 -4.125,13.53125 -2.68796,3.20146 -10.97775,6.73205 -10.96875,6.71875 l 6.59375,4.53125 2.28125,-1.78125 18.6875,10.625 c 0,0 17.93419,-0.0287 26.5,0.75 8.33377,0.75761 13.62833,5.54047 16.40625,10.84375 3.37997,6.45269 1.26777,10.36818 -0.5,14.15625 -1.76776,3.78807 -8.82138,9.35853 -8.8125,9.34375 l 7.5,2.65625 1.75,-2.28125 20.8125,5.40625 c 0,0 17.30576,-4.66018 25.78125,-6.125 8.24588,-1.42514 14.63165,1.81514 18.6875,6.21875 4.93489,5.35801 3.88337,9.69597 3.15625,13.8125 -0.7271,4.11653 -6.09475,11.29725 -6.09375,11.28125 l 7.9375,0.65625 1.09375,-2.6875 21.5,-0.15625 c 0,0 15.53618,-8.98522 23.34375,-12.59375 7.59607,-3.51077 14.56761,-2.01632 19.625,1.1875 6.15348,3.89821 6.26189,8.33556 6.625,12.5 0.36309,4.16445 -2.96675,12.5191 -2.96875,12.5 l 7.84375,-1.4375 0.375,-2.875 20.71875,-5.71875 c 0,0 12.67368,-12.71244 19.28125,-18.21875 6.42857,-5.35715 13.56696,-5.69195 19.28125,-3.90625 6.95273,2.17274 8.19643,6.41518 9.625,10.34375 1.42857,3.92856 0.382,12.85825 0.375,12.84375 l 7.1875,-3.4375 -0.375,-2.84375 18.53125,-10.875 c 0,0 8.94897,-15.56489 13.90625,-22.59375 4.82299,-6.83845 11.64325,-9.02715 17.625,-8.78125 7.27818,0.29919 9.57207,4.07503 11.96875,7.5 2.39667,3.42496 3.6965,12.3314 3.6875,12.3125 l 6.0625,-5.1875 -1.09375,-2.65625 15.0625,-15.28125 c 0,0 4.62459,-17.36509 7.59375,-25.4375 2.88873,-7.85371 8.90843,-11.72058 14.75,-13.03125 7.10762,-1.59473 10.3298,1.4683 13.53125,4.15625 3.20147,2.68796 6.73225,10.9465 6.71875,10.9375 l 4.53125,-6.59375 -1.78125,-2.25 10.625,-18.6875 c 0,0 -0.0287,-17.96544 0.75,-26.53125 0.7576,-8.33377 5.57171,-13.62833 10.875,-16.40625 6.45269,-3.37997 10.33693,-1.26777 14.125,0.5 3.78806,1.76776 9.36115,8.85175 9.34375,8.84375 l 2.65625,-7.53125 -2.28125,-1.75 5.40625,-20.78125 c 0,0 -4.69143,-17.337 -6.15625,-25.8125 -1.42514,-8.24588 1.84639,-14.60039 6.25,-18.65625 5.358,-4.93488 9.69597,-3.9146 13.8125,-3.1875 4.11653,0.72711 11.29735,6.126 11.28125,6.125 l 0.625,-7.96875 -2.65625,-1.09375 -0.15625,-21.46875 c 0,0 -8.98523,-15.53618 -12.59375,-23.34375 -3.51078,-7.59605 -2.01632,-14.59886 1.1875,-19.65625 3.89821,-6.15349 8.33555,-6.2619 12.5,-6.625 4.16445,-0.36311 12.5129,2.96175 12.5,2.96875 l -1.4375,-7.84375 -2.875,-0.34375 -5.6875,-20.71875 c 0,0 -12.71243,-12.67367 -18.21875,-19.28125 -5.35715,-6.42857 -5.72321,-13.56697 -3.9375,-19.28125 2.17273,-6.95274 6.41517,-8.22769 10.34375,-9.65625 3.92856,-1.42858 12.85825,-0.35075 12.84375,-0.34375 l -3.40625,-7.21875 -2.875,0.40625 -10.875,-18.53125 c 0,0 -15.53364,-8.94896 -22.5625,-13.90625 -6.83845,-4.823 -9.0584,-11.64326 -8.8125,-17.625 0.2992,-7.27818 4.10629,-9.60332 7.53125,-12 3.42497,-2.39667 12.3281,-3.66735 12.3125,-3.65625 l -5.1875,-6.09375 -2.65625,1.125 -15.3125,-15.0625 c 0,0 -17.33385,-4.62458 -25.40625,-7.59375 -7.85371,-2.88873 -11.75182,-8.90843 -13.0625,-14.75 -1.59472,-7.10761 1.46829,-10.32979 4.15625,-13.53125 2.68794,-3.20146 10.9465,-6.73225 10.9375,-6.71875 l -6.5625,-4.53125 -2.28125,1.75 -18.6875,-10.59375 c 0,0 -17.93419,0.0287 -26.5,-0.75 -8.33377,-0.75761 -13.65958,-5.57171 -16.4375,-10.875 -3.37998,-6.45269 -1.23652,-10.33693 0.53125,-14.125 1.76776,-3.78806 8.8244,-9.36085 8.8125,-9.34375 l -7.53125,-2.65625 -1.75,2.28125 -20.78125,-5.40625 c 0,0 -17.33701,4.66017 -25.8125,6.125 -8.24588,1.42514 -14.60039,-1.81514 -18.65625,-6.21875 -4.93488,-5.35801 -3.91461,-9.69598 -3.1875,-13.8125 0.7271,-4.11653 6.126,-11.29735 6.125,-11.28125 l -7.96875,-0.65625 -1.0625,2.6875 -21.5,0.15625 c 0,0 -15.53618,8.98523 -23.34375,12.59375 -7.59606,3.51078 -14.59886,2.01632 -19.65625,-1.1875 -6.15349,-3.89821 -6.2619,-8.33555 -6.625,-12.5 -0.3631,-4.16444 2.998,-12.5189 3,-12.5 z',
                        fill: config.colors.boundary,
                        scale: { x: config.absX( 21250 ), y: config.absX( 21250 ) },
                        opacity: 0
                    });

                    config.shapes.boundaries.push( tile );
                    config.layers.foreground.add( tile );
                }
            }
        }
    }

    function generateTitle() {
        var absX = config.absX, absY = config.absY;

        config.shapes.menu.ceros = new Kinetic.Shape({
            sceneFunc: function( context ){
                context.beginPath();
                context.arc( absX(8.7), absY(5), absX(11.5), pi(1.85), pi(0.2), true );
                context.lineTo( absX(4.0185), absY(8) );
                context.moveTo( absX(4), absY(3.35) );
                context.arc( absX(3.07), absY(5), absX(11.5), pi(1.75), pi(0.0), true );
                context.moveTo( absX(2.42), absY(2.65) );
                context.arc( absX(2), absY(5), absX(11.5), pi(1), pi(1.9) );
                context.arc( absX(1.486), absY(5), absX(11.5), pi(3), pi(1), true );
                context.arc( absX(1.486), absY(5), absX(11.5), pi(3), pi(2.2), true );
                context.arc( absX(1.13), absY(5), absX(11.5), pi(1.2), pi(0.81) );
                context.stroke();
                context.strokeShape(this);
            },
            stroke: config.colors.title,
            strokeWidth: config.fonts.strokeWidth.title
        });

        config.layers.menu.add( config.shapes.menu.ceros );

        config.shapes.menu.snake = new Kinetic.Shape({
            sceneFunc: function( context ){
                context.beginPath();
                context.arc( absX(8.7), absY(1.72), absX(11.5), pi(1.15), pi(0.81) );
                context.arc( absX(8.7), absY(1.72), absX(11.5), pi(0.81), pi(0.2), true );
                context.arc( absX(3.07), absY(1.72), absX(11.5), pi(1.2), pi(2) );
                context.arc( absX(3.07), absY(1.72), absX(11.5), pi(0), pi(1), true );
                context.lineTo( absX(4.19), absY(1.318) );
                context.moveTo( absX(2.423), absY(1.318) );
                context.lineTo( absX(2.423), absY(1.318) );
                context.lineTo( absX(2.423), absY(1.72) );
                context.arc( absX(1.99), absY(1.72), absX(11.5), pi(1), pi(2) );
                context.lineTo( absX(1.695), absY(1.318) );
                context.lineTo( absX(1.695), absY(2.47) );
                context.moveTo( absX(1.695), absY(1.71) );
                context.lineTo( absX(2.413), absY(1.71) );
                context.lineTo( absX(1.695), absY(1.71) );
                context.quadraticCurveTo( absX(1.308), absY(1.71), absX(1.308), absY(2.45) );
                context.moveTo( absX(1.695), absY(1.71) );
                context.quadraticCurveTo( absX(1.39), absY(1.71), absX(1.287), absY(1.3825) );
                context.arc( absX(1.12), absY(1.72), absX(11.5), pi(1.75), pi(0), true );
                context.stroke();
                context.strokeShape(this);
            },
            stroke: config.colors.title,
            strokeWidth: config.fonts.strokeWidth.title
        });

        config.layers.menu.add( config.shapes.menu.snake );
    }

    function generateSettings() {
        var absX = config.absX,
            absY = config.absY;

        config.shapes.menu.volumeHitbox = new Kinetic.Rect({
            x: absX( 32 ),
            y: absY( 4.67 ),
            width: absX( 4.31 ),
            height: absY( 2.845 ),
            opacity: 0
        });

        config.shapes.menu.volume = new Kinetic.Text({
            x: absX( 32 ),
            y: absY( 5.9 ),
            text: '\uf028',
            fontSize: config.fonts.size.settings,
            fontFamily: 'FontAwesome',
            fill: config.colors.menu.enabled,
            opacity: 0
        });

        config.shapes.menu.fullscreenHitbox = new Kinetic.Rect({
            x: absX( 3.31 ),
            y: absY( 4.67 ),
            width: absX( 5.07 ),
            height: absY( 2.85 ),
            opacity: 0
        });

        config.shapes.menu.fullscreen = new Kinetic.Text({
            x: absX( 3.31 ),
            y: absY( 5.36 ),
            text: '\uf0b2',
            fontSize: config.fonts.size.settings * 0.922,
            fontFamily: 'FontAwesome',
            fill: config.colors.menu.enabled,
            opacity: 0
        });

        config.shapes.menu.helpHitbox = new Kinetic.Rect({
            x: absX( 1.86 ),
            y: absY( 4.67 ),
            width: absX( 5.07 ),
            height: absY( 2.85 ),
            opacity: 0
        });

        config.shapes.menu.help = new Kinetic.Text({
            x: absX( 1.86 ),
            y: absY( 5.35 ),
            text: '\uf059',
            fontSize: config.fonts.size.settings * 0.922,
            fontFamily: 'FontAwesome',
            fill: config.colors.menu.disabled,
            opacity: 0
        });

        config.shapes.menu.creditsHitbox = new Kinetic.Rect({
            x: absX( 1.297 ),
            y: absY( 4.68 ),
            width: absX( 5.017 ),
            height: absY( 2.849 ),
            opacity: 0
        });

        config.shapes.menu.credits = new Kinetic.Text({
            x: absX( 1.32 ),
            y: absY( 6.1 ),
            text: '\u00A9',
            fontSize: config.fonts.size.settings * 1.089,
            fontFamily: config.fonts.face.main,
            fill: config.colors.menu.disabled,
            opacity: 0
        });


        config.shapes.menu.volumeHitbox.on( 'mouseover', function() {
            if ( config.shapes.menu.volume.opacity() > 0 ) config.animations.menu.mouseovervolume = true
        });

        config.shapes.menu.volumeHitbox.on( 'mouseout', function() {
            if ( config.shapes.menu.volume.opacity() > 0 ){
                config.shapes.menu.volume.fill( config.colors.menu.enabled );
                config.animations.menu.mouseovervolume = false
            }
        });

        config.shapes.menu.volumeHitbox.on( 'mouseup', function() {
            if ( config.shapes.menu.volume.opacity() > 0 ){
                buzz.sounds[ 0 ].toggleMute();
                config.animations.menu.settingsIn = false
            }
        });

        config.shapes.menu.fullscreenHitbox.on( 'mouseover', function() {
            if ( config.shapes.menu.fullscreen.opacity() > 0 ) config.animations.menu.mouseOverFullScreen = true
        });

        config.shapes.menu.fullscreenHitbox.on( 'mouseout', function() {
            if ( config.shapes.menu.fullscreen.opacity() > 0 ){
                config.shapes.menu.fullscreen.fill( config.colors.menu.enabled );
                config.animations.menu.mouseOverFullScreen = false
            }
        });

        config.shapes.menu.fullscreenHitbox.on( 'mouseup', function() {
            if ( config.shapes.menu.fullscreen.opacity() > 0 ){
                if (screenfull.enabled) screenfull.request();
                config.animations.menu.settingsIn = false
            }
        });


        config.layers.menu.add( config.shapes.menu.volume );
        config.layers.menu.add( config.shapes.menu.volumeHitbox );
        config.shapes.menu.volumeHitbox.cache();

        config.layers.menu.add( config.shapes.menu.fullscreen );
        config.layers.menu.add( config.shapes.menu.fullscreenHitbox );
        config.shapes.menu.fullscreenHitbox.cache();

        config.layers.menu.add( config.shapes.menu.help );
        config.layers.menu.add( config.shapes.menu.helpHitbox );
        config.shapes.menu.helpHitbox.cache();

        config.layers.menu.add( config.shapes.menu.credits );
        config.layers.menu.add( config.shapes.menu.creditsHitbox );
        config.shapes.menu.creditsHitbox.cache();
    }

    function generateMenuOptions() {
        var absX = config.absX,
            absY = config.absY;

        config.shapes.menu.onePlayerHitbox = new Kinetic.Rect({
            x: absX( 50 ),
            y: absY( 1.21 ),
            width: absX( 6.5 ),
            height: absY( 8.9 ),
            opacity: 0
        });

        config.shapes.menu.number1 = new Kinetic.Text({
            x: absX( 50 ),
            y: config.fonts.optionRowY,
            text: '1',
            fontSize: config.fonts.size.menu,
            fontFamily: config.fonts.face.main,
            fill: config.colors.menu.enabled,
            stroke: config.colors.stroke.enabled,
            strokeWidth: config.fonts.strokeWidth.menu
        });

        config.shapes.menu.controller1 = new Kinetic.Text({
            x: absX( 18 ),
            y: config.fonts.optionRowGamePadY,
            text: '\uf11b',
            fontSize: config.fonts.size.gamePad,
            fontFamily: 'FontAwesome',
            fill: config.colors.menu.enabled,
            stroke: config.colors.stroke.enabled,
            strokeWidth: config.fonts.strokeWidth.menu
        });

        config.shapes.menu.number2 = new Kinetic.Text({
            x: absX( 5 ),
            y: config.fonts.optionRowY,
            text: '2',
            fontSize: config.fonts.size.menu,
            fontFamily: config.fonts.face.main,
            fill: config.colors.menu.disabled,
            stroke: config.colors.stroke.disabled,
            strokeWidth: config.fonts.strokeWidth.menu
        });

        config.shapes.menu.controller2 = new Kinetic.Text({
            x: absX( 3.99 ),
            y: config.fonts.optionRowGamePadY,
            text: '\uf11b',
            fontSize: config.fonts.size.gamePad,
            fontFamily: 'FontAwesome',
            fill: config.colors.menu.disabled,
            stroke: config.colors.stroke.disabled,
            strokeWidth: config.fonts.strokeWidth.menu
        });

        config.shapes.menu.settingsHitbox = new Kinetic.Rect({
            x: absX( 2.51 ),
            y: config.fonts.optionRowY + absY( 105 ),
            width: absX( 12.85 ),
            height: absY( 7.17 ),
            opacity: 0
        });

        config.shapes.menu.settings = new Kinetic.Text({
            x: absX( 2.51 ),
            y: config.fonts.optionRowY,
            text: '\uf013',
            fontSize: config.fonts.size.menu,
            fontFamily: 'FontAwesome',
            fill: config.colors.menu.enabled,
            stroke: config.colors.stroke.enabled,
            strokeWidth: config.fonts.strokeWidth.menu
        });

        config.shapes.menu.highScores = new Kinetic.Text({
            x: absX( 1.97 ),
            y: config.fonts.optionRowY,
            text: 'High Scores',
            fontSize: config.fonts.size.menu,
            fontFamily: config.fonts.face.main,
            fill: config.colors.menu.disabled,
            stroke: config.colors.stroke.disabled,
            strokeWidth: config.fonts.strokeWidth.menu
        });


        config.shapes.menu.onePlayerHitbox.on( 'mouseover', function() {
            config.animations.menu.mouseOver1Player = true
        });

        config.shapes.menu.onePlayerHitbox.on( 'mouseout', function() {
            config.shapes.menu.controller1.fill( config.colors.menu.enabled );
            config.shapes.menu.number1.fill( config.colors.menu.enabled );
            config.animations.menu.mouseOver1Player = false
        });

        config.shapes.menu.onePlayerHitbox.on( 'mouseup', function() {
            config.animations.menu.transitioningToGame = true;
        });

        config.shapes.menu.settingsHitbox.on( 'mouseover', function() {
            config.animations.menu.mouseOverSettings = true
        });

        config.shapes.menu.settingsHitbox.on( 'mouseout', function() {
            config.shapes.menu.settings.fill( config.colors.menu.enabled );
            config.animations.menu.mouseOverSettings = false
        });

        config.shapes.menu.settingsHitbox.on( 'mouseup', function() {
            config.animations.menu.settingsIn = !config.animations.menu.settingsIn
        });


        config.layers.menu.add( config.shapes.menu.number1 );
        config.layers.menu.add( config.shapes.menu.controller1 );
        config.layers.menu.add( config.shapes.menu.onePlayerHitbox );
        config.shapes.menu.onePlayerHitbox.cache();

        config.layers.menu.add( config.shapes.menu.number2 );
        config.layers.menu.add( config.shapes.menu.controller2 );

        config.layers.menu.add( config.shapes.menu.settings );
        config.layers.menu.add( config.shapes.menu.settingsHitbox );
        config.shapes.menu.settingsHitbox.cache();

        config.layers.menu.add( config.shapes.menu.highScores );
    }

    function generateSnakePrototype() {
        var color = config.colors.snake,
            segment = new Kinetic.Group();

        for ( var i = 0; i < config.shapes.game.snake.numberOfInner + 1; i++ ){
            var rect = new Kinetic.Rect({
                x: config.tiles.size + i * (( config.tiles.size * 0.33 ) / 2),
                y: config.tiles.size + i * (( config.tiles.size * 0.33 ) / 2),
                width: config.tiles.size - i * ( config.tiles.size * 0.33 ),
                height: config.tiles.size - i * ( config.tiles.size * 0.33 ),
                fill: 'hsl(' +
                    color.hue + ', ' +
                    color.sat + '%, ' +
                    color.lum + '%)'
            });

            color.lum += 10;

            segment.add( rect );
        }

        config.shapes.game.snake.proto = segment
    }

    function queueNewSnakeSegment() {
        if ( config.shapes.game.snake.segments.length == 0 ){
            config.shapes.game.snake.queue.push({
                x: config.shapes.game.snake.defaultStartCoords.x * config.tiles.size,
                y: config.shapes.game.snake.defaultStartCoords.y * config.tiles.size
            })
        } else {
            config.shapes.game.snake.queue.push({
                x: config.shapes.game.snake.segments.last().x(),
                y: config.shapes.game.snake.segments.last().y()
            })
        }
    }

    function addSnakeSegment() {
        var queuedSegment = config.shapes.game.snake.queue[ 0 ],
            segment = config.shapes.game.snake.proto.clone({ x: queuedSegment.x, y: queuedSegment.y });

        segment.id( config.shapes.game.snake.segments.length );
        config.shapes.game.snake.segments.push( segment );
        config.shapes.game.snake.coords.push({
            id: segment.id(), x: queuedSegment.x / config.tiles.size, y: queuedSegment.y / config.tiles.size });

        config.shapes.game.snake.queue.shift();
        config.layers.foreground.add( segment );
    }

    function snakeMove( direction ){
        var firstSegment = config.shapes.game.snake.segments[ 0 ],
            lastSegment = config.shapes.game.snake.segments.pop(),
            lastSegmentCoords = config.shapes.game.snake.coords.pop();

        if ( direction == 'up' ){
            lastSegment.x( firstSegment.x() );
            lastSegment.y( firstSegment.y() - config.tiles.size );
        } else if ( direction == 'right' ){
            lastSegment.x( firstSegment.x() + config.tiles.size );
            lastSegment.y( firstSegment.y() )
        } else if ( direction == 'down' ){
            lastSegment.x( firstSegment.x() );
            lastSegment.y( firstSegment.y() + config.tiles.size )
        } else {
            lastSegment.x( firstSegment.x() - config.tiles.size );
            lastSegment.y( firstSegment.y() );
        }

        lastSegmentCoords.x = Math.round( lastSegment.x() / config.tiles.size ) + 1;
        lastSegmentCoords.y = Math.round( lastSegment.y() / config.tiles.size ) + 1;

        config.animations.game.snake.previousDirection = direction;
        config.shapes.game.snake.segments.unshift( lastSegment );
        config.shapes.game.snake.coords.unshift( lastSegmentCoords );
    }

    function generateHeartPrototype() {
        var color = config.colors.heart,
            heart = new Kinetic.Group();

        for ( var i = 0; i < config.shapes.game.hearts.numberOfInner + 1; i++ ){
            var innerHeart = new Kinetic.Text({
                x: config.tiles.size + i * (( config.tiles.size * 0.33 ) / 2),
                y: config.tiles.size + i * (( config.tiles.size * 0.33 ) / 2),
                text: '\uf004',
                fontSize: config.tiles.size - i * ( config.tiles.size * 0.33 ),
                fontFamily: 'FontAwesome',
                fill: 'hsl(' +
                    color.hue + ', ' +
                    color.sat + '%, ' +
                    color.lum + '%)'
            });

            color.lum += 10;

            heart.add( innerHeart );
        }

        config.shapes.game.hearts.proto = heart;
    }

    function regenerateHearts() {
        var coords = config.shapes.game.hearts.coords,
            snakes = config.shapes.game.snake.coords,
            collision = false;

        generateHeart( function( heart, x, y ){
            snakes.forEach( function( snake ){
                if ( heart.x == snake.x && heart.y == snake.y ){
                    collision = true
                }
            });

            coords.forEach( function( otherHeart ){
                if ( heart.x == otherHeart.x && heart.y == otherHeart.y ){
                    collision = true
                }
            });

            if ( collision ) regenerateHearts();
            else {
                config.shapes.game.hearts.existOnTheStage = true;
                heart.id( config.shapes.game.hearts.list.length );
                coords.push({ id: heart.id(), x: x + 1, y: y + 1});
                config.shapes.game.hearts.list.push( heart );
                config.layers.foreground.add( heart );
                heart.moveToBottom();

                for ( var i = 0; i < config.shapes.game.hearts.maximumPossible - 1; i++ ){
                    if ( getRandomFloat(0, 100) < config.shapes.game.hearts.probability ){
                        generateHeart( function( heart, x, y ){
                            snakes.forEach( function( snake ){
                                if ( heart.x == snake.x && heart.y == snake.y ) collision = true
                            });

                            coords.forEach( function( otherHeart ){
                                if ( heart.x == otherHeart.x && heart.y == otherHeart.y ) collision = true
                            });

                            if ( !collision ){
                                heart.id( config.shapes.game.hearts.list.length );
                                coords.push({ id: heart.id(), x: x + 1, y: y + 1});
                                config.shapes.game.hearts.list.push( heart );
                                config.layers.foreground.add( heart );
                                heart.moveToBottom();
                            } else collision = false
                        });
                    }
                }
            }
        });

        function generateHeart( cb ){
            var x = getRandomInt( 2, config.tiles.horizontalAmount - 4 ),
                y = getRandomInt( 2, config.tiles.verticalAmount - 4 ),
                heartIntersectsSegment = false;

            config.shapes.game.snake.coords.forEach( function( coord ) {
                if ( coord.x == x + 1 && coord.y == y + 1 ) heartIntersectsSegment = true
            });

            if ( heartIntersectsSegment ) generateHeart( cb );
            else {
                var heart = config.shapes.game.hearts.proto.clone({
                    x: x * config.tiles.size, y: y * config.tiles.size });

                cb( heart, x, y )
            }
        }
    }

    function generateCounterPrototype() {
        config.shapes.game.snake.counters.proto = new Kinetic.Text({
            fontSize: config.fonts.size.menu * 2,
            fontFamily: config.fonts.face.main,
            fill: config.colors.counter.face,
            shadowColor: config.colors.counter.shadow,
            shadowBlur: config.fonts.counterShadowBlur
        });
    }

    function displaySegmentCounter() {
        var snakes = config.shapes.game.snake.segments,
            activeCounters = config.shapes.game.counters,
            xOffset = 0;

        if ( snakes.length > 10 ) xOffset = config.tiles.size * 1.25;
        else if ( snakes.length > 100 ) xOffset = config.tiles.size * 2.5;

        activeCounters.push( config.shapes.game.snake.counters.proto.clone({
            x: snakes[ 0 ].x() - xOffset, y: snakes[ 0 ].y() - config.tiles.size * 1.2, text: snakes.length + 1
        }));

        config.layers.foreground.add( activeCounters.last() );
    }

    function createGameLoop() {
        var x = 0, y = 0, i = 0;

        config.animations.loops.game = new Kinetic.Animation( function( frame ){
            if ( !config.animations.game.isOngoing ){
                if ( config.animations.game.transitioningToGame ){
                    if ( config.shapes.game.snake.segments.length == 0 ){
                        regenerateHearts();

                        queueNewSnakeSegment();
                        addSnakeSegment();
                    }

                    i = config.shapes.boundaries[ 0 ].opacity() + config.animations.transitionSpeed;

                    if ( i >= 1 ) {
                        i = 1;
                        config.animations.game.transitioningToGame = false;
                        config.animations.game.isOngoing = true
                    }

                    config.shapes.boundaries.forEach( function( boundary ){ boundary.opacity( i ) });
                    config.shapes.game.hearts.list.forEach( function( heart ){ heart.opacity( i ) });
                    config.shapes.game.snake.segments[ 0 ].opacity( i )

                } else if ( config.animations.game.fadingOutShapes ){
                    i = config.shapes.game.snake.segments[ 0 ].opacity() - config.animations.transitionSpeed;

                    config.shapes.game.snake.segments.forEach( function( segment ){
                        if ( i <= 0 ) segment.destroy();
                        else segment.opacity( i );
                    });

                    config.shapes.game.hearts.list.forEach( function( heart ){
                        if ( i <= 0 ) heart.destroy();
                        else heart.opacity( i );
                    });

                    config.shapes.boundaries.forEach( function( boundary ){
                        if ( i <= 0 ){
                            i = 0;
                            boundary.opacity( i );

                            config.animations.loops.background.stop();
                            config.animations.loops.game.stop();
                            config.animations.loops.menu.start();

                            config.animations.game.snake.currentDirection = 'up';
                            config.animations.game.snake.previousDirection = 'up';

                            config.shapes.game.snake.segments = [];
                            config.shapes.game.snake.coords = [];
                            config.shapes.game.hearts.list = [];
                            config.shapes.game.hearts.coords = [];

                            config.animations.game.transitioningToMenu = true
                        }
                        else boundary.opacity( i )
                    });
                }
            } else {
                if ( frame.time - config.animations.game.snake.lastMovementTime >= ( config.animations.period -
                    ( config.shapes.game.snake.segments.length * config.animations.game.speedIncrement )) / 2 &&
                    config.animations.game.snakeIsMoving ){

                    config.animations.game.snake.lastMovementTime = frame.time;

                    if ( config.shapes.game.snake.queue.length > 0 ) addSnakeSegment();

                    if ( config.animations.game.snake.queuedMovements.length > 0 ){
                        config.animations.game.snake.currentDirection = config.animations.game.snake.queuedMovements.shift();
                    } else config.animations.game.snake.currentDirection = config.animations.game.snake.previousDirection;

                    if ( config.animations.game.snake.currentDirection == 'up' ) snakeMove( 'up' );
                    else if ( config.animations.game.snake.currentDirection == 'right' ) snakeMove( 'right' );
                    else if ( config.animations.game.snake.currentDirection == 'down' ) snakeMove( 'down' );
                    else if ( config.animations.game.snake.currentDirection == 'left' ) snakeMove( 'left' );

                    // Collision handling
                    config.shapes.game.snake.coords.forEach( function( snakeCoord ){
                        for ( x = 0; x < config.shapes.game.hearts.coords.length; x++ ){
                            // Colided with heart
                            if ( snakeCoord.x == config.shapes.game.hearts.coords[ x ].x &&
                                snakeCoord.y == config.shapes.game.hearts.coords[ x ].y ){

                                displaySegmentCounter();
                                config.cyclingBackgroundColors = true;

                                for ( y = 0; y < config.shapes.game.hearts.list.length; y++ ){
                                    if ( config.shapes.game.hearts.coords[ x ].id == config.shapes.game.hearts.list[ y ].id() ){
                                        config.shapes.game.hearts.list[ y ].destroy();
                                        config.shapes.game.hearts.list.splice( y, 1 );
                                    }
                                }

                                config.shapes.game.hearts.coords.splice( x, 1 );
                                queueNewSnakeSegment();
                            }
                        }

                        // Collided with self
                        config.shapes.game.snake.coords.forEach( function( segment ){
                            if ( snakeCoord.x == segment.x && snakeCoord.y == segment.y && snakeCoord.id != segment.id ){
                                collision()
                            }
                        })
                    });

                    // Collided with boundary
                    if ( config.shapes.game.snake.coords[ 0 ].x == 0 || config.shapes.game.snake.coords[ 0 ].y == 0 ||
                        config.shapes.game.snake.coords[ 0 ].x == config.tiles.horizontalAmount - 1 ||
                        config.shapes.game.snake.coords[ 0 ].y == config.tiles.verticalAmount - 1 ){

                        collision()
                    }

                    config.shapes.game.hearts.existOnTheStage = false;

                    // Regenerate hearts if there are none on the stage
                    config.shapes.game.hearts.coords.forEach( function( heartCoord ){
                        if ( !( heartCoord.x == -1 && heartCoord.y == -1 )) config.shapes.game.hearts.existOnTheStage = true
                    });

                    if ( !config.shapes.game.hearts.existOnTheStage ) regenerateHearts();

                    config.shapes.game.counters.forEach( function( counter ){
                        counter.moveToTop();
                    })
                }
            }

            if ( config.shapes.game.counters ){
                config.shapes.game.counters.forEach( function( counter ){
                    x = counter.opacity() - config.animations.transitionSpeed;

                    if ( x <= 0 ) counter.destroy();
                    else counter.opacity( x );
                })
            }
        }, config.layers.foreground );

        function collision() {
            config.animations.game.isOngoing = false;
            config.animations.game.fadingOutShapes = true
        }
    }

    function createMenuLoop() {
        var bounciness = null,
            brightnessOffset = null;

        config.animations.loops.menu = new Kinetic.Animation( function( frame ){
            bounciness = ( Math.sin( frame.time * 2 * Math.PI / config.animations.period )) * config.animations.menu.titleBounciness;
            brightnessOffset = Math.abs((( Math.cos( frame.time * Math.PI / config.animations.period ) * config.animations.menu.textBrightnessVariance )));

            config.shapes.menu.ceros.strokeWidth( config.fonts.strokeWidth.title + bounciness );
            config.shapes.menu.snake.strokeWidth( config.fonts.strokeWidth.title + bounciness );

            if ( config.animations.menu.mouseOver1Player ){
                config.shapes.menu.number1.fill( 'hsl(' + config.colors.menu.enabledHSL.h + ', ' +
                    config.colors.menu.enabledHSL.s + '%, ' + ( config.colors.menu.enabledHSL.l - brightnessOffset ) + '%)' );

                config.shapes.menu.controller1.fill( 'hsl(' + config.colors.menu.enabledHSL.h + ', ' +
                    config.colors.menu.enabledHSL.s + '%, ' + ( config.colors.menu.enabledHSL.l - brightnessOffset ) + '%)' )}

            if ( config.animations.menu.mouseOverSettings ){
                config.shapes.menu.settings.fill( 'hsl(' + config.colors.menu.enabledHSL.h + ', ' +
                    config.colors.menu.enabledHSL.s + '%, ' + ( config.colors.menu.enabledHSL.l - brightnessOffset ) + '%)' )}

            if ( config.animations.menu.mouseovervolume ){
                config.shapes.menu.volume.fill( 'hsl(' + config.colors.menu.enabledHSL.h + ', ' +
                    config.colors.menu.enabledHSL.s + '%, ' + ( config.colors.menu.enabledHSL.l - brightnessOffset ) + '%)' )}

            if ( config.animations.menu.mouseOverFullScreen ){
                config.shapes.menu.fullscreen.fill( 'hsl(' + config.colors.menu.enabledHSL.h + ', ' +
                    config.colors.menu.enabledHSL.s + '%, ' + ( config.colors.menu.enabledHSL.l - brightnessOffset ) + '%)' )}

            if ( config.animations.menu.settingsIn && config.shapes.menu.volume.opacity() < 1 ){
                config.shapes.settingShapesOpacity += config.animations.transitionSpeed;
                config.shapes.settingShapesOpacity = config.shapes.settingShapesOpacity > 1 ?
                    1 : config.shapes.settingShapesOpacity;

                config.shapes.menu.volume.opacity( config.shapes.settingShapesOpacity );
                config.shapes.menu.fullscreen.opacity( config.shapes.settingShapesOpacity );
                config.shapes.menu.help.opacity( config.shapes.settingShapesOpacity );
                config.shapes.menu.credits.opacity( config.shapes.settingShapesOpacity );

            } else if ( !config.animations.menu.settingsIn && config.shapes.menu.volume.opacity() > 0 ){
                config.shapes.settingShapesOpacity -= config.animations.transitionSpeed;
                config.shapes.settingShapesOpacity = config.shapes.settingShapesOpacity < 0 ?
                    0 : config.shapes.settingShapesOpacity;

                config.shapes.menu.volume.opacity( config.shapes.settingShapesOpacity );
                config.shapes.menu.fullscreen.opacity( config.shapes.settingShapesOpacity );
                config.shapes.menu.help.opacity( config.shapes.settingShapesOpacity );
                config.shapes.menu.credits.opacity( config.shapes.settingShapesOpacity );
            }

            if ( config.animations.game.transitioningToMenu || config.animations.menu.transitioningToGame ){
                if ( config.animations.game.transitioningToMenu ) config.shapes.menuShapesOpacity += config.animations.transitionSpeed;
                if ( config.animations.menu.transitioningToGame ) config.shapes.menuShapesOpacity -= config.animations.transitionSpeed;
                if ( config.animations.menu.settingsIn ) config.animations.menu.settingsIn = false;

                if ( config.shapes.menuShapesOpacity >= 1 ){
                    config.shapes.menuShapesOpacity = 1;
                    config.animations.game.transitioningToMenu = false;
                    config.animations.loops.menu.start();
                } else if ( config.shapes.menuShapesOpacity <= 0 ){
                    config.shapes.menuShapesOpacity = 0;
                    config.animations.menu.transitioningToGame = false;
                    config.animations.game.transitioningToGame = true;
                    config.gameStarted = true;
                    config.animations.loops.game.start();
                    config.animations.loops.background.start();
                }

                config.shapes.menu.ceros.opacity( config.shapes.menuShapesOpacity );
                config.shapes.menu.snake.opacity( config.shapes.menuShapesOpacity );
                config.shapes.menu.number1.opacity( config.shapes.menuShapesOpacity );
                config.shapes.menu.controller1.opacity( config.shapes.menuShapesOpacity );
                config.shapes.menu.number2.opacity( config.shapes.menuShapesOpacity );
                config.shapes.menu.controller2.opacity( config.shapes.menuShapesOpacity );
                config.shapes.menu.settings.opacity( config.shapes.menuShapesOpacity );
                config.shapes.menu.highScores.opacity( config.shapes.menuShapesOpacity );
            }
        }, config.layers.menu );
    }

    function createBackgroundLoop() {
        config.animations.loops.background = new Kinetic.Animation( function() {
            if ( config.cyclingBackgroundColors ){
                config.shapes.tiles.forEach( function( tile ){
                    tile.fill( config.randomBgColor() )})}

            config.cyclingBackgroundColors = false

        }, config.layers.bg );
    }

    function startLoadingLoop() {
        var wheelRadius = getRandomFloat( 0, 2 );

        config.animations.loops.loading = new Kinetic.Animation( function() {
            wheelRadius -= 0.01;
            if ( wheelRadius <= 0 ) wheelRadius = 2;

            if ( config.doneLoadingAssets ){
                config.shapes.loadingShapesOpacity -= config.animations.transitionSpeed;

                if ( config.shapes.loadingShapesOpacity <= 0 ){
                    config.animations.loops.loading.stop();
                    config.layers.loading.remove()
                } else {
                    for ( var shape in config.shapes.loading ){
                        if ( config.shapes.loading.hasOwnProperty( shape )){
                            config.shapes.loading[ shape ].opacity( config.shapes.loadingShapesOpacity )}}}
            }

            config.shapes.loading.wheel.setDrawFunc( function( context ){
                context.beginPath();
                context.arc( config.absX(1.99), config.absY(1.99), config.absX(4.5), pi(wheelRadius), pi( wheelRadius * 2 ), true );                    context.stroke();
                context.strokeShape( this );
            });

        }, config.layers.loading );

        config.animations.loops.loading.start();
    }

    function pi( x ){
        return x * Math.PI
    }

    function getRandomInt( min, max ){
        return Math.floor( Math.random() * ( max - min + 1 )) + min;
    }

    function getRandomFloat( min, max ){
        return Math.random() * ( max - min ) + min;
    }

    Array.prototype.last = function() {
        return this[ this.length - 1 ];
    };
});