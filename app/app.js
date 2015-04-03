define(function(require) {
    require('modules/application/application-includes');
    require('BX24');
    require('ui.bootstrap');
    require('modules/menu/menu-includes');
    require('modules/errors/errors-includes');
    require('modules/auth/auth-includes');
    require('modules/settings/settings-includes');
    require('modules/domains/domains-includes');
    require('modules/modals/modals-includes');
    require('modules/hosting/hosting-includes');

    var ng = require('angular');

    var name = 'my-app';
    var app = ng.module(name, [
        'application',
        'auth',
        'menu',
        'errors',
        'ui.bootstrap',
        'modals',
        'domains',
        'hosting',
        'settings'
    ]);



    ng.element(document)
        .ready(function()
        {
            /*
             *   Bitrix frame section
             */
            BX24.fitWindow();

            /*
             *   goodness app section
             */
            var root = ng.element(document.querySelector('#' + name));

            ng.bootstrap(root, [name]);
            console.timeEnd('application loading');


        });
});
