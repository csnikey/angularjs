var app = angular.module('app', []);
//需要控制器的名称匹配
app.controller('indexCtrl', function($scope) {
    $scope.items = [1,3,20];
   
});


app.controller('baseCtrl', function($scope) {
    $scope.items = [1,7000,20];
   
});