/**
 * Load all dependencies for module
 */
define(function(require) {

    var module = require('module!@');

    /**
    * Providers && Services
    */
    require('service!provider/menuItemsProvider');
    require('service!factory/menuFactory');
    require('service!controller/menu');
});
