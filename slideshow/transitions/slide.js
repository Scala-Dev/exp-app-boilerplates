'use strict';
/* global transitions, slides */

transitions.slide = function () {
  this.name = 'slide';
  this.prepare = function () {};
  this.execute  = function (current, next) {
 	if (current) current.element.setAttribute('slide-out', '');
 	next.element.setAttribute('slide-in', '');
  };
};
