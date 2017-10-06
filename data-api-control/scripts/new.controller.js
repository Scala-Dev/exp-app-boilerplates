'use strict';

angular.module('dataApiControl').controller('newController', ['$scope','$mdDialog','expData', function($scope, $mdDialog, expData){
    $scope.newData = {};

    $scope.cancel = function(){
        $mdDialog.cancel();
    };

    $scope.add = function(){
        expData.createEntry($scope.newData)
            .then(function(data){
                $mdDialog.hide(data);
            })
    };

}]);