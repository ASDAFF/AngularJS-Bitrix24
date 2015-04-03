define(function(require) {

    var module = require('module!@');

    module.provider('domains.provider.domains', [function() {
        this.$get = [
            '$filter',
            'modals.service.modal',
            'domains.factory.domains',
            'domains.service.domains',
            'app.provider.spinner',
            '$rootScope',
            function($filter,  modalService, domainsFactory, domainsService, spinner, $rootScope) {
                var domains = domainsFactory;
                $rootScope.$watch('user', function(newUser, oldUser){
                    var status = (newUser == oldUser);
                    if(status){
                        return;
                    }
                    domainsService.getList($rootScope.user).then(function (data) {
                        domains.list = [];
                        angular.forEach(data, function (domainEntity) {
                            var m = domainEntity.PROPERTY_VALUES.expiration_date.match(/^(\d{1,2}).(\d{1,2}).(\d{4})$/);
                            var dateObject = new Date(m[3], m[2]-1, m[1]);
                            domains.list.push(angular.extend(domainEntity.PROPERTY_VALUES, {
                                id: domainEntity.ID,
                                is_shared: domainEntity.PROPERTY_VALUES.is_shared === "true"?true:false,
                                is_manual: domainEntity.PROPERTY_VALUES.is_manual === "true"?true:false,
                                expiration_date: dateObject
                            }));
                        });
                        domains.totalItems = domains.list.length;
                        domains.totalPages = Math.ceil(domains.list.length / domains.itemsPerPage);
                        domains.filteredList = domains.list;
                    });
                });

                return {
                    "getDomains": function(){
                        return domains;
                    },
                    "setPage": function (pageNo) {
                        domains.currentPage = pageNo;
                    },
                    "getDomainById": function(id){
                        var found = $filter('filter')(domains.list, {id: id}, true);
                        if (found.length) {
                            var selected = found[0];
                        } else {
                            var selected = 'Not found';
                        }
                        return selected;
                    },
                    "updateDomain": function(domain, newDomain){
                        var m = newDomain.expiration_date.match(/^(\d{1,2}).(\d{1,2}).(\d{4})$/);
                        var dateObject = new Date(m[3], m[2]-1, m[1]);
                        newDomain.expiration_date = dateObject;
                        angular.forEach(domains.list, function(value, index){
                            if(JSON.stringify(domain) === JSON.stringify(value) ){
                                domains.list[index] = newDomain;
                            }
                        });
                    }
                }
            }
        ];
    }]);
});
