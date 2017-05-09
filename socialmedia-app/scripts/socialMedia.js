"use strict";

var GlobalEventTrigger = {trigger: 0};
var GlobalGrid = {};

// trigger masonry reload
function ReadyToPlay() {
  GlobalEventTrigger.trigger++;
}

// Removing buffer from video element and then remove grid. Garbage collector can then clean memory.
function removeGrid(rootDiv) {

  // set src to empty
  $('#socialMedia video source').attr('src', '');

  // remove the grid
  rootDiv.children('.grid').remove();

}

// re layout the grid
function redoLayout() {
  GlobalGrid.masonry('layout');
}


$(document).ready(function () {

  function getEXP(){
    var uuid = exp.app.config.feed_configuration.uuid;
    var rows = parseFloat(exp.app.config.numberRows) || Math.round(4 * window.innerWidth / 1920);
    var width = (1 / rows) * 100;
    var gutter = parseFloat(exp.app.config.gutterSize) || 4;
    var $socialMedia = $('#socialMedia');

    var refresh = function () {
      removeGrid($socialMedia);
      var $grid = $('<div>').addClass('grid');
      var $sizer = $('<div>').addClass('sizer');
      $sizer.css('width', width + '%');
      $sizer.appendTo($grid);

      exp.getFeed(uuid).then(function (feed) {

        feed.getData().then(function(data){

          var $wrapper = $('<div>').addClass('wrapper');
          $wrapper.css('width', width + '%');
          var $item = $('<div>').addClass('item');
          $item.css('max-width', '100%');
          $item.css('padding', gutter + 'px');
          var $image = $('<img>').attr('src', data.details.imageUrl);
          $image.appendTo($item);
          $item.appendTo($wrapper);
          $wrapper.appendTo($grid);

          data.items.forEach(function (item) {

            var $wrapper = $('<div>').addClass('wrapper');
            $wrapper.css('width', width + '%');
            var $item = $('<div>').addClass('item');
            $item.css('max-width', '100%');
            $item.css('padding', gutter + 'px');

            // check for image or video
            if (item.type === 'video') {

              if (item.hasOwnProperty('videos')) {

                var $video = $('<video>').attr('muted', 'true').attr('loop', 'true').attr('autoplay', 'true').attr('oncanplay', 'ReadyToPlay();');
                var $source = $('<source>').attr('src', item.videos[0].url).attr('type', 'video/mp4');
                $source.appendTo($video);
                $video.appendTo($item);

              }

            } else {

              if (item.hasOwnProperty('images')) {

                var $image = $('<img>').attr('src', item.images[0].url);
                $image.appendTo($item);

              }

            }

            $item.appendTo($wrapper);
            $wrapper.appendTo($grid);


          });

          $grid.appendTo($socialMedia);

          $grid.masonry({
            itemSelector: '.wrapper',
            columnWidth: '.sizer'
          });

          $grid.masonry('reloadItems');

          $grid.imagesLoaded().progress(function () {
            $grid.masonry('layout');
            GlobalGrid = $grid;

            // watch firefox
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
              GlobalEventTrigger.watch('trigger', function (id, oldval, newval) {
                $grid.masonry('layout');
              })
            }

            // observe for chrome
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
              Object.observe(GlobalEventTrigger, redoLayout);
            }

          });

        });

      });

    };

    // execute first grid buildup
    refresh();

    // set interval on grid buildup
    setInterval(GridRebuild, exp.app.config.refresh_rate_seconds * 1000);

    // initiate new build
    function GridRebuild() {

      // de-register observe for chrome
      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        Object.unobserve(GlobalEventTrigger, redoLayout);
      }

      // de-register observe for firefox
      if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        GlobalEventTrigger.unwatch('trigger');
      }

      GlobalEventTrigger.trigger = 0;
      GlobalGrid = {};
      refresh();
    }
  }

  var myVar;

  // adding timeout to wait for exp object
  myVar = setTimeout(getEXP, 1000);

});
