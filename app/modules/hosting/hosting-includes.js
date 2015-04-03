/**
 * Load all dependencies for module
 */
define(function(require) {

    var module = require('module!@');

    /**
     * Include services
     */
    require('service!factory/hostingFactory');
    require('service!service/hostingService');
    require('service!provider/hostingProvider');

    /**
     * Include controllers
     */
    require('controller!index');

    /**
     * Require configs
     */
    require('config!main')(module);
});
