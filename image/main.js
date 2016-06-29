'use strict';
/* global exp */

function unload () {
  document.getElementById('img').setAttribute('src', '');
}

function load () {
  return Promise.resolve().then(function () {
    if (exp.app.config.url) {
      return exp.app.config.url;
    } else if (exp.app.config.content && exp.app.config.content.uuid) {
      return exp.getContent(exp.app.config.content.uuid).then(function (content) {
        if (!content) throw new Error('Content lookup failed.');
        if (content.hasVariant('vector.svg')) {
          return content.getVariantUrl('vector.svg');
        }
        else {
          return content.getUrl();
        }
      });
    } else {
      throw new Error('Received no content.');
    }
  }).then(function (src) {
    return new Promise (function (resolve, reject) {
      document.getElementById('img').setAttribute('src', src);
      document.getElementById('img').onload = resolve;
      setTimeout(function () { reject(new Error('Image load timed out.')); }, 10000);
    });
  });
}
