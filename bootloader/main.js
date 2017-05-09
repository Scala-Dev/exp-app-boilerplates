'use strict';
/* global exp */

(function () {


  // Showing and hiding errors.
  function show (message) {
    clearTimeout(authTimeout);
    document.getElementById('error').textContent = message;
    document.getElementById('error').style.zIndex = 1000;
    document.getElementById('error').style.opacity = 1;
  }

  function hide () {
    clearTimeout(authTimeout);
    document.getElementById('error').style.zIndex = -1000;
    document.getElementById('error').style.opacity = 0;
  }

  // Experience app launch.
  function launchExperienceApp () {
    return exp.player.load({
      template: '23a31727-9578-4e22-9452-03fc7a0f9862'
    }).catch(onExperienceAppLaunchError);
  }

  function onExperienceAppLaunchError (error) {
    window.console.warn('Experience app failed to load.', error);
    throw error;
  }


  // Pairing app launch.
  function launchPairingApp () {
    return exp.player.load({
      template: '5e9a5aaf-7a03-4651-8c73-8675635dcf88'
    }).catch(onPairingAppLaunchError);
  }

  function onPairingAppLaunchError (error) {
    window.console.warn('Pairing app failed to load.', error);
    throw error;
  }


  // Child launch
  function launchChild (auth) {
    return Promise.resolve().then(function () {
      if (auth.identity.isPairing) {
        return launchPairingApp();
      } else {
        return launchExperienceApp();
      }
    }).catch(onChildLaunchError);
  }

  function onChildLaunchError (error) {
    window.console.warn('Bootload child failed to load.', error);
    throw error;
  }

  // Auth
  var authTimeout;

  function getAuth () {
    authTimeout = setTimeout(onGetAuthTimeout, 5000);
    return exp.getAuth().then(onGetAuthSuccess, onGetAuthError);
  }

  function onGetAuthSuccess (auth) {
    clearTimeout(authTimeout);
    hide();
    return auth;
  }

  function onGetAuthError (error) {
    clearTimeout(authTimeout);
    window.console.warn('Bootloader failed to get auth.', error);
    throw error;
  }

  function onGetAuthTimeout () {
    show('Waiting for authentication...');
  }

  // Playback
  function playChild (app) {
    return app.play().then(onPlayChildSuccess, onPlayChildError);
  }

  function onPlayChildSuccess () {
    throw new Error('Playback finished.');
  }

  function onPlayChildError (error) {
    window.console.warn('Bootloader child playback failed.', error);
    throw error;
  }

  // Error handler.
  function onError (error) {
    window.console.warn('Bootloader encountered an error.', error);
    show(((error && error.message) ? error.message : 'An unknown error has occured.'));
    return new Promise(function (resolve, reject) {
      setTimeout(function () { reject(error); }, 3000);
    });
  }


  function load () {
    hide();
    
  }

  function play () {

    var date = new Date();
    var timeUntilMidnight = (86400 - date.getHours() * 3600 - date.getMinutes() * 60 - date.getSeconds()) * 1000;
    setTimeout(function () { exp.app.abort(); }, timeUntilMidnight);

    return Promise.resolve()
      .then(getAuth)
      .then(launchChild)
      .then(playChild)
      .catch(onError);
  }


  window.load = function () { return load(); };
  window.play = function () { return play(); };

})();
