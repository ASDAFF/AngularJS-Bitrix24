define(function(require) {

    var module = require('module!@');

    module.provider('hosting.provider.hosting', [function() {
        this.$get = [
            '$filter',
            'modals.service.modal',
            'hosting.factory.hosting',
            'hosting.service.hosting',
            'app.provider.spinner',
            '$rootScope',
            function($filter,  modalService, hostingFactory, hostingService, spinner, $rootScope) {
                var hostingEntity = hostingFactory,
                    items = [];
                hostingService.get($rootScope.user).then(function (data) {
                    angular.forEach(data, function (item) {
                        items.push(angular.extend(item.PROPERTY_VALUES, {id: item.ID , is_shared: item.PROPERTY_VALUES.is_shared === "true"?true:false}));
                    });
                    hostingEntity.set.list(items);
                    hostingEntity.set.totalItems(items.length);
                    hostingEntity.set.filteredList(items);
                });
                return hostingEntity;
            }
        ];
    }]);
});
