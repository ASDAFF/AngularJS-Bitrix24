/**
 * Load all dependencies for module
 */
define(function(require) {

    var module = require('module!@');

    /**
     * Include services
     */
//    require('service!service/modalService');

    /**
     * Include controllers
     */
//    require('controller!index');

    /**
     * Require configs
     */
    require('config!main')(module);

});
