/* 
 * Copyright (C) 2015 Hadi Mehrpouya <http://www.hadi.link>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
String.prototype.width = function (font) {
    var f = font || g_font,
            o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
            w = o.width();
    o.remove();
    return w;
};
String.prototype.height = function (font) {
    var f = font || g_font,
            o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
            h = o.height();
    o.remove();
    return h;
};

function addChar(x, y) {
    var sp = game.add.sprite(x, y, charBitmaps[Math.floor(Math.random() * charBitmaps.length)]);
    sp.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(sp);
    sp.body.bounce.y = 0.2;
    sp.body.gravity.y = 500;
    sp.body.collideWorldBounds = true;
    return sp;
}

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
function makeWordBitmap(_word, _color,_font) {
    var color = _color;
    var font = _font || g_font;
    var bmd = game.add.bitmapData(_word.width(_font), _word.height(_font), _word);
    bmd.text(_word, 0, _word.height(_font)-_word.height(_font)/4, font, _color);
    return bmd;
}


function initCell(chr, x, y) {
    game.add.text(x, y, chr, style);
//    platforms.add(text);
//    return text;
}


