'use strict';
/* global exp */

window.load = function () {
  exp.app.element.style.display = 'none';
};

window.play = function () {
  exp.getDevice(exp.auth.identity.uuid).then(function (device) {
    var channels = ['organization'];
    channels.push(device.uuid);
    if (device.document.experience && device.document.experience.uuid) channels.push(device.document.experience.uuid);
    if (device.document.location && device.document.location.uuid) channels.push(device.document.location.uuid);
    if (device.document.location && device.document.location.zones) {
      device.document.location.zones.forEach(function (zone) {
        channels.push(device.document.location.uuid + ':zone:' + zone.key);
      });
    }
    channels.forEach(function (channel) {
      exp.getChannel(channel).listen('fling', function (payload, callback) {
        exp.player.play(payload);
        callback(exp.auth.identity.uuid);
      });
    });
  });
  return new Promise(function () {});
};
