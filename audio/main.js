'use strict';
/* global exp */


var audio;

function play () {
  return new Promise(function (resolve, reject) {
    audio.play();
    audio.addEventListener('error', reject);
    audio.addEventListener('ended', resolve);
  });
}

function unload () {
  audio.setAttribute('src', '');
}

function load () {
  audio = document.getElementById('audio');
  return Promise.resolve().then(function () {

    // If loop wasn't explicitly set. Infer from playback context.
    if (exp.app.config.loop !== true && exp.app.config.loop !== false) {
      exp.app.config.loop = !exp.app.context.once;
    }
    
    if (exp.app.config.loop) {
      audio.setAttribute('loop', ' ');
    }

    if (exp.app.config.url) {
      return exp.app.config.url;
    } else if (exp.app.config.content && exp.app.config.content.uuid) {
      return exp.getContent(exp.app.config.content.uuid).then(function (content) {
        if (!content) throw new Error('Content lookup failed.');
        return content.getUrl();
      });
    } else {
      throw new Error('Received no content.');
    }
  }).then(function (src) {
    return new Promise (function (resolve, reject) {
      audio.setAttribute('src', src);
      if (exp.app.config && (exp.app.config.volume || exp.app.config.volume === 0)) audio.volume = exp.app.config.volume;
      audio.addEventListener('error', reject);
      audio.addEventListener('canplaythrough', resolve);
    });
  });
}


function stop () {
  audio.volume = 0;
}
