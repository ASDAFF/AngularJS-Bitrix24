define(function(require) {
    require('datepicker');
    var module = require('module!@');

    // we could load Greater with this:
    // require('service!application:factory/greater');
    // But this service is loaded in application-includes.js

    module.controller('hosting.controllers.index', [
        '$scope',
        '$filter',
        '$timeout',
        'hosting.provider.hosting',
        'modals.service.modal',
        'hosting.service.hosting',
        function(
            $scope,
            $filter,
            $timeout,
            hostingProvider,
            modalService,
            hostingService
            ) {

            var formReset = function(){
                angular.extend($scope.$parent, {
                    form: {
                        hosting: {
                            is_shared: true
                        }
                    }
                });
            };

            var initDateTimePicker = function(){
                $timeout( function() {
                    var init = $('#expiration_date').datetimepicker({
                        lang: 'ru',
                        format: 'd.m.Y',
                        timepicker: false,
                        closeOnDateSelect: true
                    });
                }, 100);
            }
            formReset();
            angular.extend($scope, {
                title: "Управление хостингом",
                hostingAdd: function(){
                    formReset();
                    var modalOptions = {
                        closeButtonText: 'Отмена',
                        actionButtonText: 'Создать',
                        headerText: 'Добавление хостинга'
                    };
                    var modalDefaults = {
                        template: require('template!modalForm')
                    }
                    var modalEntity = modalService.showModal(modalDefaults, modalOptions);

                    modalEntity.opened.then(function(){
                       initDateTimePicker();
                    });
                    modalEntity.result.then(function () {
                        hostingService.add($scope.$parent.form.hosting).then(function(data){
                            console.log(data);
                            $scope.$parent.form.hosting.id = data;
                            hostingProvider.add.listObject($scope.$parent.form.hosting);
                            formReset();
                        });
                    });

                },
                hostingRemove: function (item) {
                    var modalOptions = {
                        closeButtonText: 'Отмена',
                        actionButtonText: 'Удалить',
                        headerText: 'Удаление домена',
                        bodyText: 'Подтвердите удаление хостинга: "'+ item.name + '"?'
                    };
                    modalService.showModal({}, modalOptions).result.then(function () {
                        hostingService.remove(item).then(function() {
                            $scope.hosting.list.splice($scope.hosting.list.indexOf(item), 1);
                        });
                    });
                },
                hostingEdit: function (item) {
                    $scope.$parent.form.hosting = angular.copy(item);

                    var modalOptions = {
                        closeButtonText: 'Отмена',
                        actionButtonText: 'Сохранить',
                        headerText: 'Редактирование аккаунта хостинга'
                    };
                    var modalDefaults = {
                        template: require('template!modalForm')
                    }
                    var modalEntity = modalService.showModal(modalDefaults, modalOptions);
                    modalEntity.opened.then(function(){
                        initDateTimePicker();
                    });
                    modalEntity.result.then(function () {
                        hostingService.edit($scope.$parent.form.hosting).then(function() {
                            hostingProvider.update.listObject(item, $scope.$parent.form.hosting);
                            formReset();
                        });

                    });
                },
                hosting: hostingProvider.getInstance(),
                status: function(date) {
                    if(date === "") return {};
                    // Copy date parts of the timestamps, discarding the time parts.
                    var m = date.match(/^(\d{1,2}).(\d{1,2}).(\d{4})$/);
                    var one = new Date();
                    var two = new Date(m[3], m[2]-1, m[1]);
                    // Do the math.
                    var millisecondsPerDay = 1000 * 60 * 60 * 24;
                    var millisBetween = two.getTime() - one.getTime();
                    var days = Math.floor(  millisBetween / millisecondsPerDay);
                    var status = { class: "label-success", text: "ОК" };
                    // Round down.
                    if(days < 30){
                        status = { class: "label-warning", text: "Требует продления" };
                    }
                    if(days < 0) {
                        status = { class: "label-danger", text: "Просрочен" }
                    }
                    return status;
                }
            });
            $scope.$watchCollection('hosting.list', function(value){
                $scope.hosting.options.filteredList = $filter('filter')(value, $scope.hosting.options.searchText);
                $scope.hosting.options.totalItems = $scope.hosting.options.filteredList.length;
                $scope.hosting.options.totalPages = Math.ceil($scope.hosting.options.filteredList.length / $scope.hosting.options.itemsPerPage);
            });

            $scope.$watch('hosting.options.searchText', function(search) {
                $scope.hosting.filteredList = $filter('filter')($scope.hosting.list, search);
                $scope.hosting.options.totalItems = $scope.hosting.options.filteredList.length;
                $scope.hosting.options.totalPages = Math.ceil($scope.hosting.options.filteredList.length / $scope.hosting.options.itemsPerPage);
                $scope.hosting.options.currentPage = 1;
            });
        }
    ]);
});
