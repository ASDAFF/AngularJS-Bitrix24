define(function(require) {

    var module = require('module!@');

    // we could load Greater with this:
    // require('service!application:factory/greater');
    // But this service is loaded in application-includes.js

    module.controller('setting.controllers.index', [
        '$q',
        '$scope',
        '$filter',
        'app.provider.spinner',
        'settings.service.permissions',
        'settings.service.systemProperties',
        'settings.provider.settings',
        'appConfig',
        function(
            $q,
            $scope,
            $filter,
            spinner,
            permissionsService,
            systemProperiesService,
            settingsProvider,
            appConfig
            ) {

            angular.extend($scope, {
                checkAllDomains: function() {
                    angular.forEach($scope.setting.userList, function( user) {
                        if(user.ID != $scope.$root.user.ID && $scope.setting.sharedDomainUsers.indexOf(user.ID) < 0) {
                            $scope.setting.sharedDomainUsers.push(user.ID);
                        }
                    });
                },
                uncheckAllDomains: function() {
                    $scope.setting.sharedDomainUsers = $filter('filter')($scope.setting.sharedDomainUsers, $scope.$root.user.ID);
                },
                checkAllHostings: function() {
                    angular.forEach($scope.setting.userList, function( user) {
                            if(user.ID != $scope.$root.user.ID && $scope.setting.sharedHostingUsers.indexOf(user.ID) < 0) {
                                $scope.setting.sharedHostingUsers.push(user.ID);
                            }
                    });
                },
                uncheckAllHostings: function() {
                    $scope.setting.sharedHostingUsers = $filter('filter')($scope.setting.sharedHostingUsers, $scope.$root.user.ID);
                }
            });
            spinner.show();
            settingsProvider.init().then(function(settings){
                var domainEntityPermissions = settings.getDomainEntityPermissions();
                var hostingEntityPermissions = settings.getHostingEntityPermissioins();
                var domainEntityPermittedUserList = [];
                var hostingEntityPermittedUserList = [];
                for (prop in domainEntityPermissions){
                    if (domainEntityPermissions.hasOwnProperty(prop)) {
                        if (m = prop.match(/^U([\d]+)$/)) {
                            domainEntityPermittedUserList.push(m[1]);
                        }
                    }
                }
                for (prop in hostingEntityPermissions){
                    if (hostingEntityPermissions.hasOwnProperty(prop)) {
                        if (m = prop.match(/^U([\d]+)$/)) {
                            hostingEntityPermittedUserList.push(m[1]);
                        }
                    }
                }
                var userList = [];
                angular.forEach(settings.getUserList(), function(user){
                    user.hasDomainEntityPermissioin = false;
                    user.hasHostingEntityPermissioin = false;
                    if (domainEntityPermittedUserList.indexOf(parseInt(user.ID)) >= 0) {
                        user.hasDomainEntityPermissioin = true
                    }
                    if (hostingEntityPermittedUserList.indexOf(parseInt(user.ID)) >= 0) {
                        user.hasHostingEntityPermissioin = true
                    }
                    userList.push(user);
                });
                angular.extend($scope, {
                    setting: {
                        userList: userList,
                        isDomainsShared: settings.isDomainsShared(),
                        isHostingsShared: settings.isHostingsShared(),
                        sharedDomainUsers: domainEntityPermittedUserList,
                        sharedHostingUsers: hostingEntityPermittedUserList
                    },
                    savePermissions: function() {
                        spinner.show();
                        $q.all([
                            permissionsService.saveEntityPermissions(appConfig.entity.domain.name, $scope.setting.sharedDomainUsers),
                            permissionsService.saveEntityPermissions(appConfig.entity.hosting.name, $scope.setting.sharedHostingUsers),
                            systemProperiesService.saveSharedState(appConfig.entity.hosting.name, $scope.setting.isHostingsShared),
                            systemProperiesService.saveSharedState(appConfig.entity.domain.name, $scope.setting.isDomainsShared)
                        ]).then(function(data){
                            spinner.hide();
                        });
                    }
                });
                spinner.hide();
            });

            $scope.$watch('allUsersHosting', function(value){
                if(typeof $scope.setting === 'undefined') return;
                if(value){
                    $scope.checkAllHostings();
                } else {
                    $scope.uncheckAllHostings();
                }
            });
            $scope.$watch('allUsersDomain', function(value){
                if(typeof $scope.setting === 'undefined') return;
                if(value){
                    $scope.checkAllDomains();
                } else {
                    $scope.uncheckAllDomains();
                }
            });
        }
    ]);
});
