(function() {
  function expWeatherIcon(icon) {
    icon = icon || 'unknown';
    return 'assets/icons/' + icon + '.svg';
  }

  angular.module('weather-app')
    .filter('expWeatherIcon', function() {
      return expWeatherIcon;
    });
})();
