'use strict';

function paint () {
  // set general style
  $('body').css({
    'background-color': exp.app.config.primaryColor || '#ffffff',
    'color': exp.app.config.secondaryColor || '#000000'
  });

  // add title and logo
  var headerPromise = Promise.resolve()
    .then(function () {
      var logoPromise = Promise.resolve()
        .then(function () {
          if (exp.app.config.logo && exp.app.config.logo.uuid) {
            return exp.getContent(exp.app.config.logo.uuid).then(function (content) {
              return '<div class="logo"><img src="'+content.getUrl()+'"/></div>';
            });
          } else return '';
        });

      var titlePromise = Promise.resolve()
        .then(function () {
          if (exp.app.config.title) return '<div class="header-txt">'+exp.app.config.title+'</div>';
          else return '';
        });

      return Promise.all([logoPromise, titlePromise]);
    })
    .then(function (result) {
      var header = '';
      if (result[0] || result[1]) header = '<div id="header">' + result[0] + result[1] + '</div>';

      $('#header-container').html(header);
    });

  // add products
  var productPromise = Promise.resolve()
    .then(function () {
      if (!exp.app.config.feed_configuration || !exp.app.config.feed_configuration.uuid) return Promise.reject();

      return exp.getFeed(exp.app.config.feed_configuration.uuid).then(function (feed) {
        return feed.getData();
      });
    })
    .then(function (data) {
      if (!data.items.length) return Promise.reject();

      var elements = '';

      data.items.forEach(function (product) {
        var item = {
          name: product.text,
          description: product.raw.description || '',
          image: (product.images && product.images[0]) ? product.images[0].url : '',
          price: (product.metadata.amount) ? '$' + Number(product.metadata.amount).toFixed(2) : ''
        };

        elements +=
          '<div class="product-list-item">' +
            '<div class="product-image">' +
              '<img src="' + item.image + '">' +
            '</div>' +
            '<div class="product-txt">' +
              '<h2>' +  item.name + '</h2>' +
              '<p>' + item.description + '</p>' +
            '</div>' +
            '<div class="product-price">' +
              '<p>' + item.price + '</p>'+
            '</div>' +
          '</div>';
      });

      $('body').removeClass('full-screen');
      $('div#product-container').removeClass('no-product').html('<div class="product-list">'+elements+'</div>');

      var numColumn = exp.app.config.numberColumns || 1;

      $('.product-list').css({
        '-webkit-column-count': numColumn,
        '-moz-column-count': numColumn,
        'column-count': numColumn
      });

    })
    .catch(function () {
      $('body').addClass('full-screen');
      $('div#product-container').addClass('no-product').html('<h2>No Product Found.</h2>');
    });

    // set refresh timer once header and content are set
    Promise.all([headerPromise, productPromise])
      .then(function () {
        setTimeout(paint, (parseFloat(exp.app.config.refreshRateSeconds) || 60) * 1000);
      })
      .catch(function () {
        setTimeout(paint, (parseFloat(exp.app.config.refreshRateSeconds) || 60) * 1000);
      });
}

function load () {
  paint();
}
