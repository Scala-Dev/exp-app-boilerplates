'use strict';
/* global exp */

var promise = Promise.resolve();
var current = { child: null, experience: null, device: null, builtins: [] };
var next = { experience: null };

function enableBackgroundApps () {
  /* Play built in applications. */
  window.console.debug('Loading background apps.');
  if (current.builtins.length > 0) return Promise.resolve();
  return Promise.all([
    exp.player.load({ template: '7c8cbe65-d8e1-4359-85d7-21b90eb6ebc6' }), // menu
    exp.player.load({ template: '1b21ec6e-0b96-4089-bed8-0c6f36114916' }), // fling
    exp.player.load({ template: 'ef6e7796-a37e-4d30-b992-60e2e787e66d' }) // identifier
  ]).then(function (apps) {
    window.console.debug('Playing background apps.');
    current.builtins = apps;
    current.builtins.map(function (app) {
      app.play().catch(function (error) {
        window.console.warn('One of the background apps failed playback.');
        exp.app.abort(error);
      });
    });
  });
}

function disableBackgroundApps () {
  window.console.debug('Stopping background apps.');
  current.builtins.map(function (app) { app.stop(); });
  current.builtins = [];
}


/* Populates the device global */
function getDevice () {
  window.console.debug('Getting the current device.');
  return Promise.resolve().then(function () {
    if (exp.auth.identity.type !== 'device') {
      window.console.debug('Type of player is NOT a device. Skipping');
      return;
    }
    return exp.getCurrentDevice().then(function (device) {
      if (device) {
        window.console.debug('Using device with uuid: ' + device.uuid);
        return device;
      } else {
        throw new Error('Received no device from API.');
      }
    });
  }).catch(function (error) {
    window.console.warn('Unexpected error fetching current device.');
    throw error;
  });
}


/* Adds listeners for restart, update, and pairing. */
function listenOnDevice (device) {
  window.console.debug('Attaching device listeners for restart, update, and pairing.');
  return Promise.all([
    device.getChannel().listen('restart', function () {
      window.console.info('Device restart received. Restarting player.');
      exp.player.restart();
    }).then(function () {
      window.console.debug('Listening for device restart command.');
    }).catch(function (error) {
      window.console.warn('Error listening for device restart command.');
      throw error;
    }),
    device.getChannel({ system: true }).listen('update', function () {
      window.console.info('Device update received. Restarting player.');
      exp.player.restart();
    }).then(function () {
      window.console.debug('Listening for device update command.');
    }).catch(function (error) {
      window.console.warn('Error listening for device update command.');
      throw error;
    }),
    device.getChannel({ system: true }).listen('unpair', function () {
      window.console.info('Unpair command received. Unpairing player.');
      exp.player.unpair();
    }).then(function () {
      window.console.debug('Listening for device unpair command.');
    }).catch(function (error) {
      window.console.warn('Error listening for device unpair command.');
      throw error;
    })
  ]).catch(function (error) {
    window.console.warn('Error attaching a device listener.');
    throw error;
  });
}

function listenOnExperience (experience) {
  window.console.debug('Attaching experience listeners.');
  return experience.getChannel({ system: true }).listen('update', function () {
    window.console.info('Experience update received. Refreshing');
    refresh();
  }).then(function () {
    window.console.debug('Listening for experience update command.');
  }).catch(function (error) {
    window.console.warn('Error listening for experience update command.');
    throw error;
  });
}

function listenOnNetwork () {
  window.console.debug('Attaching network listeners.');
  return Promise.resolve().then(function () {
    exp.on('online', function () {
      window.console.info('Network online received. Refreshing.');
      refresh();
    });
  }).then(function () {
    window.console.debug('Listening for network online event.');
  }).catch(function (error) {
    window.console.warn('Error listening for network online event.');
    throw error;
  });
}

/* Gets the current experience and assigns it the the nextExperience global. */
function getExperience (device) {
  window.console.debug('Getting experience.');
  return Promise.resolve().then(function () {
    if (exp.player.params.experience) {
      window.console.debug('Getting experience specified in player params.');
      return exp.getExperience(exp.player.params.experience);
    } else if (device) {
      window.console.debug('Getting experience attached to device.');
      return device.getExperience();
    } else {
      window.console.debug('Player has no experience.');
      return null;
    }
  }).then(function (experience) {
    if (experience) {
      window.console.debug('Obtained experience with uuid: ' + experience.uuid);
      return experience;
    } else {
      window.console.debug('No experience was found.');
      return null;
    }
  }).catch(function (error) {
    window.console.warn('Error getting the experience.');
    throw error;
  });
}


function refresh () {
  window.console.debug('Refresh requested.');
  promise = promise.then(function () {
    window.console.debug('Refresh starting.');
    return getExperience(current.device).then(function (experience) { next.experience = experience; });
  }).then(function () {
    if (exp.app.status !== 'playing') {
      window.console.debug('App is not playing. Skipping reload.');
      return;
    }
    if ((current.experience &&
         current.experience.document.lastModified === next.experience.document.lastModified)) {
      window.console.debug('Experience unchanged. Skipping reload.');
      return;
    }
    window.console.debug('Experience needs to be reloaded.');
    setTimeout(reload, 0); // Async to resolve promise.
  }).catch(function (error) {
    window.console.warn('Refresh of experience failed.');
    exp.app.abort(error);
    throw error;
  });
}


function loadChild (experience) {
  if (exp.player.params.key) {
    window.console.debug('Loading application by key.');
    return exp.player.load({
      key: exp.player.params.key,
      duration: 86400 * 1000
    });

  } else {
    window.console.debug('Loading schedule app.');
    return exp.player.load({
      template: 'a2eee36c-0171-4d36-9e5d-04850c7c56b3',
      config: { recurrences: experience.document.schedule.recurrences },
      duration: 86400 * 1000
    });
  }
}


function reload () {
  window.console.debug('Reload requested.');
  promise = promise.then(function () {
    window.console.debug('Reload starting.');
    current.experience = next.experience;
    if (current.experience && current.experience.document.disableBackgroundApps) {
      return disableBackgroundApps();
    } else {
      return enableBackgroundApps();
    }
  }).then(function () {
    if (!current.experience) {
      window.console.warn('Player has no experience.');
      return;
    }
    const old = current.child;
    current.child = null;
    if (old && ['ready', 'playing'].indexOf(old.status) !== -1) old.stop();
    return loadChild(current.experience).then(function (app) {
      current.child = app;
      current.child.play().then(function () {
        if (current.child === app) {
          window.console.debug('Child playback finished.');
          reload();
        }
      }).catch(function (error) {
        window.console.warn('Child app failed.');
        exp.app.abort(error);
      });
    });
  }).catch(function (error) {
    window.console.warn('Reload of experience failed.');
    exp.app.abort(error);
    throw error;
  });

}


function load () {
  return Promise.resolve().then(function () {
    return getDevice().then(function (device) { current.device = device; });
  }).then(function () {
    return getExperience(current.device).then(function (experience) { next.experience = experience; });
  }).then(function () {
    if (current.device) listenOnDevice(current.device);
  }).then(function () {
    if (next.experience) listenOnExperience(next.experience);
  }).then(function () {
    listenOnNetwork();
  });
}


function play () {
  reload();
  return new Promise(function () {});
}
