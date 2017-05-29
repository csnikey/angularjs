//调整字号大小
    (function() {
        //根据屏幕device-width来调整根字体大小
        document.addEventListener('DOMContentLoaded', function() {

            var html = document.documentElement;
            var windowWidth = html.clientWidth;
            if (windowWidth > 400) {
                windowWidth = 400;
            }
            html.style.fontSize = windowWidth / 7.5 + 'px';
        }, false);

    })();
console.log(113);
var app = angular.module('app', ['ui.router', 'ngFileUpload', 'me-lazyload']);

app.run(function($rootScope, $state, $stateParams, $location, $window, indexData) {
    $rootScope.$state = $state;
  

})


app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $httpProvider.interceptors.push(HttpInterceptor);
    $urlRouterProvider.otherwise('/index/questions');//之外的情况都跳转到ques界面
    $stateProvider.state('index', {
        abstract: true,
        url: '/index',
        templateUrl: 'pages/index.html'

    }).state('index.questions', {
        url: '/questions',
        templateUrl: 'pages/questions.html',
        controller: 'indexCtrl'
    })
})



$("#file").change(function(){
	var filename=$(this).val();
	console.log(filename);
	
	$.post("http://test.yilian.zhuojianchina.com/weixin/hocus.htm?action=uploadImg",{
		picture:filename
	},function(data){
		console.log(data);
	})
	
	
	
	
})


