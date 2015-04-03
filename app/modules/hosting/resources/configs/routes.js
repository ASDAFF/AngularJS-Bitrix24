define(function(require) {

    return function(module){
        var module = require('module!@');
        module.config([
            '$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/hosting', {
                        template: require('template!index'),
                        controller: 'hosting.controllers.index',
                        resolve: {}
                    })
            }
        ]);
    }
});
