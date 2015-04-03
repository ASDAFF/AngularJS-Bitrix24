/**
 * Load all dependencies for module
 */
define(function(require) {

    var module = require('module!@');

    /**
     * Include services
     */
    require('service!factory/domainsFactory');
    require('service!service/domainsService');
    require('service!provider/domainsProvider');

    /**
     * Include controllers
     */
    require('controller!index');

    /**
     * Require configs
     */
    require('config!main')(module);
});
