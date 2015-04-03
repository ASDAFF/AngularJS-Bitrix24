/**
 * Create angular module
 */
define(function(require) {
  var ng = require('angular');
  require('checklist-model');
  var module = ng.module('settings', ['checklist-model']);

  return module;
});
