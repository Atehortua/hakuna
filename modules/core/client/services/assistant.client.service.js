'use strict';

angular.module('core').factory('Links', ['$resource',
    function($resource) {

        return $resource('/api/links/:linkId',{linkId:'@_id'},{
            update:{
                method:'PUT'
            },
            remove:{
                method:"DELETE"
            }
        });

    }
]);
