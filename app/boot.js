requirejs.config({
    baseUrl: '/app',
    paths: {
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'ui.bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
        'datepicker': '../bower_components/datetimepicker/jquery.datetimepicker',
        'jquery': '../bower_components/jquery/dist/jquery',
        'BX24': '../bower_components/bitrix24/v1',
        'angular': '../bower_components/angularjs/angular',
        'angular-route': '../bower_components/angular-route/angular-route',
        'text': '../bower_components/requirejs-text/text',
        'punycode': '../bower_components/punycode/punycode',
        'checklist-model': '../bower_components/checklist-model/checklist-model',

        'base': '../bower_components/requirejs-angualr-loader/src/base',
        'template': '../bower_components/requirejs-angualr-loader/src/template',
        'controller': '../bower_components/requirejs-angualr-loader/src/controller',
        'service': '../bower_components/requirejs-angualr-loader/src/service',
        'module': '../bower_components/requirejs-angualr-loader/src/module',
        'config': '../bower_components/requirejs-angualr-loader/src/config',
        'directive': '../bower_components/requirejs-angualr-loader/src/directive',
        'filter': '../bower_components/requirejs-angualr-loader/src/filter'
    },
    structure: {
        /**
         * @description
         * requirejs.config.baseUrl + structure.prefix
         *
         * requirejs.config.baseUrl = '/application'
         * structure.prefix = modules/{module}
         * {module} - module name
         *
         * result:
         *
         * application/modules/{module}
         */
        prefix: 'modules/{module}',

        /**
         * require
         */
        module: {
            path: '/{module}'
        },

        /**
         * @description
         *
         * syntax:
         *  require('template!{module}:{template-name}');
         *
         *  require('template!{template-name}') - in this case - will be used current module
         *    (which contains the current file)
         *
         *  require('template!@{template-name}') - same as above
         *
         *
         * if current module - foo (file where you use require is located under foo's module directory
         *  Example: /application/modules/foo/foo-include.js)
         *  next paths are same:
         *
         * require('template!bar')
         * require('template!@bar')
         * require('template!foo:bar')
         *
         * We will get:
         *
         *  /resource/views/{template}.{extension}
         *    -> /resource/views/bar.html     *
         *   then: requirejs.config.baseUrl + module + template path
         *   -> /application/modules/foo/resource/views/bar.html
         *
         *    baseUrl: /application
         *    modules dir: /modules
         *    module name: /foo
         *    template path: /resource/views/bar.html
         */
        template: {
            path: '/resources/views/{template}.{extension}',
            extension: 'html'
        },

        /**
         * @description
         *
         * Same for controller
         */
        controller: {
            path: '/controllers/{controller}'
        },

        /**
         * @description
         *
         * Same for service
         */
        service: {
            path: '/src/{service}'
        },

        /**
         * @description
         *
         * Same for config
         */
        config: {
            path: '/resources/configs/{config}'
        },

        /**
         * @description
         *
         * Same for directive
         */
        directive: {
            path: '/resources/directives/{directive}'
        },

        /**
         * @description
         *
         * Same for filter
         */
        filter: {
            path: '/resources/filter/{filter}'
        }
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-cache': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'ui.bootstrap': {
            deps: ['angular']
        },
        'BX24': {
            deps: ['jquery']
        },
        'datepicker': {
            deps: ['jquery']
        },
        'checklist-model': {
            deps:['angular']
        }
    }
});


console.time('application loading');
require(['app']);


