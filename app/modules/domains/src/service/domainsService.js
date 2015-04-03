define(function(require){
    var module = require('module!@');
    module.service('domains.service.domains', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
        this.getList = function(user){
            var deffered = $q.defer();
            BX24.callMethod(
                'entity.item.get',{ENTITY: 'domain'},
                function(result){
                    if(result.error()){
                        deffered.reject();
                    } else{
                        var domains = [];
                        var d = result.data();
                        angular.forEach(d, function(domain){
                            if (domain.is_shared !== "true" && (parseInt(user.ID) === parseInt(domain.PROPERTY_VALUES.user_id))) {
                                domains.push(domain);
                            } else if (domain.is_shared === "true") {
                                domains.push(domain);
                            }
                        });
                        deffered.resolve(domains);
                    }
                }
            );
            return deffered.promise;
        };
        this.addDomain = function(domain) {
            var deffered = $q.defer();
            BX24.callMethod(
                'entity.item.add',{
                    ENTITY: 'domain',
                    DATE_ACTIVE_FROM: new Date(),
                    NAME: 'domain_' + Date.now(),
                    PROPERTY_VALUES: angular.extend(domain, {user_id: $rootScope.user.ID})
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
        this.editDomain = function(domain, manual) {
            var deffered = $q.defer();
            BX24.callMethod(
                'entity.item.update',{
                    ENTITY: 'domain',
                    ID: domain.id,
                    PROPERTY_VALUES: angular.extend(domain, {user_id: $rootScope.user.ID, is_manual: manual})
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
        this.getWhois = function(domain){
                var timeout = $q.defer(),
                    result = $q.defer(),
                    timedOut = false,
                    httpRequest;

                setTimeout(function () {
                    timedOut = true;
                    timeout.resolve();
                }, (1000 * 5));

                httpRequest = $http({
                    method: 'GET',
                    url: '/api/v1/whois/' + domain.name,
                    cache: false,
                    timeout: timeout.promise
                });

                httpRequest.success(function(data, status, headers, config) {
                    result.resolve(data);
                });

                httpRequest.error(function(data, status, headers, config) {
                    if (timedOut) {
                        result.reject({
                            error: 'timeout',
                            message: 'Request took longer than 5 seconds.'
                        });
                    } else {
                        result.reject(data);
                    }
                });

                return result.promise;
        };
        this.removeDomain = function( item) {
            var deffered = $q.defer();
            BX24.callMethod('entity.item.delete', {
                ENTITY: 'domain',
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