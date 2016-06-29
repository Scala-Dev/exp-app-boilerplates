'use strict';
/* global exp */

(function () {

  var onlineTimeout;

  function online () {
    clearTimeout(onlineTimeout);
    document.body.style.opacity = 1;
    var code = exp.auth.identity.pairingCode;
    document.getElementById('code').textContent = code.slice(0, 3) + '-' + code.slice(3);
  }

  function offline () {
    exp.app.abort(new Error('Connection lost.'));
  }

  window.play = function () {
    setTimeout(function () { exp.app.abort(new Error('Pairing code expired.')); }, (exp.auth.expiration - Date.now())/2 );
    onlineTimeout = setTimeout(offline, 10000);
    if (exp.isConnected) { online(); }
    else { exp.on('online', online); }
    exp.on('offline', offline);
    exp.getChannel('pairing', { system: true }).listen('credentials', function (credentials) {
      exp.player.options.set('uuid', credentials.uuid);
      exp.player.options.set('secret', credentials.secret);
      exp.player.options.save().then(function () {
        exp.player.restart(new Error('Credentials received.'));
      });
    });
    return new Promise(function () {});
  };

})();
