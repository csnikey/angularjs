angular.module('app', ['ngRoute'])
.controller('HomeController',HomeController)
.controller('myinfoController',myinfoController)
.controller('addController',addController)
.config( function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl:'pages/home.html',
				controller: 'HomeController'
			})
			.when('/addCase', {
				template: '添加病理',
				controller: 'addController'
			})
			.when('/myInfo', {
				template: '我的页面',
//				templateUrl:'myinfo.html',
				controller: 'myinfoController'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
	



function HomeController($rootScope, $scope){
	
	$scope.data=123;
	
	
	
	
}
function myinfoController($rootScope, $scope){
	
	$scope.data=123;

}
function addController($rootScope, $scope){
	
	$scope.data=123;
	
	
	
	
}


