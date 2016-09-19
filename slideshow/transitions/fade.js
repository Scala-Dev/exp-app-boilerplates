'use strict';
/* global transitions, slides */

transitions.fade = function () {
  this.name = 'fade';
  this.prepare = function (app) {
    if (app.first) app.element.setAttribute('first', '');
    if (app.last) app.element.setAttribute('last', '');
  };
  this.execute  = function () {};
};
