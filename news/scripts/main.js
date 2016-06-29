'use strict';

// get feed data
var getRssData = function () {

  if (exp.app.config.hasOwnProperty('feedConfiguration')) {
    return exp.getFeed(exp.app.config.feedConfiguration.uuid)
      .then(function (feed) {
        if (feed) {
          return feed.getData()
            .then(function (data) {
              var rssReturnData = data;
              // remove all HTML from text
              rssReturnData.items.forEach(function (item, index, theArray) {
                theArray[index].text = item.text.replace(/<(?:.|\n)*?>/gm, '');
              });
              return rssReturnData;
            });
        }
      })
  } else {
    return {};
  }

};


function load(){

  // create vue app
  var vm = new Vue({
    el: '#newsApp',
    data: {
      rssData: {},
      style: '',
      lineColor: '',
      titleText: '',
      logo: ''
    },
    methods: {
      getTitleText: function () {

        if (exp.app.config.hasOwnProperty('titleText')) {
          this.titleText = exp.app.config.titleText;
        } else {
          this.titleText = '';
        }

      },
      setStyle: function () {

        var backgroundColor = '';
        var textColor = '';

        if (exp.app.config.hasOwnProperty('primaryColor')) {
          backgroundColor = exp.app.config.primaryColor;
        } else {
          backgroundColor = '#F5F5DC';
        }

        if (exp.app.config.hasOwnProperty('SecondaryColor')) {
          textColor = exp.app.config.SecondaryColor;
        } else {
          textColor = '#000000';
        }

        this.style = 'background-color:' + backgroundColor + ';color:' + textColor + ';';

      },
      setLineColor: function () {

        var textColor = '';

        if (exp.app.config.hasOwnProperty('SecondaryColor')) {
          textColor = exp.app.config.SecondaryColor;
        } else {
          textColor = '#000000';
        }

        this.lineColor = 'background-color:' + textColor + ';color:' + textColor + ';'
      },
      getTimeInterval: function () {

        if (exp.app.config.hasOwnProperty('refreshRateSeconds')) {
          return parseInt(exp.app.config.refreshRateSeconds, 10) * 1000;
        } else {
          return 60 * 1000;
        }

      }
    }
  });

  // set initial values
  vm.getTitleText();
  vm.setStyle();
  vm.setLineColor();

  // get logo
  if (exp.app.config.hasOwnProperty('logo')) {
    exp.getContent(exp.app.config.logo.uuid).then(function (content) {
      vm.logo = content.getUrl();
    });
  } else {
    vm.logo = ''
  }

  // first data load
  getRssData().then(function (data) {
    if (data) {
      vm.rssData = data;
      console.log('new rss data received');
    }
  }).catch(function (error) {
    console.log('error receiving data: ' + error);
  });

  // refresh data using interval
  setInterval(function () {
    getRssData().then(function (data) {
      if (data) {
        vm.rssData = data;
        console.log('new rss data received');
      }
    }).catch(function (error) {
      console.log('error receiving data: ' + error);
    });
  }, vm.getTimeInterval());

}
