/**
 * Load all dependencies for module
 */
define(function(require) {

  var module = require('module!@');

  /**
   * Include providers
   */
  require('service!provider/spinner');
  require('config!main')(module);
});
