(function() {

  function expWindDirection(degree) {
    if (degree === undefined) {
      return '';
    }

    degree = Math.round(parseFloat(degree), 0);

    if (degree >= 0 && degree <= 11.25) {
      return 'N';
    } else if (degree > 11.25 && degree <= 33.75) {
      return 'NNE';
    } else if (degree > 33.75 && degree <= 56.25) {
      return 'NE';
    } else if (degree > 56.25 && degree <= 78.75) {
      return 'ENE';
    } else if (degree > 78.75 && degree <= 101.25) {
      return 'E';
    } else if (degree > 101.25 && degree <= 123.75) {
      return 'ESE';
    } else if (degree > 123.75 && degree <= 146.25) {
      return 'SE';
    } else if (degree > 146.25 && degree <= 168.75) {
      return 'SSE';
    } else if (degree > 168.75 && degree <= 191.25) {
      return 'S';
    } else if (degree > 191.25 && degree <= 213.75) {
      return 'SSW';
    } else if (degree > 213.75 && degree <= 236.25) {
      return 'SW';
    } else if (degree > 236.25 && degree <= 258.75) {
      return 'WSW';
    } else if (degree > 258.75 && degree <= 281.25) {
      return 'W';
    } else if (degree > 281.25 && degree <= 303.75) {
      return 'WNW';
    } else if (degree > 303.75 && degree <= 326.25) {
      return 'NW';
    } else if (degree > 326.25 && degree <= 348.75) {
      return 'NNW';
    } else {
      return degree.toString() + ' ° ';
    }
  }

  angular.module('weather-app')
    .filter('expWindDirection', function(_$filter_, _Exp_) {
      return expWindDirection;
    });
})();
