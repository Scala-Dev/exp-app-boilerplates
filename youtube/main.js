'use strict';
/* global exp, YT */

var re = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
var player, readyEvent;
var loadPromise, loadResolve, loadReject;
var youtubePromise, youtubeResolve, youtubeReject;
var playPromise, playResolve, playReject;

loadPromise = new Promise(function (resolve, reject) {
  loadResolve = resolve;
  loadReject = reject;
});

youtubePromise = new Promise(function (resolve, reject) {
  youtubeResolve = resolve;
  youtubeReject = reject;
});

playPromise = new Promise(function (resolve, reject) {
  playResolve = resolve;
  playReject = reject;
});


function load () {
  return Promise.resolve().then(function () {
    // If loop wasn't explicitly set. Infer from playback context.
    if (exp.app.config.loop !== true && exp.app.config.loop !== false) {
      exp.app.config.loop = !exp.app.context.once;
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
  }).then(function (url) {
    var matches = re.exec(url);
    var videoId;

    if (matches && matches[1]) videoId = matches[1];
    else throw new Error('url is not valid youtube url');

    var options = {};
    options.id = videoId;
    options.loop = exp.app.config.loop ? 1 : 0;
    loadResolve(options);
    const script = document.createElement('script');
    script.setAttribute('src', 'https://www.youtube.com/iframe_api');
    document.body.appendChild(script);
    return youtubePromise;
  });
}

function onPlayerError(event) {
  playReject(new Error('error occurs while playing video, code: ' + event.data));
}


function onPlayerReady(event) {
  if (exp.app.config.volume || exp.app.config.volume === 0) {
    player.setVolume(parseInt(exp.app.config.volume) * 100);
  }
  player.setPlaybackQuality('hd1080');

  readyEvent = event;
  youtubeResolve();
}


function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED && !exp.app.config.loop) {
    readyEvent.target.mute();
    playResolve();
  }
}

function onYouTubeIframeAPIReady() {
  loadPromise.then(function (options) {
    player = new YT.Player('player', {
      videoId: options.id,
      playerVars: {
        autoplay: 0,
        controls: 0,
        enablejsapi: 1,
        iv_load_policy: 3,
        rel: 0,
        loop: options.loop,
        origin: 'http://' + window.location.host,
        playlist: options.id
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    });
  });
}


function play () {
  readyEvent.target.playVideo();
  return playPromise;
}
