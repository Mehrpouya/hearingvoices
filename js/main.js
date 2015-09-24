var FONT = 22;
var style = {font: FONT + "px monospace", fill: "#f00"};
var g_width = $(window).width();
var g_height = $(window).height();
var game = new Phaser.Game(g_width, g_height, Phaser.AUTO, 'hearing-voices', {preload: preload, create: create, update: update, render: render});

function preload() {
    game.stage.backgroundColor = '#000';
    game.load.image('player', 'img/character.png');
    game.load.image('background', 'img/background.jpg');
    makeAllCharacterBitmaps();
}

var player;
var platforms;
var cursors;
var jumpButton;
var sprite;
function create() {
    game.add.sprite(0, 0, 'background');
    player = game.add.sprite(0, 0, 'player');

    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

//    addChar('a', 200, -500);
//    game.add.text(400, 400, 's', style);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}
function update() {
addChar(Math.round(Math.random()*g_width),100);
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player, sprite);

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
    
    sprite = game.add.sprite(x, y, charBitmaps[Math.floor(Math.random()*charBitmaps.length)]);
    console.log(x,y,sprite);
    sprite.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(sprite);
    sprite.body.bounce.y = 0.2;
    sprite.body.gravity.y = 500;
    sprite.body.collideWorldBounds = true;
}
var charBitmaps = [];
function makeAllCharacterBitmaps() {
    var charList = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"
                , "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
    for (var i = 0; i < charList.length; i++) {
        var bmd = game.add.bitmapData(30, 70, charList[i]);
        bmd.text(charList[i], 0, 45, '50px Courier', 'rgb('+(Math.round(Math.random()*255))+','
                +(Math.round(Math.random()*255))+','+(Math.round(Math.random()*255)+')'));
        charBitmaps.push(bmd);
    }
}