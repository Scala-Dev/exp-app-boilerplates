'use strict';
/* global exp, moment */

moment.locale(window.navigator.userLanguage || window.navigator.language);

var app = angular.module('meetingRoomApp',['ngMaterial']);

function load () {
  if (!exp.app.config.feed) return Promise.reject('Feed not configured. Cannot launch meeting room app.');
  angular.bootstrap(document.body, ['meetingRoomApp']);
}

app.controller('mainController', function ($scope, $interval) {

  $scope.now = new Date();
  $scope.config = exp.app.config;
  $scope.events = [];
  $scope.target = new Date();
  $scope.moment = moment;
  $scope.current = null;

  $scope.groupFormat = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd, MMM D',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'll'
  };

  $scope.timeFormat = {
    sameDay: 'LT',
    nextDay: 'MMM D, LT',
    nextWeek: 'MMM D, LT',
    lastDay: 'MMM D, LT',
    lastWeek: 'MMM D, LT',
    sameElse: 'MMM D, LT'
  };

  var groups = [];

  $scope.days = function() {
    groups = [];

    // only return the days
    return $scope.events.map(function(event) { return event.day; });
  };

  $scope.groupByDay = function(day) {
    var isNewGroup = groups.indexOf(day) === -1;

    if (isNewGroup) groups.push(day);

    return isNewGroup;
  };

  function setCurrent(event) {
    if (!event) {
      $scope.current = null;
      // change color here etc.
    } else if (!$scope.current || $scope.current.id !== event.id) {
      event.day = moment($scope.now).format('YYYY-MM-DD');
      $scope.current = event;
      // change color here etc.
    }
  }

  function getLogo () {
    if (!$scope.config.logo || !$scope.config.logo.uuid) return;
    return exp.getContent($scope.config.logo.uuid).then(function(content) {
      if (content) $scope.logo = content.getUrl();
    });
  }

  function refreshFeed () {
    return exp.getFeed($scope.config.feed.uuid).then(function (feed) {
      return feed.getData().then(function (data) {
        $scope.current = null;
        var days = [];
        var events = [];
        data.items.forEach(function (event) {
          event.start = moment(event.metadata.startDate).toDate();
          event.end = moment(event.metadata.endDate).toDate();
          if (event.end < $scope.now) return; // skip past events

          event.text = event.text || '(No title)';
          event.day = moment(event.start < $scope.now ? $scope.now : event.start).format('YYYY-MM-DD');
          events.push(event);
        });
        $scope.events = events;
      });
    });
  }

  function refreshTime () {
    $scope.now = new Date();

    var next = $scope.events[0];

    if (next && next.start < $scope.now) {
      if (next.end > $scope.now) {
        return setCurrent(next);
      }

      $scope.events.shift(); // remove past event
    }

    setCurrent(null);
  }

  $interval(refreshFeed, (parseFloat($scope.config.refreshInterval) || 60) * 1000);
  $interval(refreshTime, 1000);

  refreshFeed();
  refreshTime();
  getLogo();

});
