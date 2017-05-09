'use strict';
/* global exp */


var video;

function play () {
  return new Promise(function (resolve, reject) {
    video.play();
    video.addEventListener('error', function(e) { reject(e.target.error); });
    video.addEventListener('ended', resolve);
  });
}

function unload () {
  video.setAttribute('src', '');
}

function load () {
  video = document.getElementById('video');
  return Promise.resolve().then(function () {
    let videoPromise;
    let captionsTrackPromise;

    // If loop wasn't explicitly set. Infer from playback context.
    if (exp.app.config.loop !== true && exp.app.config.loop !== false) {
      exp.app.config.loop = !exp.app.context.once;
    }

    if (exp.app.config.loop) {
      video.setAttribute('loop', ' ');
    }

    if (exp.app.config.captionsTrack) {
      captionsTrackPromise = exp.getContent(exp.app.config.captionsTrack.uuid);
    }

    if (exp.app.config.url) {
      videoPromise = Promise.resolve(exp.app.config.url);
    } else if (exp.app.config.content && exp.app.config.content.uuid) {
      videoPromise = exp.getContent(exp.app.config.content.uuid).then(function (content) {
        if (!content) throw new Error('Content lookup failed.');
        if (content.hasVariant('video.mp4')) {
          return content.getVariantUrl('video.mp4');
        }
        else {
          return content.getUrl();
        }
      });
    } else {
      throw new Error('Received no content.');
    }

    return Promise.all([videoPromise, captionsTrackPromise]);
  }).then(function (results) {
    const [src, captions] = results;

    return new Promise (function (resolve, reject) {
      video.setAttribute('src', src);
      if (exp.app.config && (exp.app.config.volume || exp.app.config.volume === 0)) video.volume = exp.app.config.volume;
      video.addEventListener('error', function(e) { reject(e.target.error); });
      video.addEventListener('canplaythrough', resolve);

      if (captions) {
        video.addEventListener('loadedmetadata', function() {
          const track = document.createElement('track');
          track.src = captions.getUrl();
          track.default = ' ';

          video.appendChild(track);
        });

      }

      video.load();
    });
  });
}


function stop () {
  video.volume = 0;
}
