'use strict';
/* global exp */

var channelOptions = {};
var current;

function fling (payload, callback) {

  window.console.log('Received fling event.');
  
  exp.player.load(payload).then(function (app) {
    if (current) {
      window.console.log('Stopping current app.');
      try {
        current.stop();
        window.console.log('Currently playing app stopped.');
      } catch (error) {
        window.console.warn('Failed to stop current app.', error);
      }
    }
    current = app;
    exp.app.element.style.zIndex = 1000;
    app.play().catch(function (error) {
      window.console.warn('Application playback failed.', error);
    }).then(function () {
      window.console.log('Application playback finished.');
      if (current === app) exp.app.element.style.zIndex = -1000;
    });
  }, function (error) {
    window.console.warn('Could not load application.', error);
  });

  callback(exp.auth.identity.uuid);

}

window.play = function () {

  exp.app.context.once = true;

  if (exp.auth.identity.type === 'consumerApp') channelOptions.consumer = true;
  else channelOptions.consumer = false;

  // Organization.
  exp.getChannel('organization', channelOptions).listen('fling', fling).then(function () {
    window.console.log('Listening on organization channel.');
  }, function (error) {
    window.console.warn('Failed to listen on organization channel.', error);
  });

  // Experience.
  Promise.resolve().then(function () {
    if (exp.player.params.experience) {
      return exp.getExperience(exp.player.params.experience);
    } else {
      return exp.getCurrentExperience();
    }
  }).then(function (experience) {
    if (experience) {
      return experience.getChannel(channelOptions).listen('fling', fling).then(function () {
        window.console.log('Listening on experience channel.');
      }, function (error) {
        window.console.warn('Failed to listen on experience channel.', error);
      });
    } else {
      return window.console.log('Player has no experience.');
    }
  }, function (error) {
    window.console.warn('Failed to obtain current experience.', error);
  });

  // Device.
  if (exp.auth.identity.type === 'device') {
    exp.getDevice(exp.auth.identity.uuid).then(function (device) {
      if (device) {
        return device.getChannel(channelOptions).listen('fling', fling).then(function () {
          window.console.log('Listening on device channel.');
        }).catch(function (error) {
          window.console.warn('Failed to listen on device channel.', error);
        });
      } else {
        return window.console.warn('Unexpected. Player is not attached to a device.');
      }
    }, function (error) {
      window.console.warn('Failed to obtain player\'s device.', error);
    });
  } else {
    window.console.log('Player is not a device.');
  }

  // Location.
  if (exp.auth.identity.type === 'device') {
    exp.getCurrentLocation().then(function (location) {
      if (location) {
        return location.getChannel(channelOptions).listen('fling', fling).then(function () {
          window.console.log('Listening on location channel.');
        }, function (error) {
          window.console.warn('Failed to listen on location channel.', error);
        }).then(function () {
          setupZones(location);
        });
      } else {
        window.console.log('Device is not in a location.');
      }
    }, function (error) {
      window.console.warn('Failed to obtain location of device.', error);
    });
  } else {
    window.console.log('Player is not a device. No location available.');
  }

  return new Promise(function () {});

};


function setupZones (location) {
  return location.getZones().then(function (zones) {
    return Promise.all(zones.map(function (zone) {
      return zone.getChannel(channelOptions).listen('fling', fling);
    })).then(function () {
      window.console.log('Listening to zone channels.');
    }, function (error) {
      window.console.warn('Failed to listen for fling events on one or more zones.', error);
    });
  }, function (error) {
    window.console.warn('Failed to obtain location\'s zones.', error);
  });
}
