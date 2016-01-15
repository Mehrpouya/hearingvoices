var g_font = "20px bebasregular";
var g_width = 700, g_height = $(window).height();
var g_startX;
var game = new Phaser.Game(g_width, g_height, Phaser.AUTO, 'hearing-voices', {preload: preload, create: create, update: update, render: render});
var g_currentLevel = 1;
var g_playerName = "Me";
var g_collisionTimer=-6000;
var g_soundEnabled = true;
var g_wordsAudioList=[];
var g_first=true;
$(document).ready(function(){
  $("#back").bind("click",function(){
    window.location="http://listeningtovoices.org.uk";
  });

});

function preload() {

  /*
  * TODO:
  - Add loading screen!
  */

  g_startX=(window.g_width-conf.levels[0].blockSize)/2;
  game.stage.backgroundColor = conf.levels[0].background;
  game.load.image('background', 'img/gameBackground.jpg');
  game.load.image('face', 'img/face1.jpg');
  game.load.spritesheet('reset', 'res/reset.png', 193, 71);
  loadAudioFiles();
  makeAllCharacterBitmaps();

}

var player,resetButton;
var g_platforms,g_reset,g_backHome, g_positiveWords, g_negativeWords, g_looseWords,g_noiseSound,g_backgroundHumming ;
var cursors, jumpButton, sprite;
var g_levelMapLoaded=false;
var group;

function saySomething() {
  var myList=["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20"];
  g_wordsAudioList[myList[Math.floor(Math.random()*19)]].play();
}


var g_background;
var resetButton;
function create() {
  loadLevelMap();

  var worldWidth = conf.levels[window.g_currentLevel - 1].text.width(),
  worldHeight = Math.max(g_height, 0);
  g_background = game.add.tileSprite(0, 0,worldWidth,12500, 'background');

  // resetButton = game.add.button(95, 11950, 'reset', actionOnClick, this, 2, 1, 0);
  // resetButton.onInputUp.add(resetUp, this);

  var bod = makeWordBitmap(window.g_playerName, "rgb(200,10,10)");
  player = game.add.sprite(g_startX+50, 0, bod);
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
  g_backHome = game.add.group();
  g_reset = game.add.group();
  //  We will enable physics for any object that is created in this group
  g_platforms.enableBody = true;
  g_positiveWords.enableBody = true;
  g_negativeWords.enableBody = true;
  g_looseWords.enableBody = true;
  g_reset.enableBody = true;
  g_backHome.enableBody = true;
  var resetBod = makeWordBitmap("Reset", "rgb(0,100,0)");
  var resetButton = g_reset.create(game.world.centerX-100, 12450, resetBod);
  resetButton.body.immovable = true;

  var homeBod = makeWordBitmap("home", "rgb(100,0,0)");
  var homeButton = g_backHome.create(game.world.centerX+100, 12450, homeBod);
  homeButton.body.immovable = true;


  player.body.gravity.y = 500;
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  g_noiseSound = game.add.audio('noise');
  g_noiseSound.loop = true;
  //Don't play things when the audio is mute.
  prepareAudioList();

  setInterval(saySomething, 30000);
  var s = game.add.audio('noise');
  s.loop = true;
  s.volume=0.15;
  s.play();
}

function loadAudioFiles(){
  game.load.audio('noise', ['res/audio/backgroundNoise.mp3','res/audio/backgroundNoise.ogg']);
  //Don't panic you'll be fine
  game.load.audio('dontPanicYoullBeFine', ['res/audio/DontPanicYoullBeFine.mp3', 'res/audio/DontPanicYoullBeFine.ogg']);
  //Don't you dare try to silence me.
  game.load.audio('dontYouDareTryToSilenceMeImAllYouveGot', ['res/audio/DontYouDareTryToSilenceMeImAllYouveGot.mp3', 'res/audio/DontYouDareTryToSilenceMeImAllYouveGot.ogg']);
  //I'm as real as anyone you'll ever meet.
  game.load.audio('imAsRealAsAnyoneYoullEverMeet', ['res/audio/ImAsRealAsAnyoneYoullEverMeet.mp3', 'res/audio/ImAsRealAsAnyoneYoullEverMeet.ogg']);
  //I really meant you've done so well
  game.load.audio('iReallyMeanItYouveDoneSoWell', ['res/audio/IReallyMeanItYouveDoneSoWell.mp3', 'res/audio/IReallyMeanItYouveDoneSoWell.ogg']);
  //It will be alright
  game.load.audio('itllBeAlright', ['res/audio/ItllBeAlright.mp3', 'res/audio/ItllBeAlright.ogg']);
  //Just look at you, you're fucking disgusting.
  game.load.audio('justLookAtYouYoureFuckingDisgusting', ['res/audio/JustLookAtYouYoureFuckingDisgusting.mp3', 'res/audio/JustLookAtYouYoureFuckingDisgusting.ogg']);
  //look at you fucking disgusting.
  game.load.audio('lookAtYouFuckingDisgusting', ['res/audio/LookAtYouFuckingDisgusting.mp3', 'res/audio/LookAtYouFuckingDisgusting.ogg']);
  //Remember you are really loved
  game.load.audio('rememberYouAreReallyLoved', ['res/audio/RememberYouAreReallyLoved.mp3', 'res/audio/RememberYouAreReallyLoved.ogg']);
  //Scratching your arse you filthy shite.
  game.load.audio('scratchingYourArseFilthyShite', ['res/audio/ScratchingYourArseFilthyShite.mp3', 'res/audio/ScratchingYourArseFilthyShite.ogg']);
  //Shut up.
  game.load.audio('shutUp', ['res/audio/ShutUp.mp3', 'res/audio/ShutUp.ogg']);
  //Special gift fuck you
  game.load.audio('specialGiftFuckYou', ['res/audio/SpecialGiftFuckYou.mp3', 'res/audio/SpecialGiftFuckYou.ogg']);
  //You go outside, I'm gonna stab you
  game.load.audio('youGoOutsideImGonnaeStabYou', ['res/audio/YouGoOutsideImGonnaeStabYou.mp3', 'res/audio/YouGoOutsideImGonnaeStabYou.ogg']);
  //You knoy me, don't pretend you don't.
  game.load.audio('youKnowMeDontPretendYouDont', ['res/audio/YouKnowMeDontPretendYouDont.mp3', 'res/audio/YouKnowMeDontPretendYouDont.ogg']);
  //You piece a shite
  game.load.audio('youPieceAShite', ['res/audio/YouPieceAShite.mp3', 'res/audio/YouPieceAShite.ogg']);
  //You are about as spiritual as a porn strar
  game.load.audio('youreAboutAsSpiritualAsAPornStar', ['res/audio/YoureAboutAsSpiritualAsAPornStar.mp3', 'res/audio/YoureAboutAsSpiritualAsAPornStar.ogg']);
  //You are a liar, a worthless liar.
  game.load.audio('youreALiarAWorthlessLiar', ['res/audio/YoureALiarAWorthlessLiar.mp3', 'res/audio/YoureALiarAWorthlessLiar.ogg']);
  //You're a waste of space shouldn't be here.
  game.load.audio('youreAWasteOfSpaceShouldntBeHere', ['res/audio/YoureAWasteOfSpaceShouldntBeHere.mp3', 'res/audio/YoureAWasteOfSpaceShouldntBeHere.ogg']);
  //You're never alone, we're all here.
  game.load.audio('youreNeverAloneWereAllHere', ['res/audio/YoureNeverAloneWereAllHere.mp3', 'res/audio/YoureNeverAloneWereAllHere.ogg']);
  //You're no trustworthy you're a wee eavesdropper
  game.load.audio('youreNoTrustworthyYoureAWeeEasvesdropper', ['res/audio/YoureNoTrustworthyYoureAWeeEasvesdropper.mp3', 'res/audio/YoureNoTrustworthyYoureAWeeEasvesdropper.ogg']);
  //You shouldn't be listening to this coz.
  game.load.audio('youShouldntBeListeningToThisCoz', ['res/audio/YouShouldntBeListeningToThisCoz.mp3', 'res/audio/YouShouldntBeListeningToThisCoz.ogg']);
}

function prepareAudioList(){


  var s = game.add.audio('youreAWasteOfSpaceShouldntBeHere');
  s.loop = false;
  g_wordsAudioList["01"]= s;

  s = game.add.audio('youShouldntBeListeningToThisCoz');
  s.loop = false;
  g_wordsAudioList["02"]= s;
  s = game.add.audio('youreAboutAsSpiritualAsAPornStar');
  s.loop = false;
  g_wordsAudioList["03"]= s;

  s = game.add.audio('youreALiarAWorthlessLiar');
  s.loop = false;
  g_wordsAudioList["04"]= s;

  s = game.add.audio('youGoOutsideImGonnaeStabYou');
  s.loop = false;
  g_wordsAudioList["05"]= s;

  s = game.add.audio('youreNoTrustworthyYoureAWeeEasvesdropper');
  s.loop = false;
  g_wordsAudioList["06"]= s;
  s = game.add.audio('youreNeverAloneWereAllHere');
  s.loop = false;
  g_wordsAudioList["07"]= s;
  s = game.add.audio('youPieceAShite');
  s.loop = false;
  g_wordsAudioList["08"]= s;

  s = game.add.audio('youKnowMeDontPretendYouDont');
  s.loop = false;
  g_wordsAudioList["09"]= s;

  s = game.add.audio('dontYouDareTryToSilenceMeImAllYouveGot');
  s.loop = false;
  g_wordsAudioList["10"]= s;

  s = game.add.audio('iReallyMeanItYouveDoneSoWell');
  s.loop = false;
  s.play();
  g_wordsAudioList["11"]= s;
  s = game.add.audio('rememberYouAreReallyLoved');
  s.loop = false;
  g_wordsAudioList["12"]= s;

  s = game.add.audio('shutUp');
  s.loop = false;
  g_wordsAudioList["13"]= s;

  s = game.add.audio('dontPanicYoullBeFine');
  s.loop = false;
  g_wordsAudioList["14"]= s;

  s = game.add.audio('itllBeAlright');
  s.loop = false;
  g_wordsAudioList["15"]= s;

  s = game.add.audio('justLookAtYouYoureFuckingDisgusting');
  s.loop = false;
  g_wordsAudioList["16"]= s;

  s = game.add.audio('lookAtYouFuckingDisgusting');
  s.loop = false;
  g_wordsAudioList["17"]= s;

  s = game.add.audio('scratchingYourArseFilthyShite');
  s.loop = false;
  g_wordsAudioList["18"]= s;

  s = game.add.audio('imAsRealAsAnyoneYoullEverMeet');
  s.loop = false;
  g_wordsAudioList["19"]= s;

  s = game.add.audio('specialGiftFuckYou');
  s.loop = false;
  g_wordsAudioList["20"]= s;


}
function update() {

  //    addChar(Math.round(Math.random() * g_width), 100);
  g_background.tilePosition.y += 0.5;
  game.physics.arcade.collide(player, g_platforms);
  game.physics.arcade.collide(player, g_positiveWords,positiveCollisionHandler, null, this);
  game.physics.arcade.collide(player, g_reset,resetCollisionHandler, null, this);
  game.physics.arcade.collide(player, g_backHome,homeCollisionHandler, null, this);

  game.physics.arcade.collide(player, g_looseWords);
  game.physics.arcade.collide(player, g_negativeWords);
  //    game.physics.arcade.collide(player, sprite);
  player.body.velocity.x = 0;
  if (cursors.left.isDown)
  {
    player.body.velocity.x = -150;
  }
  else if (cursors.right.isDown)
  {
    player.body.velocity.x = 150;
  }
  if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down))
  {
    player.body.velocity.y = -400;
  }
}
function resetCollisionHandler(obj1,obj2){
window.location="/interactive.html";
}
function homeCollisionHandler(obj1,obj2){
window.location="http://listeningtovoices.org.uk";
}

function positiveCollisionHandler(obj1,obj2){
  if((game.time.now-g_collisionTimer)>200 ){
    g_collisionTimer=game.time.now;
    if(g_soundEnabled)
    {
      g_wordsAudioList[obj2.myText].play();
    }
  }
}
var charBitmaps = [];
var g_levelPixelMap = [];// This is the dynamicsa of each sentence. It gets processed in the process pixel color function. and then used in the load sentences funciton.
// The magic®
function loadLevelMap() {
  var level = conf.levels[window.g_currentLevel - 1];
  var img = new Image();
  img.onload = imageLoaded;
  img.src = level.levelMap;
}
function imageLoaded(ev) {
  // var worldWidth = conf.levels[window.g_currentLevel - 1].text.width(),
  // worldHeight = Math.max(g_height, 0);//game.cache.getImage('background').height);

  g_levelMapLoaded=true;
  // var level = conf.levels[window.g_currentLevel - 1];
  // var cvs = document.createElement('canvas');
  // var ctx = cvs.getContext("2d");
  // im = ev.target; // the image, assumed to be 200x200
  // ctx.width = im.width;
  // ctx.height = im.height;
  // // read the width and height of the canvas
  // width = im.width;
  // height = im.height;
  // // stamp the image on the left of the canvas:
  // ctx.drawImage(im, 0, 0);
  // // get all canvas pixel data
  // imageData = ctx.getImageData(0, 0, width, height);
  // w2 = width / 2;
  // //vert image reading
  // for (y = 0; y < height; y++) {
  //   for (x = 0; x < width; x++) {
  //     inpos = (y * width) * 4 + x * 4; // *4 for 4 ints per pixel
  //     r = imageData.data[inpos++];
  //     g = imageData.data[inpos++];
  //     b = imageData.data[inpos++];
  //     a = imageData.data[inpos++];     // same alpha
  //     processPixelColorRGBA(r, g, b, a, x, y);
  //   }
  // }
  game.world.resize(610, 400);
  game.world.setBounds(g_startX, 0, 700, 12500);
  loadSentencesVert();
}
function processPixelColorRGBA(_r, _g, _b, _a, _x, _y) {
  var xRatio = game.world.width / 30;
  var yRatio = 50;//game.world.height / 9;
  var newY = ((_y * yRatio) / 2 + game.world.height / 2 - yRatio / 2);
  var type = "immovable";
  if ((_g + _b) <= 50 && _r > 200) {
    type = "movable";
    g_levelPixelMap.push(JSON.parse('{"type": "' + type + '","x": ' + (_x * xRatio) + ', "y": ' + newY + '}'));
  }
  if ((_r + _g + _b) <= 100) {

    g_levelPixelMap.push(JSON.parse('{"type": "' + type + '","x": ' + (_x * xRatio) + ', "y": ' + newY + '}'));
  }
  else if ((_r + _b) <= 50 && _g > 150) {
  }
  // console.log(g_levelPixelMap);
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
function loadSentencesHorz() {
  var level = conf.levels[window.g_currentLevel - 1];
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
  var sentenceType = "immovable";
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

function loadSentencesVert() {
  var level = conf.levels[window.g_currentLevel - 1];
  var wordX = 0, wordY = 0,distanceBetween=150;

  wordX=g_startX+50;

  //first break the text into sentences
  var txt = level.text;
  var sentences = txt.match(/\(?[^\.\?\!]+[\.!\?]\)?/g);//regular expression to recognise sentences
  var sentence = "", words, word = "", wordBody;
  wordY = 0;
  var wordsInBlock = 0;
  // wordY = g_levelPixelMap[0].y;
  var blockCount = 0;
  var blockUsed = 0;
  var sentenceType = "immovable";//g_levelPixelMap[0].type;
  var isHeader = false;
  var wordSpacing=10;
  var font = "20px bebasregular";

  for (i = 0; i < sentences.length; i++) {
    sentence = sentences[i].trim();
    if (sentence.indexOf("|")>=0){
      sentence = sentence.replace("|","?");
    }
    words = sentence.split(" ");
    sentenceType = "immovable";//g_levelPixelMap[blockCount].type;
    if(words[0].indexOf("~~")>=0){
      sentenceType="movable";
    }
    if(isHeader){
      blockUsed = 0;
      wordX=g_startX+50;
      wordY+=100;
    }
    if(words[0].indexOf("$$")>=0){
      blockUsed = 0;
      wordX=g_startX+50;
      wordY+=100;
      isHeader=true;
      wordSpacing=10;

      font = "30px bebasregular";

    }else{
      isHeader=false;
      wordSpacing=10;
      font = "20px bebasregular";

    }
    for (j = 0; j < words.length; j++) {
      word = words[j];
      if(word.indexOf("~~")>=0){
        sentenceType="movable";
      }
      if ((word.width() + 10 + blockUsed) >= level.blockSize) {
        blockUsed = 0;
        wordX=g_startX+50;
        wordY+=65;
      }
      /*
      * TODO:
      * Check if you can add a whole block of words as one physics object.
      */

      addWordPhysics(word, wordX, wordY, sentenceType,isHeader);
      word = word.replace("++","").replace("$$",'').replace("+-","").replace("~~","").replace(new
       RegExp("[0-9][0-9]"), "").trim();
      wordX += word.width(font) + wordSpacing;
      blockUsed += (word.width(font) + wordSpacing);
    }
  }
  if(g_first){
    g_first=false;
    $("#loadingContainer").remove();
  }
}
function addWordPhysics(_word, wordX, wordY, _sentenceType,_isHeader) {
  level = conf.levels[g_currentLevel - 1];

  var physicsGroup = window.g_platforms;
  var color = level.textColor;
  var font = g_font;
  var immovable = true;
  var soundToPlay;

  if(_isHeader){
    font = "30px bebasregular";
    color = "rgb(200,0,0)";
    _word=_word.replace(".","");
  }
  else{
  if (_sentenceType !== "immovable") {
    color = "rgb(100,100,100)";
    physicsGroup = g_looseWords;
    immovable = false;
  }
  if (_word.indexOf("++") >= 0) {
    _word=_word.replace("++","").trim();
    physicsGroup = g_positiveWords;
    color = level.plusplusColor;
    immovable = false;
    soundToPlay=_word.match(/[0-9][0-9]/)[0];
  }
  if (_word.indexOf("~~") >= 0) {
    color = "rgb(100,100,100)";
    immovable = false;
  }
  if (_word.indexOf("+-") >= 0) {
    color = "rgb(100,100,100)";
    immovable = true;
  }
  if(_word.indexOf("--") >= 0){
    color = level.textColor;
    immovable = true;
  }
  if(_word.indexOf("%%") >= 0){
    _word="i.e."
    color = level.textColor;
    immovable = true;
  }
}
  var newWord = _word.replace("++","").replace("$$",'').replace("+-","").replace("~~","").replace(new
   RegExp("[0-9][0-9]"), "").replace("--","").trim();
  wordBody = makeWordBitmap(newWord, color, font);
  textBody = physicsGroup.create(wordX, wordY, wordBody);
  textBody.myText=soundToPlay;
  textBody.body.immovable = immovable;
}
function render(){}
