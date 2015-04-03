/**
 * Create angular module
 */

define(function(require) {
    var ng = require('angular');

    var module = ng.module('domains', []);
    module.filter('startFrom', function() {
        return function(input, start) {
            if(input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        }
    });
    return module;
});
