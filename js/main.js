var g_font = "20px Courier";
var g_width = $(window).width();
var g_height = $(window).height();
var game = new Phaser.Game(g_width, g_height, Phaser.AUTO, 'hearing-voices', {preload: preload, create: create, update: update, render: render});
var g_currentLevel = 1;
var g_playerName = "Hadi";
var g_collisionTimer=0;
function preload() {
    /*
     * TODO: c 
     * Add loading screen!
     */
    game.stage.backgroundColor = conf.levels[0].background;
    game.load.image('player', 'img/character.png');
    game.load.image('art1', 'img/IdeasAug1.jpg');
    game.load.image('face', 'img/face1.jpg');
//    game.load.image('background', 'img/IdeasAug1.jpg');
    game.load.audio('humming', ['res/audio/humming.mp3', 'res/audio/humming.ogg']);
    game.load.audio('intro', ['res/audio/intro.mp3','res/audio/intro.ogg']);
    game.load.audio('voice1', ['res/audio/voice1.mp3']);
    game.load.audio('noise', ['res/audio/backgroundNoise.mp3']);
    makeAllCharacterBitmaps();
    setInterval(saySomething, 23000);
}
var player;
var humming;
var g_platforms, g_positiveWords, g_negativeWords, g_looseWords,g_noiseSound ;
var cursors;
var jumpButton;
var sprite;
var g_thingsToSay = ["You shouldn’t be here, waste of space", "Throw yourself out the window", 
    "You’re common, a common wee tart", "Wait until you’re sleeping, then I’ll get you. We’ll all get you", 
    "Remember: you are loved", "Remember: you are loved", "you deserved it.", "Quick, give us a cup of tea you fat bitch!!", "Selfish, ugly bitch. I’ll get you", "Keep going"];
var g_accents = ["UK English Female", "UK English Male"];
var group;
function saySomething() {
    g_noiseSound.volume = 0.2;
    g_noiseSound.play();
//    responsiveVoice.speak(window.g_playerName + g_thingsToSay[Math.floor(Math.random() * g_thingsToSay.length)], g_accents[Math.floor(Math.random() * g_accents.length)], {pitch: 1});
//     addChar(Math.round(Math.random() * g_width), 100);
//$("#dodod").text(game.time.fps);
}
function create() {
    loadLevelMap();
    var worldWidth = conf.levels[window.g_currentLevel - 1].text.width(),
            worldHeight = Math.max(g_height, 0);//game.cache.getImage('background').height);
    game.world.resize(worldWidth, worldHeight);
    game.world.setBounds(0, 0, worldWidth, worldHeight);
//    game.add.tileSprite(0, 0,worldWidth,worldHeight, 'background');
    var bod = makeWordBitmap(window.g_playerName, "rgb(200,10,10)");
    player = game.add.sprite(10, 0, bod);
    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
    game.camera.follow(player);
    //  The g_platforms group contains the ground and the 2 ledges we can jump on
    g_platforms = game.add.group();
    g_positiveWords = game.add.group();
    g_negativeWords = game.add.group();
    g_looseWords = game.add.group();
    //  We will enable physics for any object that is created in this group
    g_platforms.enableBody = true;
    g_positiveWords.enableBody = true;
    g_negativeWords.enableBody = true;
    g_looseWords.enableBody = true;
//    g_platforms.body.immovable = true;
    player.body.gravity.y = 500;
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    humming = game.add.audio('humming');
    music = game.add.audio('intro');
    voice1 = game.add.audio('voice1');
    g_noiseSound = game.add.audio('noise');
    music.play();
}

function update() {
//    addChar(Math.round(Math.random() * g_width), 100);
    game.physics.arcade.collide(player, g_platforms);
    game.physics.arcade.collide(player, g_positiveWords,positiveCollisionHandler, null, this);
    game.physics.arcade.collide(player, g_looseWords);
    game.physics.arcade.collide(player, g_negativeWords);
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




function positiveCollisionHandler(obj1,obj2){
    if((game.time.now-g_collisionTimer)>5000 ){
        g_collisionTimer=game.time.now;
    responsiveVoice.speak(window.g_playerName + g_thingsToSay[Math.floor(Math.random() * g_thingsToSay.length)], g_accents[Math.floor(Math.random() * g_accents.length)], {pitch: 1});
}
//voice1.play();
}





var charBitmaps = [];
var g_levelPixelMap = [];// This is the dynamicsa of each sentence. It gets processed in the process pixel color function. and then used in the load sentences funciton. 
// The magic®
function loadLevelMap() {
//    img = $('#level1')[0];
    var img = new Image();
    img.onload = imageLoaded;
    img.src = 'res/levels/1.jpg';
}

function imageLoaded(ev) {
    var level = conf.levels[window.g_currentLevel - 1];
    var cvs = document.createElement('canvas');
    var ctx = cvs.getContext("2d");
    im = ev.target; // the image, assumed to be 200x200
    ctx.width = im.width;
    ctx.height = im.height;
    // read the width and height of the canvas
    width = im.width;
    height = im.height;
    // stamp the image on the left of the canvas:
    ctx.drawImage(im, 0, 0);
    // get all canvas pixel data
    imageData = ctx.getImageData(0, 0, width, height);
    w2 = width / 2;
    // run through the image, increasing blue, but filtering
    // down red and green:
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            inpos = (y * width) * 4 + x * 4; // *4 for 4 ints per pixel
            r = imageData.data[inpos++];
            g = imageData.data[inpos++];
            b = imageData.data[inpos++];
            a = imageData.data[inpos++];     // same alpha
            processPixelColorRGBA(r, g, b, a, x, y);
        }
    }
    loadSentences();
}

function processPixelColorRGBA(_r, _g, _b, _a, _x, _y) {
    var xRatio = game.world.width / 30;
    var yRatio = game.world.height / 9;
    var newY = ((_y * yRatio) / 2 + game.world.height / 2 - yRatio / 2);
    var type = "immovable";
    if ((_g + _b) <= 50 && _r > 200) {
        type = "loose";
        g_levelPixelMap.push(JSON.parse('{"type": "' + type + '","x": ' + (_x * xRatio) + ', "y": ' + newY + '}'));
    }
    if ((_r + _g + _b) <= 100) {

        g_levelPixelMap.push(JSON.parse('{"type": "' + type + '","x": ' + (_x * xRatio) + ', "y": ' + newY + '}'));
    }
    else if ((_r + _b) <= 50 && _g > 150) {
        //g_levelPixelMap.push(JSON.parse('{"type": "normal","x": ' + (_x * xRatio) + ', "y": ' + ((_y * yRatio) - 50) + '}'));
//        group = game.add.group();
//        group.position.set(game.world.centerX, game.world.centerY);
//        var tag = game.add.sprite(0, 0, "art1", 0, group);
//        // Set our tween
//        game.add.tween(tag).to({angle: 20}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Infinity, true);
    }

    /*
     * group = game.add.group();
     group.position.set(game.world.centerX, game.world.centerY);
     var tag = game.add.sprite(0, 0, this.getPattern(64, 128), 0, group);
     // Set our tween
     game.add.tween(tag).to({angle: 20}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Infinity, true);
     */
}
/*
 * This will load the sentences by:
 * starting from the first sentence
 * breaking sentences to words
 * Making a physics body for each word
 * using the levelspixelmap to decide where to put the sentence horizontally
 * starts from position 0,y and continues until last sentence
 * */
function loadSentences() {
    var level = conf.levels[window.g_currentLevel - 1];
    var yRatio = game.world.height / 9;
    var wordX = blockX = 20, wordY = 0,distanceBetween=150;
    //first break the text into sentences
    var txt = level.text;
    var sentences = txt.match(/\(?[^\.\?\!]+[\.!\?]\)?/g);//regular expression to recognise sentences
    var sentence = "", words, word = "", wordBody;
    wordY = 100;
    var wordsInBlock = 0;
    wordY = g_levelPixelMap[0].y;
    
    var startX = 0;
    var blockCount = 0;
    var blockUsed = 0;
    var sentenceType = g_levelPixelMap[0].type;
    console.log(sentenceType);
    for (i = 0; i < sentences.length; i++) {
        sentence = sentences[i].trim();
        words = sentence.split(" ");
        for (j = 0; j < words.length; j++) {
            word = words[j];
            if ((blockUsed >= level.blockSize) || (word.width() + 10 + blockUsed > level.blockSize)) {
                blockUsed = 0;
                if (g_levelPixelMap[blockCount].x === g_levelPixelMap[blockCount + 1].x) {
                    wordX = blockX;
                    wordY = g_levelPixelMap[blockCount].y;
                }
                else {
                    wordX += distanceBetween;
                    blockX = wordX;

                }
                blockCount++;
                wordY = g_levelPixelMap[blockCount].y;
                sentenceType = g_levelPixelMap[blockCount].type;
            }
            /*
             * TODO:
             * Check if you can add a whole block of words as one physics object. 
             */
            addWordPhysics(word, wordX, wordY, sentenceType);
            wordsInBlock++;
            wordX += word.width() + 10;
            blockUsed += (word.width() + 10);
        }
    }
}
function addWordPhysics(_word, wordX, wordY, _sentenceType) {
    level = conf.levels[g_currentLevel - 1];
    var physicsGroup = window.g_platforms;
    var color = level.textColor;
    var font = g_font;
    var immovable = true;
    if (_sentenceType !== "immovable") {
        color = "rgb(100,100,100)";
        physicsGroup = g_looseWords;
        font = "20px Arial";
        immovable = false;
    }
    if (_word.indexOf("++") >= 0) {
        _word = _word.substr(2).trim();
        physicsGroup = g_positiveWords;
        color = level.plusplusColor;
        immovable = true;
        font = level.plusplusFont;
    }
    else if (_word.indexOf("+-") >= 0) {
        _word = _word.substr(2).trim();
        physicsGroup = g_negativeWords;
        color = "rgb(100,100,200)";
        immovable = true;
    }
    wordBody = makeWordBitmap(_word, color, font);
    textBody = physicsGroup.create(wordX, wordY, wordBody);
    textBody.body.immovable = immovable;
}

