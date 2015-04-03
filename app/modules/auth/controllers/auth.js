define(function (require) {
    var module = require('module!@');
    module.controller('AuthController', ['$scope', function($scope){
        $scope.today = new Date();
    }]);
});