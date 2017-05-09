'use strict';

var apps;

function load() {
  if (!exp.app.options.duration) {
    var duration = exp.app.options.duration;

    if (!exp.app.config.foregroundApp.duration) {
      exp.app.config.foregroundApp.duration = duration;
    }

    if (!exp.app.config.backgroundApp.duration) {
      exp.app.config.backgroundApp.duration = duration;
    }
  }

  var foregroundContainer = document.getElementById('foreground-container');
  var backgroundContainer = document.getElementById('background-container');

  exp.app.config.foregroundApp.container = foregroundContainer;
  exp.app.config.backgroundApp.container = backgroundContainer;

  if (exp.app.config.hideBackgroundApp) {
    backgroundContainer.style.visibility = 'hidden';
  }

  if (exp.app.config.foregroundOpacity !== undefined) {
    foregroundContainer.style.opacity = exp.app.config.foregroundOpacity;
  }

  return Promise.all([
    exp.player.load(exp.app.config.foregroundApp),
    exp.player.load(exp.app.config.backgroundApp)
  ])
  .then(function(results) {
    apps = results;
  });
}

function play() {
  return Promise.race(apps.map(function(app) {
    return app.play();
  }));
}
