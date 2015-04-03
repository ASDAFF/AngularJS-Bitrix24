define(function(require) {

    return function(module){
        var module = require('module!@');

        module.config([
            '$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/404', {
                        template: require('template!404')
                    });
                $routeProvider.when('/403', {
                        template: require('template!403')
                    });
            }
        ]);
    }
});
