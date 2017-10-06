'use strict';

angular.module('dataApiControl',['ngMaterial','ng.jsoneditor','ngMessages']);

angular.module('dataApiControl').config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple')
        .accentPalette('deep-purple');
});