define(function (require) {
    var module = require('module!@');
    module.factory('menu.factory.menu', [function(){
        var menu = {
            activeItems: [],
            blueprint: {
                domain: {
                    caption: 'Домены',
                    route: '/domain',
                    class: 'icon icon-globe'
                },
                hosting: {
                    caption: 'Хостинг',
                    route: '/hosting',
                    class: 'icon icon-bolt'
                },
                setting: {
                    caption: 'Настройки',
                    route: '/setting',
                    class: 'icon icon-cog'
                }
            }
        };
        return {
            addMenuItem: function(item) {
                if (!item.hasOwnProperty('caption')) {
                    throw new Error('Caption property could not be empty');
                }
                if (!item.hasOwnProperty('route')) {
                    throw new Error('Route property could not be empty');
                }
                menu.activeItems.push(item);
            },
            getMenuItems: function() {
                return menu.activeItems;
            },
            getMenuBlueprint: function() {
                return menu.blueprint;
            },
            removeMenuItems: function(){
                menu.activeItems = [];
            }
        }
    }]);
});