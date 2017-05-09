(function() {
  var Exp;
  var $filter;

  function expTemperature(temperature) {
    if (temperature === undefined) {
      return '';
    }

    var unit = Exp.app.config.temperature;

    if (unit === 'c') {
      return $filter('number')(temperature.c, 0) + '°C';
    } else if (unit === 'f') {
      return $filter('number')(temperature.f, 0) + '°F';
    } else {
      throw new Error('Not a Recognized Temperature Unit: ', unit);
    }
  }

  angular.module('weather-app')
    .filter('expTemperature', function(_$filter_, _Exp_) {
      $filter = _$filter_;
      Exp = _Exp_;

      return expTemperature;
    });
})();
