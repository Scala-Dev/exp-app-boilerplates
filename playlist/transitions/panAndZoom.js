'use strict';
/* global transitions, $, exp */

transitions.panAndZoom = function () {

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var generateEffects = function () {
    var zoomStart = '';
    var zoomEnd = '';
    var startPoint = {};
    var endPoint = {};
    var minTrans = 2;
    var maxTrans = 11;

    for (var index = 1; index < 51; index++) {
      var effectName = 'kenburns' + index.toString();

      // zoom in or out
      if (Math.round(Math.random())) {
        zoomStart = '1.22';
        zoomEnd = '1.' + getRandomInt(3, 5).toString();
      } else {
        zoomStart = '1.' + getRandomInt(3, 5).toString();
        zoomEnd = '1.22';
      }

      // direction
      var width = $(window).width();
      if (Math.round(Math.random())) {
        startPoint.x = (getRandomInt(-minTrans, minTrans) / 100) * width;
        endPoint.x = (getRandomInt(-maxTrans, maxTrans) / 100) * width;
      } else {
        startPoint.x = (getRandomInt(-maxTrans, maxTrans) / 100) * width;
        endPoint.x = (getRandomInt(-minTrans, minTrans) / 100) * width;
      }
      var height = $(window).height()
      if (Math.round(Math.random())) {
        startPoint.y = (getRandomInt(-minTrans, minTrans) / 100) * height;
        endPoint.y = (getRandomInt(-maxTrans, maxTrans) / 100) * height;
      } else {
        startPoint.y = (getRandomInt(-maxTrans, maxTrans) / 100) * height;
        endPoint.y = (getRandomInt(-minTrans, minTrans) / 100) * height;
      }

      // create effect
      $.keyframe.define([{
        'name': effectName,
        '0%': {
          transform:  'matrix3d(' + zoomStart + ',0,0.00,0,0.00,' + zoomStart + ',0.00,0,0,0,1,0,' + startPoint.x + ',' + startPoint.y + ',0,1)'
        },
        '100%': {
          transform:  'matrix3d(' + zoomEnd + ',0,0.00,0,0.00,' + zoomEnd + ',0.00,0,0,0,1,0,' + endPoint.x + ',' + endPoint.y + ',0,1)'
        }
      }]);
    }
  };

  this.prepare = function () {
  };

  this.execute = function (current, next) {
    if (!current) {
      next.element.style.opacity = 1;
    } else {
      current.element.style.transition = 'opacity 0.5s';
      current.element.style.opacity = 0;
      next.element.style.transition = 'opacity 0.5s';
      next.element.style.opacity = 1;
    }
    // select a effect random
    // adding additional 2 seconds for effect. So effect is running while new slide is presented.
    next.element.style.animationName = 'kenburns' + getRandomInt(1, 50).toString();
    next.element.style.animationFillMode = 'forwards';
    next.element.style.animationDuration = ((next.options.duration / 1000) + 2).toString() + 's';
    next.element.style.animationTimingFunction = 'linear';
  };

  this.name = 'panAndZoom';
  $.keyframe.debug = false;
  generateEffects();
};
