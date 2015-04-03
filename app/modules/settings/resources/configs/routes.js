define(function(require) {

    return function(module){
        var module = require('module!@');

        module.config([
            '$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/setting', {
                        template: require('template!index'),
                        controller: 'setting.controllers.index',
                        resolve: {}
                    });
            }
        ]);
    }
});
