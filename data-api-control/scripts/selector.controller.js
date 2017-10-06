'use strict';

angular.module('dataApiControl').controller('selectorController', ['$scope','$mdDialog','expData', function($scope, $mdDialog, expData){
    $scope.items = [];
    $scope.groupFilter = '';

    $scope.cancel = function(){
        $mdDialog.cancel();
    };

    $scope.select = function(item){
        $mdDialog.hide(item);
    };

    expData.findDataEntries({}).then(function(items){
        $scope.$apply(function(){
            $scope.items = items.results;
        });
    });

}]);