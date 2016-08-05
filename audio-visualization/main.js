'use strict';
/* global exp */

var wavesurfer;

function play () {
  return new Promise(function (resolve, reject) {
    wavesurfer.play();
    wavesurfer.on('error', reject);
    
    if (exp.app.config.loop) {
      wavesurfer.on('finish', function() { wavesurfer.play(); });
    } else {
      wavesurfer.on('finish', resolve);
    }
  });
}

function load () {
  var height = Math.ceil(document.body.offsetHeight / 4);
  var ctx = document.createElement('canvas').getContext('2d');
  var linGrad = ctx.createLinearGradient(0, 0, 0, height * 2);
  linGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.000)');
  linGrad.addColorStop(0.5, 'rgba(183, 183, 183, 1.000)');

  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: exp.app.config.waveColor || linGrad,
    progressColor: exp.app.config.progressColor || 'rgba(126,87,194,0.5)',
    cursorColor: exp.app.config.cursorColor || '#fff',
    height: height,
    normalize: true,
    barWidth: exp.app.config.barWidth || 3
  });
  
  return Promise.resolve().then(function () {
    // add background image
    if (exp.app.config.background && exp.app.config.background.uuid) {
      return exp.getContent(exp.app.config.background.uuid).then(function (content) {
        if (!content) return;
        
        document.getElementById('background').style.backgroundImage = 'url(' + content.getUrl() + ')';
      });
    }
  }).then(function() {
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
  }).then(function (src) {
    return new Promise (function (resolve, reject) {
      wavesurfer.on('ready', resolve);
      wavesurfer.on('error', reject);
      wavesurfer.load(src);
      
      if (exp.app.config && (exp.app.config.volume || exp.app.config.volume === 0)) wavesurfer.setVolume(exp.app.config.volume);
    });
  });
}

function stop () {
  if (wavesurfer) wavesurfer.setVolume(0);
}
