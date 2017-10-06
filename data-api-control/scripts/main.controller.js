'use strict';

angular.module('dataApiControl').controller('mainController', ['$scope', '$mdDialog', '$mdToast', 'expData', '$timeout', function ($scope, $mdDialog, $mdToast, expData, $timeout) {

    var _jsonEditor = null;
    $scope.selectedText = '';
    $scope.config = {data: {}, options: {mode: 'view'}};
    $scope.selectedItem = {};
    $scope.firstRun = true;
    $scope.organization = exp.auth.identity.organization;

    $scope.editorLoaded = function (jsonEditor) {
        _jsonEditor = jsonEditor;
    };

    function formatData(item) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(JSON.parse(JSON.stringify(item)));
            } catch (err) {
                reject(err);
            }
        });
    }

    $scope.modeSelect = function (mode) {
        $scope.config.options.mode = mode;
        if (mode === 'tree' || mode === 'view') {
            $timeout(function () {
                _jsonEditor.expandAll();
            }, 500);
        }
    };

    $scope.select = function (ev) {
        $mdDialog.show({
            controller: 'selectorController',
            templateUrl: 'scripts/selector.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
            .then(function (item) {
                formatData(item)
                    .then(function (data) {
                        $scope.$apply(function(){
                            $scope.selectedItem = data;
                            $scope.config.data = data.value;
                            $scope.selectedText = '( group: ' + $scope.selectedItem.group + ' - key: ' + $scope.selectedItem.key + ' )';
                            $scope.firstRun = false;
                            $scope.config.options.mode = 'tree';
                        });
                        return 'data loaded!';
                    })
                    .then(function (message) {
                        showMessage(message);
                        $timeout(function () {_jsonEditor.expandAll();}, 500);
                    })
                    .catch(function (err) {
                        showMessage(err);
                    });
            }, function () {
                showMessage('selection cancelled');
            });
    };

    $scope.newEntry = function (ev) {
        $mdDialog.show({
            controller: 'newController',
            templateUrl: 'scripts/new.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function (item) {
            formatData(item)
                .then(function (data) {
                    if(data){
                        $scope.$apply(function(){
                            $scope.selectedItem = data;
                            $scope.config.data = data.value;
                            $scope.selectedText = '( group: ' + $scope.selectedItem.group + ' - key: ' + $scope.selectedItem.key + ' )';
                            $scope.firstRun = false;
                            $scope.config.options.mode = 'tree';
                        });
                        return 'data loaded!';
                    }else{
                        return 'group key already exits!';
                    }
                })
                .then(function (message) {
                    showMessage(message);
                    $timeout(function () {_jsonEditor.expandAll();}, 500);
                })
                .catch(function (err) {
                    showMessage(err);
                });
        }, function () {
            showMessage('new data entry cancelled');
        });
    };

    $scope.delete = function(ev){
        var confirm = $mdDialog.confirm()
            .title('Delete data Entry, Are you sure?')
            .textContent('Would you like to delete the data entry: ' + $scope.selectedText + ' ?')
            .ariaLabel('Delete Data Entry')
            .targetEvent(ev)
            .ok('Delete!')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            expData.removeEntry($scope.selectedItem)
                .then(function(){
                    $scope.$apply(function(){
                        $scope.selectedText = '';
                        $scope.config = {data: {}, options: {mode: 'view'}};
                        $scope.selectedItem = {};
                        $scope.firstRun = true;
                    });
                    showMessage('data entry removed');
                })
        }, function() {
            showMessage('delete data entry cancelled');
        });
    };

    $scope.save = function () {
        expData.saveData($scope.selectedItem.group, $scope.selectedItem.key, $scope.config.data)
            .then(function (data) {
                return formatData(data);
            })
            .then(function (data) {
                $scope.$apply(function(){
                    $scope.config.data = data;
                    $scope.selectedItem.value = data;
                    $scope.firstRun = false;
                });
                return 'data saved!';
            })
            .then(function (message) {
                showMessage(message);
                $timeout(function () {_jsonEditor.expandAll();}, 500);
            })
            .catch(function (err) {
                console.log(err);
            })
    };

    $scope.reload = function () {
        if ($scope.selectedItem.value) {
            $scope.config.data = $scope.selectedItem.value;
            $timeout(function () {
                _jsonEditor.expandAll();
            }, 500);
        }
    };

    var showMessage = function(message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom left')
                .hideDelay(3000)
        );
    };

}]);