define(function(require) {
    require('datepicker');
    var punycode = require('punycode');
    var module = require('module!@');

    // we could load Greater with this:
    // require('service!application:factory/greater');
    // But this service is loaded in application-includes.js

    module.controller('domains.controllers.index', [
        '$scope',
        '$filter',
        'domains.provider.domains',
        'modals.service.modal',
        'domains.service.domains',
        'app.provider.spinner',
        function(
            $scope,
            $filter,
            $domains,
            modalService,
            domainsService,
            spinner
            ) {

            var resetNewDomain = function(){
                angular.extend($scope.$parent, {
                    form: {
                        newDomain: {
                            is_shared: true,
                            is_manual: true
                        }
                    }
                });
            };
            var initDateTimePicker = function(){
                setTimeout( function() {
                    $('#expiration_date').datetimepicker({
                        lang: 'ru',
                        format: 'd.m.Y',
                        timepicker: false,
                        closeOnDateSelect: true
                    });
                }, 100);
            }

            resetNewDomain();

            angular.extend($scope, {
                title: "Управление доменами",

                domainAdd: function(){

                    resetNewDomain();

                    var modalOptions = {
                        closeButtonText: 'Отмена',
                        actionButtonText: 'Создать',
                        headerText: 'Добавление домена'
                    };
                    var modalDefaults = {
                        template: require('template!add')
                    };
                    var modalEntity = modalService.showModal(modalDefaults, modalOptions);

                    modalEntity.opened.then(function(){
                        initDateTimePicker();
                    });

                    modalEntity.result.then(function (result) {
                        domainsService.addDomain($scope.$parent.form.newDomain).then(function(data){
                            $scope.$parent.form.newDomain.id = data;
                            var m = $scope.$parent.form.newDomain.expiration_date.match(/^(\d{1,2}).(\d{1,2}).(\d{4})$/);
                            var dateObject = new Date(m[3], m[2]-1, m[1]);
                            $scope.$parent.form.newDomain.expiration_date = dateObject;
                            $scope.domains.list.push($scope.$parent.form.newDomain);
                            resetNewDomain();
                        });
                    });

                },
                domainRemove: function (item) {
                    var modalOptions = {
                        closeButtonText: 'Отмена',
                        actionButtonText: 'Удалить',
                        headerText: 'Удаление домена',
                        bodyText: 'Подтвердите удаление домена: "'+ item.name + '"?'
                    };
                    var modalDefaults = {
                        template: require('template!add')
                    };
                    modalService.showModal({}, modalOptions).result.then(function () {
                        domainsService.removeDomain(item).then(function() {
                            $scope.domains.list.splice($scope.domains.list.indexOf(item), 1);
                        });
                    });
                },
                domainEdit: function (item) {
                    $scope.$parent.form.newDomain = angular.copy(item);
                    var MyDate = new Date(item.expiration_date);
                    var modelDate = ('0' + MyDate.getDate()).slice(-2) + '.'
                        + ('0' + (MyDate.getMonth()+1)).slice(-2) + '.'
                        + MyDate.getFullYear();
                    $scope.$parent.form.newDomain.expiration_date = modelDate;

                    var modalOptions = {
                        closeButtonText: 'Отмена',
                        actionButtonText: 'Сохранить',
                        headerText: 'Редактирование домена'
                    };
                    var modalDefaults = {
                        template: require('template!add')
                    }
                    var modalEntity = modalService.showModal(modalDefaults, modalOptions);
                    modalEntity.opened.then(function(){
                        initDateTimePicker();
                    });
                    var dateEdit = false;

                    modalEntity.result.then(function () {
                        if($scope.$parent.form.newDomain.expiration_date !== modelDate && !item.is_manual){
                            dateEdit = true;
                        }
                        domainsService.editDomain($scope.$parent.form.newDomain, dateEdit).then(function() {
                            $domains.updateDomain(item, $scope.$parent.form.newDomain);
                            resetNewDomain();
                        });

                    });
                },
                domainWhois: function(item){

                    $scope.$parent.form.newDomain = angular.copy(item);

                        spinner.show();
                        var whoisPromise = domainsService.getWhois($scope.$parent.form.newDomain);
                        whoisPromise.then(function(data) {
                            if(!data.hasOwnProperty('expires')){
                                var modalOptions = {
                                    actionButtonText: 'Закрыть',
                                    headerText: 'Обновить информацию не удалось',
                                    bodyText: 'Информация о дате истечения указанного домена не найдена'
                                };
                                modalService.showModal({template: require("template!error")}, modalOptions);
                                resetNewDomain();
                                spinner.hide();
                                return;
                            }
                            var MyDate = new Date(data.expires * 1000);
                            $scope.$parent.form.newDomain.expiration_date = ('0' + MyDate.getDate()).slice(-2) + '.'
                                + ('0' + (MyDate.getMonth()+1)).slice(-2) + '.'
                                + MyDate.getFullYear();

                            domainsService.editDomain($scope.$parent.form.newDomain, false).then(function() {
                                $domains.updateDomain(item, $scope.$parent.form.newDomain);
                                resetNewDomain();
                                spinner.hide();
                            });
                        });
                        whoisPromise.catch(function(){
                            var modalOptions = {
                                actionButtonText: 'Закрыть',
                                headerText: 'Обновить информацию не удалось',
                                bodyText: 'Таймаут соединения, сервер whois не ответил вовремя, попробуйте позднее'
                            };
                            modalService.showModal({template: require("template!error")}, modalOptions);
                            resetNewDomain();
                            spinner.hide();
                            return;
                        });

                },
                domains: $domains.getDomains(),
                toASCII: function(name){
                  return punycode.toASCII(name);
                },
                status: function(date) {
                    if(date === "") return {};
                    // Copy date parts of the timestamps, discarding the time parts.
                    var one = new Date();
                    var two = new Date(date);
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

            angular.extend($scope.$parent, {
                domainWhoisNew: function(){
                    $scope.$parent.whoisWait = true;
                    var whoisPromise = domainsService.getWhois($scope.$parent.form.newDomain);
                    whoisPromise.then(function(data) {
                        if(!data.hasOwnProperty('expires')){
                            var modalOptions = {
                                actionButtonText: 'Закрыть',
                                headerText: 'Обновить информацию не удалось',
                                bodyText: 'Информация о дате истечения указанного домена не найдена'
                            };
                            modalService.showModal({template: require("template!error")}, modalOptions);
                            resetNewDomain();
                            $scope.$parent.whoisWait = false;
                            return;
                        }
                        var MyDate = new Date(data.expires * 1000);
                        $scope.$parent.form.newDomain.expiration_date = ('0' + MyDate.getDate()).slice(-2) + '.'
                            + ('0' + (MyDate.getMonth()+1)).slice(-2) + '.'
                            + MyDate.getFullYear();

                        $scope.$parent.whoisWait = false;
                        $scope.$parent.form.newDomain.is_manual = false;
                    });
                    whoisPromise.catch(function(){
                        var modalOptions = {
                            actionButtonText: 'Закрыть',
                            headerText: 'Обновить информацию не удалось',
                            bodyText: 'Таймаут соединения, сервер whois не ответил вовремя, попробуйте позднее'
                        };
                        modalService.showModal({template: require("template!error")}, modalOptions);
                        $scope.$parent.whoisWait = false;
                        return;
                    });
                }
            });

            $scope.$watchCollection('domains.list', function(value){
                $scope.domains.filteredList = $filter('filter')(value, $scope.domains.searchText);
                $scope.domains.totalItems = $scope.domains.filteredList.length;
                $scope.domains.totalPages = Math.ceil($scope.domains.filteredList.length / $scope.domains.itemsPerPage);
            });

            $scope.$watch('domains.searchText', function(search) {
                $scope.domains.filteredList = $filter('filter')($scope.domains.list, search);
                $scope.domains.totalItems = $scope.domains.filteredList.length;
                $scope.domains.totalPages = Math.ceil($scope.domains.filteredList.length / $scope.domains.itemsPerPage);
                $scope.domains.currentPage = 1;
            });
        }
    ]);
});
