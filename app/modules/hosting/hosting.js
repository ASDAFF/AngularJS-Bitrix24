/**
 * Create angular module
 */

define(function(require) {

    require('datepicker');

    var ng = require('angular');

    var module = ng.module('hosting', []);
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
