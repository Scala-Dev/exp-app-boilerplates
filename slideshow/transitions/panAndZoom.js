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
      if (Math.round(Math.random())) {
        startPoint.x = getRandomInt(-minTrans, minTrans).toString() + '%';
        endPoint.x = getRandomInt(-maxTrans, maxTrans).toString() + '%';
      } else {
        startPoint.x = getRandomInt(-maxTrans, maxTrans).toString() + '%';
        endPoint.x = getRandomInt(-minTrans, minTrans).toString() + '%';
      }
      if (Math.round(Math.random())) {
        startPoint.y = getRandomInt(-minTrans, minTrans).toString() + '%';
        endPoint.y = getRandomInt(-maxTrans, maxTrans).toString() + '%';
      } else {
        startPoint.y = getRandomInt(-maxTrans, maxTrans).toString() + '%';
        endPoint.y = getRandomInt(-minTrans, minTrans).toString() + '%';
      }

      // create effect
      $.keyframe.define([{
        'name': effectName,
        '0%': {
          transform: 'translate(' + startPoint.x + ',' + startPoint.y + ') scale(' + zoomStart + ')'
        },
        '100%': {
          transform: 'translate(' + endPoint.x + ',' + endPoint.y + ') scale(' + zoomEnd + ')'
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
