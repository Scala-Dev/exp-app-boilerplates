'use strict';

function load() {
  var loadPromise = new Promise(function(resolve, reject) {
    window.initialFeedResolve = resolve;
    window.initialFeedReject = resolve;
  });

  angular.bootstrap(document, ['weather-app']);

  return loadPromise;
}

function play() {
}
