define(function(require){
    var module = require('module!@');
    module.service('hosting.service.hosting', [
        '$http',
        '$q',
        '$rootScope',
        'appConfig', function($http, $q, $rootScope, config) {
            this.get = function(user){
                var deffered = $q.defer();
                BX24.callMethod(
                    'entity.item.get',{ENTITY: config.entity.hosting.name},
                    function(result){
                        if(result.error()){
                            deffered.reject();
                        } else{
                            var hostings = [];
                            var d = result.data();
                            angular.forEach(d, function(host){
                                if (host.is_shared !== "true" && (parseInt(user.ID) === parseInt(host.PROPERTY_VALUES.user_id))) {
                                    hostings.push(host);
                                } else if (host.is_shared === "true") {
                                    hostings.push(host);
                                }
                            });
                            deffered.resolve(hostings);
                        }
                    }
                );
                return deffered.promise;
            };
            this.add = function(item) {
                var deffered = $q.defer();
                BX24.callMethod(
                    'entity.item.add',{
                        ENTITY: config.entity.hosting.name,
                        DATE_ACTIVE_FROM: new Date(),
                        NAME: 'hosting_' + Date.now(),
                        PROPERTY_VALUES: angular.extend(item, {user_id: $rootScope.user.ID})
                    }, function(result){
                        if(result.error()){
                            deffered.reject();
                        } else{
                            deffered.resolve(result.data());
                        }
                    }
                );
                return deffered.promise;
            };
            this.edit = function(item) {
                var deffered = $q.defer();
                BX24.callMethod(
                    'entity.item.update',{
                        ENTITY: config.entity.hosting.name,
                        ID: item.id,
                        PROPERTY_VALUES: angular.extend(item, {user_id: $rootScope.user.ID})
                    }, function(result){
                        if(result.error()){
                            deffered.reject();
                        }else{
                            deffered.resolve(result.data());
                        }
                    }
                );
                return deffered.promise;
            };
            this.remove = function( item) {
                var deffered = $q.defer();
                BX24.callMethod('entity.item.delete', {
                        ENTITY: config.entity.hosting.name,
                        ID: item.id
                    }, function(result){
                        if(result.error()){
                            deffered.reject();
                        }else{
                            deffered.resolve(result.data());
                        }
                    }
                );
                return deffered.promise;
            };

        }]);
});