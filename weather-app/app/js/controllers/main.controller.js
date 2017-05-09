(function() {
  function MainCtrl($scope, $interval, Exp, WeatherFeed) {
    this.WeatherFeed = WeatherFeed;

    var that = this;

    // get the feed in constructor because it only needs to be gotten once
    var feedPromise = this.feedPromise = WeatherFeed.getFeed();

    // updateData calls getData then puts the results on scope
    function updateData() {
      var start = new Date();

      return that.getData()
        .then(function(data) {
          that.locationName = _.get(data, 'details.location');
          that.currentDay = data.items[0];
          that.futureDays = data.items.slice(1, 4);

          $scope.$digest();
          // write data to scope
        })
        .catch(console.error.bind(console));
    }

    // set interval for updateData()
    $interval(updateData, Exp.app.config.refreshRateSeconds * 1000);

    updateData()
      .then(window.initialFeedResolve, window.initialFeedReject);
  }

  MainCtrl.prototype.getData = function() {
    var that = this;

    return Promise.all([this.feedPromise, this.WeatherFeed.getLocation()])
      .then(function(results) {
        var feed = results[0];
        var location = results[1];

        return that.WeatherFeed.getData(feed, location);
      })
      .catch(console.error.bind(console));
  };

  angular.module('weather-app')
    .controller('MainCtrl', MainCtrl);
})();
