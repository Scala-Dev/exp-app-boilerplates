'use strict';
/* global transitions, slides */

transitions.poster = function () {
  this.name = 'poster';
  this.prepare = function (app) {
    if (app.first) app.element.setAttribute('first', '');
  };
  this.execute  = function (current, next) {
    if (current) current.element.setAttribute('slide-out', '');
    if (!next.first) next.element.setAttribute('slide-in', '');
  };
};
