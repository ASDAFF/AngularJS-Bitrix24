define(function(require){
    var module = require('module!@');

    module.factory('hosting.factory.hosting', [function(){
            var _hostingEntity = {
                list: [],
                filteredList: [],
                options: {
                    filters: [
                        { name: "Нет", order: "id" },
                        { name: "По дате", order: "expiration_date" },
                        { name: "По имени", order: "name" }
                    ],
                    currentFilter: { name: "Нет", order: "id" },
                    totalItems: 0,
                    maxSize: 5,
                    totalPages: 0,
                    currentPage: 1,
                    itemsPerPage: 20,
                    searchText: ''
                }
            };

            return {
                get: {
                    filters: function(){
                        return _hostingEntity.options.filters;
                    },
                    currentFilter: function(){
                        return _hostingEntity.options.currentFilter;
                    },
                    list: function(){
                        return _hostingEntity.list;
                    },
                    filteredList: function(){
                        return _hostingEntity.filteredList;
                    },
                    totalItems: function(){
                        return _hostingEntity.options.totalItems;
                    },
                    maxSize: function(){
                        return _hostingEntity.options.maxSize;
                    },
                    totalPages: function(){
                        return _hostingEntity.options.totalPages;
                    },
                    currentPage: function(){
                        return _hostingEntity.options.currentPage;
                    },
                    itemsPerPage: function(){
                        return _hostingEntity.options.itemsPerPage;
                    },
                    searchText: function(){
                        return _hostingEntity.options.searchText;
                    },
                    "listObject": function(id){
                        var found = $filter('filter')(domains.list, {id: id}, true);
                        if (found.length) {
                            var selected = found[0];
                        } else {
                            var selected = 'Not found';
                        }
                        return selected;
                    }
                },
                set: {
                    filters: function(value){
                        _hostingEntity.options.filters = value;
                    },
                    currentFilter: function(value){
                        _hostingEntity.options.currentFilter = value;
                    },
                    list: function(value){
                        _hostingEntity.list = value;
                    },
                    filteredList: function(value){
                        return _hostingEntity.filteredList = value;
                    },
                    totalItems: function(value){
                        _hostingEntity.options.totalItems = value;
                    },
                    maxSize: function(value){
                        _hostingEntity.options.maxSize = value;
                    },
                    totalPages: function(value){
                        _hostingEntity.options.totalPages = value;
                    },
                    currentPage: function(value){
                        _hostingEntity.options.currentPage = value;
                    },
                    itemsPerPage: function(value){
                        _hostingEntity.options.itemsPerPage = value;
                    },
                    searchText: function(value){
                        _hostingEntity.options.searchText = value;
                    }
                },
                add: {
                    filters: function(value){
                        _hostingEntity.options.filters.push(value);
                    },
                    listObject: function(value){
                        _hostingEntity.list.push(value);
                    }
                },
                update: {
                    listObject: function(oldValue, newValue){
                        angular.forEach(_hostingEntity.list, function(value, index){
                            if(JSON.stringify(oldValue) === JSON.stringify(value) ){
                                _hostingEntity.list[index] = newValue;
                            }
                        });
                    }
                },
                getInstance: function() {
                    return _hostingEntity
                }
            }
        }]
    );
});