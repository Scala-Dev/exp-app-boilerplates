'use strict';
/* global exp, RRule */

function getTime () {
  var date = new Date();
  return (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
}

function localizeDate (date, hours, minutes, seconds, milliseconds) {
  var year = date.getUTCFullYear();
  var month = date.getUTCMonth();
  var day = date.getUTCDate();
  return new Date(year, month, day, hours, minutes, seconds, milliseconds);
}

function getRecurrences () {
  return exp.app.config.recurrences.map(function (recurrence) {
    var options = RRule.parseString(recurrence.rrule);
    if (options.dtstart) options.dtstart = localizeDate(options.dtstart, 12, 0, 0, 0);
    if (options.until) options.until = localizeDate(options.until, 23, 59, 59, 999);
    var rruleString = RRule.optionsToString(options);
    return {
      rrule: RRule.fromString(rruleString),
      appKey: recurrence.dayPlanKey || recurrence.appKey
    };
  }).reverse();
}

function getCurrentRecurrence () {
  var date = new Date();
  var recurrences = getRecurrences();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var start = new Date(year, month, day, 0, 0, 0, 0);
  var end = new Date(year, month, day, 23, 59, 59, 999);
  return recurrences.find(function (recurrence) { return recurrence.rrule.between(start, end).length > 0; });
}

function playForever (key) {
  return exp.player.play({ key: key }).catch(function() {}).then(function() {
    setTimeout(function() { return playForever(key); }, 5000);
  });
}

window.load = function () {
  exp.app.element.style.display = 'none';
};

window.play = function () {
  var recurrence = getCurrentRecurrence();
  if (recurrence) {
    playForever(recurrence.appKey);
  } else {
    window.console.warn('Nothing scheduled today.');
  }
  return new Promise(function (resolve) { setTimeout(resolve, 86400 * 1000 - getTime()); });
};
