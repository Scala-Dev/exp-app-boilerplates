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
    setTimeout(function () {
      document.body.style.opacity = 0;
      exp.app.stop();
    }, (exp.auth.expiration - Date.now())/2 );
    onlineTimeout = setTimeout(offline, 10000);
    if (exp.isConnected) { online(); }
    else { exp.on('online', online); }
    exp.on('offline', offline);
    exp.getChannel('pairing', { system: true }).listen('credentials', function (credentials) {
      exp.player.pair(credentials);

    });
    return new Promise(function () {});
  };

})();
