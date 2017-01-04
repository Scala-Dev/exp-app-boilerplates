'use strict';
/* global exp */

var sequence;
var timeouts = {};
var loadResolve;

function getTime () {
  var date = new Date();
  return (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
}

function setSyncTimeout (now, target) {
  clearTimeout(timeouts[target]);
  if (now - target > 10000) return;
  timeouts[target] = setTimeout(sync, target - now);
}

function setSyncTimeouts () {
  var now = getTime();
  sequence.forEach(function (item) {
    setSyncTimeout(now, item.block.startTime);
    setSyncTimeout(now, item.block.endTime);
    setSyncTimeout(now, item.block.startTime + 86400 * 1000);
    setSyncTimeout(now, item.block.endTime + 86400 * 1000);
  });
}

function sync () {
  var now = getTime();
  var hasOne = false;
  sequence.forEach(function (item) {
    if (now < item.block.startTime || now >= item.block.endTime) {
      if (item.promise) stopItem(item);
    } else if (now >= item.block.startTime && now < item.block.endTime) {
      hasOne = true;
      if (item.promise) playItem(item);
      else loadItem(item);
    }
  });
  if (!hasOne) loadResolve();
}

function loadItem (item) {
  window.console.log('Loading child application.');
  item.promise = exp.player.load({
    key: item.block.key,
    duration: 86400 * 1000
  }).then(function (app) {
    window.console.log('Child application loaded.');
    setTimeout(sync, 0);
    loadResolve();
    return app;
  }, function (error) {
    delete item.promise;
    window.console.warn('Child application failed to load.', error);
    setTimeout(sync, 5000);
  });
}

function playItem (item) {
  item.promise.then(function (app) {
    if (exp.app.status !== 'playing' || app.status !== 'ready') return;
    window.console.log('Child application playback started.');
    app.play().then(function () {
      delete item.promise;
      window.console.info('Child application playback finished.');
      setTimeout(sync, 0);
    }, function (error) {
      delete item.promise;
      window.console.warn('Child application playback failed.', error);
      setTimeout(sync, 5000);
    });
  });
}

function stopItem (item) {
  item.promise.then(function (app) {
    if (app.status === 'loading') app.abort('Stopped by dayplan.');
    else if (app.status === 'playing') app.stop();
  });
}

window.play = function () {
  setSyncTimeouts();
  sync();
  return new Promise(function () {}); // Dayplan will loop forever.
};

window.load = function () {
  sequence = exp.app.config.blocks.map(function (block) {
    block.key = block.appKey || block.key; // Backwards compatability.
    return { block: block, app: null };
  });
  return new Promise(function (loadResolve_) {
    loadResolve = loadResolve_;
    sync();
  });
};
