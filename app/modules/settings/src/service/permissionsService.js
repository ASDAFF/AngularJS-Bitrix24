define(function (require) {
    var module = require('module!@');
    return module.service('settings.service.permissions', ['$q', '$log', function($q, $log){
        this.getEntityPermissions = function(entityName){
            var deferrer = $q.defer();
            BX24.callMethod(
                'entity.rights',
                {ENTITY: entityName},
                function(result){
                    if (result.error()) {
                        deferrer.reject()
                    } else {
                        deferrer.resolve(result.data());
                    }
                }
            );
            return deferrer.promise;
        };
        this.saveEntityPermissions = function(entityName, model){
            var access = {};
            var deferred = $q.defer();
            angular.forEach(model, function(item){
                access['U'+item] = 'X';
            });
            access['AU'] = 'X';
            BX24.callMethod(
                'entity.update',
                {
                    ENTITY: entityName,
                    ACCESS:access
                },
                function(result) {
                    if (result.error()) {
                        deferred.reject('Domain entity permissions has not been updated');
                    } else {
                        deferred.resolve(result.data());
                    }
                }
            );
            return deferred.promise;
        };
    }]);
});