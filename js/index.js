angular.module('app', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				template: '这是首页页面'
			})
			.when('/addCase', {
				template: '添加病理'
			})
			.when('/myInfo', {
				template: '我的页面'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);