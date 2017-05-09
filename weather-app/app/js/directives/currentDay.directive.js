(function() {
  angular.module('weather-app')
    .directive('currentDay', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/templates/currentDay.html',
        controller: 'DayCtrl',
        controllerAs: 'DayCtrl',
        bindToController: true,
        scope: {
          dayData: '='
        }
      };
    });
})();
