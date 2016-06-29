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
    if (matches && matches[1]) {
      videoId = matches[1];
    } else {
      throw new Error('url is not valid youtube url');
    }
    loadResolve(videoId);
    return youtubePromise;
  });
}

function onPlayerError(event) {
  playReject(new Error('error occurs while playing video, code: ' + event.data));
}


function onPlayerReady(event) {
  player.setPlaybackQuality('hd1080');
  readyEvent = event;
  youtubeResolve();
}


function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    readyEvent.target.mute();
    playResolve();
  }
}

function onYouTubeIframeAPIReady() {
  loadPromise.then(function (videoId) {
    player = new YT.Player('player', {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        enablejsapi: 1,
        iv_load_policy: 3,
        loop: 0,
        origin: 'http://' + window.location.host,
        playlist: videoId
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
