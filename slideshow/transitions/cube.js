'use strict';
/* global transitions */

transitions.cube = function (app) {

  function getScale () {
    var w = window.innerWidth;
    var p = 5000;
    return 1 - w / (2 * p);
  }

  var scale = getScale();
  var slideshow = document.getElementById('slideshow');
  var viewport = document.getElementById('viewport');

  $(viewport).css('perspective', '5000px');
  $(slideshow).css('transform-style', 'preserve-3d');

  this.refresh = function () {
    scale = getScale();
    $(slideshow).css('transform', 'rotateY(0deg) scale(' + scale + ')');
    $.keyframe.define([{
      name: 'cube',
      '0%': { transform:  'scale(' + scale + ') rotateY(0deg)' },
      '20%': { transform:  'scale(.5) rotateY(0deg)' },
      '80%': { transform:  'scale(.5) rotateY(-90deg)' },
      '100%': { transform:  'scale(' + scale + ') rotateY(-90deg)' }
    }]);
  };

  this.prepare = function (app) {
    $(app.element).css('visibility', 'hidden');
  };

  this.execute  = function (current, next) {
    if (!current) {
      return $(next.element).css('visibility', 'visible').css('transform', 'rotateY(90deg) translateX(-50%) rotateY(-90deg)');
    }
    $(slideshow)
      .css('animation', 'cube 2s')
      .on('animationend', function () {
        $(next.element).css('visibility', 'visible').css('transform', 'rotateY(90deg) translateX(-50%) rotateY(-90deg)');
        $(current.element).css('visibility', 'hidden');
        $(this).off('animationend').css('animation', '').css('transform', 'rotateY(0deg) scale(' + scale + ')');
      });
    $(current.element).css('transform', 'rotateY(90deg) translateX(-50%) rotateY(-90deg)');
    $(next.element).css('transform', 'translateX(50%) rotateY(90deg)').css('visibility', 'visible');
  };

  window.addEventListener('resize', this.refresh.bind(this));



  this.name = 'cube';
  this.refresh();
  $.keyframe.debug = true;

};

