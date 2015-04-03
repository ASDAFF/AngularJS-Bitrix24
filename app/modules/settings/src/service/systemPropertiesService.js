define(function (require) {
    var module = require('module!@');
    return module.service('settings.service.systemProperties', [
        '$q',
        '$log',
        'appConfig',
        function($q, $log, config){
        this.isEntityShared = function(entityName) {

            var deferred = $q.defer();
            BX24.callMethod(
                'entity.item.get',
                {
                    ENTITY: config.entity.setting.name,
                    FILTER: {
                        '=PROPERTY_key': entityName
                    }
                },
                function(result) {
                    if (result.error()) {
                        deferred.reject();
                    } else {
                        var val = result.data()[0].PROPERTY_VALUES.value === "0"?false:true;
                        deferred.resolve(val);
                    }
                }
            );
            return deferred.promise;
        };
        this.saveSharedState = function(entityName, state) {
            var deferred = $q.defer();
            BX24.callMethod(
                'entity.item.get',
                {
                    ENTITY: config.entity.setting.name,
                    FILTER: {
                        '=PROPERTY_key': entityName
                    }
                },
                function(result){
                    if (!result.error()) {
                        var id = result.data()[0].ID;
                        BX24.callMethod(
                            'entity.item.update',
                            {
                                ENTITY: config.entity.setting.name,
                                ID: id,
                                PROPERTY_VALUES: {
                                    value: state?1:0
                                }
                            },
                            function(res) {
                                if (res.error()) {
                                    deferred.reject('Hosting shared state has not been saved');
                                } else {
                                    deferred.resolve(res.data());
                                }
                            }
                        )
                    }
                }
            );
            return deferred.promise;
        };

    }]);
});