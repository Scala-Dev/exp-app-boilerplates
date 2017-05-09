(function() {
  function DayCtrl($scope) {
    var that = this;

    var thisDayData = function() {
      return that.dayData;
    };
    $scope.$watch(thisDayData, function(data, oldData) {
      if (data !== undefined) {
        that.parseRawData(data);
      }
    }, true);
  }

  DayCtrl.prototype.parseRawData = function(data) {
    this.weatherIcon = _.get(data, 'raw.weather[0].icon', 'unknown');
    this.temperature = _.get(data, 'metadata.current');
    this.humidity = _.get(data, 'raw.main.humidity');
    this.windSpeed = _.get(data, 'raw.wind.speed');
    this.windDirection = _.get(data, 'raw.wind.deg');
    this.low = _.get(data, 'metadata.low');
    this.high = _.get(data, 'metadata.high');

    this.date = data.date;
  };


  angular.module('weather-app')
    .controller('DayCtrl', DayCtrl);
})();
