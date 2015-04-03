define(function (require) {
    var module = require('module!@');
    module.provider('settings.provider.settings', [function(){
        this.$get = [
            '$rootScope',
            'settings.service.permissions',
            'settings.service.user',
            'settings.service.systemProperties',
            'settings.factory.settings',
            '$q',
            'appConfig',
            function($rootScope, permService, userService, systemPropertiesService, settingsFactory, $q, appConfig) {
                var permSettings = settingsFactory;
                var deferred = $q.defer();
                this.init = function () {
                    if($rootScope.hasOwnProperty('permsQueue') && $rootScope.permsQueue){
                        $rootScope.$watch('permSettings', function(settings){
                            if(typeof settings === 'undefined') return;
                            deferred.resolve(settings);
                            $rootScope.permsQueue = false;
                        });
                    }
                    else {
                        $rootScope.permsQueue = true;
                        if ($rootScope.hasOwnProperty('permSettings') && $rootScope.permSettings.hasOwnProperty('expire') && ((Date.now() - $rootScope.permSettings.expire) < 10000)) {
                            deferred.resolve($rootScope.permSettings);
                            $rootScope.permsQueue = false;
                            return deferred.promise;
                        }
                        $q.all([
                            permService.getEntityPermissions(appConfig.entity.domain.name),
                            permService.getEntityPermissions(appConfig.entity.hosting.name),
                            userService.getUserList(),
                            systemPropertiesService.isEntityShared(appConfig.entity.domain.name),
                            systemPropertiesService.isEntityShared(appConfig.entity.hosting.name)
                        ]).then(function (data) {
                            permSettings.setDomainEntityPermissions(data[0]);
                            permSettings.setHostingEntityPermissions(data[1]);
                            permSettings.setUserList(data[2]['result']);
                            permSettings.setCurrentUser($rootScope.user);
                            permSettings.domainsShared(data[3]);
                            permSettings.hostingsShared(data[4]);
                            permSettings.shared([data[3], data[4]]);
                            deferred.resolve(permSettings);
                            $rootScope.permSettings = permSettings;
                            $rootScope.permSettings.expire = Date.now();
                            $rootScope.permsQueue = false;
                        });
                    }

                    return deferred.promise;

                };
                return this;
            }
        ]
    }]);
});