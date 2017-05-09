(function() {
  var Exp;
  var $filter;

  function expWindSpeed(windSpeed) {
    if (windSpeed === undefined) {
      return '';
    }

    var metric = Exp.app.config.measurements;

    if (metric === 'metric') {
      var number = Math.round(parseFloat(windSpeed * 3.6));
      return $filter('number')(number, 0) + ' km/h';
    } else if (metric === 'imperial') {
      var number = Math.round(parseFloat(windSpeed * 2.2));
      return $filter('number')(number, 0) + ' mph';
    } else {
      throw new Error('Not a Recognized Measurement Metric: ', metric);
    }
  }

  angular.module('weather-app')
    .filter('expWindSpeed', function(_$filter_, _Exp_) {
      $filter = _$filter_;
      Exp = _Exp_;

      return expWindSpeed;
    });
})();
