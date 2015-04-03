define(function(require) {

    return function(module){
        var module = require('module!@');

        module.config([
            '$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/domain', {
                        template: require('template!index'),
                        controller: 'domains.controllers.index',
                        resolve: {}
                    });

                $routeProvider
                    .when('/', {
                        //template: require('template!index'),
                        //controller: 'domains.controllers.index',
                        resolve: {},
                        redirectTo: function () {
                            return "/domain";
                        }
                    });
            }
        ]);
    }
});
