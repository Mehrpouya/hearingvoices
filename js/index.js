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


$(".autoScrollabe").click(function() {
    alert($(this).attr('whereTo'));
    $('html, body').animate({

        scrollTop: $($(this).attr('whereTo')).offset().top
    }, 2000);
});

function navClicked(_whereTo){
    $('html, body').animate({

        scrollTop: $(_whereTo).offset().top-50
    }, 2000);
}


$(document).ready(function(){
  var description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id tortor nisi. Aenean sodales diam ac lacus elementum scelerisque. Suspendisse a dui vitae lacus faucibus venenatis vel id nisl. Proin orci ante, ultricies nec interdum at, iaculis venenatis nulla. ';

  $('#survey img').bind("click",function(){
    $('#survey').fadeOut("slow");
  });
  $('#sound').ttwMusicPlayer(myPlaylist, //You can specify the following options in the options object:
  {
       tracksToShow:1,
       description:description,
       autoplay:false,
       jPlayer:{
           swfPath:'/js/vendor/player/jquery-jplayer' //You need to override the default swf path any time the directory structure changes
       },
       ratingCallback:function(index, playlistItem, rating){
               //some logic to process the rating, perhaps through an ajax call
       }
  });


    $('section[data-type="background"]').each(function(){
        var $bgobj = $(this); // assigning the object

        $(window).scroll(function() {
            var yPos = -($window.scrollTop() / $bgobj.data('speed'));

            // Put together our final background position
            var coords = '50% '+ yPos + 'px';

            // Move the background
            $bgobj.css({ backgroundPosition: coords });
        });
    });
});
