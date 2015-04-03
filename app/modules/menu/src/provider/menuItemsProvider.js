define(function (require) {
    var module = require('module!@');
    module.provider('menu.provider.menuItems', [function(){
        this.$get = [
            '$q',
            '$rootScope',
            'menu.factory.menu',
            'settings.provider.settings',
            'appConfig',
            function($q, $rootScope, menuFactory, $permSettings, appConfig) {
                return {
                    getMenuInstance: function(){
                        var deferred = $q.defer();

                        $permSettings.init().then(function(permSettings){

                            var menuBlueprintElements = menuFactory.getMenuBlueprint();
                            var isDomainShared = permSettings.isDomainsShared();
                            var isHostingShared = permSettings.isHostingsShared();
                            var domainEntityPermissions = permSettings.getDomainEntityPermissions();
                            var hostingEntityPermissions = permSettings.getHostingEntityPermissioins();

                            var domainPermittedUsers = [];
                            for (p in domainEntityPermissions) {
                                if (um = p.match(/^U([\d]+)$/)) {
                                    domainPermittedUsers.push(um[1]);
                                }
                            }

                            var hostingPermittedUsers = [];
                            for (p in hostingEntityPermissions) {
                                if (um = p.match(/^U([\d]+)$/)) {
                                    hostingPermittedUsers.push(um[1]);
                                }
                            }
                            $rootScope.$watch('user', function(user) {
                                if(typeof user === 'undefined') return;
                                menuFactory.removeMenuItems();
                                if (isDomainShared || domainPermittedUsers.indexOf(user.ID) >= 0) {
                                    menuFactory.addMenuItem(menuBlueprintElements.domain);
                                }
                                if (isHostingShared || hostingPermittedUsers.indexOf(user.ID) >= 0) {
                                    menuFactory.addMenuItem(menuBlueprintElements.hosting);
                                }
                                if (user.isAdmin) {
                                    menuFactory.addMenuItem(menuBlueprintElements.setting);
                                }
                                var menuItems = menuFactory.getMenuItems();
                                var provider = {
                                    getMenuItems: function () {
                                        return menuItems;
                                    }
                                };
                                deferred.resolve(provider);
                            });
                        });
                        return deferred.promise;
                    }
                }
            }]}
    ]);
});