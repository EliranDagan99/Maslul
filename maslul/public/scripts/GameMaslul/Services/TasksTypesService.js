gameMaslulApp.service('TasksTypesService', ['$http',
    function ($http) {

        // Done
        this.getAll = function () {
            return ($http({
                method: 'GET',
                url: '/api/tasks/all'
            }));
        };

        // Done
        this.getAllBonusTasks = function () {
            return ($http({
                method: 'GET',
                url: '/api/tasks/all/bonus'
            }));
        };

        // Done
        this.get = function (id) {
            return ($http({
                method: 'GET',
                url: '/api/tasks/getById',
                params: {
                    id: id
                }
            }));
        };

}]);