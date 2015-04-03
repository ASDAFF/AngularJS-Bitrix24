define(function(require){
    var module = require('module!@');
    return module.service('settings.service.user', ['$q', '$log', function($q, $log){
        this.getUserList = function(){
            var deferrer = $q.defer();
            BX24.callMethod(
                'user.get', {
                    FILTER: {
                        ACTIVE: true
                    }
                },
                function(result){
                    if (result.error()) {
                        deferrer.reject();
                    } else {
                        deferrer.resolve({result: result.data()})
                    }
                }
            );
            return deferrer.promise;
        };
        
    }]);
});