/**
 * Load all dependencies for module
 */
define(function(require) {

    var module = require('module!@');

    require('controller!auth');

    require('service!service/auth');

    require('config!main')(module);
});
