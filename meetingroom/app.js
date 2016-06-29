'use strict';
/* global exp, moment */

moment.locale(window.navigator.userLanguage || window.navigator.language);

var app = angular.module('meetingRoomApp',['ngMaterial']);

function load () { angular.bootstrap(document.body, ['meetingRoomApp']); }

app.controller('mainController', function ($scope, $interval) {

  $scope.now = new Date();
  $scope.config = exp.app.config;
  $scope.events = [];
  $scope.target = new Date();
  $scope.moment = moment;
  $scope.current = null;

  $scope.targetFormat = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    sameElse: 'll'
  };

  function getLogo () {
    if (!$scope.config.logo || !$scope.config.logo.uuid) return;
    return exp.getContent($scope.config.logo.uuid).then(function(content) {
       $scope.logo = content.getUrl();
    });
  }

  function refreshFeed () {
    return exp.getFeed($scope.config.feed.uuid).then(function (feed) {
      return feed.getData().then(function (data) {
        $scope.events = [];
        $scope.current = null;
        $scope.days = [];
        var days = [];
        var events = data.items;
        events.forEach(function (event) {
          event.start = new Date(event.metadata.startDate);
          event.end = new Date(event.metadata.endDate);
          if (event.start < $scope.now && event.end > $scope.now) { $scope.current = event; }
          var day = days.find(function (day) { return day.date.toLocaleDateString() === event.start.toLocaleDateString(); });
          if (day) { day.events.push(event); }
          else { days.push({ date: event.start, events: [event] })}
        });
        $scope.days = days;
        $scope.events = events;
      });
    });
  }

  function refreshTime () { $scope.now = new Date(); }

  $interval(refreshFeed, (parseFloat($scope.config.refreshInterval) || 60) * 1000);
  $interval(refreshTime, 1000);

  refreshFeed();
  refreshTime();
  getLogo();

});
