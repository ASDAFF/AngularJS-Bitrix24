/**
 * Load all dependencies for module
 */
define(function(require) {

    var module = require('module!@');

    /**
    * Providers && Services
    */
    require('service!service/permissionsService');
    require('service!service/userService');
    require('service!service/systemPropertiesService');
    require('service!factory/settingsFactory');
    require('service!provider/settingsProvider');

    /**
     * Include controllers
     */
    require('controller!index');

    /**
     * Require configs
     */
    require('config!main')(module);
});
