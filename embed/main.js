'use strict';
/* global exp */

function load () {
  return Promise.resolve().then(function () {
    if (exp.app.config.url) {
      return exp.app.config.url;
    } else if (exp.app.config.content && exp.app.config.content.uuid) {
      return exp.getContent(exp.app.config.content.uuid).then(function (content) {
        if (!content) throw new Error('Content lookup failed.');
        return content.getUrl();
      });
    } else {
      throw new Error('Received no content.');
    }
  }).then(function (src) {
    return new Promise (function (resolve, reject) {
      document.getElementById('frame').setAttribute('src', src);
      document.getElementById('frame').onload = resolve;
      setTimeout(reject, 10000);
    });
  });
}
