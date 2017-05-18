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