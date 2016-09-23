'use strict';
/* global exp */

var sequence;
var timeouts = {};

function getTime () {
  var date = new Date();
  return (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
}

function setSyncTimeout (now, target) {
  clearTimeout(timeouts[target]);
  if (now - target > 10000) return;
  timeouts[target] = setTimeout(sync, target - now);
}

function launch (item) {
  if (item.app && item.app.status !== 'unloaded') return; // Already playing.
  if (item.promise) return;
  item.promise = exp.player.load({ key: item.block.key, duration: 86400 * 1000 }).then(function (app) {
    delete item.promise;
    item.app = app;
    return item.app.play();
  }).catch(function (error) {
    window.console.error('Error launching app in dayplan.', error);
  }).then(function () {
    delete item.app;
    setTimeout(sync, 1000);
  });
}

function kill (item) {
  if (!item.app) return Promise.resolve();
  if (item.app.status !== 'unloaded') return item.app.abort('End of dayplan block', true);
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
  sequence.forEach(function (item) {
    if (now < item.block.startTime || now >= item.block.endTime) return kill(item);
    if (now >= item.block.startTime && now < item.block.endTime) return launch(item);
  });
}

window.play = function () {
  setSyncTimeouts();
  sync();
  return new Promise(function () {}); // Dayplan will loop forever.
};

window.load = function () {
  exp.app.element.style.display = 'none';
  sequence = exp.app.config.blocks.map(function (block) {
    block.key = block.appKey || block.key; // Backwards compatability.
    return { block: block, app: null };
  });
};
