app.controller('manageRoleController', function ($scope, $http) {
    $scope.roles = [];
    $scope.selectedRole = null;

    $scope.loadData = function () {
        $http.get('/api/roles')
            .then(function (response) {
                $scope.roles = response.data;
            }, function (error) {
                console.error('API Error:', error);
            });
    };

    $scope.deleteRole = function (roleId) {
        $http.delete('/api/roles/' + roleId)
            .then(function (response) {
                $scope.loadData();
            }, function (error) {
                console.error('API Error:', error);
            });
    };

    $scope.createRole = function () {
        $http.post('/api/roles', {
            "name": $scope.roleName
        })
            .then(function (response) {
                $scope.loadData();
                $scope.clearRole();
            }, function (error) {
                console.error('API Error:', error);
            });
    };

    $scope.clearRole = function () {
        $scope.roleName = '';
        $scope.selectedRole = null;
    };

    $scope.editRole = function (role) {
        $scope.selectedRole = role;
        $scope.roleName = role.name; 
    };

    $scope.updateRole = function () {
        $http.put('/api/roles/' + $scope.selectedRole.id, {
            "id": $scope.selectedRole.id,
            "name": $scope.roleName
        })
            .then(function (response) {
                $scope.loadData();
                $scope.clearRole();
            }, function (error) {
                console.error('API Error:', error);
            });
    };

    $scope.loadData();
});
