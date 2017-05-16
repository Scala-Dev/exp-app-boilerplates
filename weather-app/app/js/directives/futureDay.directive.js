(function() {
  angular.module('weather-app')
    .directive('futureDay', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/templates/futureDay.html',
        controller: 'DayCtrl',
        controllerAs: 'DayCtrl',
        bindToController: true,
        scope: {
          dayData: '='
        }
      };
    });
})();
