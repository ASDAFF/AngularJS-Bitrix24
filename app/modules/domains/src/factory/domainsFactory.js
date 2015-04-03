define(function(require){
    var module = require('module!@');

    module.factory('domains.factory.domains', [function(){
            return {
               filters:
                        [
                            { name: "По дате", order: "expiration_date", asc: false },
                            { name: "По имени", order: "name", asc: true }
                        ],
                currentFilter: { name: "По дате", order: "expiration_date", asc: false },
                list: [],
                filteredList: [],
                totalItems: 0,
                maxSize: 5,
                totalPages: 0,
                currentPage: 1,
                itemsPerPage: 20,
                searchText: ''
            }
        }]
    );
});