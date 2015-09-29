var g_font = "20px Courier";
var g_width = $(window).width();
var g_height = $(window).height();
var game = new Phaser.Game(g_width, g_height, Phaser.AUTO, 'hearing-voices', {preload: preload, create: create, update: update, render: render});
var g_currentLevel = 1;

function preload() {
/*
 * TODO:
 * Add loading screen!
 */
    loadLevelMap();
    game.stage.backgroundColor = '#000';
    game.load.image('player', 'img/character.png');
    game.load.image('background', 'img/IdeasAug1.jpg');
    game.load.audio('humming', ['res/audio/humming.mp3', 'res/audio/humming.ogg']);
    makeAllCharacterBitmaps();

}

var player;
var humming;
var platforms;
var cursors;
var jumpButton;
var sprite;
function create() {
    var worldWidth = conf.levels[window.g_currentLevel - 1].text.width(),
            worldHeight= Math.max(g_height,game.cache.getImage('background').height);
    console.lo
    game.world.resize(worldWidth, worldHeight);
    game.world.setBounds(0, 0, worldWidth, worldHeight);



    game.add.tileSprite(0, 0,worldWidth,worldHeight, 'background');
    var bod = makeWordBitmap("Debbie", "rgb(100,100,200)");
    player = game.add.sprite(10, 0,bod );
    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
    game.camera.follow(player);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    player.body.gravity.y = 100;
//    addChar('a', 200, -500);
//    game.add.text(400, 400, 's', style);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    humming = game.add.audio('humming');
    loadSentences();
//    humming.play();


}
function update() {
//    addChar(Math.round(Math.random() * g_width), 100);
    game.physics.arcade.collide(player, platforms);
//    game.physics.arcade.collide(player, sprite);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;
    }

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down))
    {
        player.body.velocity.y = -400;
    }
}
function render() {

}


function initCell(chr, x, y) {
    game.add.text(x, y, chr, style);
//    platforms.add(text);
//    return text;
}

function addChar(x, y) {

    var sp = game.add.sprite(x, y, charBitmaps[Math.floor(Math.random() * charBitmaps.length)]);
    sp.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(sp);
    sp.body.bounce.y = 0.2;
    sp.body.gravity.y = 500;
    sp.body.collideWorldBounds = true;
    return sp;
}
var charBitmaps = [];
function makeAllCharacterBitmaps() {
    var charList = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"
                , "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
    var color = Math.round(Math.random() * 250) + 50;
    for (var i = 0; i < charList.length; i++) {
        var bmd = game.add.bitmapData(30, 70, charList[i]);

        bmd.text(charList[i], 0, 45, g_font, 'rgb(' + color + ',' + color + ',' + color + ')');
        charBitmaps.push(bmd);
    }
}


function makeWordBitmap(_word, _color) {
    var color = _color;
    var bmd = game.add.bitmapData(_word.width(), 12, _word);
    bmd.text(_word, 0,12, g_font, _color);
    return bmd;
}

String.prototype.width = function (font) {
    var f = font || g_font,
            o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
            w = o.width();

    o.remove();

    return w;
}


var g_levelPixelMap;
// The magic®
function loadLevelMap() {
    var level = conf.levels[window.g_currentLevel - 1];
    var cvs = document.createElement('canvas');
    var img = new Image();
    //loading level design from pixel map
    cvs.width = level.width;
    cvs.height = level.height;
    var ctx = cvs.getContext("2d");
    var img = document.getElementById(level.levelMapId);
    console.log(level.levelMapId, img);
    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    var idt = ctx.getImageData(0, 0, cvs.width, cvs.height);
    for (var y = 0; y < cvs.height; y++) {
        for (var x = 0; x < cvs.width; x++) {
            processPixelColor(getPixel(idt, x * y), x, y);
        }
    }
}

function processPixelColor(_color, _x, _y) {
    var r = _color[0], g = _color[1], b = _color[2], a = _color[3];
    if (r < 255 && g < 255 && b < 255) {
        if (r + g + b === 0) {
            g_levelPixelMap.push({"type": "normal", "x": _x, "y": _y});
        }
    }
}

function getPixel(imgData, index) {
    var i = index * 4, d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]]; // [R,G,B,A]
}

// AND/OR

function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
}


/*
 * This will load the sentences by:
 * 
 * starting from the first sentence
 * breaking sentences to words
 * Making a physics body for each word
 * using the levelspixelmap to decide where to put the sentence horizontally
 * starts from position 0,y and continues until last sentence
 * */
function loadSentences() {
    var level = conf.levels[window.g_currentLevel - 1];
    var wordX = 0, wordY = 0;
    //first break the text into sentences
    var txt = level.text;
    var sentences = txt.match(/\(?[^\.\?\!]+[\.!\?]\)?/g);//regular expression to recognise sentences
    var sentence = "", words, word = "", wordBody;
    wordY = 100;
    for (i = 0; i < sentences.length; i++) {
        sentence = sentences[i];
        words = sentence.split(" ");

        for (j = 0; j < words.length; j++) {
            word = words[j];
            wordBody = makeWordBitmap(word, "rgb(220,220,220)");
            var sp = game.add.sprite(wordX, wordY, wordBody);
            platforms.add(sp);
            console.log(wordX, word, sp);
            wordX += word.width() + 10;
            game.physics.arcade.enable(sp);
//            sp.body.bounce.y = 0.2;
//            sp.body.gravity.y = 500;
            sp.body.collideWorldBounds = true;
        }
        wordY += 70;
    }
//    makeWordBitmap
}