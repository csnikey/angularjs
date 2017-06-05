##菜鸟教程
* 可以实时运行查看并实践语法
* [菜鸟教程地址](http://www.runoob.com/angularjs/angularjs-tutorial.html)
##参考手册
* [参考手册](http://www.runoob.com/angularjs/angularjs-reference.html)
## 数据绑定，数据模型
引入框架之后。
ng-model {{}} 可以使用同一个数据模型

ng-app 可以实现一个app实例的调用，如果不写这个，就会导致实例化失败

ng-init 可以初始化数据变量 ng-init='name="ac"'

标签上 ng-app指令定义了应用, ng-controller 定义了控制器。

##AngularJS 应用

* AngularJS 模块（Module） 定义了 AngularJS 应用。
var app = angular.module('myApp', []);


* AngularJS 控制器（Controller） 用于控制 AngularJS 应用。

app.controller('myCtrl', function($scope) {
    $scope.firstName= "John";
    $scope.lastName= "Doe";
});

## 基本运算
* 字符串相加
变量相加（运算），拼接字符串 
* 数学运算 ，与js相同
* ng-bind 可以直接使用变量 不用大括号
* 对象语法与js相同
* 支持数组语法

## 指令
* ng-app 指令初始化一个 AngularJS 应用程序
* ng-model 指定一个数据模型
* ng-init 初始化数据，通常情况下，不使用 ng-init。您将使用一个控制器或模块来代替它。

##ng-repeat 重复
ng-repeat="item in items"
item就是循环项 ，可以为数组项也可以为对象本身

##自定义指令
可以使用 .directive 函数来添加自定义的指令。
要调用自定义指令，HTML 元素上需要添加自定义指令名。
使用驼峰法来命名一个指令， runoobDirective, 但在使用它时需要以 - 分割, runoob-directive:
你可以通过以下方式来调用指令：元素名、 属性、 类名 、注释
你可以限制你的指令只能通过特定的方式来调用。restrict 值可以是以下几种:
E 作为元素名使用
A 作为属性使用
C 作为类名使用
M 作为注释使用
var app = angular.module("myApp", []);
app.directive("runoobDirective", function() {
    return {
        restrict : "A",
        template : "<h1>自定义指令!</h1>"
    };
});


## 创建自己的应用
* 定义自己的指令，命名的时候 用全部小写，注意的是组件是驼峰，标签或者属性调用时是-连接
var app = angular.module("myApp", []);
app.directive("runoobDirective", function() {
    return {
        restrict : "A",
        template : "<h1>自定义指令!</h1>"
    };
});


## demo
//这是教程里类似的写法
angular.module('myApp',[]).directive('zl1',[ function(){
  return {
    restrict:'AE',
    template:'thirective',
    link:function($scope,elm,attr,controller){
      console.log("这是link");
    },
    controller:function($scope,$element,$attrs){
      console.log("这是con");
    }
  };
}]).controller('Con1',['$scope',function($scope){
  $scope.name="aliceqqq";
}]);

## ng验证输入框，避免了不必要的脚本写法
<form ng-app="" name="myForm">
    Email:
    <input type="email" name="myAddress" ng-model="text">
    <span ng-show="myForm.myAddress.$error.email">不是一个合法的邮箱地址</span>
</form>

## 基于ng控件可以做不同的状态显示
input.ng-invalid {
    background-color: lightblue;
}
ng具有的不同状态
ng-empty
ng-not-empty
ng-touched
ng-untouched
ng-valid
ng-invalid
ng-dirty
ng-pending
ng-pristine


##scope 作用域
Scope(作用域) 是应用在 HTML (视图) 和 JavaScript (控制器)之间的纽带。
Scope 是一个对象，有可用的方法和属性。这些属性和方法都可以作用于视图上。
Scope 可应用在视图和控制器上。

## 根作用域
所有的应用都有一个 $rootScope，它可以作用在 ng-app 指令包含的所有 HTML 元素中。
$rootScope 可作用于整个应用中。是各个 controller 中 scope 的桥梁。用 rootscope 定义的值，可以在各个 controller 中使用。
后台应用中的session和它具有一样的性质。这个是本地客户端的而这个是基于通讯实现的，会话存在的前提下。

##ng-controller 通用用来做数据的处理
控制器实例化的部分可以写在本页面，也可以写在外联的js脚本中，建议第二种方式，思维更加清晰，
angular.module('myApp', []).controller('namesCtrl', function($scope) {
    $scope.names = [
        {name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
    ];
});

##过滤器
| 表达式的过滤器 uppercase  currency 过滤器将数字格式化为货币格式：limitTo 截取 orderBy filter number date | date:"yyyy-MM-dd HH:mm:ss"
//自定义的过滤器  与之前jq的区别是针对应用设置一系列专业性质的语法
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.msg = "Runoob";
});
app.filter('reverse', function() { //可以注入依赖
    return function(text) {
        return text.split("").reverse().join("");
    }
});

## 服务
在 AngularJS 中，服务是一个函数或对象，可在你的 AngularJS 应用中使用。
AngularJS 内建了30 多个服务。
有个 $location 服务，它可以返回当前页面的 URL 地址。服务可以当做函数的入参传入，注意 $location 服务是作为一个参数传递到 controller 中。如果要使用它，需要在 controller 中定义。
$http 是 AngularJS 应用中最常用的服务。 服务向服务器发送请求，应用响应服务器传送过来的数据。
你可以创建访问自定义服务，链接到你的模块中：
app.service('hexafy', function() {
    this.myFunc = function (x) {
        return x.toString(16);
    }
});

## 编辑器选择vs
具有很好的命令面板
集成终端工具 
可以实时调试
代码同步处理也不错的
支持代码实时保存修改

