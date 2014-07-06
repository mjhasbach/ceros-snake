define([ 'settings' ], function( settings ){
    var webFonts = { areLoaded: false };

    require([ 'font!' +
        'google,' +
        'families: [' + settings.font.face + ',Fira+Mono::latin]|' +

        'custom,' +
        'families: [ FontAwesome ],' +
        'urls: [ css/fontawesome-v4.0.3.min.css ],' +
        'testStrings: { FontAwesome: \uf11b\uf013\uf028\uf0b2\uf059 }'

    ], function() {
        webFonts.areLoaded = true;
    });

    return webFonts
});