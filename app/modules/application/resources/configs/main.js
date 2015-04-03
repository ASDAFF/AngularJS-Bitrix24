define(function(require){
    return function(module){
        require('./html5-mode')(module);
        module.constant('appConfig',
            {
                entity: {
                    domain: {
                        locale: 'Домен',
                        name: 'domain'
                    },
                    hosting: {
                        locale: 'Хостинг',
                        name: 'hosting'
                    },
                    setting: {
                        locale: 'Настройки',
                        name: 'setting',
                        hidden: true
                    }

                },
                settings: {
                    domainShared: 'domainEntityShared',
                    hostingShared: 'hostingEntityShared'
                }
            });
    };

});