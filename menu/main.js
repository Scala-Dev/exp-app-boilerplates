'use strict';
/* global exp */

var offlineUpdateInterval;

function onDeviceOnline () {
  document.getElementById('online').style.display = 'block';
  document.getElementById('offline').style.display = 'none';
}

function onDeviceOffline () {
  document.getElementById('online').style.display = 'none';
  document.getElementById('offline').style.display = 'block';
}

function update () {
  if (exp.auth) {
    exp.get('/api/organizations/current').then(function (org) {
      document.getElementById('organization').textContent = org.description;
    });
    Promise.resolve().then(function () {
      if (exp.auth.identity.type === 'device') return exp.getDevice(exp.auth.identity.uuid);
    }).catch(function () {
      window.console.warn('Failed to fetch device.');
    }).then(function (device) {
      if (device) document.getElementById('name').textContent = device.document.name;
      else if (exp.auth.identity.type === 'consumerApp') document.getElementById('name').textContent = 'Consumer App';
      else document.getElementById('name').textContent = 'Unknown';
      if (exp.player.params.experience) {
        return exp.getExperience(exp.player.params.experience);
      } else if (device) {
        return device.getExperience();
      }
    }).catch(function () {
      window.console.warn('Failed to fetch experience.');
    }).then(function (experience) {
      if (experience && experience.document && experience.document.name) {
        document.getElementById('experience').textContent = experience.document.name;
      } else {
        document.getElementById('experience').textContent = 'No Experience Assigned';
      }
    });
  } else {
    document.getElementById('organization').textContent = 'Organization Name Unknown';
    document.getElementById('name').textContent = 'Device Name Unknown';
    document.getElementById('experience').textContent = 'Experience Name Unknown';
  }

  if (exp.isConnected) {
    onDeviceOnline();
  } else {
    onDeviceOffline();
  }
}

function formatBytes (bytes) {
  if (bytes > 1.024E9) {
    bytes = (bytes / 1.024E9).toFixed(2) + 'GB';
  } else if (bytes > 1.024E6) {
    bytes = (bytes / 1.024E6).toFixed(2) + 'MB';
  } else if (bytes > 1.024E3) {
    bytes = (bytes / 1.024E3).toFixed(2) + 'KB';
  } else {
    bytes = bytes.toFixed(2) + 'B';
  }
  return bytes;
}

function updateOffline () {
  exp.player.offline.report().then(function (report) {
    document.getElementById('offline-storage').style.display = 'block';
    if (isFinite(report.maximum.size) && !isNaN(report.maximum.size)) {
      document.getElementById('offline-storage-session-bar').style.width = (report.session.size / report.maximum.size * 100) + '%';
      document.getElementById('offline-storage-total-bar').style.width = ((report.total.size - report.session.size) / report.maximum.size * 100) + '%';
      document.getElementById('offline-storage-maximum-bar').style.width = ((report.maximum.size - report.total.size) / report.maximum.size * 100) + '%';
      document.getElementById('offline-storage-text').textContent = formatBytes(report.session.size) + ' / ' + formatBytes(report.total.size) + ' / ' + formatBytes(report.maximum.size);
    } else {
      document.getElementById('offline-storage-session-bar').style.width = (report.session.size / report.total.size / 2 * 100) + '%';
      document.getElementById('offline-storage-total-bar').style.width = ((report.total.size - report.session.size ) / report.total.size / 2 * 100) + '%';
      document.getElementById('offline-storage-maximum-bar').style.width = '50%';
      document.getElementById('offline-storage-text').textContent = formatBytes(report.session.size) + ' / ' + formatBytes(report.total.size) + ' / Unknown';
    }
  }).catch(function (error) {
    window.console.error(error);
    window.console.warn('Failed to get offline storage info.', error);
    document.getElementById('offline-storage').style.display = 'none';
  });
}

function open () {
  if (exp.player.offline) {
    offlineUpdateInterval = setInterval(updateOffline, 5000);
    updateOffline();
  } else {
    document.getElementById('offline-storage').style.display = 'none';
  }

  update();

  window.document.getElementById('menu').style.visibility = 'visible';
  exp.app.element.style.width = '';
  exp.app.element.style.height = '';
  exp.app.element.style.top = '0px';
  exp.app.element.style.right = '0px';
}

function close () {
  clearInterval(offlineUpdateInterval);
  window.document.getElementById('menu').style.visibility = 'visible';
  exp.app.element.style.width = '24px';
  exp.app.element.style.height = '24px';
  exp.app.element.style.top = '';
  exp.app.element.style.right = '';
}


window.load = function () {
  exp.app.element.style.zIndex = '1000';
  close();
  var launcher = document.getElementById('launcher');
  launcher.onmousedown = open;
  launcher.ontouchstart = open;
  document.getElementById('close').onclick = close;
  document.getElementById('unpair').onclick = function () { exp.player.unpair(); };
  exp.on('offline', onDeviceOffline);
  exp.on('online', onDeviceOnline);
  update();
};


window.play = function () {
  return new Promise(function () {});
};
