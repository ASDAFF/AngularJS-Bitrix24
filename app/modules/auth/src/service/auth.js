define(function(require){

    var module = require('module!@');

    module.service('application.factory.auth', ['$rootScope','$q', function($rootScope, $q){
        return {
            get: function () {
                var deferred = $q.defer();
                var user = {};
                $rootScope.authQueue = true;
                if ($rootScope.hasOwnProperty('user') && ((Date.now() - $rootScope.user.expire) < 10000)) {
                    deferred.resolve($rootScope.user);
                    $rootScope.authQueue = false;
                    return deferred.promise;
                }
                BX24.callMethod('user.current', {}, function (result) {
                    if (result.error()) {
                        deferred.reject(result.error());
                    } else {
                        user = result.data();
                        BX24.callMethod('user.admin', {}, function (result) {
                                if (result.error()) {
                                    deferred.reject(result.error());
                                } else {
                                    user.isAdmin = result.data();
                                    user.expire = Date.now();
                                    $rootScope.user = user;
                                    deferred.resolve($rootScope.user);
                                }
                            }
                        );
                    }
                    $rootScope.authQueue = false;
                });

                return deferred.promise;
            }
        }
    }])
});