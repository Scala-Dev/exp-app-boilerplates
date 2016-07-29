'use strict';

var app = angular.module('facebookApp',['ngMaterial']);

// fires from EXP player
function load () { angular.bootstrap(document.body, ['facebookApp']); }

app.controller('mainController',['$scope','$interval', function($scope, $interval){

    $scope.pageLogo = '';
    $scope.pageName = '';
    $scope.messages = [];

    var getRandomColor = function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // get feed from EXP
    var getFeedData = function(){
        exp.getFeed(exp.app.config.feed.uuid)
            .then(function(feed){
                return feed.getData();
            })
            .then(function(data){

                $scope.pageLogo = data.details.imageUrl;
                $scope.pageName = data.details.name;
                $scope.messages = [];

                for(var index=0; index<data.items.length;index++){

                    var tempText = '';
                    if(data.items[index].text.length > 210){
                        tempText = data.items[index].text.substr(1, 207) + '...';
                    }else{
                        tempText = data.items[index].text;
                    }

                    $scope.messages.push({
                        text: tempText,
                        date: data.items[index].date,
                        created: data.items[index].createdByDisplay,
                        background: {'background-color':getRandomColor()}
                    })
                }

                $scope.$apply();
            });
    };

    getFeedData();
    $interval(getFeedData, (exp.app.config.refreshRateSeconds * 1000))

}]);