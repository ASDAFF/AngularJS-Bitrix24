define(function (require) {
    var module = require('module!@');
    module.controller('MenuController', [
        '$scope',
        'menu.provider.menuItems',
        function($scope, menuItemsProvider){
            menuItemsProvider.getMenuInstance().then(function(data){
                $scope.menuItems = data.getMenuItems();
                $scope.menuItemsReady = true;
            });
        }
    ]);
});