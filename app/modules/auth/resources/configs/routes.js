define(function(require) {

    return function(module){
        var module = require('module!@');

        module.config([
            '$routeProvider',
            function($routeProvider) {

                var originalWhen = $routeProvider.when;
                $routeProvider.when = function(path, route){
                    route.resolve = {
                        user: ['$rootScope', '$q', '$location', '$timeout', 'application.factory.auth', 'settings.provider.settings', 'appConfig','$route', function($rootScope, $q, $location, $timeout, auth, $permSettings, appConfig, $route){
                            $rootScope.firewallSuccess = false;
                            var authProm = $q.defer(),
                                prom = $q.defer().promise;
                            if($rootScope.hasOwnProperty('authQueue') && $rootScope.authQueue){
                                $rootScope.$watch('user', function(user){
                                    if(typeof user === 'undefined') return;
                                    authProm.resolve(user);
                                    prom = authProm.promise;
                                    $route.reload();
                                });
                            } else {
                                prom = auth.get();
                            }
                            var firewallPromise = $q.defer(),
                                entityName = path.match(/^\/([\w\d]*)\/*|.*$/).pop();

                            prom.then(function (user) {
                                if (entityName == "" || (typeof entityName === "undefined") || !appConfig.entity.hasOwnProperty(entityName)) {
                                    firewallPromise.reject();
                                    return;
                                }
                                if(!user.ACTIVE){
                                    firewallPromise.reject('AccessDenied');
                                    $location.path("/403");
                                    $rootScope.firewallSuccess = false;
                                }
                                var entity = appConfig.entity[entityName];
                                if(entity.hasOwnProperty('hidden') && entity.hidden){
                                    if ($rootScope.user.isAdmin){
                                        firewallPromise.resolve();
                                        $rootScope.firewallSuccess = true;
                                        return;
                                    } else {
                                        firewallPromise.reject('AccessDenied');
                                        $location.path("/403");
                                        $rootScope.firewallSuccess = false;
                                    }
                                }
                                $permSettings.init().then(function(permSettings){
                                    if(permSettings.isShared(entity.name)){
                                        firewallPromise.resolve();
                                        $rootScope.firewallSuccess = true;
                                    } else {
                                        if(entity.name === (appConfig.entity.domain.name)){
                                            if (permSettings.getDomainEntityPermissions().hasOwnProperty(('U' + $rootScope.user.ID))) {
                                                firewallPromise.resolve();
                                                $rootScope.firewallSuccess = true;
                                            } else {
                                                firewallPromise.reject('AccessDenied');
                                                $location.path("/403");
                                                $rootScope.firewallSuccess = false;
                                            }
                                        } else {
                                            if(entity.name === (appConfig.entity.hosting.name)){
                                                if (permSettings.getDomainEntityPermissions().hasOwnProperty(('U' + $rootScope.user.ID))) {
                                                    firewallPromise.resolve();
                                                    $rootScope.firewallSuccess = true;
                                                } else {
                                                    firewallPromise.reject('AccessDenied');
                                                    $location.path("/403");
                                                    $rootScope.firewallSuccess = false;
                                                }
                                            }
                                        }
                                    }
                                });
                            });


                            return firewallPromise;
                        }]
                    };

                    return originalWhen(path, route);
                };
            }
        ]);
    }
});
