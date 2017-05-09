'use strict';

var apps;

function load() {
  exp.app.context.once = false;
  
  var region1 = document.getElementById('region1');
  var region2 = document.getElementById('region2');
  
  var orientation = exp.app.config.orientation || 'vertical';
  
  region1.setAttribute('class', orientation);
  region2.setAttribute('class', orientation);
  
  if (orientation === 'vertical') {
    region1.style.width = exp.app.config.size + '%';
    region2.style.width = (100 - exp.app.config.size) + '%';
  } else {
    region1.style.height = exp.app.config.size + '%';
    region2.style.height = (100 - exp.app.config.size) + '%';
  }
  
  // get the apps to play in each region
  var region1Config = exp.app.config.region1;
  var region2Config = exp.app.config.region2;
  
  // tell the apps to play inside the divs
  region1Config.container = region1;
  region2Config.container = region2;
  
  // tell the apps to play all day
  region1Config.duration = 86400 * 1000;
  region2Config.duration = 86400 * 1000;
  
  return Promise.all([
    exp.player.load(exp.app.config.region1),
    exp.player.load(exp.app.config.region2)
  ])
  .then(function(results) {
    apps = results;
  });
 
}

function play() {
  apps.forEach(function(app) {
    app.play();
  });
}
