define(function (require) {
    var module = require('module!@');
    module.factory('settings.factory.settings', [function(){
        var settings = {
            permissions: {
                isDomainsShared: false,
                isHostingsShared: false,
                domainEntity: {},
                hostingEntity: {},
                shared:[]
            },
            userList: [],
            system: [],
            currentUser: {}
        };
        return {
            isDomainsShared: function() {
                return settings.permissions.isDomainsShared
            },
            domainsShared: function(shared) {
                settings.permissions.isDomainsShared = shared;
            },
            isHostingsShared: function() {
                return settings.permissions.isHostingsShared;
            },
            hostingsShared: function(shared) {
                settings.permissions.isHostingsShared = shared;
            },
            shared: function(shared) {
                settings.permissions.shared = shared;
            },
            isShared: function(entity) {
                if (settings.permissions.shared.indexOf(entity) > 0) {
                    return true;
                }
                    return false;
            },
            getDomainEntityPermissions: function() {
                return settings.permissions.domainEntity;
            },
            getHostingEntityPermissioins: function() {
                return settings.permissions.hostingEntity;
            },
            setDomainEntityPermissions: function(permissions) {
                settings.permissions.domainEntity = permissions;
            },
            addDomainEntityPermission: function(perm) {
                settings.permissions.domainEntity.push(perm);
            },
            setHostingEntityPermissions: function(permissions) {
                settings.permissions.hostingEntity = permissions;
            },
            addHostingEntityPermission: function(perm) {
                settings.permissions.hostingEntity.push(perm);
            },
            setUserList: function(userList) {
                settings.userList = userList;
            },
            getUserList: function() {
                return settings.userList;
            },
            addUser: function(user) {
                settings.userList.push(user);
            },
            setCurrentUser: function(user) {
                settings.currentUser = user;
            },
            getCurrentUser: function() {
                return settings.currentUser;
            }
        }
    }]);
});