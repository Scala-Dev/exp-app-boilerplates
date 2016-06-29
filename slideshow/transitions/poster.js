'use strict';
/* global transitions, slides */

transitions.poster = function () {
  this.name = 'poster';
  this.prepare = function () {};
  this.execute  = function (current, next) {
 	if (current) current.element.setAttribute('slide-out', '');
 	next.element.setAttribute('slide-in', '');
  };
};
