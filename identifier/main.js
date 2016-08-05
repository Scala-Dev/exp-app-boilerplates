'use strict';
/* global exp */

var timeout;

function load () {
  exp.app.element.style.display = 'block';
}

function play () {
  var timeout;
  exp.getDevice(exp.auth.identity.uuid).then(function (device) {
    device.getChannel().listen('identify', function (payload, callback) {
      clearTimeout(timeout);
      exp.app.element.style.display = 'block';
      exp.app.element.style.zIndex = 999;
      document.getElementById('identifier').style.visibility = 'visible';
      document.getElementById('identifier-name').innerHTML = device.document.name;
      timeout = setTimeout(function () {
        exp.app.element.style.display = 'none';
        document.getElementById('identifier').style.visibility = 'hidden';
      }, 15000);
      callback();
    });
  });
  return new Promise(function () {});
}
