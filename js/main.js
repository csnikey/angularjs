
HttpInterceptor.$inject = ['$q', '$timeout', '$location'];var app = angular.module('app', ['ui.router', 'ngFileUpload', 'me-lazyload']);

app.run(['$rootScope', '$state', '$stateParams', '$location', '$window', 'indexData', function($rootScope, $state, $stateParams, $location, $window, indexData) {
    $rootScope.$state = $state;
    $rootScope.isWeiXin = isWeiXin;

    $rootScope.fenxiang = function(e) {
        layer.msg('分享请点击右上角');
        // MtaH5.clickStat('share');
        console.log(e);
    }

    $rootScope.imgSmall = '@1e_1c_0o_0l_196h_196w_90q.src';

    $rootScope.goDetail = function(qid, uid, myid, isOpen, qtype) {
        if (isOpen == '1') {
            $state.go('pDetail', {uid: qid})
        } else if (uid == myid) {
            $state.go('myDetail', {uid: qid})
        } else if (qtype == 7) {
            // $state.go('detail2', {
            //     uid: qid
            // })
            location.href = '/?#/detail2/' + qid
        } else {
            $state.go('detail', {uid: qid})
        }
    }

    $rootScope.goInfo = function(uid, event) {
        var url = '/api/' + root + '/user/index?id=' + uid;
        indexData.getData(url).success(function(res) {
            if (res.status == 0) {
                if (res.data.isself == 1) {
                    $state.go('myInfo');
                } else {
                    $state.go('otherInfo', {uid: uid});
                }
            } else {
                layer.msg(res.msg);
            }
        })

        event.stopPropagation();
    }
    $rootScope.goAsk = function(uid, type) {
        var url = '/?#/ask/' + uid + '?type=' + type;
        location.href = url;
    }

    $rootScope.path = $state.current.url;
    $rootScope.pathName = $state.current.name;
    $rootScope.quesType = 0;

    var loadingIcon;
    $rootScope.$on('$stateChangeStart', function() {
        // loadingIcon=layer.msg('正在加载中...', {icon: 16,time:0});

    })
    $rootScope.$on('$stateChangeSuccess', function(newVal) {
        weishare();
        // 根据路径判断我们点击发布的时候的发布类型
        $rootScope.path = $state.current.url;
        $rootScope.pathName = $state.current.name;
        if ($rootScope.path == '/equipments' || $stateParams.type == '1') {
            $rootScope.quesType = 1;
        } else if ($rootScope.path == '/exams' || $stateParams.type == '2') {
            $rootScope.quesType = 2;
        } else {
            $rootScope.quesType = 0;
        }
        // 输出错误信息
        var message = $location.search().message;
        if (message) {
            layer.msg(message);
        }

        indexData.getData('/api/' + root + '/user/concern').success(function(res) {
            $rootScope.userInfo.newInfo = res.data;
        });

    })
}])

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $httpProvider.interceptors.push(HttpInterceptor);
    $urlRouterProvider.otherwise('/index/questions');
    $stateProvider.state('index', {
        abstract: true,
        url: '/index',
        templateUrl: 'pages/index.html'

    }).state('index.questions', {
        url: '/questions',
        templateUrl: 'pages/questions.html',
        controller: 'questionsCtrl'
    }).state('index.paycases', {
        url: '/paycases',
        templateUrl: 'pages/paycases.html',
        controller: 'paycasesCtrl'
    }).state('find.topics', {
        url: '/topics',
        templateUrl: 'pages/topics.html'

    }).state('index.artistic', {
        url: '/artistic?type',
        templateUrl: 'pages/artistic.html'

    }).state('search', {
        url: '/search',
        templateUrl: 'pages/search.html',
        controller: 'searchCtrl',
        controllerAs: 'vm'
    }).state('detail', {
        url: '/detail/:uid?item',
        templateUrl: 'pages/detail.html',
        resolve: {
            mydata: ['indexData', '$stateParams', function(indexData, $stateParams) {
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid;
                return indexData.getData(url);
            }]
        },
        controller: 'detailCtrl'

    }).state('detail2', {
        url: '/detail2/:uid?from_uid',
        templateUrl: 'pages/detail2.html',
        resolve: {
            mydata: ['ajax', '$stateParams', function(ajax, $stateParams) {
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid;
                if ($stateParams.from_uid) {
                    url += '?from_uid=' + $stateParams.from_uid;
                }
                return ajax.get(url);
            }]
        },
        controller: 'detail2Ctrl'
    }).state('myDetail', {
        url: '/myDetail/:uid',
        templateUrl: 'pages/myDetail.html',
        resolve: {
            mydata: ['indexData', '$stateParams', function(indexData, $stateParams) {
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid;
                return indexData.getData(url);
            }]
        },
        controller: 'myDetailCtrl'
    }).state('pDetail', {
        url: '/pDetail/:uid',
        templateUrl: 'pages/pDetail.html',
        resolve: {
            mydata: ['indexData', '$stateParams', function(indexData, $stateParams) {
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid;
                return indexData.getData(url);
            }]
        },
        controller: "pDetailCtrl"
    }).state('pay', {
        url: '/pay/:uid?status&trade_id',
        templateUrl: 'pages/pay.html',
        controller: 'payCtrl',
        resolve: {
            mydata: ['indexData', '$stateParams', function(indexData, $stateParams) {
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid;
                return indexData.getData(url);
            }]
        }
    }).state('focus', {
        abstract: true,
        url: '/focus',
        templateUrl: 'pages/focus.html'

    }).state('focus.myQus', {
        url: '/myQus',
        templateUrl: 'pages/myQus.html',
        controller: 'myQusCtrl',
        controllerAs: 'vm'
    }).state('focus.myAsw', {
        url: '/myAsw',
        templateUrl: 'pages/myAsw.html',
        controller: 'myAswCtrl',
        controllerAs: 'vm'
    }).state('focus.myCollect', {
        url: '/myCollect',
        templateUrl: 'pages/myCollect.html',
        controller: 'myCollectCtrl'
    }).state('question', {
        url: '/question/:type?flag',
        templateUrl: 'pages/question.html',
        controller: 'questionCtrl'
    }).state('append', {
        url: '/append/:qid?content&type',
        templateUrl: 'pages/append.html',
        controller: 'appendCtrl'
    }).state('addtopics', {
        url: '/addtopics',
        templateUrl: 'pages/addtopics.html',
        controller: 'addtopicsCtrl'
    }).state('addactive', {
        url: '/addactive/:activity_id',
        templateUrl: 'pages/addactive.html',
        controller: 'addactiveCtrl'
    }).state('ask', {
        url: '/ask/:uid?type',
        templateUrl: 'pages/ask.html',
        controller: 'askCtrl'
    }).state('find', {
        url: '/find',
        abstract: true,
        templateUrl: 'pages/find.html'

    }).state('find.news', {
        url: '/news',
        templateUrl: 'pages/news.html'

    }).state('find.keshi', {
        url: '/keshi',
        templateUrl: 'pages/keshi.html',
        controller: 'keshiCtrl',
        controllerAs: 'vm'
    }).state('kdetail', {
        url: '/kdetail/:kid',
        templateUrl: 'pages/kdetail.html',
        controller: 'kdetailCtrl',
        controllerAs: 'vm'
    }).state('find.exams', {
        url: '/exams',
        templateUrl: 'pages/exams.html'

    }).state('find.equipments', {
        url: '/equipments',
        templateUrl: 'pages/equipments.html'

    }).state('find.active_list', {
        url: '/active_list',
        templateUrl: 'pages/active_list.html',
        controller: 'activeListCtrl'
    }).state('myInfo', {
        url: '/myInfo',
        templateUrl: 'pages/myInfo.html',
        controller: 'myInfoCtrl',
        controllerAs: 'vm'
    }).state('otherInfo', {
        url: '/otherInfo/:uid',
        templateUrl: 'pages/otherInfo.html',
        controller:'otherInfoCtrl',
        controllerAs:'vm'
    }).state('myFocus', {
        url: '/myFocus/:uid',
        templateUrl: 'pages/myFocus.html',
        controller: 'myFocusCtrl',
        controllerAs: 'vm'
    }).state('myFans', {
        url: '/myFans/:uid',
        templateUrl: 'pages/myFans.html',
        controller: 'myFansCtrl',
        controllerAs: 'vm'
    }).state('charge', {
        url: '/charge',
        templateUrl: 'pages/charge.html',
        controller: 'chargeCtrl',
        controllerAs: 'vm'
    }).state('shangCharge', {
        url: '/shangCharge',
        templateUrl: 'pages/shangCharge.html',
        controller: 'shangChargeCtrl'
    }).state('shangIn', {
        url: '/shangIn/:money?pay_type',
        templateUrl: 'pages/shangIn.html',
        controller: 'shangInCtrl',
        controllerAs: 'vm'
    }).state('shangOut', {
        url: '/shangOut/:money?pay_type',
        templateUrl: 'pages/shangOut.html',
        controller: 'shangOutCtrl',
        controllerAs: 'vm'
    }).state('shangAll', {
        url: '/shangAll?money',
        templateUrl: 'pages/shangAll.html',
        controller: 'shangAllCtrl',
        controllerAs: 'vm'
    }).state('showShang', {
        url: '/showShang',
        templateUrl: 'pages/showShang.html',
        controller: 'showShangCtrl',
        controllerAs: 'vm'
    }).state('myaccepted', {
        url: '/myaccepted',
        templateUrl: 'pages/myaccepted.html',
        controller: 'myacceptedCtrl',
        controllerAs: 'vm'
    }).state('redbagrecord', {
        url: '/redbagrecord?type',
        templateUrl: 'pages/redbagrecord.html',
        controller: 'redbagrecordCtrl',
        controllerAs: 'vm'
    }).state('guide', {
        url: '/guide',
        templateUrl: 'pages/guide.html'
    }).state('about', {
        url: '/about',
        templateUrl: 'pages/about.html'
    }).state('aboutcont', {
        url: '/aboutcont?type',
        templateUrl: 'pages/aboutcont.html'
    }).state('guidecont', {
        url: '/guidecont?type',
        templateUrl: 'pages/guidecont.html'
    }).state('payCheck', {
        url: '/payCheck',
        templateUrl: 'pages/payCheck.html'
    }).state('myPay', {
        url: '/myPay/:type',
        controller: 'myPayCtrl',
        templateUrl: 'pages/myPay.html'
    }).state('payCase', {
        url: '/payCase',
        controller: 'payCaseCtrl',
        controllerAs: 'vm',
        templateUrl: 'pages/payCase.html'
    }).state('active', {
        url: '/active/:id',
        templateUrl: 'pages/active.html',
        controller: 'activeCtrl',
        controllerAs: 'vm'
    }).state('active_detail', {
        url: '/active_detail/:id',
        templateUrl: 'pages/active_detail.html',
        controller: 'activeDetailCtrl'
    }).state('match', {
        url: '/match/:id?isbanner',
        templateUrl: 'pages/match.html',
        controller: 'matchCtrl'
    }).state('invitation', {
        url: '/invitation?id',
        templateUrl: 'pages/invitation.html',
        controller: 'invitationCtrl',
        controllerAs: 'vm'
    }).state('myInvitation', {
        url: '/myInvitation',
        templateUrl: 'pages/myInvitation.html',
        resolve: {
            mydata: ['indexData', '$stateParams', function(indexData, $stateParams) {
                var url = '/api/' + root + '/user/index';
                return indexData.getData(url);
            }]
        },
        controller: 'myInvitationCtrl',
        controllerAs: 'vm'
    }).state('wepay', {
        url: '/wepay/:id?qid&aid&is_anonymous&type',
        templateUrl: 'tpl/invitation/wepay.html'
    }).state('shareRank', {
        url: '/shareRank/:id',
        templateUrl: 'pages/shareRank.html',
        controller: 'shareRankCtrl',
        controllerAs: 'vm'
    }).state('shareDetail', {
        url: '/shareDetail',
        templateUrl: 'pages/shareDetail.html',
        controller: 'shareDetailCtrl',
        controllerAs: 'vm'
    }).state('activeInvite', {
        url: '/activeInvite/:id?uid',
        templateUrl: 'pages/activeInvite.html',
        controller: 'activeInviteCtrl',
        controllerAs: 'vm'
    }).state('mooc', {
        url: '/mooc',
        templateUrl: 'pages/mooc.html',
        controller: 'moocCtrl',
        controllerAs: 'vm'
    }).state('payCaseRank', {
        url: '/payCaseRank',
        templateUrl: 'pages/payCaseRank.html',
        controller: 'payCaseRankCtrl',
        controllerAs: 'vm'
    }).state('otherInfoList', {
        url: '/otherInfoList/:id?type&limit',
        templateUrl: 'pages/otherInfo_list.html',
        controller: 'otherInfoListCtrl',
        controllerAs: 'vm'
    }).state('otherInfoInvite', {
        url: '/otherInfoInvite/:uid',
        templateUrl: 'pages/otherInfoInvite.html',
        controller: 'otherInfoInviteCtrl',
        controllerAs: 'vm'
    }).state('rule', {
        url: '/rule',
        templateUrl: 'pages/rule.html',
        controller: 'ruleCtrl',
    }).state('error', {
        url: '/error',
        templateUrl: 'pages/error.html',
        controller: 'errorCtrl',
        controllerAs: 'vm'
    })
}])

//去除数组中的重复项
function uniqArr(data) {
    var temp = {},
        result = [];
    if (data.length > 0) {
        data.forEach(function(arr) {
            if (!temp[arr.id]) {
                temp[arr.id] = true;
                result.push(arr)
            }
        })
    }
    return result;
}

app.directive('myPayissue', ['$rootScope', 'ajax', function($rootScope,ajax) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            uid: '='
        },
        templateUrl: '/tpl/components/myPayissue.html',
        link: function(scope) {
            var url = '/api/' + root + '/user/mypayissue?type=pay_issue_receive&status="0,3"&user_id=' + scope.uid;
            scope.goInfo = $rootScope.goInfo;
            scope.goDetail = $rootScope.goDetail;
            scope.userInfo = $rootScope.userInfo;

            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    scope.data = res.data;
                } else {
                    layer.msg(res);
                }

            });

        }
    }
}]);
app.directive('myPaycases', ['$rootScope', 'ajax', function($rootScope,ajax) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            uid: '='
        },
        templateUrl: '/tpl/components/myPaycases.html',
        link: function(scope) {
            var url = '/api/' + root + '/user/mypaytoseequestion?user_id=' + scope.uid;

            scope.goInfo = $rootScope.goInfo;
            scope.goDetail = $rootScope.goDetail;
            scope.userInfo = $rootScope.userInfo;

            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    scope.data = res.data;
                } else {
                    layer.msg(res);
                }
            });

        }
    }
}]);

app.directive('myAnswer', ['indexData', '$rootScope', function(indexData, $rootScope) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            uid: '=',
            type: '='
        },
        template: '<ul id="index_list">' +
        '<li class="tab-list mb2" ng-repeat="item in data" ng-if="item.type==0">' +
        '<div class="pda" ng-click="goDetail(item.question_id,item.m_members.id,userInfo.id,item.pay_issue_isopen)">' +
        '<div class="clearfix">' + '<div class="p-logo fl" ng-click="goInfo(item.role_id,$event)">' +
        '<a class="p-pic"><img lazy-src="{{item.m_members.headimg}}">' +
        '<div class="v" ng-if="item.m_members.isrenzheng>0"><img lazy-src="img/v{{item.m_members.isrenzheng}}.png"></div>' +
        '</a>' +
        '</div>' +
        '<div class="p-msg fr">' +
        '<a class="color-red"><span>{{item.k_price}}</span>K币<img src="img/mony.png" alt="K币" width="18"></a>' +
        '<a ng-show="item.status==1"><span>求助中</span><img src="img/help.png" alt="求助" width="18"></a>' +
        '<a ng-show="item.status==2"><span>已解决</span><img src="img/ok.png" alt="求助" width="18"></a>' +
        '</div>' +
        '</div>' +
        '<div class="clearfix">' +
        '<p class="f3 color-3d mt2 fl">问题：{{item.question}}</p>' +
        '<div class="fr mt2 color-96">已有<span class="color-green">{{item.answer_num}}</span>个人回答</div>' +
        '</div>' +
        '</div>' +
        '</li>' +
        '</ul>',
        link: function(scope) {
            var url = null;
            if (scope.type == 2) {
                url = '/api/' + root + '/user/myanswer?user_id=' + scope.uid;
            } else {
                url = '/api/' + root + '/user/myquestion?user_id=' + scope.uid;
            }
            scope.goDetail = $rootScope.goDetail;

            indexData.getData(url).success(function(res) {
                console.log(res)
                if (res.status == 0) {
                    scope.data = res.data.data;
                } else {
                    layer.msg(res);
                }

            });

        }
    }
}])

/*app.controller('examsCtrl', function($scope, indexData) {
    var url = '/api/' + root + '/index/exams';
    indexData.getData(url).success(function(res) {
        $scope.data = res.data.data;
        console.log(res);
    });
    $scope.tabs = [{
        title: '最新提问',
        type: 'new',
        float: 'fl'
    }, {
        title: '最多收藏',
        type: 'collect',
        float: 'fl'
    }, {
        title: '最多回复',
        type: 'answer',
        float: 'fl'
    }];

    $scope.type = 'new';
    $scope.page = 1;
    $scope.getMore = function(type) {
        $scope.page = $scope.page + 1;
        var url = '/api/' + root + '/index/exams?type=' + type + '&page=' + $scope.page;
        indexData.getData(url).success(function(data) {
            if (data.status == 0) {
                if (data.data.data.length == 0) {
                    layer.msg('已经没有数据了');
                } else {
                    data.data.data.forEach(function(item) {
                        $scope.data.push(item);
                    });
                }

            } else {
                layer.msg(data.msg);
            }
        })
    }
});*/
app.controller('equipmentsCtrl', ['$scope', 'indexData', function($scope, indexData) {
    var url = '/api/' + root + '/index/equipments';
    indexData.getData(url).success(function(res) {
        $scope.data = res.data.data;
    });
    $scope.tabs = [{
        title: '最新提问',
        type: 'new',
        float: 'fl'
    }, {
        title: '最多收藏',
        type: 'collect',
        float: 'fl'
    }, {
        title: '最多回复',
        type: 'answer',
        float: 'fl'
    }];

    $scope.type = 'new';
    $scope.page = 1;
    $scope.getMore = function(type) {
        $scope.page = $scope.page + 1;
        var url = '/api/' + root + '/index/exams?type=' + type + '&page=' + $scope.page;
        indexData.getData(url).success(function(data) {
            if (data.status == 0) {
                if (data.data.data.length == 0) {
                    layer.msg('已经没有数据了');
                } else {
                    data.data.data.forEach(function(item) {
                        $scope.data.push(item);
                    });
                }

            } else {
                layer.msg(data.msg);
            }
        })
    }
}]);

app.controller('aboutcontCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
    var type = $stateParams.type;
    $scope.type = type;
}]);

app.controller('guidecontCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
    var type = $stateParams.type;
    $scope.type = type;
}]);

function get_name() {
    var year = new Date().getFullYear(),
        month = get_month(),
        day = get_day();
    var time = new Date().valueOf();
    var random = Math.ceil(Math.random() * 10000000);
    var filename = year + '' + month + '' + day + '/' + time + '' + random;
    return filename;
}

function get_month() {
    var date = new Date();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    return month;
}

function get_day() {
    var date = new Date();
    var day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    return day;
}

function weishare() {
    //微信分享
    var config = {
        title: '医看—医生快速问答平台', // 分享标题
        desc: '免费、专业，关键是回复速度快',
        link: location.href, // 分享链接
        imgUrl: 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg', // 分享图标
        success: function(res) {
            // 用户确认分享后执行的回调函数
            MtaH5.clickStat('share');
        },
        fail: function(res) {
            alert('error');
        }
    }
    wx.ready(function() {
        wx.onMenuShareTimeline(config);
        wx.onMenuShareAppMessage(config);
        wx.onMenuShareQQ(config);
    });
}

/**
 * 替换输入文本中的链接
 * @param  {String} str 需要替换的内容
 * @return {String}     返回处理完成的字符串
 */
function changeLink(str){
  var reg = /##([^##]+)?##/gi;
  var str = str;
  var patarg;
  while (patarg = reg.exec(str)){
    str = str.replace(patarg[0],'<a class="my-link" onclick="window.event.stopPropagation();" href="'+patarg[1]+'">查看链接</a>');
  }
  return encodeURI(str);
}

var myscope;

app.directive('uploadImg', ['indexData', function(indexData) {
    return {
        restrict: 'EA',
        link: function($scope, ele, attrs, tabsCtrl) {
            var accessid = '',
                host = '',
                policyBase64 = '',
                signature = '',
                callbackbody = '',
                filename = '',
                key = '',
                pics = [];

            var target = ele.get(0);
            var uploader = new plupload.Uploader({
                runtimes: 'html5,flash,silverlight,html4',
                browse_button: target,
                multi_selection: true,
                url: "//yikan-t.oss-cn-hangzhou.aliyuncs.com",

                filters: {
                    mime_types: [ //只允许上传图片和zip,rar文件
                        {
                            title: "Image files",
                            extensions: "jpg,gif,png,bmp"
                        }
                    ],
                    max_file_size: '10mb', //最大只能上传10mb的文件
                    prevent_duplicates: true //不允许选取重复文件
                },

                init: {
                    FilesAdded: function(up, files) {
                        files.forEach(function(file) {
                            var type = file.name.split('.')[1];
                            upload_start(up, type, false);

                        })


                    },
                    BeforeUpload: function(up, file) {
                        var type = file.name.split('.')[1];
                        upload_start(up, type, true);
                    },

                    UploadProgress: function(up, file) {
                        /*var d = document.getElementById(file.id);
                        d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        var prog = d.getElementsByTagName('div')[0];
                        var progBar = prog.getElementsByTagName('div')[0]
                        progBar.style.width= 2*file.percent+'px';
                        progBar.setAttribute('aria-valuenow', file.percent);*/
                    },
                    UploadComplete: function(up, files) {
                        $scope.$apply(function() {
                            if ($scope.data.pics && !$scope.ans.pics) {
                                pics.forEach(function(pic) {
                                    $scope.data.pics.push(pic);
                                })
                            } else {
                                pics.forEach(function(pic) {
                                    $scope.ans.pics.push(pic);
                                    console.log($scope.ans.pics);
                                })
                            }
                        })

                        pics = [];
                    }
                }
            });
            uploader.init();


            function upload_start(up, type, ret) {
                if (ret == false) {
                    indexData.getData('/api/frontend/utils/uploadsign').success(function(obj) {
                        host = obj['host'];
                        policyBase64 = obj['policy'];
                        accessid = obj['accessid'];
                        signature = obj['signature'];
                        expire = parseInt(obj['expire']);
                        key = obj['dir'];

                        var new_multipart_params = {
                            'key': key + get_name() + '.' + type,
                            'policy': policyBase64,
                            'OSSAccessKeyId': accessid,
                            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                            'signature': signature,
                        };
                        up.setOption({
                            'url': host,
                            'multipart_params': new_multipart_params
                        });
                        up.start();
                        ret = true;
                    });

                } else {
                    var new_multipart_params = {
                        'key': key + get_name() + '.' + type,
                        'policy': policyBase64,
                        'OSSAccessKeyId': accessid,
                        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                        'signature': signature,
                    };
                    up.setOption({
                        'url': host,
                        'multipart_params': new_multipart_params
                    });
                    up.start();
                    pics.push(new_multipart_params.key);
                }



            }



            //plupload中为我们提供了mOxie对象
            //有关mOxie的介绍和说明请看：https://github.com/moxiecode/moxie/wiki/API
            //如果你不想了解那么多的话，那就照抄本示例的代码来得到预览的图片吧
            function previewImage(file, callback) { //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                if (!file || !/image\//.test(file.type)) return; //确保文件是图片
                if (file.type == 'image/gif') { //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                    var fr = new mOxie.FileReader();
                    fr.onload = function() {
                        callback(fr.result);
                        fr.destroy();
                        fr = null;
                    }
                    fr.readAsDataURL(file.getSource());
                } else {
                    var preloader = new mOxie.Image();
                    preloader.onload = function() {
                        preloader.downsize(300, 300); //先压缩一下要预览的图片,宽300，高300
                        var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                        callback && callback(imgsrc); //callback传入的参数为预览图片的url
                        preloader.destroy();
                        preloader = null;
                    };
                    preloader.load(file.getSource());
                }
            }

            function get_name() {
                var year = new Date().getFullYear(),
                    month = get_month(),
                    day = get_day();
                var time = new Date().valueOf();
                var random = Math.ceil(Math.random() * 10000000);
                var filename = year + '' + month + '' + day + '/' + time + '' + random;
                return filename;
            }

            function get_month() {
                var date = new Date();
                var month = date.getMonth() + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                return month;
            }

            function get_day() {
                var date = new Date();
                var day = date.getDate();
                if (day < 10) {
                    day = '0' + day;
                }
                return day;
            }
        }
    }
}]);

app.directive('msg', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            num: '=num',
        },
        template: '<i class="msg" ng-if="num>0"></i>',
    }
})
app.directive('msg2', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            num: '=num',
        },
        template: '<i class="msg2" ng-if="num>0"></i>',
    }
})

//加载更多
/*app.directive('addMore',function(indexData){
    return {
        restrict:'EA',
        replace:true,
        scope:{
            type:'=type',
            page:'=page',
            urlType:'=urlType',
        },
        template:'<div class="next pda" ng-if="data.length>=20">' +
                    '<div class="next-btn" ng-click="getMore(type)">点击加载更多</div>' +
                '</div>',
        link:function(scope,ele,attrs,addCtrl){
            scope.getMore = function(type) {
                page = page + 1;
                var url=setUrl(urlType);
                indexData.getData(url).success(function(data) {
                    if (data.status == 0) {
                        if (data.data.data.length == 0) {
                            layer.msg('已经没有数据了');
                        } else {
                            data.data.data.forEach(function(item) {
                                scope.data.push(item);
                            });
                        }

                    } else {
                        layer.msg(data.msg);
                    }
                })
            }
        }
    }
})*/

app.directive('goHere', function() {
    return {
        restrict: 'EA',
        link: function(scope, ele, attrs, ctrl) {
            if (scope.targetId == attrs.myid) {
                var height = $(ele).offset().top - 200;
                $('body,html').animate({
                    scrollTop: height
                });
            }
        }
    }
})

app.filter('datefilter', function() {
    return function(obj) {
        return obj.slice(5);
    }
});

app.filter('money', function() {
    return function(obj) {
        var money = obj / 100;
        return money >= 1 ? money : 0
    }
})

app.filter('uniqArray', function() {
    return function(data,index) {
        var temp = {},
            result = [];
        if (data.length > 0) {
            data.forEach(function(arr) {
                if (!temp[arr[index]]) {
                    temp[arr[index]] = true;
                    result.push(arr)
                }
            })
        }
        return result;
    }
})

app.filter('br', ['$sce', function($sce) {
    return function(str) {
        return $sce.trustAsHtml(str.replace(/\n/g, '<br>'));
    }
}])

app.filter('time', function() {
    return function(time) {
        var h = Math.floor(time/60/60)
        var d = Math.floor(time/60%60)
        var t = Math.floor(time%60)
        h=h>10?h:'0'+h;
        d=d>10?d:'0'+d;
        t=t>10?t:'0'+t;

        return h+':'+d+':'+t
    }
})

app.filter('category_item', function() {
    return function(item,category) {
        console.log(item)
        console.log(category)
        return category[item];
    }
})

app.service('indexData', ['$http', function($http) {
    this.getData = function(url) {
        return $http({
            method: 'GET',
            url: url
        });
    }
}]);

app.service('postData', ['$http', function($http) {
    this.setData = function(url, data) {
        return $http({
            method: 'POST',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
    }
}]);

app.service('updateData', ['$http', function($http) {
    this.putData = function(url) {
        return $http({
            method: 'PUT',
            url: url
        })
    }
}]);

app.service('deletePic', ['$http', function($http) {
    this.delete = function(url, data) {
        /*return $.ajax({
            url:url,
            method:'PUT',
            data:data
        })*/
        return $http({
            method: 'PUT',
            url: url,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }
}]);


//微信分享
app.service('weixin', function() {
    this.share = function(config) {
        return function() {
            wx.onMenuShareTimeline(config);
            wx.onMenuShareAppMessage(config);
            wx.onMenuShareQQ(config);
        }
    }
})

//存储赞赏信息
app.service('myShang', function() {
    var _myInfo = {};
    this.setInfo = function(person,type,free_person) {
        _myInfo.person = person;
        _myInfo.type = type;
        _myInfo.free_person = free_person;
    }
    this.getInfo = function() {
        return _myInfo;
    }
})


app.service('detailService', ['indexData', function(indexData) {
    var url = '/api/' + root + '/index/detail/1565';
    this.data = function() {
        return indexData.getData(url).success(function(res) {
            return res
        })
    }
}])


var ajaxLoading;
// http拦截
app.factory('HttpInterceptor', ['$q', '$timeout', '$location', HttpInterceptor]);

function HttpInterceptor($q, $timeout, $location) {
    return {
        request: function(config) {
            ajaxLoading = layer.load(2);
            return config;
        },
        response: function(err) {
            layer.close(ajaxLoading);
            if (err.data.status == -3) {
                var smart_url = encodeURIComponent(location.href);
                location.href = '/api/' + root + '/account/signin?smart_url=' + smart_url;

            } else {
                return err;
            }
        }
    }
}

;(function(window, document, undefined) {
  /**
   * 改变病例类型
   */
  changeType.$inject = ['ajax'];
  angular.module('app').directive('changeType',changeType);

  function changeType(ajax) {
    return {
      restrict:'EA',
      replace: true,
      scope: {
          admin: '=',
          qid: '=',
          type: '='
      },
      templateUrl: 'tpl/components/changeType.html',
      link:function(scope,ele,attr){
        scope.submit = submit;
        scope.select = scope.type;
        function submit(){
          var url = '/api/' + root + '/operation/changequestiontype';
          var data = {
            question_id:scope.qid,
            type:scope.select
          }
          layer.confirm('确定要改变？', {
              icon: '3',
              title: ' '
          }, function(index) {
              ajax.post(url,$.param(data))
                  .success(function(res) {
                      layer.msg(res.msg);
                      layer.close(index);
                      if (res.status == 0) {
                          location.reload();
                      }
                  })

          })
        }
      }
    }
  }
})(window,document);

;(function(window, document, undefined) {
  /**
   * 删除帖子指令
   * @param  {String} delete - 指令名称
   * @return {object}
   */
  angular.module('app').directive('delete', ['ajax', function(ajax) {
      return {
          restrict: 'EA',
          replace: true,
          scope: {
              admin: '=',
              type: '=',
              qid: '='
          },
          template: '<div class="btn-sm" ng-click="delete(type,qid)" ng-show="admin==1">删除</div>',
          link: function(scope, ele, attrs) {

              scope.delete = del;

              /**
               * 删除方法
               * @param  {Num} type 删除类型 0：删除问题 1：删除回答
               * @param  {String} id   目标ID
               */
              function del(type, id) {

                  var url = setUrl(type, id);
                  layer.confirm('确定要删除？', {
                      icon: '3',
                      title: ' '
                  }, function(index) {
                      ajax.put(url)
                          .success(function(res) {
                              layer.msg(res.msg);
                              layer.close(index);
                              if (res.status == 0) {
                                  location.reload();
                              }
                          })

                  })

              }

              /**
               * 设置url
               * @param  {Num} type   删除类型 0：删除问题 1：删除回答
               * @param  {String} id  目标ID
               * @return {String}     返回最终url
               */
              function setUrl(type, id) {
                  var url1 = '/api/' + root + '/operation/delquestion/' + id,
                      url2 = '/api/' + root + '/operation/delreply/' + id;
                  return type == 0 ? url1 : url2;
              }
          }
      }
  }])
})(window,document);

;
(function(window, document, undefined) {
  /**
   * 图片懒加载
   */
    lazySrc.$inject = ['$window', '$document'];
    angular
      .module('me-lazyload', [])
      .directive('lazySrc', lazySrc);

    function lazySrc($window, $document) {
        var doc = $document[0],
            body = doc.body,
            win = $window,
            $win = angular.element(win),
            uid = 0,
            elements = {};

        function getUid(el) {
            var __uid = el.data("__uid");
            if (!__uid) {
                el.data("__uid", (__uid = '' + ++uid));
            }
            return __uid;
        }

        function getWindowOffset() {
            var t,
                pageXOffset = (typeof win.pageXOffset == 'number')
                    ? win.pageXOffset
                    : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.scrollLeft == 'number'
                        ? t
                        : body).scrollLeft,
                pageYOffset = (typeof win.pageYOffset == 'number')
                    ? win.pageYOffset
                    : (((t = doc.documentElement) || (t = body.parentNode)) && typeof t.scrollTop == 'number'
                        ? t
                        : body).scrollTop;
            return {offsetX: pageXOffset, offsetY: pageYOffset};
        }

        function isVisible(iElement) {
            var elem = iElement[0],
                elemRect = elem.getBoundingClientRect(),
                windowOffset = getWindowOffset(),
                winOffsetX = windowOffset.offsetX,
                winOffsetY = windowOffset.offsetY,
                elemWidth = elemRect.width || elem.width,
                elemHeight = elemRect.height || elem.height,
                elemOffsetX = elemRect.left + winOffsetX,
                elemOffsetY = elemRect.top + winOffsetY,
                viewWidth = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0),
                viewHeight = Math.max(doc.documentElement.clientHeight, win.innerHeight || 0),
                xVisible,
                yVisible;

            if (elemOffsetY <= winOffsetY) {
                if (elemOffsetY + elemHeight >= winOffsetY) {
                    yVisible = true;
                }
            } else if (elemOffsetY >= winOffsetY) {
                if (elemOffsetY <= winOffsetY + viewHeight) {
                    yVisible = true;
                }
            }

            if (elemOffsetX <= winOffsetX) {
                if (elemOffsetX + elemWidth >= winOffsetX) {
                    xVisible = true;
                }
            } else if (elemOffsetX >= winOffsetX) {
                if (elemOffsetX <= winOffsetX + viewWidth) {
                    xVisible = true;
                }
            }

            return xVisible && yVisible;
        };

        function checkImage() {
            angular.forEach(elements, function(obj, key) {
                var iElement = obj.iElement,
                    $scope = obj.$scope;
                if (isVisible(iElement)) {
                    iElement.attr('src', $scope.lazySrc);
                }
            });
        }

        $win.bind('scroll', checkImage);
        $win.bind('resize', checkImage);

        function onLoad() {
            var $el = angular.element(this),
                uid = getUid($el);

            $el.css('opacity', 1);

            if (elements.hasOwnProperty(uid)) {
                delete elements[uid];
            }
        }

        return {
            restrict: 'A',
            scope: {
                lazySrc: '@',
                animateVisible: '@',
                animateSpeed: '@'
            },
            link: function($scope, iElement) {
                iElement.bind('load', onLoad);

                $scope.$watch('lazySrc', function() {
                    var speed = "1s";
                    if ($scope.animateSpeed != null) {
                        speed = $scope.animateSpeed;
                    }
                    if (isVisible(iElement)) {
                        if ($scope.animateVisible) {
                            iElement.css({
                                'opacity': 0,
                                '-webkit-transition': 'opacity ' + speed,
                                'transition': 'opacity ' + speed
                            });
                        }
                        iElement.attr('src', $scope.lazySrc);
                    } else {
                        var uid = getUid(iElement);
                        iElement.css({
                            'opacity': 0,
                            '-webkit-transition': 'opacity ' + speed,
                            'transition': 'opacity ' + speed
                        });
                        elements[uid] = {
                            iElement: iElement,
                            $scope: $scope
                        };
                    }
                });

                $scope.$on('$destroy', function() {
                    iElement.unbind('load');
                    var uid = getUid(iElement);
                    if (elements.hasOwnProperty(uid)) {
                        delete elements[uid];
                    }
                });
            }
        };
    }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 惩罚指令
   * 惩罚不符合规矩的补充
   */
  punish.$inject = ['ajax'];
  angular.module('app').directive('punish',punish);

  function punish(ajax) {
    return {
      restrict:'EA',
      replace: true,
      scope: {
          admin: '=',
          status: '=',
          eid: '='
      },
      template: '<div class="punish fr" ng-show="admin==1&&status==1" ng-click="punish(eid)">惩罚</div>',
      link:function(scope,ele,attr){
        scope.punish = punish;

        /**
         * 惩罚用户
         * @param  {String} eid 补充ID
         */
        function punish(eid){
          var url = '/api/' + root + '/operation/appendpunish/'+eid;

          layer.confirm('确定要惩罚？', {
              icon: '3',
              title: ' '
          }, function(index) {
              ajax.put(url)
                  .success(function(res) {
                      layer.msg(res.msg);
                      layer.close(index);
                      if (res.status == 0) {
                          location.reload();
                      }
                  })

          })
        }
      }
    }
  }
})(window,document);

;(function(window, document,undefined) {
    /**
     * 列表渲染完成指令
     */
        renderFinished.$inject = ['$timeout'];
    angular
        .module('app')
        .directive('renderFinished',renderFinished);

        function renderFinished($timeout){
            return {
                restrict:'A',
                link:function (scope, element, attrs) {
                  if (scope.$last) {
                      $timeout(function(){
                        console.log('repeat over');
                        scope.$emit('renderFinished');
                    })
                  }
                }
            }
        }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 回复对象组件
   */
   angular.module('app').directive('ansName', function() {
       return {
           restrict: 'E',
           replace: true,
           scope: {
               person: '=',
               parent: '=',
               user: '='
           },
           template: '<span class="ans-name">{{name}}</span>',
           link: function(scope, ele, attrs, tabsCtrl) {
               scope.parent.forEach(function(item) {
                   if (scope.person == item.id) {
                       if (item.is_anonymous == 0 || scope.user.is_admin == 1) {
                           scope.name = item.member_info.name;
                       } else if (item.is_anonymous == 1) {
                           if (item.member_info.id == scope.user.id) {
                               scope.name = '匿名(我)'
                           } else {
                               scope.name = '匿名';
                           }
                       }
                   }
               })
           }
       }
   });
})(window,document);

;(function(window, document, undefined) {
  /**
   * 首页付费病例轮播
   */

    caseSwiper.$inject = ['$timeout', '$location', '$state', 'ajax'];
  angular
    .module('app')
    .directive('caseSwiper',caseSwiper);

    function caseSwiper($timeout,$location,$state,ajax){
      return {
        restrict:'E',
        replace:true,
        scope:{},
        templateUrl:'tpl/components/caseSwiper.html',
        link:function(scope, element, attrs){
          var url = '/api/' + root + '/index/questions?type=pay_to_see';
          ajax.get(url).success(function(res){
            if(!res.status){
              scope.data = res.data.data;
              $timeout(function() {
                  var swiper = new Swiper('.swipe2', {
                      slidesPerView: 4,
                      spaceBetween: 10
                  });
              });
              scope.goDetail = function(qid, uid, myid, isOpen,qtype) {
                  if (isOpen == '1') {
                      $state.go('pDetail', {
                          uid: qid
                      })
                  }else if (uid == myid) {
                      $state.go('myDetail', {
                          uid: qid
                      })
                  } else if (qtype == 7) {
                      location.href = '/?#/detail2/'+qid
                  } else {
                      $state.go('detail', {
                          uid: qid
                      })
                  }
              }
            }
          })
        }
      }
    }
})(window,document);

;(function(window, document, undefined) {
  /**
   * 关注
   */
   angular.module('app').directive('chargeFocus', function() {
       return {
           restrict: 'EA',
           replace: true,
           scope: {
               isFocus: '='
           },
           template: '<p ng-if="isFocus==0">您还未关注[医看]平台，无法提现。<a ng-click="showShare()" style="text-decoration:underline;color:blue;">去关注</a></p>',
           link: function(scope, ele, attrs, tabsCtrl) {

               scope.showShare = function() {
                   if ($('.show-share').hasClass('hide')) {
                       $('.show-share').removeClass('hide');
                       $('.show-share').find('img').attr('src', 'img/focus-code.png');
                   } else {
                       $('.show-share').addClass('hide');
                       $('.show-share').find('img').attr('src', 'img/share.png');
                   }
               }
               scope.close = function() {
                   $('.first-focus').addClass('hide');
               }
           }
       }
   })
})(window,document);

;(function(window, document, undefined) {
  /**
   * 倒计时
   */
   angular.module('app').directive('clock', ['$interval', function($interval) {
       return {
           restrict: 'EA',
           replace: true,
           scope: {
               addtime: '='
           },
           template: '<div>{{time}}</div>',
           link: function(scope) {
               scope.time = null;

               var timer = $interval(getTime, 1);

               function getTime() {
                   var end_time = new Date((parseInt(scope.addtime) + 86400) * 1000),
                       now_time = new Date();

                   var t = end_time - now_time,
                       h = 0,
                       m = 0,
                       s = 0;

                   if (t > 0) {
                       h = Math.floor(t / 1000 / 60 / 60 % 24);
                       m = Math.floor(t / 1000 / 60 % 60);
                       s = Math.floor(t / 1000 % 60);
                       scope.time = format(h) + ':' + format(m) + ':' + format(s);
                   } else {
                       scope.time = '00:00:00';
                       $interval.cancel(timer);
                   }
               }

               function format(item) {
                   if (item < 10) {
                       return '0' + item
                   } else {
                       return item;
                   }
               }

           }
       }
   }])
})(window,document);

;(function(window, document, undefined) {
  /**
   * 收藏指令
   */

    collect.$inject = ['ajax'];
    angular
      .module('app')
      .directive('collect', collect);

      function collect(ajax) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                iscollect: '=iscollect',
                id: '=uid',
                num: '=num'
            },
            template: '<a>' +
                    '<img lazy-src="{{imgUrl}}">' +
                      '<span ng-class="{\'color-fa\':iscollect==1}">{{num}}</span>' +
                      '</a>',
            link: function(scope, ele, attrs, tabsCtrl) {
                var id,
                    url;
                scope.$watch('id', function(newValue) {
                    if (newValue !== undefined) {
                        var id = scope.id,
                            url = '/api/' + root + '/operation/collect/' + id;
                        scope.url = url;
                        if (scope.iscollect) {
                            scope.imgUrl = 'img/favorite2.png';
                        } else {
                            scope.imgUrl = 'img/favorite.png';
                        }

                    }
                });
                ele.bind('click', function() {
                    ajax.put(scope.url).success(function(res) {
                        if (res.status == 0) {
                            if (!scope.iscollect) {
                                layer.msg('收藏成功');
                                scope.iscollect = 1;
                                scope.num++;
                                scope.imgUrl = 'img/favorite2.png';
                            } else {
                                layer.msg('取消收藏');
                                scope.iscollect = 0;
                                scope.num--;
                                scope.imgUrl = 'img/favorite.png';
                            }

                        } else {
                            layer.msg(res.msg);
                        }
                    }).error(function() {
                        layer.msg('操作失败');
                    })

                });
            }
        }
    }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 未关注提醒
   */
   angular.module('app').directive('firstFocus', ['ajax', '$rootScope', function(ajax, $rootScope) {
       return {
           restrict: 'EA',
           replace: true,
           scope: {},
           template: '<div class="first-focus clearfix" ng-show="isFocus==0">' +
               '<div class="fl"><img class="focus_logo" src="img/focus_logo.png"></div>' +
               '<div class="fl">影像医生快速问答平台</div>' +
               '<div class="fl"><img class="focus_btn" src="img/focus_btn.png" ng-click="showShare()"></div>' +
               '<div class="fr"><img class="focus_close" src="img/focus_close.png" ng-click="close()"></div>' +
               '<div class="guanzhu-code"><img src="img/focus_code.jpg"><div>请先关注医看平台</div></div>' +
               '</div>',
           link: function(scope, ele, attrs, tabsCtrl) {

               var url = '/api/' + root + '/user/userinfo';
               ajax.get(url).success(function(res) {
                   if (res.status == 0) {
                       scope.isFocus = res.data.subscribe;
                       $rootScope.isFocus = scope.isFocus;
                       scope.showShare = function() {
                           if ($('.show-share').hasClass('hide')) {
                               $('.show-share').removeClass('hide');
                              //  $('.show-share').find('img').attr('src', 'img/focus-code.png');
                           } else {
                               $('.show-share').addClass('hide');
                              //  $('.show-share').find('img').attr('src', 'img/share.png');
                           }
                       }
                       scope.close = function() {
                           $('.first-focus').addClass('hide');
                       }
                   }
               });

               $rootScope.userInfo = {};
               ajax.get('/api/' + root + '/user/index').success(function(res) {
                   if (res.status == 0 && !$.isEmptyObject(res.data)) {
                       $rootScope.userInfo = res.data.userinfo;
                   }
               })
               ajax.get('/api/' + root + '/user/concern').success(function(res) {
                   if (res.status == 0) {
                       $rootScope.userInfo.newInfo = res.data;
                   }
               })

           }
       }
   }])
})(window,document);

;(function(window, document, undefined) {

  // 关注功能指令
  focus.$inject = ['ajax'];
myFocus.$inject = ['ajax'];
  angular
    .module('app')
    .directive('focus', focus)
    .directive('myFocus',myFocus);

    function focus(ajax) {
      return {
          restrict: 'E',
          transclude: true,
          replace: true,
          scope: {
              isFocus: '=isFocus',
              id: '=uid'
          },
          template: '<div ng-class="{\'color-red\':isFocus==0}" ng-transclude>{{content}}</div>',
          link: function(scope, ele, attrs, tabsCtrl) {
              var id, url;
              scope.$watch('id', function(newValue) {
                  if (newValue !== undefined) {
                      id = scope.id;
                      url = '/api/' + root + '/operation/follow/' + id;

                      if (scope.isFocus) {
                          scope.content = '已关注';
                      } else {
                          scope.content = '+关注';
                      }
                  }
              })

              ele.on('click', function() {
                  console.log(scope.isFocus);
                  ajax.put(url).success(function(res) {
                      if (res.status == 0) {
                          if (!scope.isFocus) {
                              layer.msg(res.msg);
                              scope.isFocus = 1;
                              scope.content = '已关注';
                          } else {
                              layer.msg(res.msg);
                              scope.isFocus = 0;
                              scope.content = '+关注';
                          }

                      } else {
                          layer.msg(res.msg);
                      }
                  }).error(function() {
                      layer.msg('操作失败');
                  })

              });
          }
      }
  }

  function myFocus(ajax) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            isFocus: '=isFocus',
            id: '=uid'
        },
        template: '<img ng-src="{{imgSrc}}" alt="">',
        link: function(scope, ele, attrs, tabsCtrl) {
            var id, url;
            scope.$watch('id', function(newValue) {
                if (newValue !== undefined) {
                    id = scope.id;
                    url = '/api/' + root + '/operation/follow/' + id;

                    if (scope.isFocus) {
                        scope.imgSrc = '/img/otherInfo/focused2.png';
                    } else {
                        scope.imgSrc = '/img/otherInfo/focus2.png';
                    }
                }
            })

            ele.on('click', function() {
                console.log(scope.isFocus);
                ajax.put(url).success(function(res) {
                    if (res.status == 0) {
                        if (!scope.isFocus) {
                            layer.msg(res.msg);
                            scope.isFocus = 1;
                            scope.imgSrc = '/img/otherInfo/focused2.png';
                        } else {
                            layer.msg(res.msg);
                            scope.isFocus = 0;
                            scope.imgSrc = '/img/otherInfo/focus2.png';
                        }

                    } else {
                        layer.msg(res.msg);
                    }
                }).error(function() {
                    layer.msg('操作失败');
                })

            });
        }
    }
}
})(window,document);

;(function(window, document, undefined) {
  /**
   * 多选框指令
   * @param  {String} myCheckbox- 指令名称
   * @return {object}
   */
  angular.module('app').directive('myCheckbox', function() {
      return {
          restrict: 'EA',
          template: '<ul class="append-list clearfix">' +
              '<li ng-repeat="item in text" ng-click="check(item.type)"><span><img ng-src="{{isChecked(item.type)?pic.imgOn:pic.imgDf}}"></span>{{item.title}}<img ng-if="item.title == \'确诊\'|| item.title == \'病理\'" class="checkbox-tips" src="/img/checkbox-tips.png"></li>' +
              '</ul>',
          replace: true,
          scope: {
              text: '=',
              checkBox: '='
          },
          link: function(scope, ele, attrs, ctrl) {
              /**
               * 选项框图片
               * @type {Object}
               */
              scope.pic = {
                  imgOn: 'img/gou.png',
                  imgDf: 'img/qu.png'
              };

              /**
               * 选中方法
               * @todo 改变选中状态
               * @param  {Num} type - checkbox的选项
               */
              scope.check = function(type) {
                  if (scope.isChecked(type)) {
                      scope.checkBox = null;
                  } else {
                      scope.checkBox = type;
                  }

              }

              /**
               * 判断是否选中
               * @param  {Num} type - checkbox的选项
               * @return {Boolean}
               */
              scope.isChecked = function(type) {
                  return scope.checkBox == type;
              }

          }
      }
  })
})(window,document);

;(function(window, document, undefined) {
  /**
   * 公开回答
   */
   angular.module('app').directive('openAns', ['ajax', function(ajax) {
       return {
           restrict: 'EA',
           replace: true,
           scope: {
               data: '=',
               trade: '='
           },
           template: '<div class="pda clearfix bb">' +
               '<div class="fl">公开问题</div>' +
               '<div class="fr">' +
               '<a class="btn-ans" ng-click="open()">{{openBtn}}</a>' +
               '</div>' +
               '<div class="mid fd">{{openText}}</div>' +
               '</div>',
           link: function(scope) {
               var txt1 = '选择公开问题后，问题与答案将同步至首页其他医生也能免费为您作答。可在关注-我的提问里看到',
                   txt2 = '问题被查看'+scope.data.free_clicked_num+'次，分享至朋友圈，让更多的朋友看见';

               var state = scope.data.pay_issue_isopen;
               var url = '/api/' + root + '/trade/opensee/' + scope.trade;

               scope.open = open;
               init();


               function init() {
                   scope.openBtn = state == 0 ? '公开' : '分享';
                   scope.openText = state == 0 ? txt1 : txt2;
               }

               function open() {
                   if (state == 0) {
                       ajax.put(url).success(function(res) {
                           if (res.status == 0) {
                               state = 1;
                               init();
                           }
                           layer.msg(res.msg);
                       })
                   } else {
                       layer.msg('点击右上角分享按钮分享到朋友圈');
                   }
               }
           }
       }
   }])
})(window,document);

;(function(window, document, undefined) {
    /**
     * 病例列表
     */
    angular
        .module('app')
        .directive('questionList', questionList);

    function questionList() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'tpl/components/questionList.html',
            link: function(scope, element, attrs) {
                console.log(scope.item);
            }
        }
    }

})(window, document);

;(function(window, document, undefined) {
  /**
   * 推荐阅读 推荐阅读去掉
   */
   angular.module('app').directive('read-self', ['$timeout', 'ajax', function($timeout, ajax) {
       return {
           restrict: 'EA',
           replace: true,
           scope: {},
           template: '<div class="tuijian">' +
               '<div class="tuijian-title clearfix">' +
               '<div class="fl f3">推荐阅读</div>' +
               '</div>' +
               '<div class="swiper-container">' +
               '<div class="swiper-wrapper">' +
               '<div class="swiper-slide" ng-repeat="item in data">' +
               '<a href="{{item.link}}">' +
               '<div class="pl3"><div class="tuijian-cont bt clearfix">' +
               '<div class="fl">' +
               '<img lazy-src="{{item.original_pic_addr}}" class="tuijian-img">' +
               '</div>' +
               '<div class="tuijian-cont-txt">' +
               '<h3>{{item.name}}</h3>' +
               '<p class="color9 fd">{{item.info}}</p>' +
               '</div>' +
               '</div></div>' +
               '</a>' +
               '</div>' +
               '</div>' +
               '<div class="swiper-pagination"></div>' +
               '</div>' +
               '</div>',
           link: function(scope, ele, attrs, tabsCtrl) {
               var url = '/api/' + root + '/activity/index?type=recommend';
               ajax.get(url).success(function(res) {
                   if (res.status == 0) {
                       scope.data = res.data.data;
                   }
                   $timeout(function() {
                       var mySwiper = new Swiper('.swiper-container', {
                           pagination: '.swiper-pagination',
                           autoplay: 4000,
                           autoplayDisableOnInteraction: false
                       })
                   })

               });
           }
       }
   }]);
})(window,document);

;(function(window, document, undefined) {
  /**
   * 评分组件
   */
   angular.module('app').directive('score', ['ajax', function(ajax) {
       return {
           restrict: 'EA',
           replace: true,
           scope: {
               did: '=',
               fen: '='
           },
           template: '<div class="pda clearfix bb">' +
               '<div class="fl">我的评分</div>' +
               '<div class="fr">' +
               '<a class="btn-ans" ng-click="submit()" ng-if="fen==0">确定</a>' +
               '<a class="btn-ans-gray" ng-if="fen>0">已评</a>' +
               '</div>' +
               '<div class="mid">' +
               '<div id="starBg" class="star_bg">' +
               '<input ng-model="data.score" type="radio" id="starScore1" class="score score_1" value="1" name="score">' +
               '<span  class="star star_1" title="差">' +
               '<label for="starScore1">差</label>' +
               '</span>' +
               '<input ng-model="data.score" type="radio" id="starScore2" class="score score_2" value="2" name="score">' +
               '<span  class="star star_2" title="较差">' +
               '<label for="starScore2">较差</label>' +
               '</span>' +
               '<input ng-model="data.score" type="radio" id="starScore3" class="score score_3" value="3" name="score">' +
               '<span  class="star star_3" title="普通">' +
               '<label for="starScore3">普通</label>' +
               '</span>' +
               '<input ng-model="data.score" type="radio" id="starScore4" class="score score_4" value="4" name="score">' +
               '<span  class="star star_4" title="较好">' +
               '<label for="starScore4">较好</label>' +
               '</span>' +
               '<input ng-model="data.score" type="radio" id="starScore5" class="score score_5" value="5" name="score">' +
               '<span class="star star_5" title="好">' +
               '<label for="starScore5">好</label>' +
               '</span>' +
               '</div>' +
               '</div>' +
               '</div>',
           link: function(scope) {
               console.log(scope.fen)
               scope.data = {
                   id: scope.did,
                   score: parseInt(scope.fen)
               }

               var url = '/api/' + root + '/trade/setscore';

               scope.submit = function() {
                   ajax.post(url, $.param(scope.data)).success(function(res) {
                       layer.msg(res.msg);
                   })
               }
           }
       }
   }]);
})(window,document);

;(function(window, document, undefined) {
  /**
   * 分享
   */
   angular.module('app').directive('share', function() {
       return {
           restrict: 'EA',
           replace: true,
           template: '<div class="show-share hide">' +
               '<div class="show-share-content">'+
                 '<div class="show-share-title">长按二维码关注医看</div>'+
                 '<img src="img/newCode.png">'+
                 '<div class="show-share-bottom">'+
                   '<a class="qrcode-close">关闭</a>'+
                 '</div>'+
               '</div>' +
               '<div class="share-close">关闭</div>' +
               '</div>',
           link: function(scope, ele, attrs, tabsCtrl) {
               ele.on('click', function() {
                   if ($(this).hasClass('hide')) {
                       $(this).removeClass('hide');
                   } else {
                       $(this).addClass('hide');
                      //  $('.show-share').find('img').attr('src', 'img/share.png');
                   }
               })
           }
       }
   });
})(window,document);

;(function(window, document, undefined) {
  // 轮播插件
  swiper.$inject = ['$timeout', 'ajax'];
  angular
    .module('app')
    .directive('swiper', swiper);

    function swiper($timeout, ajax) {
      return {
          restrict: 'EA',
          replace: true,
          scope: {},
          template: '<div class="swiper-container swipe1">' +
              '<div class="swiper-wrapper">' +
                  '<div class="swiper-slide" ng-repeat="item in data">'+
                  '<a ng-if="item.type!=4" href="{{item.link}}" onclick="MtaH5.clickStat(\'banner\');"><img ng-src="{{item.thumbnail_pic_addr}}"></a><a ng-if="item.type==4" ng-click="showShare(item.original_pic_addr)"><img ng-src="{{item.thumbnail_pic_addr}}"></a>'+
                  '</div>' +
              '</div>' +
              '<div class="swiper-pagination"></div>' +
              '</div>',
          link: function(scope, ele, attrs, tabsCtrl) {
              var url = '/api/' + root + '/activity/index?type=banner';
              ajax.get(url).success(function(res) {
                  if (res.status == 0) {
                      scope.data = res.data.data;
                  }
                  $timeout(function() {
                      var mySwiper = new Swiper('.swipe1', {
                          // 如果需要分页器
                          pagination: '.swiper-pagination',
                          autoplay: 3000,
                          autoplayDisableOnInteraction: false
                      })
                  });

                  scope.showShare = function(src) {
                      if ($('.show-share').hasClass('hide')) {
                          $('.show-share').removeClass('hide');
                          $('.show-share').find('img').attr('src', src);
                      } else {
                          $('.show-share').addClass('hide');
                          $('.show-share').find('img').attr('src', 'img/share.png');
                      }
                  }

              });
          }
      }
  }
})(window,document);

;(function(window, document, undefined) {
  /**
   * tab组件
   */
   angular.module('app').directive('tabs', ['ajax', function(ajax) {
       return {
           restrict: 'E',
           transclude: true,
           replace: true,
           template: '<div class="tab-link clearfix" ng-transclude></div>',
           controller: ['$scope', '$state', function($scope, $state) {
               var tabs = [];
               this.hideOther = function(activeTab) {
                   angular.forEach(tabs, function(tab) {
                       if (activeTab !== tab) {
                           tab.isActive = false;
                       }
                   });
               }
               this.addTab = function(tab) {
                   tabs.push(tab);
               }
               this.changeURL = function(type) {
                   // var _layer=layer.msg('正在加载中...', {icon:16,time:0});

                   var action = $state.current.name.split('.')[0],
                       current = $state.current.url.split('?')[0];
                       console.log(action);
                       console.log(current);
                   // 发现那边更改action和current
                   if(action=='find'&&current=='/active_list'){
                       action='activity';
                       current='/index';
                   }else if(action=='find'&&current=='/equipments'){
                       action='index';
                       current='/equipments';
                   }else if(action=='find'&&current=='/topics'){
                       action='index';
                       current='/topics';
                   }else if(action=='focus'&&current=='/myCollect'){
                       action="video";
                       current="/index";
                   }else if(action=='index'&&current == '/paycases'){
                     current = '/questions';

                     if(type == 'hot'){
                       type = 'pay_to_see_hot';
                       MtaH5.clickStat('pay_to_see_hot_list');
                     }else{
                       type = 'pay_to_see';
                       MtaH5.clickStat('pay_to_see_new_list');
                     }
                   }

                   var url = '/api/' + root + '/' + action + current + '?type=' + type;
                   // 查看type。如果是精品榜那么改变url
                   if(type=='jingpin'){
                       url='/api/' + root + '/index/shares';
                       MtaH5.clickStat('essential_question_list');
                   }else if(type=='matches'){
                       url='/api/' + root + '/index/matches';
                       MtaH5.clickStat('match_question_list');
                   }else if (type=='live') {
                       MtaH5.clickStat('activity_live_list');
                   }else if(type=='bin'||type=='mycollectpay'){
                       url='/api/'+root+'/user/mycollection';
                   }else if(type == 'video'){
                       url='/api/'+root+'/video/index?is_collect=true';
                   }else if(type == 'paycase'){
                       url='/api/'+root+'/user/mypaytosee';
                   }else if(type == 'myquestion'){
                       url='/api/' + root + '/user/myquestion';
                   }else if(type == 'mypaycase'){
                       url='/api/' + root + '/user/mypaytoseequestion';
                   }


                   ajax.get(url).success(function(res) {
                       if (res.status == 0) {
                           if (current == '/artistic') {
                               $scope.data = res.data;
                           } else {
                               if(res.data.category){
                                   $scope.category=res.data.category;
                               }else if(type=='pay_to_see_hot'||type == 'pay_to_see'){
                                 cutDescription(res);
                               }

                               $scope.data = res.data.data;
                           }
                       } else {
                           layer.msg(res.msg);
                       }

                       // layer.close(_layer);


                   })
               }
               this.changeType = function(type) {
                   $scope.type = type;
                   $scope.page = 1;
               }
               this.isType = function(type){
                   return type == $scope.type;
               }

               function cutDescription(res){
                 res.data.data.forEach(function(item){
                   item.description = item.description.substr(0, 10) + '**********';
                   item.question_exts.forEach(function(item){
                     item.description = item.description.substr(0, 10) + '**********';
                   })
                 })
               }
           }]

       }
   }]);

   angular.module('app').directive('tab', function() {
       return {
           restrict: 'E',
           transclude: true,
           replace: true,
           require: '^?tabs',
           scope: {
               title: '=tabTitle',
               type: '=urlType',
               float: '=float'
           },
           template: '<a ng-class="float" ng-click="change()"><span ng-class="{on:isActive}" data-type="type">{{title}}</span></a>',
           link: function(scope, ele, attrs, tabsCtrl) {
               // ele.index() == 0 ? scope.isActive = true : scope.isActive = false;
               scope.isActive = tabsCtrl.isType(scope.type);
               tabsCtrl.addTab(scope);
               scope.change = function() {
                   scope.isActive = true;
                   tabsCtrl.hideOther(scope);
                   tabsCtrl.changeURL(scope.type);
                   tabsCtrl.changeType(scope.type);
               }

           }
       }
   });
})(window,document);

;(function(window, document, undefined) {
    /**
   * 点赞指令
   */
    zan.$inject = ['ajax'];
    angular
      .module('app')
      .directive('zan', zan);

      function zan(ajax) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                islike: '=islike',
                id: '=uid',
                num: '=num'
            },
            template: '<a>' + '<img class="ib-m" alt="点赞" width="19" lazy-src="{{imgUrl}}">' + '<span class="ml8 ib-m"  ng-class="{\'color-fa\':islike==1}" ng-transclude>{{num}}</span>' + '</a>',
            link: function(scope, ele, attrs, tabsCtrl) {
                var id,
                    url;
                scope.$watch('id', function(newValue) {
                    if (newValue !== undefined) {
                        id = scope.id;
                        url = '/api/' + root + '/operation/like/' + id;

                        if (scope.islike) {
                            scope.imgUrl = 'img/zan.png';
                        } else {
                            scope.imgUrl = 'img/zan2.png';
                        }
                    }
                })

                ele.on('click', function() {
                    console.log(scope.islike);
                    ajax.put(url).success(function(res) {
                        if (res.status == 0) {
                            if (!scope.islike) {
                                layer.msg(res.msg);
                                scope.islike = 1;
                                scope.num++;
                                scope.imgUrl = 'img/zan.png';
                            } else {
                                layer.msg(res.msg);
                                scope.islike = 0;
                                scope.num--;
                                scope.imgUrl = 'img/zan2.png';
                            }

                        } else {
                            layer.msg(res.msg);
                        }
                    }).error(function() {
                        layer.msg('操作失败');
                    })

                });
            }
        }
    }
})(window, document);

;(function(window, document, undefined) {
    /**
     * ajax 服务
     */
    ajax.$inject = ['$http'];
    angular
        .module('app')
        .service('ajax', ajax);

    function ajax($http) {
        this.get = function(url) {
            return $http({method: 'GET', url: url});
        }
        this.post = function(url, data) {
            return $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        }
        this.put = function(url) {
            return $http({method: 'PUT', url: url});
        }
    }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 图片预览
   */
   angular.module('app').service('photoswipe', function() {

       this.openPhotoSwipe = function(photos) {
           var e = window.event;
           var index = $(e.target.parentNode).index();

           var pswpElement = document.querySelectorAll('.pswp')[0];

           var title = arguments[1];

           // build items array
           var items = [];
           photos.forEach(function(item) {
               var tmp;
               var type = typeof item;
               if (type == 'object') {
                   var img = new Image();
                   img.src = item.site;
                   tmp = {
                       src: item.site + '?x-oss-process=image/watermark,image_c2h1aXlpbjgwLTMwLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSxQXzE1,t_90,g_se,x_10,y_10',
                       w: img.width,
                       h: img.height,
                       title: title
                   };
               } else {
                   var img = new Image();
                   img.src = 'http://img.kankanyisheng.com/' + item;

                   tmp = {
                       src: 'http://img.kankanyisheng.com/' + item,
                       w: img.width,
                       h: img.height,
                       title: title
                   }
               }
               items.push(tmp)
           })

           //随机图片
           var random  = Math.floor(Math.random()*20+1);
           var randomImg={
               src:'img/person/'+random+'.gif',
               w:'375',
               h:'585'
           }
           items.push(randomImg);

           console.log(index);
           // define options (if needed)
           var options = {
               // history & focus options are disabled on CodePen
               history: false,
               focus: false,

               showAnimationDuration: 0,
               hideAnimationDuration: 0,
               shareEl: false,
               fullscreenEl: false

           };
           var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
           gallery.listen('preventDragEvent', function(e, isDown, preventObj) {
               // e - original event
               // isDown - true = drag start, false = drag release

               // Line below will force e.preventDefault() on:
               // touchstart/mousedown/pointerdown events
               // as well as on:
               // touchend/mouseup/pointerup events
               preventObj.prevent = true;
           });
           gallery.init();
           gallery.goTo(index);
       };
   });
})(window,document);

;(function(window, document, undefined) {
    /**
     * 存储数据
     */
    angular
        .module('app')
        .service('storeData', storeData);

    function storeData() {

        var store =null;

        this.setData = setData;
        this.getData = getData;
        this.reset = reset;

        function setData(data) {
          store = data;
        }

        function getData() {
          return store;
        }

        function reset() {
          store = null;
        }
    }
})(window, document);

;
(function(window, document, undefined) {

    /**
    * 存储付费提问的数据,给“向其他医生提问”用
    */

    angular.module('app').service('storePay', storePay);

    function storePay() {
        var data = {};

        this.setData = function(newData) {
            data = newData;
            var payData = JSON.stringify(data);
            localStorage.setItem('payData', payData);
        }
        this.getData = function() {
            var payData = JSON.parse(localStorage.getItem('payData'));
            return payData;
        }
    }
})(window, document);

;(function(window, document, undefined) {
    /**
     * 存储列表数据，状态
     */
    store.$inject = ['$location', '$anchorScroll'];
    angular
        .module('app')
        .service('store', store);

    function store($location,$anchorScroll) {

        var store = {
            data: null,
            type: null,
            page: null,
            id: null,
            flag: false
        }

        this.setData = setData;
        this.getData = getData;
        this.init = init;

        function setData(data, type, page, id) {
            store.data = data;
            store.type = type;
            store.page = page;
            store.id = id;
            store.flag = true;

            localStorage.setItem('listData',JSON.stringify(store));
        }

        function getData() {
            // var data = JSON.parse(localStorage.getItem('listData'));
            // if(data){
            //   store = data;
            // }
            return store;
        }

        function reset() {
            store = {
                data: null,
                type: null,
                page: null,
                id: null,
                flag: false
            }
            localStorage.setItem('listData',null);
        }
        function init($scope){
          // var data = JSON.parse(localStorage.getItem('listData'));
          // if(data){
          //   store = data;
          // }

          $scope.data = store.data;
          $scope.type = store.type;
          $scope.page = store.page;
          $scope.$on('renderFinished',renderFinished(store.id));
          reset();
        }

        function renderFinished(id){
            return function(){
               $location.hash(id);
               $anchorScroll();
            }
        }
    }
})(window, document);

;
(function(window, document, undefined) {
  /**
     * time 服务
     */
  angular.module('app').service('time', time);

  function time() {

    this.getCurrentMonthFirst = getCurrentMonthFirst;
    this.getCurrentMonthLast = getCurrentMonthLast;
    this.getYearWeek = getYearWeek;

    /**
     * 获取当前月份第一天
     * @return {Object} 返回当前月份第一天的时间对象
     */
    function getCurrentMonthFirst(month) {
      var now = new Date();
      return new Date(now.getFullYear(), month, 1);
    }

    /**
     * 获取当前月份最后一天
     * @return {Object} 返回当前月份最后一天的时间对象
     */
    function getCurrentMonthLast(month) {
      var date = new Date();
      var nextMonth = ++month;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      return new Date(nextMonthFirstDay - oneDay);
    }
    /**
     * 获取当前是第几周
     * @return {String} 周数
     */
    function getYearWeek() {
      //当前日期
      var date1 = new Date();
      //1月1号
      var date2 = new Date(date1.getFullYear(), 0, 1);
      //获取1月1号星期（以周一为第一天，0周一~6周日）
      var dateWeekNum = date2.getDay() - 1;
      if (dateWeekNum < 0) {
        dateWeekNum = 6;
      }
      if (dateWeekNum < 4) {
        //前移日期
        date2.setDate(date2.getDate() - dateWeekNum);
      } else {
        //后移日期
        date2.setDate(date2.getDate() + 7 - dateWeekNum);
      }
      var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
      if (d < 0) {
        var date3 = (date1.getFullYear() - 1) + "-12-31";
        return getYearWeek(date3);
      } else {
        //得到年数周数
        var week = Math.ceil((d + 1) / 7);
        return week;
      }
    }

  }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 上传图片
   */
   angular.module('app').service('uploadImg', ['ajax', function(ajax) {

       this.upload = function($scope, Upload) {
           return function(files, errFiles) {
               $scope.files = files;
               $scope.errFiles = errFiles;
               if (errFiles.length) {
                   layer.msg('有' + errFiles.length + '图片超过2MB，无法上传');
               }
               ajax.get('/api/frontend/utils/uploadsign').success(function(res) {
                   syncFiles(files, res);
               })

           }

           function syncFiles(files, res) {
               var file = files.shift();
               var type = file.name.split('.')[1];
               var new_multipart_params = {
                   'key': res.dir + get_name() + '.' + type,
                   'policy': res.policy,
                   'OSSAccessKeyId': res.accessid,
                   'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                   'signature': res.signature,
                   'file': file
               };
               Upload.upload({
                   url: '//yikan-t.oss-cn-hangzhou.aliyuncs.com',
                   data: new_multipart_params
               }).then(function(response) {
                   if ($scope.ans) {
                       $scope.ans.pics.push(new_multipart_params.key);
                   } else {
                       $scope.data.pics.push(new_multipart_params.key);
                   }

                   if (files.length > 0) {
                       syncFiles(files, res);
                   }
               }, function(response) {
                   console.log(response);
               });
           }
       }

       // 微信上传
       this.wxUpload = function($scope) {
           return function() {
               wx.chooseImage({
                   success: function(res) {
                       var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                       syncUpload(localIds);
                   }
               });
           }

           function syncUpload(localIds) {
               var localId = localIds.shift();
               //解决IOS无法上传的坑
               if (localId.indexOf("wxlocalresource") != -1) {
                   localId = localId.replace("wxlocalresource", "wxLocalResource");
               }
               wx.uploadImage({
                   localId: localId,
                   isShowProgressTips: 0,
                   success: function(res) {
                       var serverId = res.serverId; // 返回图片的服务器端ID
                       var picdata = {
                           media_id: serverId
                       }
                       ajax.post('/api/' + root + '/utils/wxupload', $.param(picdata)).success(function(res) {
                           if ($scope.data.pics) {
                               $scope.data.pics.push(res.data);
                           } else {
                               $scope.ans.pics.push(res.data);
                           }
                           if (localIds.length > 0) {
                               syncUpload(localIds);
                           }
                       });


                   }
               });
           }
       }
   }]);
})(window,document);

;(function(window, document, undefined) {
  'use strict';
  //错误页面
  errorCtrl.$inject = ['$location'];
  angular.module('app').controller('errorCtrl',errorCtrl);

  function errorCtrl($location) {
    var vm = this;
    vm.info = $location.search().msg;
    vm.goBack = goBack;

    function goBack() {
      history.go(-1);
    }
  }

})(window,document);

;(function(window, document, undefined) {
    // 首页2
    app.controller('indexCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.isON = false;
        $scope.$state = $state;
        $scope.change = function() {
            $scope.isON = !$scope.isON;
        }
    }]);
})(window, document);

;(function(window, document, undefined) {
  /**
   * mooc
   */
  moocCtrl.$inject = ['ajax'];
  angular.module('app').controller('moocCtrl',moocCtrl);

  function moocCtrl(ajax) {
    var vm = this;
    console.log(vm);
  }
})(window,document);

;(function(window, document, undefined) {
  'use strict';

  angular.module('app').controller('ruleCtrl',ruleCtrl);

  function ruleCtrl(){
    console.log(location.href);
    //微信分享
    var config = {
        title: '医看—医生快速问答平台', // 分享标题
        desc: '免费、专业，关键是回复速度快',
        link: location.origin+'/#/rule', // 分享链接
        imgUrl: 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg', // 分享图标
        success: function(res) {
            // 用户确认分享后执行的回调函数
            MtaH5.clickStat('share');
        },
        fail: function(res) {
            alert('error');
        }
    }
    wx.ready(function() {
        wx.onMenuShareTimeline(config);
        wx.onMenuShareAppMessage(config);
    });
  }
})(window,document);

app.controller('newsCtrl', ['$scope', 'indexData', function($scope, indexData) {
    try {
        document.getElementById('mta').onclick();
    } catch (e) {
        console.log(e);
    }

    var url = '/api/' + root + '/activity/index?type=news';
    indexData.getData(url).success(function(res) {
        if (res.status == 0) {
            $scope.data = res.data.data;
        } else {
            layer.msg(res.msg);
        }
    });
    var tab_url = '/api/' + root + '/index/tags?type=news';
    indexData.getData(tab_url).success(function(res) {
        if (res.status == 0) {
            $scope.tabs = res.data;
        } else {
            layer.msg(res.msg);
        }
    });

    $scope.page = 1;
    $scope.tag_id = 0;


    $scope.change = function(tag_id) {
        $scope.tag_id = tag_id;
        var url = '/api/' + root + '/activity/index?type=news&tag_id='+$scope.tag_id;
        indexData.getData(url).success(function(res) {
            if (res.status == 0) {
                $scope.data = res.data.data;
            } else {
                layer.msg(res.msg);
            }
        });
    }

    $scope.getMore = function() {
        $scope.page = $scope.page + 1;
        var url = '/api/' + root + '/activity/index?type=news&tag_id='+$scope.tag_id+'&page=' + $scope.page;
        indexData.getData(url).success(function(data) {
            if (data.status == 0) {
                if (data.data.data.length == 0) {
                    layer.msg('已经没有数据了');
                } else {
                    data.data.data.forEach(function(item) {
                        $scope.data.push(item);
                    });
                }

            } else {
                layer.msg(data.msg);
            }
        })
    }

}])
;(function(window, document, undefined) {
    //科室列表
    keshiCtrl.$inject = ['$scope', 'ajax'];
    angular
        .module('app')
        .controller('keshiCtrl', keshiCtrl);

    function keshiCtrl($scope, ajax) {
        var vm = this;
        var url = '/api/' + root + '/administrative/index';

        vm.page = 1;
        vm.getMore = getMore;

        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }

        ajax.get(url).success(function(res) {
            vm.data = res.data.data;
        });


        function getMore() {
            vm.page = vm.page + 1;
            var url = '/api/' + root + '/administrative/index?page=' + vm.page;
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.data.forEach(function(item) {
                            vm.data.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }
})(window, document);

;(function(window, document,undefined) {
    /**
     * 首页话题榜
     */
    app.controller('xuanshangCtrl', ['$scope', '$state', 'indexData', function($scope, $state, indexData) {
        var url = '/api/' + root + '/index/topics';
        indexData.getData(url).success(function(data) {
            $scope.data = data.data.data;
        });
        $scope.tabs = [{
            title: '最新话题',
            type: 'new',
            float: 'fl'
        }, {
            title: '热门话题',
            type: 'hot',
            float: 'fr'
        }];

        $scope.type = 'new';
        $scope.page = 1;

        $scope.getMore = function(type) {
            $scope.page = $scope.page + 1;
            var url = '/api/' + root + '/index/topics?type=' + type + '&page=' + $scope.page;
            indexData.getData(url).success(function(data) {
                if (data.status == 0) {
                    if (data.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        data.data.data.forEach(function(item) {
                            $scope.data.push(item);
                        });
                    }

                } else {
                    layer.msg(data.msg);
                }
            })
        }
    }]);
})(window, document);

;(function(window, document, undefined) {
  /**
   * 我的病例详情
   */

  myDetailCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'mydata', '$timeout', 'uploadImg', 'Upload', 'ajax', 'photoswipe', 'myShang'];
  angular.module('app').controller('myDetailCtrl',myDetailCtrl);

  function myDetailCtrl($rootScope, $scope, $state, $stateParams, mydata, $timeout, uploadImg, Upload, ajax, photoswipe,myShang) {
      // MtaH5.clickStat('my_question_detali');
      ajax.get('/api/' + root + '/user/concern').success(function(res) {
          $rootScope.userInfo.newInfo = res.data;
      });
      $scope.addLink = addLink;

      if (!$.isEmptyObject(mydata.data.data)) {
          $scope.data = mydata.data.data;

          // 图片预加载
          $scope.preloadImgs = [];
          if ($scope.data.pic_log.length > 0) {
              $scope.data.pic_log.forEach(function(item) {
                  var img = new Image();
                  img.src = item.site;
                  $scope.preloadImgs.push(img);
              });
          }
          if ($scope.data.replys.length > 0) {
              $scope.data.replys.forEach(function(item) {
                  if (item.pic.length > 0) {
                      item.pic.forEach(function(pic) {
                          var img = new Image();
                          img.src = pic.site;
                          $scope.preloadImgs.push(img);
                      })
                  }
              })
          }

          initAns(); //初始化表单

          $scope.utils = {
              submit: submit,
              uploadFiles: uploadImg.upload($scope, Upload),
              deleteFiles: deleteFiles,
              reply: reply
          }

          //判断微信浏览器决定上传方式
          if (isWeiXin) {
              $scope.utils.uploadFiles = uploadImg.wxUpload($scope);
          }

          //photpswipe

          $scope.openPhoto = photoswipe.openPhotoSwipe;

          $scope.goReply = function() {
              var aHeight = $('#reply').offset().top;
              console.log(aHeight);
              $('body,html').animate({
                  scrollTop: aHeight
              }, 200);
          }

          $scope.gopay = function(id, qid, aid, is_anonymous) {
              var goUrl = '/?#/wepay/' + id + '?qid=' + qid + '&is_anonymous=' + is_anonymous;
              if (aid) {
                  goUrl += '&aid=' + aid;
              }

              location.href = goUrl;
          }

          // 加载更多
          $scope.page = 1;

          $scope.getMore = function() {
              $scope.page = $scope.page + 1;
              var url = '/api/' + root + '/index/detail/' + $stateParams.uid + '?page=' + $scope.page;
              ajax.get(url).success(function(data) {
                  if (data.status == 0) {
                      if (data.data.replys.length == 0) {
                          layer.msg('已经没有数据了');
                      } else {
                          data.data.replys.forEach(function(item) {
                              if (item.pic.length > 0) {
                                  item.pic.forEach(function(pic) {
                                      var img = new Image();
                                      img.src = pic.site;
                                      $scope.preloadImgs.push(img);
                                  })
                              }
                              $scope.data.replys.push(item);
                          });
                      }

                  } else {
                      layer.msg(data.msg);
                  }
              })
          }

          $scope.setShang = function(person,type,free_person) {
              myShang.setInfo(person,type,free_person);
              $state.go('showShang');
          }

          //初始化回答表单
          function initAns() {

              $scope.ans = {
                  question_id: '',
                  content: '',
                  pics: [],
                  answer_id: '',
                  is_anonymous: 0
              };
              $scope.add = [
                  {
                      type: 1,
                      title: '匿名回复'
                  }
              ];
              try {
                  document.getElementById('mta').onclick();
              } catch (e) {
                  console.log(e);
              }
          }

          //获取数据
          function getData(url) {
              ajax.get(url).success(function(data) {
                  $scope.data = data.data;
              });
          }

          //提交回答
          function submit() {
              $scope.ans.question_id = arguments[0];
              $scope.ans.answer_id = arguments[1];

              var data = $scope.ans,
                  url = '/api/' + root + '/operation/reply';



              if ($scope.ans.answer_id) {
                  post();
              } else {
                  layer.confirm('如果是补充图像以及信息，或者公布随访和病理，可以点击『补充图片』，帖子会重新置顶！', {
                      title: ' ',
                      btn: ['去补充', '继续提交'] //按钮
                  }, function(index) {
                      $state.go('append', {
                          qid: $stateParams.uid,
                          content: $scope.ans.content
                      })
                      layer.close(index);
                  }, function(index) {
                      post();
                      layer.close(index);
                  });
              }

              function post() {
                  data.content = changeLink(data.content);
                  ajax.post(url, $.param(data)).success(function(res) {
                      if (res.status == 0) {
                          layer.msg(res.msg);

                          MtaH5.clickStat('reply');
                          //清空表单
                          initAns();
                          // 重置page
                          $scope.page = 1;

                          // 更新数据
                          getData('/api/' + root + '/index/detail/' + $stateParams.uid);

                          $('#reply').removeClass('reply-hide');
                      } else {
                          layer.msg(res.msg);
                          $scope.ans.content = decodeURI($scope.ans.content);
                      }
                  })
              }

          }

          //删除图片
          function deleteFiles(picname) {
              console.log('delete');
              var index = $scope.ans.pics.indexOf(picname);
              $scope.ans.pics.splice(index, 1);
          }
          //添加链接
          function addLink() {
              layer.prompt({
                  title: ' '
              }, function(value, index, elem) {
                  $timeout(function(){
                    $scope.ans.content += '##'+value+'##';
                  })
                  layer.close(index);
              });
          }
          //回复显示
          function reply(event, id) {
              var target = $(event.target.parentNode.nextElementSibling),
                  that = $(event.target);
              if (target.hasClass('reply-hide')) {
                  $('.ans-input').addClass('reply-hide');
                  $('.btn-reply').text('回复');
                  target.removeClass('reply-hide');
                  that.text('取消');
                  //清空表单
                  initAns();
              } else {
                  target.addClass('reply-hide');
                  that.text('回复');
                  $('#reply').removeClass('reply-hide');
                  initAns();
              }

          }

          // 采纳回答
          $scope.accept = function(question_id, answer_id) {
              var url = '/api/' + root + '/operation/accept/' + question_id + '/' + answer_id;
              ajax.put(url).success(function(res) {
                  if (res.status == 0) {
                      layer.msg(res.msg);
                      $state.go('focus.myQus');
                  } else {
                      layer.msg(res.msg);
                  }
              })
          }

          var link = origin + '/#/detail/' + $stateParams.uid;
          if ($scope.data.type == 7) {
              link = origin + '/#/detail2/' + $stateParams.uid;
          }

          //微信分享
          var config = {
              title: '医看——医生快速问答平台', // 分享标题
              desc: '我在[医看平台]提了一个问题，快来回答吧！',
              link: link, // 分享链接
              imgUrl: $scope.data.pic_log.length == 0
                  ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg'
                  : $scope.data.pic_log[0].site, // 分享图标
              success: function(res) {
                  // 用户确认分享后执行的回调函数
                  ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                      console.log(res);
                  })
                  MtaH5.clickStat('share');
              },
              fail: function(res) {
                  alert('error');
              }
          }
          var config2 = {
              title: '问题：' + $scope.data.question.replace(/\n/g, '') + ' ' + '描述：' + $scope.data.description.replace(/\n/g, ''),
              link: link, // 分享链接
              imgUrl: $scope.data.pic_log.length == 0
                  ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg'
                  : $scope.data.pic_log[0].site, // 分享图标
              success: function(res) {
                  // 用户确认分享后执行的回调函数
                  ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                      console.log(res);
                  })
                  MtaH5.clickStat('share');
              },
              fail: function(res) {
                  alert('error');
              }
          }
          wx.ready(function() {
              wx.onMenuShareTimeline(config2);
              wx.onMenuShareAppMessage(config);
              wx.onMenuShareQQ(config);
          });
      }
  }
})(window,document);

;(function(window, document, undefined) {
  /**
   * 详情页面
   */
    detailCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$state', '$timeout', 'mydata', 'uploadImg', 'ajax', 'Upload', 'photoswipe', 'myShang'];
  angular
    .module('app')
    .controller('detailCtrl',detailCtrl);

    function detailCtrl($rootScope, $scope, $stateParams, $state, $timeout,mydata, uploadImg,ajax, Upload, photoswipe, myShang) {
        // MtaH5.clickStat('question_detail');
        // ajax.get('/api/' + root + '/user/concern').success(function(res) {
        //     $rootScope.userInfo.newInfo = res.data;
        // });
        $scope.tabs = [
            {
                title: '高手竞技',
                type: 2,
                float: 'fl'
            }, {
                title: '普通浏览',
                type: 1,
                float: 'fr'
            }
        ]

        if (!$.isEmptyObject(mydata.data.data)) {
            $scope.changeNormal = changeNormal;
            $scope.data = mydata.data.data;
            $scope.addLink = addLink;
            $scope.type = 2;

            if($scope.data.type == 7){
              location.href = '/?#/detail2/'+$stateParams.uid;
            }
            if ($scope.data.type == 4 && $scope.data.activity_info.is_banner == 1) {
                $scope.data.replys.forEach(function(item) {
                    if (item.content !== '' && item.member_info.id != $rootScope.userInfo.id) {
                        item.content = item.content.substr(0, 10) + '**********';
                    }
                })
            }
            $scope.targetId = $stateParams.item;
            // 图片预加载

            $scope.preloadImgs = [];
            if ($scope.data.pic_log.length > 0) {
                $scope.data.pic_log.forEach(function(item) {
                    var img = new Image();
                    img.src = item.site;
                    $scope.preloadImgs.push(img);
                });
            }
            if ($scope.data.replys.length > 0) {
                $scope.data.replys.forEach(function(item) {
                    if (item.pic.length > 0) {
                        item.pic.forEach(function(pic) {
                            var img = new Image();
                            img.src = pic.site;
                            $scope.preloadImgs.push(img);
                        })
                    }
                })
            }

            //去除点赞中的重复数据
            $scope.data.reward_user = uniqArr($scope.data.reward_user);

            $scope.data.replys.forEach(function(item) {
                item.reward_user = uniqArr(item.reward_user);
            })
            $scope.setShang = function(person) {
                myShang.setInfo(person);
                $state.go('showShang');
            }


            initAns(); //初始化表单

            $scope.utils = {
                submit: submit,
                uploadFiles: uploadImg.upload($scope, Upload),
                deleteFiles: deleteFiles,
                reply: reply
            }

            $scope.gopay = function(id, qid, aid, is_anonymous) {
                var goUrl = '/?#/wepay/' + id + '?qid=' + qid + '&is_anonymous=' + is_anonymous;
                if (aid) {
                    goUrl += '&aid=' + aid;
                }

                location.href = goUrl;
            }
            $scope.pre = function(qid) {
                var targetId = parseInt(qid) + 1;
                $state.go('detail', {
                    uid: targetId
                });
            }
            $scope.next = function(qid) {
                var targetId = parseInt(qid) - 1;
                $state.go('detail', {
                    uid: targetId
                });
            }

            //判断微信浏览器决定上传方式
            if (isWeiXin) {
                $scope.utils.uploadFiles = uploadImg.wxUpload($scope);
                // $scope.utils.uploadFiles = wxUpload;
            }

            //photpswipe

            $scope.openPhoto = photoswipe.openPhotoSwipe;

            $scope.goReply = function() {
                var aHeight = $('#reply').offset().top;
                $('body,html').animate({
                    scrollTop: aHeight
                }, 200);
            }
            $scope.zanshang = function(uid, qid) {
                location.href = '/#/wepay/' + uid + '?qid=' + qid;
            }

            // 加载更多
            $scope.page = 1;

            $scope.getMore = function() {
                $scope.page = $scope.page + 1;
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid + '?page=' + $scope.page;
                ajax.get(url).success(function(data) {
                    if (data.status == 0) {
                        if (data.data.replys.length == 0) {
                            layer.msg('已经没有数据了');
                        } else {
                            data.data.replys.forEach(function(item) {
                                if (item.pic.length > 0) {
                                    item.pic.forEach(function(pic) {
                                        var img = new Image();
                                        img.src = pic.site;
                                        $scope.preloadImgs.push(img);
                                    })
                                }
                                $scope.data.replys.push(item);
                            });
                        }

                    } else {
                        layer.msg(data.msg);
                    }
                })
            }



            //初始化回答表单
            function initAns() {

                $scope.ans = {
                    question_id: '',
                    content: '',
                    pics: [],
                    answer_id: '',
                    is_anonymous: 0
                };
                $scope.add = [{
                    type: 1,
                    title: '匿名回复'
                }]

                try {
                    document.getElementById('mta').onclick();
                } catch (e) {
                    console.log(e);
                }


            }

            //获取数据
            function getData(url) {
                ajax.get(url).success(function(data) {
                    $scope.data = data.data;
                    // layer.close($rootScope.loading);
                });
            }

            //提交回答
            function submit() {
                $scope.ans.question_id = arguments[0];
                $scope.ans.answer_id = arguments[1];
                var data = $scope.ans,
                    url = '/api/' + root + '/operation/reply';

                data.content = changeLink(data.content);
                ajax.post(url, $.param(data)).success(function(res) {
                    if (res.status == 0) {
                        layer.msg(res.msg);

                        MtaH5.clickStat('reply');
                        //清空表单
                        initAns();
                        // 重置page
                        $scope.page = 1;

                        // 更新数据
                        //getData('/api/' + root + '/index/detail/' + $stateParams.uid);
                        $state.reload();

                        $('#reply').removeClass('reply-hide');
                    } else {
                        layer.msg(res.msg);
                        $scope.ans.content = decodeURI($scope.ans.content);
                    }
                })
            }


            //删除图片
            function deleteFiles(picname) {
                console.log('delete');
                var index = $scope.ans.pics.indexOf(picname);
                $scope.ans.pics.splice(index, 1);
            }

            function addLink() {
                layer.prompt({
                    title: ' '
                }, function(value, index, elem) {
                    $timeout(function(){
                      $scope.ans.content += '##'+value+'##';
                    })
                    layer.close(index);
                });
            }

            //回复显示
            var showID;

            function reply(event, id) {
                var target = $(event.target.parentNode.nextElementSibling),
                    that = $(event.target);
                if ($rootScope.isFocus == 1) {
                    if (target.hasClass('reply-hide')) {
                        $('.ans-input').addClass('reply-hide');
                        $('.btn-reply').text('回复');
                        target.removeClass('reply-hide');
                        that.text('取消');
                        //清空表单
                        initAns();
                    } else {
                        target.addClass('reply-hide');
                        that.text('回复');
                        $('#reply').removeClass('reply-hide');
                        initAns();
                    }
                } else {
                    layer.msg('您还未关注[医看]平台，无法回复');
                }


            }
            /**
             * 改变查看模式
             * @param  {int} type 类型
             * @return {[type]}      [description]
             */
            function changeNormal(type) {
              var url = '/api/' + root + '/operation/replyseeother/'+$stateParams.uid;
              if($rootScope.userInfo.id){
                if(type === 1&&$scope.data.reply_see_other === 2){
                  ajax.put(url).success(function(res){
                    if(res.status===0){
                      $state.reload();
                    }
                  })
                }else {
                  $scope.type = type;
                }
              }else{
                layer.msg('请您登录后再进行操作');
              }

            }
            //微信分享
            var config = {
                title: '医看——医生快速问答平台', // 分享标题
                desc: '问题：' + $scope.data.question.replace(/\n/g, '') + ' ' + '描述：' + $scope.data.description.replace(/\n/g, ''),
                link: origin + '/#/detail/' + $stateParams.uid, // 分享链接
                imgUrl: $scope.data.pic_log.length == 0 ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg' : $scope.data.pic_log[0].site, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                        console.log(res);
                    })
                    MtaH5.clickStat('share');
                },
                fail: function(res) {
                    alert('error');
                }
            }
            var config2 = {
                title: '问题：' + $scope.data.question.replace(/\n/g, '') + ' ' + '描述：' + $scope.data.description.replace(/\n/g, ''),
                link: origin + '/#/detail/' + $stateParams.uid, // 分享链接
                imgUrl: $scope.data.pic_log.length == 0 ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg' : $scope.data.pic_log[0].site, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                        console.log(res);
                    })
                    MtaH5.clickStat('share');
                },
                fail: function(res) {
                    alert('error');
                }
            }
            wx.ready(function() {
                wx.onMenuShareTimeline(config2);
                wx.onMenuShareAppMessage(config);
                wx.onMenuShareQQ(config);
            });
        } else {
            $state.go('index.questions');
        }
    }
})(window,document);

;(function(window, document, undefined) {
  /**
   * 付费病例详情
   */

    detail2Ctrl.$inject = ['$rootScope', '$scope', '$stateParams', '$location', '$state', 'mydata', 'uploadImg', 'Upload', 'ajax', 'photoswipe', 'myShang'];
    angular
      .module('app')
      .controller('detail2Ctrl', detail2Ctrl);

    function detail2Ctrl($rootScope, $scope, $stateParams, $location, $state, mydata, uploadImg, Upload, ajax, photoswipe, myShang) {
        // MtaH5.clickStat('question_detail');
        $scope.isPay = false;
        $scope.kmoneyList = ['10', '20', '30'];
        $scope.moneyList = ['0.5','1.0','1.5'];
        $scope.kpay = kpay;
        $scope.payWarn=payWarn;
        $scope.pay = pay;
        $scope.freeRead = freeRead;
        $scope.from_uid = $stateParams.from_uid;

        var shareLink = origin + '/?#/detail2/' + $stateParams.uid;

        // ajax.get('/api/' + root + '/user/concern').success(function(res) {
        //     $rootScope.userInfo.newInfo = res.data;
        // });
        if (!$.isEmptyObject(mydata.data.data)) {

            $scope.data = mydata.data.data;
            $scope.targetId = $stateParams.item;

            //判断如果问题是本人发布的，则跳转到我的发布页面
            if($scope.data.role_id==$rootScope.userInfo.id) {
              location.replace(origin+'/#/myDetail/'+$stateParams.uid);
            }

            if($scope.from_uid){
              shareLink = origin + '/?#/detail2/' + $stateParams.uid+'?from_uid='+$scope.from_uid;
            }


            // 图片预加载
            $scope.preloadImgs = [];
            if ($scope.data.pic_log.length > 0) {
                $scope.data.pic_log.forEach(function(item) {
                    var img = new Image();
                    img.src = item.site;
                    $scope.preloadImgs.push(img);
                });
            }
            if ($scope.data.replys.length > 0) {
                $scope.data.replys.forEach(function(item) {
                    if (item.pic.length > 0) {
                        item.pic.forEach(function(pic) {
                            var img = new Image();
                            img.src = pic.site;
                            $scope.preloadImgs.push(img);
                        })
                    }
                })
            }

            //去除点赞中的重复数据
            $scope.data.reward_user = uniqArr($scope.data.reward_user);
            $scope.data.reward_user.forEach(function(item){
              if(item.id == $rootScope.userInfo.id){
                $scope.isPay = true;
                shareLink = origin + '/?#/detail2/' + $stateParams.uid+'?from_uid='+$rootScope.userInfo.id;
              }
            });
            $scope.data.invite_user.forEach(function(item){
              if(item.member.id == $rootScope.userInfo.id){
                $scope.isPay = true;
                shareLink = origin + '/?#/detail2/' + $stateParams.uid+'?from_uid='+$scope.data.inviter.id;
              }
            });
            if (!$scope.isPay) {
                $scope.data.description = $scope.data.description.substr(0, 10) + '**********';
                $scope.data.question_exts.forEach(function(item){
                  item.description = item.description.substr(0, 10) + '**********';
                })
            }
            if($scope.from_uid&&$scope.data.invite_user.length==3&&!$scope.isPay){
              layer.msg('很抱歉!<br>手慢无~但您可以付k币看~<br>您来做土豪');
            }

            $scope.data.replys.forEach(function(item) {
                item.reward_user = uniqArr(item.reward_user);
            })
            $scope.setShang = function(person,type,free_person) {
                myShang.setInfo(person,type,free_person);
                $state.go('showShang');
            }

            initAns(); //初始化表单

            $scope.utils = {
                submit: submit,
                uploadFiles: uploadImg.upload($scope, Upload),
                deleteFiles: deleteFiles,
                reply: reply
            }

            $scope.gopay = function(id, qid, aid, is_anonymous) {
                var goUrl = '/?#/wepay/' + id + '?qid=' + qid + '&is_anonymous=' + is_anonymous;
                if (aid) {
                    goUrl += '&aid=' + aid;
                }

                location.href = goUrl;
            }
            $scope.pre = function(qid) {
                var targetId = parseInt(qid) + 1;
                $state.go('detail', {uid: targetId});
            }
            $scope.next = function(qid) {
                var targetId = parseInt(qid) - 1;
                $state.go('detail', {uid: targetId});
            }

            //判断微信浏览器决定上传方式
            if (isWeiXin) {
                $scope.utils.uploadFiles = uploadImg.wxUpload($scope);
                // $scope.utils.uploadFiles = wxUpload;
            }

            //photpswipe

            $scope.openPhoto = photoswipe.openPhotoSwipe;

            $scope.goReply = function() {
                var aHeight = $('#reply').offset().top;
                $('body,html').animate({
                    scrollTop: aHeight
                }, 200);
            }

            // 加载更多
            $scope.page = 1;

            $scope.getMore = function() {
                $scope.page = $scope.page + 1;
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid + '?page=' + $scope.page;
                ajax.get(url).success(function(data) {
                    if (data.status == 0) {
                        if (data.data.replys.length == 0) {
                            layer.msg('已经没有数据了');
                        } else {
                            data.data.replys.forEach(function(item) {
                                if (item.pic.length > 0) {
                                    item.pic.forEach(function(pic) {
                                        var img = new Image();
                                        img.src = pic.site;
                                        $scope.preloadImgs.push(img);
                                    })
                                }
                                $scope.data.replys.push(item);
                            });
                        }

                    } else {
                        layer.msg(data.msg);
                    }
                })
            }

            function kpay(price,uid) {
                var url = '/api/' + root + '/operation/kreward';
                var data = {
                    type: 2,
                    k_money: price,
                    to_uid: uid,
                    question_id: $stateParams.uid
                };

                layer.confirm('确定付费?', {
                    icon: 3,
                    title: ' '
                }, function(index) {
                    ajax.post(url, $.param(data)).success(function(res) {
                        if (res.status == 0) {
                            layer.msg(res.msg)
                                $state.reload();
                        } else {
                            layer.msg(res.msg);
                        }
                    })
                    layer.close(index);
                });
            }

            function pay(price,uid) {
                var url = '/api/' + root + '/paycore/reward';
                price = Math.floor(price);
                var data = {
                    type: 2,
                    price: price,
                    to_uid: uid,
                    question_id: $stateParams.uid
                };
                ajax.post(url, $.param(data)).success(function(res) {
                    var jsApiParameters = JSON.parse(res.data.bridge_json_string);
                    callpay();

                    function jsApiCall() {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest',
                            jsApiParameters,
                            function(res) {
                                WeixinJSBridge.log(res.err_msg);
                                if (res.err_desc) {
                                    layer.msg(res.err_code + res.err_desc + res.err_msg);
                                } else {
                                    $state.reload();
                                }

                            }
                        );
                    }

                    function callpay() {
                        if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                            } else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                            }
                        } else {
                            jsApiCall();
                        }
                    }
                })
            }

            function payWarn(){
              layer.msg('请支付任意k币，查看病例详情');
            }

            /**
             * 获取免费阅读付费病例资格
             * @param  {String} qid    问题ID
             * @param  {String} fromId 邀请人ID
             * @return {[type]}        [description]
             */
            function freeRead(qid,fromId) {
              var url = '/api/' + root + '/operation/paytoseeinvite';
              var data = {
                question_id:qid,
                from_uid:fromId
              }
              ajax.post(url,$.param(data)).success(function(res){
                  layer.msg(res.msg);
                  //$state.reload();
                  location.reload();
              })
            }

            //初始化回答表单
            function initAns() {

                $scope.ans = {
                    question_id: '',
                    content: '',
                    pics: [],
                    answer_id: '',
                    is_anonymous: 0
                };
                $scope.add = [
                    {
                        type: 1,
                        title: '匿名回复'
                    }
                ]

                try {
                    document.getElementById('mta').onclick();
                } catch (e) {
                    console.log(e);
                }

            }

            //获取数据
            function getData(url) {
                ajax.get(url).success(function(data) {
                    $scope.data = data.data;
                    if (!$scope.isPay) {
                        $scope.data.description = $scope.data.description.substr(0, 10) + '**********';
                        $scope.data.question_exts.forEach(function(item){
                          item.description = item.description.substr(0, 10) + '**********';
                        })
                    }
                });
            }

            //提交回答
            function submit() {
                $scope.ans.question_id = arguments[0];
                $scope.ans.answer_id = arguments[1];
                var data = $scope.ans,
                    url = '/api/' + root + '/operation/reply';
                ajax.post(url, $.param(data)).success(function(res) {
                    if (res.status == 0) {
                        layer.msg(res.msg);

                        MtaH5.clickStat('reply');
                        //清空表单
                        initAns();
                        // 重置page
                        $scope.page = 1;

                        // 更新数据
                        getData('/api/' + root + '/index/detail/' + $stateParams.uid);

                        $('#reply').removeClass('reply-hide');
                    } else {
                        layer.msg(res.msg);
                    }
                })
            }

            //删除图片
            function deleteFiles(picname) {
                console.log('delete');
                var index = $scope.ans.pics.indexOf(picname);
                $scope.ans.pics.splice(index, 1);
            }

            //回复显示
            var showID;

            function reply(event, id) {
                var target = $(event.target.parentNode.nextElementSibling),
                    that = $(event.target);
                if ($rootScope.isFocus == 1) {
                    if (target.hasClass('reply-hide')) {
                        $('.ans-input').addClass('reply-hide');
                        $('.btn-reply').text('回复');
                        target.removeClass('reply-hide');
                        that.text('取消');
                        //清空表单
                        initAns();
                    } else {
                        target.addClass('reply-hide');
                        that.text('回复');
                        $('#reply').removeClass('reply-hide');
                        initAns();
                    }
                } else {
                    layer.msg('您还未关注[医看]平台，无法回复');
                }

            }

            var shareTitle1 = '「医看」付费病例：优质内容，值得付费';
            var shareTitle2 = '给家推荐一个「医看」付费病例:问题：' + $scope.data.question.replace(/\n/g, '');
            var shareDesc = '问题：' + $scope.data.question.replace(/\n/g, '') + ' ' + '描述：' + $scope.data.description.replace(/\n/g, '');

            if($scope.isPay){
              shareTitle1 = $scope.data.inviter.name+'付费邀请您查看原创经典医学影像病例！手慢无！'
              shareTitle2 = shareTitle1;
              shareDesc = '医看平台优质付费病例免费看啦！速度来抢3个免费名额！'
            }
            //微信分享
            var config = {
                title: shareTitle1, // 分享标题
                desc: shareDesc,
                link: shareLink, // 分享链接
                imgUrl: $scope.data.pic_log.length == 0? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg'
                    : $scope.data.pic_log[0].site, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                        console.log(res);
                    })
                    MtaH5.clickStat('share');
                },
                fail: function(res) {
                    alert('error');
                }
            }
            var config2 = {
                title: shareTitle2,
                link: shareLink, // 分享链接
                imgUrl: $scope.data.pic_log.length == 0
                    ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg'
                    : $scope.data.pic_log[0].site, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                        console.log(res);
                    })
                    MtaH5.clickStat('share');
                },
                fail: function(res) {
                    alert('error');
                }
            }
            wx.ready(function() {
                wx.onMenuShareTimeline(config2);
                wx.onMenuShareAppMessage(config);
                wx.onMenuShareQQ(config);
            });
        } else {
            $state.go('index.questions');
        }
    }
})(window, document);

;(function(window, document,undefined) {
    /**
     * 付费问答详情
     *
     */
    app.controller('pDetailCtrl', ['$rootScope', '$scope', '$stateParams', '$state', '$sce', 'mydata', 'uploadImg', 'Upload', 'ajax', 'photoswipe', 'myShang', function($rootScope, $scope, $stateParams, $state, $sce, mydata, uploadImg, Upload, ajax, photoswipe, myShang) {
        ajax.get('/api/' + root + '/user/concern').success(function(res) {
            $rootScope.userInfo.newInfo = res.data;
        });
        if (!$.isEmptyObject(mydata.data.data)) {

            $scope.data = mydata.data.data;
            $scope.targetId = $stateParams.item;
            $scope.isPay = false;

            // 图片预加载
            $scope.preloadImgs = [];
            if ($scope.data.pic_log.length > 0) {
                $scope.data.pic_log.forEach(function(item) {
                    var img = new Image();
                    img.src = item.site;
                    $scope.preloadImgs.push(img);
                });
            }
            if ($scope.data.replys.length > 0) {
                $scope.data.replys.forEach(function(item) {
                    if (item.pic.length > 0) {
                        item.pic.forEach(function(pic) {
                            var img = new Image();
                            img.src = pic.site;
                            $scope.preloadImgs.push(img);
                        })
                    }
                })
            }

            //去除点赞中的重复数据
            $scope.data.reward_user = uniqArr($scope.data.reward_user);
            $scope.data.reward_user.forEach(function(item){
              if(item.id == $rootScope.userInfo.id){
                $scope.isPay = true;
              }
            });

            $scope.data.replys.forEach(function(item) {
                item.reward_user = uniqArr(item.reward_user);
            })
            $scope.setShang = function(person) {
                myShang.setInfo(person);
                $state.go('showShang');
            }


            initAns(); //初始化表单

            $scope.utils = {
                submit: submit,
                uploadFiles: uploadImg.upload($scope, Upload),
                deleteFiles: deleteFiles,
                reply: reply,
                showAns: showAns,
                kpay: kpay
            }

            $scope.gopay = function(id, qid, aid, is_anonymous) {
                var goUrl = '/?#/wepay/' + id + '?qid=' + qid + '&is_anonymous=' + is_anonymous;
                if (aid) {
                    goUrl += '&aid=' + aid;
                }

                location.href = goUrl;
            }
            $scope.pre = function(qid) {
                var targetId = parseInt(qid) + 1;
                $state.go('detail', {
                    uid: targetId
                });
            }
            $scope.next = function(qid) {
                var targetId = parseInt(qid) - 1;
                $state.go('detail', {
                    uid: targetId
                });
            }

            //判断微信浏览器决定上传方式
            if (isWeiXin) {
                $scope.utils.uploadFiles = uploadImg.wxUpload($scope);
                // $scope.utils.uploadFiles = wxUpload;
            }

            //photpswipe

            $scope.openPhoto = photoswipe.openPhotoSwipe;

            $scope.goReply = function() {
                var aHeight = $('#reply').offset().top;
                $('body,html').animate({
                    scrollTop: aHeight
                }, 200);
            }
            $scope.zanshang = function(uid, qid) {
                location.href = '/#/wepay/' + uid + '?qid=' + qid;
            }

            // 加载更多
            $scope.page = 1;

            $scope.getMore = function() {
                $scope.page = $scope.page + 1;
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid + '?page=' + $scope.page;
                ajax.get(url).success(function(data) {
                    if (data.status == 0) {
                        if (data.data.replys.length == 0) {
                            layer.msg('已经没有数据了');
                        } else {
                            data.data.replys.forEach(function(item) {
                                if (item.pic.length > 0) {
                                    item.pic.forEach(function(pic) {
                                        var img = new Image();
                                        img.src = pic.site;
                                        $scope.preloadImgs.push(img);
                                    })
                                }
                                $scope.data.replys.push(item);
                            });
                        }

                    } else {
                        layer.msg(data.msg);
                    }
                })
            }



            //初始化回答表单
            function initAns() {

                $scope.ans = {
                    question_id: '',
                    content: '',
                    pics: [],
                    answer_id: '',
                    is_anonymous: 0
                };
                $scope.add = [{
                    type: 1,
                    title: '匿名回复'
                }]
                $scope.isShow = false;
            }


            // 显示付费回答
            function showAns(id) {
                $scope.isShow = !$scope.isShow;

                ajax.put('/api/' + root + '/index/freeclickincr/' + id)
                    .success(function(res) {
                        layer.msg(res.msg);
                    })

            }
            //获取数据
            function getData(url) {
                ajax.get(url).success(function(data) {
                    $scope.data = data.data;
                    // layer.close($rootScope.loading);
                });
            }
            /**
             * 付费查看
             * @param  {[type]} price 价格
             * @param  {[type]} uid   目标用户id
             */
            function kpay(price,uid) {
                var url = '/api/' + root + '/operation/kreward';
                var data = {
                    type: 2,
                    k_money: price,
                    to_uid: uid,
                    question_id: $stateParams.uid
                };

                layer.confirm('确定付费?', {
                    icon: 3,
                    title: ' '
                }, function(index) {
                    ajax.post(url, $.param(data)).success(function(res) {
                        if (res.status == 0) {
                            layer.msg(res.msg)
                                $state.reload();
                        } else {
                            layer.msg(res.msg);
                        }
                    })
                    layer.close(index);
                });
            }

            //提交回答
            function submit() {
                $scope.ans.question_id = arguments[0];
                $scope.ans.answer_id = arguments[1];
                var data = $scope.ans,
                    url = '/api/' + root + '/operation/reply';
                ajax.post(url, $.param(data)).success(function(res) {
                    if (res.status == 0) {
                        layer.msg(res.msg);

                        //清空表单
                        initAns();
                        // 重置page
                        $scope.page = 1;

                        // 更新数据
                        getData('/api/' + root + '/index/detail/' + $stateParams.uid);

                        $('#reply').removeClass('reply-hide');
                    } else {
                        layer.msg(res.msg);
                    }
                })
            }


            //删除图片
            function deleteFiles(picname) {
                var index = $scope.ans.pics.indexOf(picname);
                $scope.ans.pics.splice(index, 1);
            }

            //回复显示
            var showID;

            function reply(event, id) {
                var target = $(event.target.parentNode.nextElementSibling),
                    that = $(event.target);
                if ($rootScope.isFocus == 1) {
                    if (target.hasClass('reply-hide')) {
                        $('.ans-input').addClass('reply-hide');
                        $('.btn-reply').text('回复');
                        target.removeClass('reply-hide');
                        that.text('取消');
                        //清空表单
                        initAns();
                    } else {
                        target.addClass('reply-hide');
                        that.text('回复');
                        $('#reply').removeClass('reply-hide');
                        initAns();
                    }
                } else {
                    layer.msg('您还未关注[医看]平台，无法回复');
                }


            }
            //微信分享
            var config = {
                title: '医看——医生快速问答平台', // 分享标题
                desc: '问题：' + $scope.data.question.replace(/\n/g, '') + ' ' + '描述：' + $scope.data.description.replace(/\n/g, ''),
                link: origin + '/#/pDetail/' + $stateParams.uid, // 分享链接
                imgUrl: $scope.data.pic_log.length == 0 ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg' : $scope.data.pic_log[0].site, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                        console.log(res);
                    })
                },
                fail: function(res) {
                    alert('error');
                }
            }
            var config2 = {
                title: '问题：' + $scope.data.question.replace(/\n/g, '') + ' ' + '描述：' + $scope.data.description.replace(/\n/g, ''),
                link: origin + '/#/pDetail/' + $stateParams.uid, // 分享链接
                imgUrl: $scope.data.pic_log.length == 0 ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg' : $scope.data.pic_log[0].site, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                        console.log(res);
                    })
                },
                fail: function(res) {
                    alert('error');
                }
            }
            wx.ready(function() {
                wx.onMenuShareTimeline(config2);
                wx.onMenuShareAppMessage(config);
                wx.onMenuShareQQ(config);
            });
        } else {
            $state.go('index.questions');
        }
    }])
})(window, document);

;(function(window, document, undefined) {
  /**
   * 科室详情
   */
    kdetailCtrl.$inject = ['$stateParams', 'uploadImg', 'Upload', 'ajax', 'photoswipe'];
    angular.module('app').controller('kdetailCtrl', kdetailCtrl);

    function kdetailCtrl($stateParams, uploadImg, Upload, ajax, photoswipe) {
        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }

        var url = '/api/' + root + '/administrative/detail/' + $stateParams.kid;

        var vm       = this;
        vm.page      = 1;
        vm.openPhoto = photoswipe.openPhotoSwipe;
        vm.goReply   = goReply;
        vm.getMore   = getMore;

        vm.utils = {
            submit: submit,
            uploadFiles: uploadImg.upload(vm, Upload),
            deleteFiles: deleteFiles,
            reply: reply
        }

        getData(url);

        initAns(); //初始化表单

        //判断微信浏览器决定上传方式
        if (isWeiXin) {
            vm.utils.uploadFiles = uploadImg.wxUpload(vm);
        }

        function goReply() {
            var aHeight = $('#reply').offset().top;
            console.log(aHeight);
            $('body,html').animate({
                scrollTop: aHeight
            }, 200);
        }

        // 加载更多
        function getMore() {
            vm.page = vm.page + 1;
            var url = '/api/' + root + '/administrative/detail/' + $stateParams.kid + '?page=' + vm.page;
            ajax.get(url).success(function(data) {
                if (data.status == 0) {
                    if (data.data.replys.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        data.data.replys.forEach(function(item) {
                            vm.data.replys.push(item);
                        });
                    }

                } else {
                    layer.msg(data.msg);
                }
            })
        }

        //初始化回答表单
        function initAns() {
            vm.ans = {
                aid: '',
                content: '',
                pics: [],
                answer_id: ''
            };
        }

        //获取数据
        function getData(url) {
            ajax.get(url).success(function(data) {
                vm.data = data.data;
                // 图片预加载
                vm.preloadImgs = [];
                data.data.equipments.forEach(function(item) {
                    item.pics.forEach(function(item2) {
                        var img = new Image();
                        img.src = item2.site;
                        vm.preloadImgs.push(img);
                    })
                });
            });
        }

        //提交回答
        function submit() {
            vm.ans.aid = arguments[0];
            vm.ans.answer_id = arguments[1];
            var data = vm.ans,
                url2 = '/api/' + root + '/operation/replydepartment';
            ajax.post(url2, $.param(data)).success(function(res) {
                if (res.status == 0) {
                    layer.msg(res.msg);
                    MtaH5.clickStat('reply');
                    //清空表单
                    initAns();
                    // 重置page
                    vm.page = 1;

                    // 更新数据
                    getData(url);
                    $('#reply').removeClass('reply-hide');
                } else {
                    layer.msg(res.msg);
                }
            })
        }

        //删除图片
        function deleteFiles(picname) {
            var index = vm.ans.pics.indexOf(picname);
            vm.ans.pics.splice(index, 1);
        }

        //回复显示
        function reply(event, id) {
            var target = $(event.target.parentNode.nextElementSibling),
                that = $(event.target);
            if (target.hasClass('reply-hide')) {
                $('.ans-input').addClass('reply-hide');
                $('.btn-reply').text('回复');
                target.removeClass('reply-hide');
                that.text('取消');
                //清空表单
                initAns();
            } else {
                target.addClass('reply-hide');
                that.text('回复');
                $('#reply').removeClass('reply-hide');
                initAns();
            }

        }

        //微信分享
        var config = {
            title: '医看—医生快速问答平台', // 分享标题
            desc: '我在[医看平台]发现了一个科室，快来看看吧！',
            link: origin + '/#/kdetail/' + $stateParams.kid, // 分享链接
            imgUrl: 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg', // 分享图标
            success: function(res) {
                // 用户确认分享后执行的回调函数
                MtaH5.clickStat('share');
            },
            fail: function(res) {
                alert('error');
            }
        }
        wx.ready(function() {
            wx.onMenuShareTimeline(config);
            wx.onMenuShareAppMessage(config);
            wx.onMenuShareQQ(config);
        });

    }
})(window, document);

;(function(window, document, undefined) {
    /**
     * 我的回答
     */
    myAswCtrl.$inject = ['$scope', 'ajax'];
    angular
        .module('app')
        .controller('myAswCtrl', myAswCtrl);

    function myAswCtrl($scope, ajax) {
        var vm = this;
        var url = '/api/' + root + '/user/myanswer';

        vm.page = 1;
        vm.getMore = getMore;

        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }
        ajax.get(url).success(function(res) {
            vm.data = res.data.data;
        });


        function getMore() {
            vm.page = vm.page + 1;
            var url = '/api/' + root + '/user/myanswer?page=' + vm.page;
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.data.forEach(function(item) {
                            vm.data.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 我的收藏
   */
  app.controller('myCollectCtrl', ['$scope', '$state', 'indexData', function($scope, $state, indexData) {
      try {
          document.getElementById('mta').onclick();
      } catch (e) {
          console.log(e);
      }
      var url = '/api/' + root + '/user/mycollection';
      indexData.getData(url).success(function(res) {
          $scope.data = res.data.data;
      });
      // indexData.getData('/api/' + root + '/video/index?is_collect=true').success(function(res) {
      //     $scope.list=res.data.data;
      //     console.log($scope.category);
      // });


      $scope.tabs = [{
          title: '我的病例',
          type: 'bin',
          float: 'fl'
      }, {
          title: '付费病例',
          type: 'mycollectpay',
          float: 'fl'
      },{
          title: '我的视频',
          type: 'video',
          float: 'fr'
      }];

      $scope.type = 'bin';

      $scope.page = 1;

      $scope.getMore = function() {
          $scope.page = $scope.page + 1;
          var url = '/api/' + root + '/user/mycollection?page=' + $scope.page;
          indexData.getData(url).success(function(data) {
              if (data.status == 0) {
                  if (data.data.data.length == 0) {
                      layer.msg('已经没有数据了');
                  } else {
                      data.data.data.forEach(function(item) {
                          $scope.data.push(item);
                      });
                  }

              } else {
                  layer.msg(data.msg);
              }
          })
      }
      $scope.goDetail = function(qid, uid, myid) {
          MtaH5.clickStat('my_collection_detail');
          if (uid == myid) {
              $state.go('myDetail', {
                  uid: qid
              })
          } else {
              $state.go('detail', {
                  uid: qid
              })
          }
      }
      $scope.category_item=function(a,category){
          if(category){
              console.log(a)
          console.log(category)
          console.log(category[a])
          return category[a];
          }
      }
  }]);
})(window,document);

;(function(window, document, undefined) {
    /**
     * 我的提问
     */
    myQusCtrl.$inject = ['$scope', 'ajax'];
    angular.module('app').controller('myQusCtrl', myQusCtrl);

    function myQusCtrl($scope,ajax) {

        var vm = this;
        var url = '/api/' + root + '/user/myquestion';

        $scope.type = 'myquestion';

        vm.page = 1;
        vm.getMore = getMore;
        vm.tabs = [{
            title: '普通提问',
            type: 'myquestion',
            float: 'fl'
        },{
            title: '付费病例',
            type: 'mypaycase',
            float: 'fr'
        }];


        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }

        ajax.get(url).success(function(res) {
            $scope.data = res.data.data;
        });

        function getMore() {
            vm.page = vm.page + 1;
            var url = '/api/' + root + '/user/myquestion?page=' + vm.page;
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.data.forEach(function(item) {
                            $scope.data.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }
})(window, document);

;(function(window, document, undefined) {

  /**
   * 付费病例列表
   */
    paycasesCtrl.$inject = ['$scope', '$state', 'ajax', 'store'];
  angular
    .module('app')
    .controller('paycasesCtrl',paycasesCtrl);

    function paycasesCtrl($scope,$state,ajax, store) {

        var url = '/api/' + root + '/index/questions?type=pay_to_see_hot';
        var url2 = '/api/' + root + '/index/questions?type=pay_to_see';

        $scope.type = 'hot';
        $scope.page = 1;
        $scope.getMore = getMore;
        $scope.goDetail = goDetail;
        $scope.isPay = isPay;
        $scope.data = [];

        var indexStore = store.getData();

        if(indexStore.flag){
            store.init($scope);
        }else{
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    cutDescription(res);
                    concatData(res);
                } else if (res.status == -5) {
                    layer.msg(res.data);
                }
            });
        }

        weishare() //微信分享

        $scope.tabs = [
            {
                title: '热门',
                type: 'hot',
                float: 'fl'
            }, {
                title: '最新',
                type: 'new',
                float: 'fr'
            }
        ];

        function getMore(type) {
            $scope.page = $scope.page + 1;
            var url = '/api/' + root + '/index/questions?type=pay_to_see_hot&page=' + $scope.page;
            if (type == 'hot') {
                url = '/api/' + root + '/index/questions?type=pay_to_see_hot&page=' + $scope.page;
            } else{
                url = '/api/' + root + '/index/questions?type=pay_to_see&page=' + $scope.page;
            }
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        cutDescription(res);
                        concatData(res);
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }

        function goDetail(qid, uid, myid, isOpen,qtype) {
            var event = window.event;
            var data = $scope.data,
                type = $scope.type,
                page = $scope.page,
                id = qid;

            store.setData(data,type,page,id);
            if (isOpen == '1') {
                $state.go('pDetail', {
                    uid: qid
                })
            } else if (uid == myid) {
                $state.go('myDetail', {
                    uid: qid
                })
            }else if (qtype == 7) {
                // $state.go('detail2', {
                //     uid: qid
                // })
                location.href = '/?#/detail2/'+qid
            } else {
                $state.go('detail', {
                    uid: qid
                })
            }
        }

        function cutDescription(res){
          res.data.data.forEach(function(item){
            item.description = item.description.substr(0, 10) + '**********';
            item.question_exts.forEach(function(item){
              item.description = item.description.substr(0, 10) + '**********';
            })
          })
        }

        function concatData(res){
          // var stmp1 = res.data.data.slice(0,3);
          // var stmp2 = res.data.data.slice(3);
          // var array = stmp1.concat($scope.data);
          // $scope.data = array.concat(stmp2);
          $scope.data = $scope.data.concat(res.data.data);
        }

        function isPay(uid,payList){
          var ispay = false;
          for (var i = 0,len=payList.length; i < len; i++) {
            if(uid == payList[i].id){
              ispay = true;
              break;
            }
          }
          return ispay;
        }

    }
})(window,document);

;(function(window, document, undefined) {
    /**
     * 首页付费榜单
     */
    app.controller('caihuaCtrl', ['$scope', '$stateParams', 'indexData', function($scope, $stateParams, indexData) {
        var url = '/api/' + root + '/index/artistic';
        indexData.getData(url).success(function(data) {
            $scope.data = data.data;
            // console.log(data);
        });
        $scope.tabs = [
            {
                title: '付费医生',
                type: 'answer',
                float: 'fl'
            }, {
                title: '人气医生',
                type: 'authen',
                float: 'fr'
            }
        ];
        if ($stateParams.type) {
            $scope.type = $stateParams.type;
        } else {
            $scope.type = 0;
        }

    }]);
})(window, document);

;(function(window, document, undefined) {

  searchCtrl.$inject = ['$scope', '$sce', 'ajax', '$location'];
  angular
    .module('app')
    .controller('searchCtrl', searchCtrl);

    function searchCtrl($scope,$sce, ajax,$location) {
      try {
          document.getElementById('mta').onclick();
      } catch (e) {
          console.log(e);
      }

      var vm = this;

      vm.type = '0';
      vm.page = 1;
      vm.is_last = false;
      vm.case=[];
      vm.user=[];
      vm.placeholder = '请输入搜索关键字';
      vm.del = del;
      vm.search = search;
      vm.getMore = getMore;
      vm.goMore = goMore;
      vm.change = change;

      var params = $location.search();
      vm.keywords = params.keywords;

      getResult(vm.keywords,vm.type);




      /**
       * 清空搜索内容
       */
      function del() {
          vm.keywords='';
          vm.case=[];
          vm.user=[];
      }

      function search(keywords) {
          vm.keywords = keywords;
          vm.case=[];
          vm.user=[];
          getResult(vm.keywords,vm.type);
          // location.href ='#/search?keywords='+keywords;
      }

      function change(type){
        if(type == 0){
          vm.placeholder='请输入搜索关键字';
        }else if(type==='case'){
          vm.placeholder='搜索病例关键字';
        }else {
          vm.placeholder='搜索用户关键字';
        }

        vm.type = type;
      }

      //高亮显示
      function hightLight(data,type){

          if(type === 'user'){
            if(data.nickname.search(new RegExp(vm.keywords,'i'))!=-1){

                data.search_content = $sce.trustAsHtml('昵称：'+data.nickname.replace(new RegExp(vm.keywords,'i'),'<strong>'+vm.keywords+'</strong>'));

            }else if(data.name.search(new RegExp(vm.keywords,'i'))!=-1){

                data.search_content = $sce.trustAsHtml('姓名：'+data.name.replace(new RegExp(vm.keywords,'i'),'<strong>'+vm.keywords+'</strong>'));

            }else if(data.hospital.search(new RegExp(vm.keywords,'i'))!=-1){

                data.search_content = $sce.trustAsHtml('医院：'+data.hospital.replace(new RegExp(vm.keywords,'i'),'<strong>'+vm.keywords+'</strong>'));

            }else if(data.administrative.search(new RegExp(vm.keywords,'i'))!=-1){

                data.search_content = $sce.trustAsHtml('科室：'+data.administrative.replace(new RegExp(vm.keywords,'i'),'<strong>'+vm.keywords+'</strong>'));

            }else if(data.zhicheng.search(new RegExp(vm.keywords,'i'))!=-1){

                data.search_content = $sce.trustAsHtml('科室：'+data.zhicheng.replace(new RegExp(vm.keywords,'i'),'<strong>'+vm.keywords+'</strong>'));

            }
          }else {
            if(data.question.search(new RegExp(vm.keywords,'i'))!=-1){

                data.search_content = $sce.trustAsHtml('问题：'+data.question.replace(new RegExp(vm.keywords,'i'),'<strong>'+vm.keywords+'</strong>'));

            }else if(data.description.search(new RegExp(vm.keywords,'i'))!=-1){

                data.search_content = $sce.trustAsHtml('描述：'+data.description.replace(new RegExp(vm.keywords,'i'),'<strong>'+vm.keywords+'</strong>'));

            }else if(data.exts.length>1&&data.ext[0].search(new RegExp(vm.keywords,'i'))!=-1){

                data.search_content = $sce.trustAsHtml('补充：'+data.exts[0].description.replace(new RegExp(vm.keywords,'i'),'<strong>'+vm.keywords+'</strong>'));

            }
          }

          return data;
      }

      //获取搜索结果
      function getResult(keywords,type){
          if(keywords){
              if(type === '0'){
                getCase(keywords,3);
                getUser(keywords,3);
              }else if (type === 'user') {
                getUser(keywords,20);
              }else {
                getCase(keywords,20);
              }
          }
      }

      function getCase(keywords,limit){
        var url = '/api/' + root + '/index/search?type=0&limit='+limit+'&keywords='+keywords;
        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                // vm.case = [];
                res.data.data.forEach(function(item) {
                    vm.case.push(hightLight(item,0));
                });
                vm.is_last = res.data.is_last;
            } else {
                layer.msg(res.msg);
            }
        });
      }
      function getUser(keywords,limit){
        var url = '/api/' + root + '/index/search?type=user&limit='+limit+'&keywords='+keywords;
        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                // vm.user = [];
                res.data.data.forEach(function(item) {
                    vm.user.push(hightLight(item,'user'));
                });
                vm.is_last = res.data.is_last;
            } else {
                layer.msg(res.msg);
            }
        });
      }

      function goMore(keywords,type){
        change(type);
        search(keywords);
      }
      /**
       * 获取更多数据
       * @param  {[String]} keywords [关键词]
       */
      function getMore(keywords,type) {
        if(keywords){
            if (type === 'user') {
              moreUser(keywords,20);
              vm.case = [];
            }else {
              moreCase(keywords,20);
              vm.user = [];
            }
        }
      }

      function moreCase(keywords,limit){
        vm.page = vm.page + 1;
        var  url = '/api/' + root + '/index/search?type=0&limit='+limit+'&keywords='+keywords+'&page=' + vm.page;
        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                vm.is_last = res.data.is_last;
                if (res.data.data.length == 0) {
                    layer.msg('已经没有数据了呀');
                } else {
                    res.data.data.forEach(function(item) {
                        vm.case.push(hightLight(item,0));
                    });
                }

            } else {
                layer.msg(data.msg);
            }
        })
      }

      function moreUser(keywords,limit){
        vm.page = vm.page + 1;
        var  url = '/api/' + root + '/index/search?type=user&limit='+limit+'&keywords='+keywords+'&page=' + vm.page;
        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                vm.is_last = res.data.is_last;
                if (res.data.data.length == 0) {
                    layer.msg('已经没有数据了呀');
                } else {
                    res.data.data.forEach(function(item) {
                        vm.user.push(hightLight(item,'user'));
                    });
                }

            } else {
                layer.msg(data.msg);
            }
        })
      }

  }

})(window,document);

;
(function(window, document, undefined) {
  /**
   * 邀请
   */
    invitationCtrl.$inject = ['ajax', '$stateParams'];
    angular.module('app').controller('invitationCtrl', invitationCtrl);

    function invitationCtrl(ajax, $stateParams) {
        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }
        var vm = this;
        var url = '/api/' + root + '/user/index';

        vm.showShare = showShare;

        if ($stateParams.id) {
            url = url + '?id=' + $stateParams.id
        }

        ajax.get(url).success(function(res) {
            vm.data = res.data.userinfo;
            //微信分享
            var config = {
                title: '我是' + vm.data.name + '我为「医看」代言', // 分享标题
                desc: '免费快速的医学影像阅片平台，活跃高效的影像医生交流社区',
                link: origin + '/#/invitation?id=' + vm.data.id, // 分享链接
                imgUrl: 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg', // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    MtaH5.clickStat('share');
                },
                fail: function(res) {
                    alert('error');
                }
            };
            var config2 = {
                title: vm.data.name + '邀请您来「医看」影像医生交流社区，每天都有海量现金送出！', // 分享标题
                link: origin + '/#/invitation?id' + vm.data.id, // 分享链接
                imgUrl: 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg', // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    MtaH5.clickStat('share');
                },
                fail: function(res) {
                    alert('error');
                }
            }
            wx.ready(function() {
                wx.onMenuShareTimeline(config2);
                wx.onMenuShareAppMessage(config);
            });
        })

        function showShare() {
            if ($('.show-share').hasClass('hide')) {
                $('.show-share').removeClass('hide');
            } else {
                $('.show-share').addClass('hide');
            }
        }

    }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 活动邀请
   */
  activeInviteCtrl.$inject = ['$stateParams'];
  angular.module('app').controller('activeInviteCtrl',activeInviteCtrl);

  function activeInviteCtrl($stateParams) {
    var vm = this;
    vm.data = {
      id:'',
      uid:''
    }
    vm.data.id = $stateParams.id;
    vm.data.uid = $stateParams.uid;
    console.log(vm.data);
  }
})(window,document);

;
(function(window, document, undefined) {

    /**
   * 我的邀请
   */
    myInvitationCtrl.$inject = ['$scope', 'mydata', 'ajax'];
    angular.module('app').controller('myInvitationCtrl', myInvitationCtrl);

    function myInvitationCtrl($scope, mydata, ajax) {
        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }
        var that = this;

        that.isShow = false;

        if (mydata.data.status == 0) {
            var url = '/api/' + root + '/user/myinvite?member_id=' + mydata.data.data.userinfo.id;
            ajax.get(url).success(function(res) {
                that.data = res.data;

                //微信分享
                var config = {
                    title: '我是' + that.data.name + '我为「医看」代言', // 分享标题
                    desc: '免费快速的医学影像阅片平台，活跃高效的影像医生交流社区',
                    link: origin + '/#/invitation?id=' + that.data.id, // 分享链接
                    imgUrl: 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg', // 分享图标
                    success: function(res) {
                        MtaH5.clickStat('share');
                        // 用户确认分享后执行的回调函数
                    },
                    fail: function(res) {
                        alert('error');
                    }
                };
                var config2 = {
                    title: that.data.name + '邀请您来「医看」影像医生交流社区，每天都有海量现金送出！', // 分享标题
                    link: origin + '/#/invitation?id=' + that.data.id, // 分享链接
                    imgUrl: 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg', // 分享图标
                    success: function(res) {
                        MtaH5.clickStat('share');
                        // 用户确认分享后执行的回调函数
                    },
                    fail: function(res) {
                        alert('error');
                    }
                }
                wx.ready(function() {
                    wx.onMenuShareTimeline(config2);
                    wx.onMenuShareAppMessage(config);
                });
            })
        }
        that.showShare = function() {
            if ($('.show-share').hasClass('hide')) {
                $('.show-share').removeClass('hide');
            } else {
                $('.show-share').addClass('hide');
            }
        }
        that.isEmptyObject = isEmptyObject;
        that.showInvite = showInvite;

        function showInvite() {
            that.isShow=!that.isShow;
        }

        function isEmptyObject(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        }

    }
})(window, document);

;
(function(window, document, undefined) {
    /**
     * 我的被采纳列表
     */
    myacceptedCtrl.$inject = ['$rootScope', 'ajax'];
    angular
        .module('app')
        .controller('myacceptedCtrl', myacceptedCtrl);

    function myacceptedCtrl($rootScope, ajax) {
        var vm =this;
        var url = '/api/' + root + '/user/myaccepted';

        vm.page = 1;
        vm.getMore = getMore;

        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                vm.data = res.data;
            } else {
                layer.msg(res);
            }

            ajax.get('/api/' + root + '/user/concern').success(function(res) {
                $rootScope.userInfo.newInfo = res.data;
            });

        });

        function getMore() {
            vm.page = vm.page + 1;
            var url = '/api/' + root + '/user/myaccepted?page=' + vm.page;
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.data.forEach(function(item) {
                            vm.data.data.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }
})(window, document);

;(function(window, document, undefined) {

  /**
   * k币兑换
   */
  chargeCtrl.$inject = ['ajax', 'time'];
  angular.module('app').controller('chargeCtrl', chargeCtrl);

  function chargeCtrl(ajax, time) {
    try {
      document.getElementById('mta').onclick();
    } catch (e) {
      console.log(e);
    }
    var vm = this;
    var subFlag = true;
    var url = '/api/' + root + '/user/kbrecord';
    var url2 = '/api/' + root + '/user/canconvertbag';
    var url3 = '/api/' + root + '/operation/convertmoney';

    vm.page = 1;
    vm.getMore = getMore;
    vm.submit = submit;
    vm.canCharge = false;

    initSub(); //初始化表单
    canCharge();//判断单双周

    ajax.get(url).success(function(res) {
      if (res.status == 0) {
        vm.data = res.data.lists;
      } else {
        layer.msg(res.msg);
      }
    });

    ajax.get(url2).success(function(res) {
      if (res.status == 0) {
        vm.count = res.data;
      } else {
        layer.msg(res.msg);
      }
    });

    /**
     * getMore 加载更多k币兑换信息
     */
    function getMore() {
      vm.page = vm.page + 1;
      var url = '/api/' + root + '/user/kbrecord?page=' + vm.page;
      ajax.get(url).success(function(data) {
        if (data.status == 0) {
          if (data.data.lists.length == 0) {
            layer.msg('已经没有数据了');
          } else {
            data.data.lists.forEach(function(item) {
              vm.data.push(item);
            });
          }
        } else {
          layer.msg(data.msg);
        }
      })
    }

    // 初始化表单数据
    function initSub() {
      vm.convertmoney = {
        bag_num: ''
      }
    }
    // 判断能否兑换k币,规定单数周可以兑换
    function canCharge() {
      var week = time.getYearWeek();
      if (week % 2) {
        vm.canCharge = true;
      } else {
        vm.canCharge = false;
      }
    }

    /**
     * 提交k币兑换请求
     */
    function submit() {
      if (subFlag) {
        subFlag = false;
        if (vm.convertmoney.bag_num) {
          ajax.post(url3, $.param(vm.convertmoney)).success(function(res) {
            if (res.status == 0) {
              initSub();
              layer.msg(res.msg);
              subFlag = true;
              location.reload();
            } else if (!res.status) {
              initSub();
              layer.msg(res.msg);
              subFlag = true;
            } else {
              initSub();
              layer.msg(res.msg);
              subFlag = true;
            }
          })
        } else {
          layer.msg('请输入兑换数量');
          subFlag = true;
        }
      }
    }

  }
})(window, document);

;
(function(window, document, undefined) {
  /**
   * 我的关注
   */
    myFocusCtrl.$inject = ['$stateParams', 'ajax'];
    angular.module('app').controller('myFocusCtrl', myFocusCtrl);

    function myFocusCtrl($stateParams, ajax) {
        var url = '/api/' + root + '/user/social/' + $stateParams.uid + '?type=attention';
        var vm = this;

        vm.page = 1;
        vm.getMore = getMore;

        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                vm.data = res.data;
            } else {
                layer.msg(res.msg);
            }

        });

        function getMore() {
            vm.page = vm.page + 1;
            var url2 = url + '&page=' + vm.page;
            ajax.get(url2).success(function(res) {
                if (res.status == 0) {
                    if (res.data.lists.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.lists.forEach(function(item) {
                            vm.data.lists.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }

})(window, document);

;
(function(window, document, undefined) {
  /**
   * 个人中心
   */
  app.controller('myInfoCtrl', ['ajax', function(ajax) {
    /*var url = '/api/' + root + '/user/index';
       indexData.getData(url).success(function(res) {
           if (res.status == 0) {
               $scope.data = res.data;
               console.log(res);
           } else {
               layer.msg(res);
           }

       });*/
    try {
      document.getElementById('mta').onclick();
    } catch (e) {
      console.log(e);
    }
    var vm = this;

    vm.edit = edit;

    function edit() {
      var url = '/api/' + root + '/operation/changeprice/';
      layer.open({
        title: ' ',
        content: '<input type="number"/ class="layer-input-number" id="price" placeholder="0～5000（其中单位为元）">',
        btn: [
          '确认', '取消'
        ],
        yes: function(index, layero) {
          var price = (document.getElementById('price').value || 0)*100;
          url = url+price;
          if(price>=0){
            ajax.put(url).success(function(res){
              layer.msg(res.msg);
              if(res.status === 0) {
                location.reload();
              }
            })
          }else {
            layer.msg('价格请在0~5000元之间');
          }
          layer.close(index);
        },
        btn2: function(index, layero) {
          //按钮【按钮二】的回调

          //return false 开启该代码可禁止点击该按钮关闭
        }
      });

    }
  }]);
})(window, document);

;(function(window, document, undefined) {

    otherInfoCtrl.$inject = ['$stateParams', 'ajax'];
    angular.module('app').controller('otherInfoCtrl', otherInfoCtrl);

    function otherInfoCtrl($stateParams, ajax) {
        var id = $stateParams.uid;
        var url = '/api/' + root + '/user/index?id=' + id;
        var vm = this;

        vm.change = change;
        vm.type = 1;
        vm.page = 1;
        vm.getMore = getMore;

        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                vm.data = res.data;
                //微信分享
                var config = {
                    title: '欢迎对TA进行一对一问诊', // 分享标题
                    desc: '邀您参观'+vm.data.userinfo.name+'医生的个人工作台，足不出户也能一对一看诊了！',
                    link: origin + '/#/otherInfo/' + vm.data.userinfo.id, // 分享链接
                    imgUrl: vm.data.userinfo.headimg, // 分享图标
                    success: function(res) {
                        // 用户确认分享后执行的回调函数
                        MtaH5.clickStat('share');
                    },
                    fail: function(res) {
                        alert('error');
                    }
                };
                var config2 = {
                    title:  '邀您参观'+vm.data.userinfo.name+'医生的个人工作台，足不出户也能一对一看诊了！', // 分享标题
                    link: origin + '/#/otherInfo/' + vm.data.userinfo.id, // 分享链接
                    imgUrl: vm.data.userinfo.headimg, // 分享图标
                    success: function(res) {
                        // 用户确认分享后执行的回调函数
                        MtaH5.clickStat('share');
                    },
                    fail: function(res) {
                        alert('error');
                    }
                }
                wx.ready(function() {
                    wx.onMenuShareTimeline(config2);
                    wx.onMenuShareAppMessage(config);
                });
            } else {
                layer.msg(res);
            }

        });

        function getMore() {
            vm.page = vm.page + 1;
            var url = '/api/' + root + '/user/index?id=' + id + '&page=' + vm.page;
            ajax.get(url).success(function(data) {
                if (data.status == 0) {
                    if (data.data.questions.lists.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        data.data.questions.lists.forEach(function(item) {
                            vm.data.questions.lists.push(item);
                        });
                    }

                } else {
                    layer.msg(data.msg);
                }
            })
        }

        function change(type) {
            vm.type = type
        }
    }

})(window, document);

;(function(window, document, undefined) {
  'use strict';
  /**
   * 活动邀请
   */
  otherInfoInviteCtrl.$inject = ['$stateParams', 'ajax'];
  angular.module('app').controller('otherInfoInviteCtrl',otherInfoInviteCtrl);

  function otherInfoInviteCtrl($stateParams,ajax) {
    var vm = this;
    var url = '/api/' + root + '/user/index?id=' + $stateParams.uid;

    vm.uid = '';
    vm.uid = $stateParams.uid;

    ajax.get(url).success(function(res) {
        vm.data = res.data.userinfo;
        //微信分享
        var config = {
            title: '欢迎对TA进行一对一问诊', // 分享标题
            desc: '邀您参观'+vm.data.name+'医生的个人工作台，足不出户也能一对一看诊了！',
            link: origin + '/#/otherInfo/' + vm.data.id, // 分享链接
            imgUrl: vm.data.headimg, // 分享图标
            success: function(res) {
                // 用户确认分享后执行的回调函数
                MtaH5.clickStat('share');
            },
            fail: function(res) {
                alert('error');
            }
        };
        var config2 = {
            title:  '邀您参观'+vm.data.name+'医生的个人工作台，足不出户也能一对一看诊了！', // 分享标题
            link: origin + '/#/otherInfo/' + vm.data.id, // 分享链接
            imgUrl: vm.data.headimg, // 分享图标
            success: function(res) {
                // 用户确认分享后执行的回调函数
                MtaH5.clickStat('share');
            },
            fail: function(res) {
                alert('error');
            }
        }
        wx.ready(function() {
            wx.onMenuShareTimeline(config2);
            wx.onMenuShareAppMessage(config);
        });
    })
  }
})(window,document);

;
(function(window, document, undefined) {
  'use strict';
  /**
   * 一对一付费和付费病例列表
   */
  otherInfoListCtrl.$inject = ['$stateParams', 'ajax'];
  angular.module('app').controller('otherInfoListCtrl', otherInfoListCtrl);

  function otherInfoListCtrl($stateParams, ajax) {
    var vm = this;
    var page = 1;
    var url = {
      payissue: '/api/' + root + '/user/mypayissue?type=pay_issue_receive&status="0,3"&user_id=' + $stateParams.id,
      paycases: '/api/' + root + '/user/mypaytoseequestion?user_id=' + $stateParams.id,
      myquestion: '/api/' + root + '/user/myquestion?user_id=' + $stateParams.id,
      myanswer: '/api/' + root + '/user/myanswer?user_id=' + $stateParams.id,
      myaccepted: '/api/' + root + '/user/myaccepted?user_id=' + $stateParams.id
    };
    vm.title = {
      payissue: '公开一对一付费提问',
      paycases: '付费病例',
      myquestion: '普通提问',
      myanswer: '普通回答',
      myaccepted: '被采纳的回答'
    };
    vm.type = $stateParams.type;
    vm.limit = $stateParams.limit;
    vm.getMore = getMore;

    ajax.get(url[vm.type]).success(function(res) {
      if (res.status == 0) {
        vm.data = res.data
        console.log(vm.data);
      }
    });

    function getMore() {
      page++;
      var url2 = url[vm.type] + '&page=' + page;
      ajax.get(url2).success(function(res) {
        var nowData = vm.type === 'payissue'? vm.data : vm.data.data;
        var addData = vm.type === 'payissue'? res.data: res.data.data;
        if (res.status === 0) {
          if (addData.length == 0) {
            layer.msg('已经没有数据了');
          } else {
            if(vm.type === 'payissue') {
              vm.data = nowData.concat(addData);;
            } else {
              vm.data.data = nowData.concat(addData);
            }
          }
        } else {
          layer.msg(res.msg);
        }
      });
    }

  }
})(window, document);

;
(function(window, document, undefined) {
    /**
     * 红包数量list
     * @type {[type]}
     */
    redbagrecordCtrl.$inject = ['$stateParams', 'ajax'];
    angular
        .module('app')
        .controller('redbagrecordCtrl', redbagrecordCtrl);

    function redbagrecordCtrl($stateParams, ajax) {

        var vm = this;
        var url = '/api/' + root + '/user/redbagrecord';

        vm.page = 1;
        vm.getMore = getMore;

        if ($stateParams.type == 1) {
            document.getElementById('mta1').onclick();
        } else {
            document.getElementById('mta2').onclick();
        }
        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                vm.data = res.data;
                vm.data.type = $stateParams.type;
            } else {
                layer.msg(res);
            }

        });

        function getMore() {
            vm.page = vm.page + 1;
            var url = '/api/' + root + '/user/redbagrecord?page=' + vm.page;
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.lists.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.lists.forEach(function(item) {
                            vm.data.lists.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }

    }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 我的粉丝
   */
    myFansCtrl.$inject = ['$stateParams', 'ajax'];
    app.controller('myFansCtrl', myFansCtrl);

    function myFansCtrl($stateParams, ajax) {
        var url = '/api/' + root + '/user/social/' + $stateParams.uid + '?type=fans';
        var vm = this;

        vm.page = 1;
        vm.getMore = getMore;

        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                vm.data = res.data;
            } else {
                layer.msg(res.msg);
            }

        });

        function getMore() {
            vm.page = vm.page + 1;
            var url2 = url + '&page=' + vm.page;
            ajax.get(url2).success(function(res) {
                if (res.status == 0) {
                    if (res.data.lists.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.lists.forEach(function(item) {
                            vm.data.lists.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }
})(window, document);

;(function(window, document, undefined) {
    /**
     * 付费问答列表
     *
     */
    app.controller('myPayCtrl', ['$scope', '$state', '$stateParams', 'indexData', 'postData', function($scope, $state, $stateParams, indexData, postData) {
        var url = '/api/' + root + '/user/mypayissue?type=' + $stateParams.type + '&status=1',
            url2 = '/api/' + root + '/user/mypayissue?type=' + $stateParams.type + '&status="0,2,3"';

        getData(url);

        $scope.page     = 1;
        $scope.type     = $stateParams.type;
        $scope.isActive = false;
        $scope.pay      = pay;

        $scope.getMore = function(isActive) {
            $scope.page = $scope.page + 1;
            var url3 = null;
            if (isActive) {
                url3 = url2 + '&page=' + $scope.page;
            } else {
                url3 = url + '&page=' + $scope.page;
            }
            indexData.getData(url3).success(function(data) {
                if (data.status == 0) {
                    if (data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        data.data.forEach(function(item) {
                            $scope.data.push(item);
                        });
                    }

                } else {
                    layer.msg(data.msg);
                }
            })
        }

        $scope.change = function(type) {
            if (type == 1) {
                $scope.isActive = false;
                getData(url);
            } else {
                $scope.isActive = true;
                getData(url2);
            }
        }

        function getData(url) {
            indexData.getData(url).success(function(res) {
                $scope.data = res.data;
            });
        }

        function pay(tid) {

            var payData = {
                trade_id: tid
            }
            var payUrl = '/api/' + root + '/paycore/onetoone';
            postData.setData(payUrl, $.param(payData)).success(function(res) {
                if (res.status == 0) {
                    var jsApiParameters = JSON.parse(res.data.bridge_json_string);
                    callpay();

                    function jsApiCall() {
                        WeixinJSBridge.invoke('getBrandWCPayRequest', jsApiParameters, function(res) {
                            WeixinJSBridge.log(res.err_msg);
                            if (res.err_desc) {
                                layer.msg(res.err_code + res.err_desc + res.err_msg);
                            } else {
                                flag = true;
                                layer.msg('发布成功');
                                $timeout(function() {
                                    $state.go('myInfo');
                                }, 500);
                            }

                        });
                    }

                    function callpay() {
                        if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                            } else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                            }
                        } else {
                            jsApiCall();
                        }
                    }
                } else {
                    layer.msg(res.msg);
                }
            })
        }

    }]);
})(window, document);

;(function(window, document, undefined) {

  /**
   * 付费问题提交
   */
   askCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'uploadImg', 'Upload', 'indexData', 'postData', 'storePay', 'photoswipe'];
   angular.module('app').controller('askCtrl',askCtrl);

   function askCtrl($scope, $state, $stateParams, $timeout, uploadImg, Upload, indexData, postData, storePay, photoswipe) {
       $scope.tags = [];
       indexData.getData('/api/' + root + '/index/tags').success(function(res) {
           $scope.tags = res.data;
       });
       indexData.getData('/api/' + root + '/user/index?id=' + $stateParams.uid).success(function(res) {
           $scope.info = res.data.userinfo;

       })
       var oldData = storePay.getData();

       var url = '/api/' + root + '/operation/send';
       $scope.data = {
           question: '',
           description: '',
           tag_id: [],
           k_price: 0,
           pics: [],
           pay_issue_isopen: 0,
           type: 6
       };
       $scope.add = [{
           type: 0,
           title: '不公开'
       }, {
           type: 1,
           title: '公开'
       }]
       //判断是否有数据
       if(!$.isEmptyObject(oldData)&&$stateParams.type==1){
           $scope.data = oldData
       }

       //photpswipe
       $scope.openPhoto = photoswipe.openPhotoSwipe;

       var flag = true;
       $scope.submit = function(uid,price) {
           if (flag) {
               flag = false;
               if ($scope.data.pics.length > 0) {
                   submitFuc(uid,price);
               } else {
                   layer.confirm('您还未传图片，确定提交?', {
                       icon: 3,
                       title: '提示'
                   }, function(index) {
                       submitFuc(uid,price);
                       layer.close(index);
                   });
                   flag = true;
               }

           } else {
               layer.msg('正在提交，请不要重复点击');
           }

       }

       function submitFuc(uid,price) {
           postData.setData(url, $.param($scope.data)).success(function(res) {
               if (res.status == 0) {
                   var payData = {
                       question_id: res.data.question_id,
                       price: price,
                       to_uid: uid
                   }
                   var payUrl = '/api/' + root + '/paycore/onetoone';
                   postData.setData(payUrl, $.param(payData)).success(function(res) {
                       if (res.status == 0) {
                           var jsApiParameters = JSON.parse(res.data.bridge_json_string);
                           callpay();

                           function jsApiCall() {
                               WeixinJSBridge.invoke(
                                   'getBrandWCPayRequest',
                                   jsApiParameters,
                                   function(res) {
                                       WeixinJSBridge.log(res.err_msg);
                                       if (res.err_desc) {
                                           layer.msg(res.err_code + res.err_desc + res.err_msg);
                                       } else {
                                           flag = true;
                                           layer.msg('发布成功');
                                           $timeout(function() {
                                               $state.go('myInfo');
                                           }, 500);
                                       }

                                   }
                               );
                           }

                           function callpay() {
                               if (typeof WeixinJSBridge == "undefined") {
                                   if (document.addEventListener) {
                                       document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                                   } else if (document.attachEvent) {
                                       document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                                       document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                                   }
                               } else {
                                   jsApiCall();
                               }
                           }
                       } else {
                           layer.msg(res.msg);
                       }
                   })
               } else {
                   layer.msg(res.msg);
                   flag = true;
               }

           });
       }


       // 判断是否选中状态
       $scope.isChecked = function(id) {
               return $scope.data.tag_id.indexOf(id) >= 0;
           }
           //改变标签状态
       $scope.changeBq1 = function(e, id) {

           if (e.target.tagName == 'INPUT') {
               var checkbox = e.target;
               var checked = checkbox.checked;
               if (checked) {
                   $scope.data.tag_id.push(id);
               } else {
                   var idx = $scope.data.tag_id.indexOf(id);
                   $scope.data.tag_id.splice(idx, 1);
               }

           } else {
               return;
           }
       }

       if (isWeiXin) {
           $scope.uploadFiles = uploadImg.wxUpload($scope);
       } else {
           // $scope.uploadFiles = uploadFiles;
           $scope.uploadFiles = uploadImg.upload($scope, Upload);
       }

       //删除图片
       $scope.deleteFiles = function(picname) {
           var index = $scope.data.pics.indexOf(picname);
           $scope.data.pics.splice(index, 1);
       }

   }
})(window,document);

;(function(window, document, undefined) {

    /**
     * 付费问答
     */
    payCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'mydata', '$timeout', 'uploadImg', 'Upload', 'ajax', 'storePay', 'photoswipe', 'myShang'];
    angular.module('app').controller('payCtrl', payCtrl);

    function payCtrl($rootScope, $scope, $stateParams, $state, mydata, $timeout, uploadImg, Upload, ajax, storePay, photoswipe, myShang) {
        ajax.get('/api/' + root + '/user/concern').success(function(res) {
            $rootScope.userInfo.newInfo = res.data;
        });
        if (!$.isEmptyObject(mydata.data.data)) {

            $scope.data   = mydata.data.data;
            $scope.count  = 2;
            $scope.status = $stateParams.status;

            $scope.data.replys.forEach(function(item) {
                if (item.type == 1 && $scope.data.role_id == item.answer_role_id) {
                    $scope.count--;
                }
            })
            $scope.targetId = $stateParams.item;
            // 图片预加载

            $scope.preloadImgs = [];
            if ($scope.data.pic_log.length > 0) {
                $scope.data.pic_log.forEach(function(item) {
                    var img = new Image();
                    img.src = item.site;
                    $scope.preloadImgs.push(img);
                });
            }
            if ($scope.data.replys.length > 0) {
                $scope.data.replys.forEach(function(item) {
                    if (item.pic.length > 0) {
                        item.pic.forEach(function(pic) {
                            var img = new Image();
                            img.src = pic.site;
                            $scope.preloadImgs.push(img);
                        })
                    }
                })
            }

            //去除点赞中的重复数据
            $scope.data.reward_user = uniqArr($scope.data.reward_user);

            $scope.data.replys.forEach(function(item) {
                item.reward_user = uniqArr(item.reward_user);
            })
            $scope.setShang = function(num, person) {
                myShang.setInfo(num, person);
                $state.go('showShang');
            }

            initAns(); //初始化表单

            $scope.utils = {
                submit: submit,
                uploadFiles: uploadImg.upload($scope, Upload),
                deleteFiles: deleteFiles,
                reply: reply,
                refuse: refuse,
                askOther: askOther
            }

            $scope.gopay = function(id, qid, aid, is_anonymous) {
                var goUrl = '/?#/wepay/' + id + '?qid=' + qid + '&is_anonymous=' + is_anonymous;
                if (aid) {
                    goUrl += '&aid=' + aid;
                }

                location.href = goUrl;
            }

            //判断微信浏览器决定上传方式
            if (isWeiXin) {
                $scope.utils.uploadFiles = uploadImg.wxUpload($scope);
                // $scope.utils.uploadFiles = wxUpload;
            }

            //photpswipe

            $scope.openPhoto = photoswipe.openPhotoSwipe;

            // 加载更多
            $scope.page = 1;

            $scope.getMore = function() {
                $scope.page = $scope.page + 1;
                var url = '/api/' + root + '/index/detail/' + $stateParams.uid + '?page=' + $scope.page;
                ajax.get(url).success(function(data) {
                    if (data.status == 0) {
                        if (data.data.replys.length == 0) {
                            layer.msg('已经没有数据了');
                        } else {
                            data.data.replys.forEach(function(item) {
                                if (item.pic.length > 0) {
                                    item.pic.forEach(function(pic) {
                                        var img = new Image();
                                        img.src = pic.site;
                                        $scope.preloadImgs.push(img);
                                    })
                                }
                                $scope.data.replys.push(item);
                            });
                        }

                    } else {
                        layer.msg(data.msg);
                    }
                })
            }

            //初始化回答表单
            function initAns() {

                $scope.ans = {
                    question_id: '',
                    content: '',
                    pics: [],
                    answer_id: '',
                    is_anonymous: 0,
                    trade_id: $stateParams.trade_id
                };
            }

            //获取数据
            function getData(url) {
                ajax.get(url).success(function(data) {
                    $scope.data = data.data;
                });
            }

            //提交回答
            function submit() {
                $scope.ans.question_id = arguments[0];
                $scope.ans.answer_id = arguments[1];
                var data = $scope.ans,
                    url = '/api/' + root + '/operation/reply';
                ajax.post(url, $.param(data)).success(function(res) {
                    if (res.status == 0) {
                        layer.msg(res.msg);

                        //清空表单
                        initAns();
                        // 重置page
                        $scope.page = 1;

                        // 更新数据
                        getData('/api/' + root + '/index/detail/' + $stateParams.uid);

                        $('#reply').removeClass('reply-hide');
                    } else {
                        layer.msg(res.msg);
                    }
                })
            }

            // 拒单
            function refuse() {
                var url = '/api/' + root + '/trade/refuseorder/' + $stateParams.trade_id;
                ajax.put(url).success(function(res) {
                    if (res.status == 0) {
                        $state.go('myInfo');
                    }
                    layer.msg(res.msg);
                })

            }

            //删除图片
            function deleteFiles(picname) {
                var index = $scope.ans.pics.indexOf(picname);
                $scope.ans.pics.splice(index, 1);
            }

            //回复显示
            var showID;

            function reply(event, id) {
                var target = $(event.currentTarget.parentNode.nextElementSibling),
                    that = $(event.currentTarget);
                var text = id == $scope.data.role_id
                    ? '追问'
                    : '回答';

                if ($rootScope.isFocus == 1) {
                    if (target.hasClass('reply-hide')) {
                        $('.ans-input').addClass('reply-hide');
                        $('.btn-reply').text(text);
                        target.removeClass('reply-hide');
                        that.text('取消');
                        //清空表单
                        initAns();
                    } else {
                        target.addClass('reply-hide');
                        that.text(text);
                        $('#reply').removeClass('reply-hide');
                        initAns();
                    }
                } else {
                    layer.msg('您还未关注[医看]平台，无法回复');
                }

            }

            function askOther() {
                var pics = [];
                if ($scope.data.pic_log.length > 0) {
                    $scope.data.pic_log.forEach(function(item) {
                        var site = item.site.slice(29);//如果变为https就变30
                        pics.push(site);
                    })
                }
                var postData = {
                    question: $scope.data.question,
                    description: $scope.data.description,
                    tag_id: $scope.data.tag_id.split(','),
                    k_price: 0,
                    pics: pics,
                    pay_issue_isopen: $scope.data.pay_issue_isopen,
                    type: 6
                }
                storePay.setData(postData);
                $state.go('index.artistic', {type: 1})
            }

            //微信分享
            var config = {
                title: '医看——医生快速问答平台', // 分享标题
                desc: '问题：' + $scope.data.question.replace(/\n/g, '') + ' ' + '描述：' + $scope.data.description.replace(/\n/g, ''),
                link: origin + '/#/pDetail/' + $stateParams.uid, // 分享链接
                imgUrl: $scope.data.pic_log.length == 0
                    ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg'
                    : $scope.data.pic_log[0].site, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                        console.log(res);
                    })
                },
                fail: function(res) {
                    alert('error');
                }
            }
            var config2 = {
                title: '问题：' + $scope.data.question.replace(/\n/g, '') + ' ' + '描述：' + $scope.data.description.replace(/\n/g, ''),
                link: origin + '/#/pDetail/' + $stateParams.uid, // 分享链接
                imgUrl: $scope.data.pic_log.length == 0
                    ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg'
                    : $scope.data.pic_log[0].site, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    ajax.put('/api/' + root + '/operation/share/' + $scope.data.question_id).success(function(res) {
                        console.log(res);
                    })
                },
                fail: function(res) {
                    alert('error');
                }
            }
            wx.ready(function() {
                wx.onMenuShareTimeline(config2);
                wx.onMenuShareAppMessage(config);
                wx.onMenuShareQQ(config);
            });
        } else {
            $state.go('index.questions');
        }
    }
})(window, document);

;(function(window, document, undefined) {

    payCaseCtrl.$inject = ['$state', 'ajax'];
    angular.module('app').controller('payCaseCtrl', payCaseCtrl);

    function payCaseCtrl($state, ajax) {
        var url = '/api/' + root + '/user/mypaytosee';
        var url2 = '/api/' + root + '/user/myinviteaytosee';
        var vm = this;

        vm.getMore = getMore;
        vm.goDetail = goDetail;
        vm.change = change;
        vm.page = 1;
        vm.type = 'my';
        vm.tabs = [
            {
                title: '我购买的',
                type: 'my',
                float: 'fl',
                url: url
            }, {
                title: '好友赠送',
                type: 'giving',
                float: 'fr',
                url: url2
            }
        ];

        getData(url);

        function getData(url) {
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    vm.data = res.data.data;
                } else if (res.status == -5) {
                    layer.msg(res.data);
                } else {
                    layer.msg(res.msg);
                }
            });
        }

        function getMore() {
            vm.page = vm.page + 1;
            var url = url + '?page=' + vm.page;

            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.data.forEach(function(item) {
                            vm.data.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }

        function goDetail(qid, uid, myid, isOpen, qtype) {
            if (isOpen == '1') {
                $state.go('pDetail', {uid: qid})
            } else if (uid == myid) {
                $state.go('myDetail', {uid: qid})
            } else if (qtype == 7) {
                $state.go('detail2', {uid: qid})
            } else {
                $state.go('detail', {uid: qid})
            }
        }

        function change(type,url) {
            vm.type = type;
            getData(url);
        }

    }
})(window, document);

;
(function(window, document, undefined) {
  /**
   * 付费病例分享榜
   */
    payCaseRankCtrl.$inject = ['ajax', 'time'];
    angular.module('app').controller('payCaseRankCtrl', payCaseRankCtrl);

    function payCaseRankCtrl(ajax, time) {
        var vm       = this;
        var date     = new Date();
        var firstDay = time.getCurrentMonthFirst(date.getMonth()).getTime().toString().slice(0, 10);
        var lastDay  = time.getCurrentMonthLast(date.getMonth()).getTime().toString().slice(0, 10);
        var url      = '/api/frontend/index/paytoseeinvitelist';
        var url2     = url + '?start_time=' + firstDay + '&end_time=' + lastDay;

        vm.myIndex     = 0;
        vm.type        = 1;
        vm.isSelect    = false;
        vm.month       = [3,4,5];
        vm.now         = date.getMonth() + 1;
        vm.showSelect  = showSelect;
        vm.changeMonth = changeMonth;
        vm.changeType  = changeType;

        getData(url2);

        function getData(url) {
            ajax.get(url).success(function(res) {
                vm.data = res.data;
                vm.data.list.forEach(function(item, index) {
                    if (item.member.id == vm.data.my_result.id) {
                        vm.myIndex = index + 1;
                    }
                })
            })
        }

        function showSelect() {
            vm.isSelect = !vm.isSelect;
        }
        function changeMonth(month) {
            vm.now      = month;
            vm.isSelect = false;
            initDate(month);
        }

        function initDate(month) {
            var currentMonth = month - 1;
            firstDay         = time.getCurrentMonthFirst(currentMonth).getTime().toString().slice(0, 10);
            lastDay          = time.getCurrentMonthLast(currentMonth).getTime().toString().slice(0, 10);
            url2             = url + '?start_time=' + firstDay + '&end_time=' + lastDay;
            getData(url2);
        }
        function changeType(type) {
            vm.type = type;
            if (type === 1) {
                getData(url2);
            } else {
                getData(url);
                vm.isSelect = false;
            }
        }
    }
})(window, document);

;(function(window, document, undefined) {

  /**
   * 打赏功能
   */

  wepayCtrl.$inject = ['$scope', '$state', '$stateParams', '$window', 'indexData', 'postData'];
  angular.module('app').controller('wepayCtrl', wepayCtrl);

  function wepayCtrl($scope, $state, $stateParams, $window, indexData, postData) {
      $scope.isHide = true;
      $scope.isHide2 = true;
      $scope.moneyList = ['0.2', '0.5', '1.0', '2.0', '6.6', '8.8'];
      $scope.kmoneyList = ['2.0', '6.0', '8.0', '10', '20', '50'];
      $scope.is_anonymous = $stateParams.is_anonymous;
      $scope.type = $stateParams.type;
      $scope.otherMoney = '';

      var url = '/api/' + root + '/user/index?id=' + $stateParams.id;
      indexData.getData(url).success(function(res) {
          if (res.status == 0) {
              $scope.info = res.data.userinfo;
          } else {
              layer.msg(res);
          }

      });

      $scope.showMore = function() {
          $scope.isHide = false;
      }
      $scope.showMore2 = function() {
          $scope.isHide2 = false;
      }
      $scope.hideMore = function() {
          $scope.isHide = true;
          $scope.isHide2 = true;
      }
      var type = $stateParams.aid ? 3 : 2;
      $scope.pay = function(price) {
          var url = '/api/' + root + '/paycore/reward';
          price = Math.floor(price);
          var data = {
              type: type,
              price: price,
              to_uid: $stateParams.id,
              question_id: $stateParams.qid,
              answer_id: $stateParams.aid
          };

          if (type == 2) {
              data.answer_id = 0;
          } else {
              data.question_id = 0;
          }
          postData.setData(url, $.param(data)).success(function(res) {
              var jsApiParameters = JSON.parse(res.data.bridge_json_string);
              callpay();

              function jsApiCall() {
                  WeixinJSBridge.invoke(
                      'getBrandWCPayRequest',
                      jsApiParameters,
                      function(res) {
                          WeixinJSBridge.log(res.err_msg);
                          if (res.err_desc) {
                              layer.msg(res.err_code + res.err_desc + res.err_msg);
                          } else {
                              /*$state.go('detail', {
                                  uid: $stateParams.qid
                              });*/
                              $window.history.back();
                          }

                      }
                  );
              }

              function callpay() {
                  if (typeof WeixinJSBridge == "undefined") {
                      if (document.addEventListener) {
                          document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                      } else if (document.attachEvent) {
                          document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                          document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                      }
                  } else {
                      jsApiCall();
                  }
              }
          })
      }

      $scope.kpay = function(price) {
          var url = '/api/' + root + '/operation/kreward';
          var data = {
              type: type,
              k_money: price,
              to_uid: $stateParams.id,
              question_id: $stateParams.qid,
              answer_id: $stateParams.aid
          };

          if (type == 2) {
              data.answer_id = 0;
          } else {
              data.question_id = 0;
          }
          layer.confirm('确定支付'+price+'K币查看?', {
              title: ' ',
              btn:'确定'
          }, function(index) {
              postData.setData(url, $.param(data)).success(function(res) {
                  if (res.status == 0) {
                      layer.msg(res.msg)
                          // $state.go('detail', {
                          //     uid: $stateParams.qid
                          // });
                      $window.history.back();
                  } else {
                      layer.msg(res.msg);
                  }
              })
              layer.close(index);
          });
      }


  }
})(window,document);

;
(function(window, document, undefined) {
    /**
   * 累计提现金额
   */
    app.controller('shangAllCtrl', ['$stateParams', 'ajax', function($stateParams, ajax) {
        var vm = this;
        var url = '/api/' + root + '/user/redbagrecord?type=2';

        vm.page = 1;
        vm.getMore = getMore;
        vm.cash_income = $stateParams.money;

        ajax.get(url).success(function(res) {
            vm.data = res.data;
        });

        function getMore() {
            vm.page = vm.page + 1;
            var url = '/api/' + root + '/user/redbagrecord?type=2&page=' + vm.page;
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.lists.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.lists.forEach(function(item) {
                            vm.data.lists.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }]);
})(window, document);

;(function(window, document, undefined) {
  /**
   * 我的账户
   */
   shangChargeCtrl.$inject = ['$scope', '$stateParams', 'indexData', 'postData'];
   angular.module('app').controller('shangChargeCtrl', shangChargeCtrl);

   function shangChargeCtrl($scope, $stateParams, indexData, postData) {

       // var url = '/api/' + root + '/user/index';
       // indexData.getData(url).success(function(res) {
       //     if (res.status == 0) {
       //         $scope.info = res.data.userinfo;
       //     } else {
       //         layer.msg(res);
       //     }

       // });
       try {
           document.getElementById('mta').onclick();
       } catch (e) {
           console.log(e);
       }

       initSub();

       function initSub() {
           $scope.charge = {
               withdraw_money: ''
           }
       }
       var subFlag = true;
       $scope.submit = submit;

       function submit() {
           if (subFlag) {
               var charge = {
                   withdraw_money: $scope.charge.withdraw_money * 100
               }
               subFlag = false;
               var url = '/api/' + root + '/operation/withdraw';
               if ($scope.charge.withdraw_money) {
                   postData.setData(url, $.param(charge))
                       .success(function(res) {
                           if (res.status == 0) {
                               initSub();
                               layer.msg(res.msg);
                               subFlag = true;
                               location.reload();
                           } else if (!res.status) {
                               initSub();
                               layer.msg(res);
                               subFlag = true;
                           } else {
                               initSub();
                               layer.msg(res.msg);
                               subFlag = true;
                           }
                       })
               } else {
                   layer.msg('请输入提现金额');
                   subFlag = true;
               }

           }

       }
   }
})(window,document);

;
(function(window, document, undefined) {
  /**
   * 赞赏支出
   */
    shangOutCtrl.$inject = ['$stateParams', 'ajax'];
    angular.module('app').controller('shangOutCtrl', shangOutCtrl);

    function shangOutCtrl($stateParams, ajax) {
        var vm  = this;
        var url = '/api/' + root + '/trade/payrecord?pay_type=' + $stateParams.pay_type;

        vm.allMoney = $stateParams.money;
        vm.pay_type = $stateParams.pay_type;
        vm.page     = 1;
        vm.getMore  = getMore;

        ajax.get(url).success(function(res) {
            vm.data = res.data.data;
        });

        function getMore() {
            vm.page = vm.page + 1;
            url = url + '&page=' + vm.page;
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.data.forEach(function(item) {
                            vm.data.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }
})(window, document);

;
(function(window, document, undefined) {
  /**
   * 赞赏列表
   */
    showShangCtrl.$inject = ['myShang'];
    angular.module('app').controller('showShangCtrl', showShangCtrl);

    function showShangCtrl(myShang) {
        var vm = this;
        vm.data = myShang.getInfo();
    }
})(window, document);

;
(function(window, document, undefined) {
  /**
   * 赞赏收入
   */
    shangInCtrl.$inject = ['$stateParams', 'ajax'];
    angular.module('app').controller('shangInCtrl', shangInCtrl);

    function shangInCtrl($stateParams, ajax) {
        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }
        var vm  = this;
        var url = '/api/' + root + '/trade/incomerecord?pay_type=' + $stateParams.pay_type;

        vm.page     = 1;
        vm.allMoney = $stateParams.money;
        vm.pay_type = $stateParams.pay_type;
        vm.getMore  = getMore;

        ajax.get(url).success(function(res) {
            vm.data = res.data.data;
        });

        function getMore() {
            vm.page = vm.page + 1;
            url = url + '&page=' + vm.page;
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.data.forEach(function(item) {
                            vm.data.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }
    }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 发布活动
   */
   addactiveCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'uploadImg', 'ajax', 'Upload', 'photoswipe'];
   angular.module('app').controller('addactiveCtrl', addactiveCtrl);

   function addactiveCtrl($scope, $state, $stateParams, $timeout, uploadImg, ajax, Upload, photoswipe) {

       $scope.tags = [];
       ajax.get('/api/' + root + '/index/tags').success(function(res) {
           $scope.tags = res.data;
       });

       var url = '/api/' + root + '/operation/send';
       $scope.data = {
           question: '',
           description: '',
           tag_id: [],
           k_price: 0,
           pics: [],
           activity_id: $stateParams.activity_id,
           type: 4
       };

       //photpswipe
       $scope.openPhoto = photoswipe.openPhotoSwipe;

       $scope.submit = function() {
           ajax.post(url, $.param($scope.data)).success(function(res) {
               if (res.status == 0) {
                   layer.msg('发布成功');
                   $timeout(function() {
                       $state.go('find.active_list');
                   }, 500);
               } else if (res.status == 1004) {
                   layer.msg(res.msg);
               }
           });
       }


       // 图片上传
       if (isWeiXin) {
           $scope.uploadFiles = uploadImg.wxUpload($scope);
       } else {
           //$scope.uploadFiles = uploadFiles;
           $scope.uploadFiles = uploadImg.upload($scope, Upload);
       }

       // 判断是否选中状态
       $scope.isChecked = function(id) {
               return $scope.data.tag_id.indexOf(id) >= 0;
           }
           //改变标签状态
       $scope.changeBq1 = function(e, id) {

           if (e.target.tagName == 'INPUT') {
               var checkbox = e.target;
               var checked = checkbox.checked;
               if (checked) {
                   $scope.data.tag_id.push(id);
               } else {
                   var idx = $scope.data.tag_id.indexOf(id);
                   $scope.data.tag_id.splice(idx, 1);
               }

           } else {
               return;
           }
       }

       //删除图片
       $scope.deleteFiles = function(picname) {
           var index = $scope.data.pics.indexOf(picname);
           $scope.data.pics.splice(index, 1);
       }

   }
})(window,document);

;
(function(window, document, undefined) {
    /**
   * 发布话题
   */
    addtopicsCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'uploadImg', 'ajax', 'Upload', 'photoswipe'];
    angular.module('app').controller('addtopicsCtrl', addtopicsCtrl);

    function addtopicsCtrl($scope, $state, $stateParams, $timeout, uploadImg, ajax, Upload, photoswipe) {

        var url = '/api/' + root + '/operation/send';

        $scope.tags = [];
        ajax.get('/api/' + root + '/index/tags?type=topic').success(function(res) {
            $scope.tags = res.data;
        });

        $scope.data = {
            question: '',
            description: '',
            tag_id: [],
            k_price: 0,
            pics: [],
            type: 5
        };

        //photpswipe
        $scope.openPhoto = photoswipe.openPhotoSwipe;

        var flag = true;
        $scope.submit = function() {
            if (flag) {
                flag = false;
                if ($scope.data.pics.length > 0) {
                    submitFuc();
                } else {
                    layer.confirm('您还未传图片，确定提交?', {
                        icon: 3,
                        title: ' '
                    }, function(index) {
                        submitFuc();
                        layer.close(index);
                    });
                    flag = true;
                }

            } else {
                layer.msg('正在提交，请不要重复点击');
            }

        }

        function submitFuc() {
            ajax.post(url, $.param($scope.data)).success(function(res) {
                if (res.status == 0) {
                    layer.msg('发布成功');
                    $timeout(function() {
                        $state.go('index.topics');
                    }, 500);
                    flag = true;
                } else if (res.status == 1004) {
                    layer.msg(res.msg);
                    flag = true;
                }
            });
        }

        // 图片上传
        if (isWeiXin) {
            $scope.uploadFiles = uploadImg.wxUpload($scope);
        } else {
            //$scope.uploadFiles = uploadFiles;
            $scope.uploadFiles = uploadImg.upload($scope, Upload);
        }

        // 判断是否选中状态
        $scope.isChecked = function(id) {
            return $scope.data.tag_id.indexOf(id) >= 0;
        }
        //改变标签状态
        $scope.changeBq1 = function(e, id) {

            if (e.target.tagName == 'INPUT') {
                var checkbox = e.target;
                var checked = checkbox.checked;
                if (checked) {
                    $scope.data.tag_id.push(id);
                } else {
                    var idx = $scope.data.tag_id.indexOf(id);
                    $scope.data.tag_id.splice(idx, 1);
                }

            } else {
                return;
            }
        }

        //删除图片
        $scope.deleteFiles = function(picname) {
            var index = $scope.data.pics.indexOf(picname);
            $scope.data.pics.splice(index, 1);
        }

    }
})(window, document);

;
(function(window, document, undefined) {
    /**
   * 提问补充
   */
    appendCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'uploadImg', 'Upload', 'ajax', 'photoswipe'];
    angular.module('app').controller('appendCtrl', appendCtrl);

    function appendCtrl($scope, $state, $stateParams, $timeout, uploadImg, Upload, ajax, photoswipe) {

        var url = '/api/' + root + '/operation/append';
        $scope.type = $stateParams.type;

        $scope.data = {
            question_id: $stateParams.qid,
            description: $stateParams.content || '',
            pics: [],
            type: 0
        };

        $scope.add = [
            {
                type: 0,
                title: '普通'
            }, {
                type: 1,
                title: '随访'
            }, {
                type: 2,
                title: '病理'
            }, {
                type: 3,
                title: '确诊'
            }
        ]

        //photpswipe
        $scope.openPhoto = photoswipe.openPhotoSwipe;

        $scope.addLink = addLink;

        var flag = true;
        $scope.submit = function() {
            if (flag) {
                flag = false;
                if ($scope.data.pics.length > 0) {
                    submitFuc();
                } else {
                    layer.confirm('您还未传图片，确定提交?', {
                        icon: 3,
                        title: ' '
                    }, function(index) {
                        submitFuc();
                        layer.close(index);
                    });
                    flag = true;
                }
            } else {
                layer.msg('正在提交，请不要重复点击');
            }
        }

        function submitFuc() {
            $scope.data.description = changeLink($scope.data.description);

            ajax.post(url, $.param($scope.data)).success(function(res) {
                if (res.status == 0) {
                    layer.msg('发布成功');
                    $timeout(function() {
                        $state.go('focus.myQus');
                    }, 500);
                    flag = true;
                } else if (res.status == 1004) {
                    layer.msg(res.msg);
                    flag = true;
                }
            });
        }

        // 图片上传
        if (isWeiXin) {
            $scope.uploadFiles = uploadImg.wxUpload($scope);
        } else {
            //$scope.uploadFiles = uploadFiles;
            $scope.uploadFiles = uploadImg.upload($scope, Upload);
        }

        //删除图片
        $scope.deleteFiles = function(picname) {
            var index = $scope.data.pics.indexOf(picname);
            $scope.data.pics.splice(index, 1);
        }

        function addLink() {
            layer.prompt({
                title: ' '
            }, function(value, index, elem) {
                $timeout(function(){
                  $scope.data.description += '##'+value+'##';
                })
                layer.close(index);
            });
        }

    }

})(window, document);

;
(function(window, document, undefined) {

    //提交问题控制器
    questionCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'uploadImg', 'Upload', 'ajax', 'photoswipe'];
    angular.module('app').controller('questionCtrl', questionCtrl);

    function questionCtrl($rootScope, $scope, $state, $stateParams, $timeout, uploadImg, Upload, ajax, photoswipe) {
       //如果没有认证，则跳转到认证页面
       console.log($stateParams.flag=='false');
        if ($rootScope.userInfo.isrenzheng <= 0&&$stateParams.flag=='false') {
            location.replace(location.origin + '/muke/#/identificate?type=1');
        }
        var question_type = $stateParams.type;
        var url = '/api/' + root + '/operation/send';

        $scope.tags = [];
        $scope.isPay = (question_type == 7);
        $scope.changeType = changeType;
        $scope.addLink = addLink;

        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }
        ajax.get('/api/' + root + '/index/tags').success(function(res) {
            $scope.tags = res.data;
        });

        $scope.data = {
            question: '',
            description: '',
            tag_id: [],
            k_price: 0,
            pics: [],
            is_urgent: 0,
            type: question_type
        };
        $scope.dom = {
            title: '',
            ans: '',
            des: ''
        };
        $scope.add = [
            {
                type: 0,
                title: '普通'
            }, {
                type: 1,
                title: '急诊'
            }
        ]
        switchType(question_type);
        //photpswipe
        $scope.openPhoto = photoswipe.openPhotoSwipe;

        var flag = true;
        $scope.submit = function() {
            if (flag) {
                flag = false;
                if ($scope.data.question.length == 0 || $scope.data.description.length == 0) {
                    layer.msg('表单不能为空')
                    flag = true;
                } else if ($scope.data.pics.length > 0) {
                    submitFuc();
                } else {
                    layer.confirm('您还未传图片，确定提交?', {
                        icon: 3,
                        title: ' '
                    }, function(index) {
                        submitFuc();
                        layer.close(index);
                    });
                    flag = true;
                }

            } else {
                layer.msg('正在提交，请不要重复点击');
            }

        }

        function submitFuc() {
            $scope.data.description = changeLink($scope.data.description);
            ajax.post(url, $.param($scope.data)).success(function(res) {
                if (res.status == 0) {
                    flag = true;
                    layer.msg('发布成功');
                    MtaH5.clickStat('send_question_success');
                    $timeout(function() {
                        $state.go('index.questions');
                    }, 500);
                } else {
                    layer.msg(res.msg);
                    flag = true;
                }

            });
        }

        // 判断是否选中状态
        $scope.isChecked = function(id) {
            return $scope.data.tag_id.indexOf(id) >= 0;
        }
        //改变标签状态
        $scope.changeBq1 = function(e, id) {

            if (e.target.tagName == 'INPUT') {
                var checkbox = e.target;
                var checked = checkbox.checked;
                if (checked) {
                    $scope.data.tag_id.push(id);
                } else {
                    var idx = $scope.data.tag_id.indexOf(id);
                    $scope.data.tag_id.splice(idx, 1);
                }

            } else {
                return;
            }
        }

        function changeType(type) {
            $scope.isPay = (type == 7);
            $scope.data.type = type;
            switchType(type);
        }

        function switchType(question_type) {
            switch (+ question_type) {
                case 0:
                    $scope.dom = {
                        title: '发布提问',
                        ans: '提问的问题（越具体越好，得到的回答将更精准）…',
                        des: '年龄、性别、主诉、基本病史（越详细越好，不要出现病人的名字）…'
                    };
                    break;
                case 1:
                    $scope.dom = {
                        title: '发布设备维修提问',
                        ans: '故障原因、相应提示、操作上的疑问（描述越具体，得到的回答将更精准）……',
                        des: '品牌、名称、型号、已使用年限、维修史（准确提供设备信息）……'
                    };
                    break;
                case 2:
                    $scope.dom = {
                        title: '发布资格考试提问',
                        ans: '如何备考、题目讲解、对知识点有疑惑等（问题越详细，得到的回答越有针对性）……',
                        des: '考试名称、级别、时间等……'
                    };
                    break;
                case 7:
                    $scope.dom = {
                        title: '发布资格考试提问',
                        ans: '这次付费病例的主题(描述准确且富有吸引力)',
                        des: '年龄、性别、主诉、基本病史、影像描述，随访，病理等（请尽可能的详细描写，力求让付费用户从中得到收获）…'
                    };
                    break;
            }
        }

        if (isWeiXin) {
            $scope.uploadFiles = uploadImg.wxUpload($scope);
        } else {
            // $scope.uploadFiles = uploadFiles;
            $scope.uploadFiles = uploadImg.upload($scope, Upload);
        }

        //删除图片
        $scope.deleteFiles = function(picname) {
            var index = $scope.data.pics.indexOf(picname);
            $scope.data.pics.splice(index, 1);
        }

        function addLink() {
            layer.prompt({
                title: ' '
            }, function(value, index, elem) {
                $timeout(function() {
                    $scope.data.description += '##' + value + '##';
                })
                layer.close(index);
            });
        }

    }
})(window, document);

;(function(window, document, undefined) {
    /**
     * 首页问题榜2
     */
    questionsCtrl.$inject = ['$scope', '$rootScope', '$state', 'ajax', 'store'];
    angular.module('app').controller('questionsCtrl', questionsCtrl);

    function questionsCtrl($scope, $rootScope, $state, ajax, store) {

        var invite_code = location.search;
        var url = '/api/' + root + '/index/questions';

        $scope.type     = 'new';
        $scope.page     = 1;
        $scope.getMore  = getMore;
        $scope.goDetail = goDetail;
        $scope.isPay    = isPay;

        if (invite_code) {
            url += invite_code;
        }

        var indexStore = store.getData();

        if (indexStore.flag) {
            store.init($scope);
        } else {
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    $scope.data = res.data.data;
                    if (invite_code && $rootScope.isFocus == 0) {
                        // location.href = 'http://url.cn/45TQUA0';
                        $('.show-share').removeClass('hide');
                    }
                } else if (res.status == -5) {
                    layer.msg(res.data);
                }
            });
        }

        weishare() //微信分享

        $scope.tabs = [
            {
                title: '提问榜',
                type: 'new',
                float: 'fl'
            }, {
                title: '精品榜',
                type: 'jingpin',
                float: 'fl'
            }/*, {
                title: '大赛榜',
                type: 'matches',
                float: 'fr'
            }*/
        ];

        function getMore(type) {
            $scope.page = $scope.page + 1;
            var url = '/api/' + root + '/index/questions?type=' + type + '&page=' + $scope.page;
            if (type == 'jingpin') {
                url = '/api/' + root + '/index/shares?page=' + $scope.page;
            } else if (type == 'matches') {
                url = '/api/' + root + '/index/matches?page=' + $scope.page
            }
            ajax.get(url).success(function(res) {
                if (res.status == 0) {
                    if (res.data.data.length == 0) {
                        layer.msg('已经没有数据了');
                    } else {
                        res.data.data.forEach(function(item) {
                            $scope.data.push(item);
                        });
                    }

                } else {
                    layer.msg(res.msg);
                }
            })
        }

        function goDetail(qid, uid, myid, isOpen, qtype) {
            var event = window.event;
            var data = $scope.data,
                type = $scope.type,
                page = $scope.page,
                id = qid;

            store.setData(data, type, page, id);
            if (isOpen == '1') {
                $state.go('pDetail', {uid: qid})
            } else if (uid == myid) {
                $state.go('myDetail', {uid: qid})
            } else if (qtype == 7) {
                // $state.go('detail2', {
                //     uid: qid
                // })
                location.href = '/?#/detail2/' + qid
            } else {
                $state.go('detail', {uid: qid})
            }
        }

        function cutDescription(res) {
            res.data.data.forEach(function(item) {
                item.description = item.description.substr(0, 10) + '**********';
                item.question_exts.forEach(function(item) {
                    item.description = item.description.substr(0, 10) + '**********';
                })
            })
        }

        function concatData(res) {
            // var stmp1 = res.data.data.slice(0,3);
            // var stmp2 = res.data.data.slice(3);
            // var array = stmp1.concat($scope.data);
            // $scope.data = array.concat(stmp2);
            $scope.data = $scope.data.concat(res.data.data);
        }

        function isPay(uid, payList) {
            var ispay = false;
            for (var i = 0, len = payList.length; i < len; i++) {
                if (uid == payList[i].id) {
                    ispay = true;
                    break;
                }
            }
            return ispay;
        }

    }
})(window, document);

;(function(window, document, undefined) {

    /**
   * 阅片大赛活动页面
   */

    activeCtrl.$inject = ['$stateParams', 'ajax'];
    angular.module('app').controller('activeCtrl', activeCtrl);

    function activeCtrl($stateParams, ajax) {
        // if ($stateParams.id == 342) {
        //     $state.go('index.questions');
        // }
        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }
        var vm = this;
        var invite_code = location.search;
        var url = '/api/' + root + '/activity/match?activity_id=' + $stateParams.id;
        if(invite_code){
          url = '/api/' + root + '/activity/match'+invite_code+'&activity_id=' + $stateParams.id;
        }

        ajax.get(url).success(function(res) {
          
            vm.data = res.data;

            var otherInfo = res.data.activity.other_info;
            var share_friends_title = null,
                share_friend_title = null,
                share_friend_desc = null;

            if (otherInfo.length > 0) {
                otherInfo.forEach(function(item) {
                    if (item.type == 1 && item.web_element == 'background') {
                        vm.background = {
                            backgroundImage: 'url(' + item.content + ')'
                        }
                    } else if (item.type == 1 && item.web_element == 'share_friends_title') {
                        share_friends_title = item.content;
                    } else if (item.type == 1 && item.web_element == 'share_friend_title') {
                        share_friend_title = item.content;
                    } else if (item.type == 1 && item.web_element == 'share_friend_desc') {
                        share_friend_desc = item.content;
                    }
                })
            }

            //微信分享
            var config = {
                title: share_friend_title ? share_friend_title : '邀您参加「中国好影像」杯阅片大赛，优胜者可获现金奖励！', // 分享标题
                desc: share_friend_desc ? share_friend_desc : '火眼金睛识病灶， 优胜者将获得现金奖励！',
                link: origin + '/#/active/' + vm.data.activity.activity_id, // 分享链接
                imgUrl: vm.data.activity.thumbnail_pic_addr, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    MtaH5.clickStat('share');
                },
                fail: function(res) {
                    alert('error');
                }
            }
            var config2 = {
                title: share_friends_title ? share_friends_title: '「中国好影像」杯阅片大赛开锣，现金奖励虚位以待！你也来试试？', // 分享标题
                link: origin + '/#/active/' + vm.data.activity.activity_id, // 分享链接
                imgUrl: vm.data.activity.thumbnail_pic_addr, // 分享图标
                success: function(res) {
                    // 用户确认分享后执行的回调函数
                    MtaH5.clickStat('share');
                },
                fail: function(res) {
                    alert('error');
                }
            }
            wx.ready(function() {
                wx.onMenuShareTimeline(config2);
                wx.onMenuShareAppMessage(config);
                wx.onMenuShareQQ(config);
            });
        })
    }
})(window, document);

;(function(window, document, undefined) {
    /**
     * 活动列表
     */
    activeListCtrl.$inject = ['$scope', 'ajax'];
    angular
        .module('app')
        .controller('activeListCtrl', activeListCtrl);

    function activeListCtrl($scope, ajax) {
        $scope.type = 'match';
        try {
            document.getElementById('mta').onclick();
        } catch (e) {
            console.log(e);
        }
        var url = '/api/' + root + '/activity/index?type=match';
        ajax.get(url).success(function(res) {
            if (res.status == 0) {
                $scope.data = res.data.data;
            } else {
                layer.msg(res.msg);
            }
        });

        $scope.tabs = [
            {
                title: '医看大赛',
                type: 'match',
                float: 'fl'
            }, {
                title: '医看直播',
                type: 'live',
                float: 'fr'
            }
        ];
    }
})(window, document);

;(function(window, document, undefined) {
  /**
   * 阅片大赛详情
   */
   matchCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'ajax', 'photoswipe', 'uploadImg', 'Upload'];
   angular.module('app').controller('matchCtrl', matchCtrl);

   function matchCtrl($scope, $rootScope, $stateParams, ajax, photoswipe, uploadImg, Upload) {
       var url = '/api/' + root + '/index/detail/' + $stateParams.id;
       getData(url);

       initAns(); //初始化表单

       $scope.utils = {
           submit: submit,
           uploadFiles: uploadImg.upload($scope, Upload),
           deleteFiles: deleteFiles
       }

       //判断微信浏览器决定上传方式
       if (isWeiXin) {
           $scope.utils.uploadFiles = uploadImg.wxUpload($scope);
       }

       //photpswipe

       $scope.openPhoto = photoswipe.openPhotoSwipe;

       $scope.goReply = function() {
           var aHeight = $('#reply').offset().top;
           $('body,html').animate({
               scrollTop: aHeight
           }, 200);
       }

       // 加载更多
       $scope.page = 1;

       $scope.getMore = function() {
           $scope.page = $scope.page + 1;
           var url = '/api/' + root + '/index/detail/' + $stateParams.id + '?page=' + $scope.page;
           ajax.get(url).success(function(data) {
               if (data.status == 0) {
                   if (data.data.replys.length == 0) {
                       layer.msg('已经没有数据了');
                   } else {
                       data.data.replys.forEach(function(item) {
                           $scope.data.replys.push(item);
                       });
                   }

               } else {
                   layer.msg(data.msg);
               }
           })
       }



       //初始化回答表单
       function initAns() {

           $scope.ans = {
               question_id: '',
               content: '',
               pics: [],
               answer_id: ''
           };
       }

       //获取数据
       function getData(url) {
           ajax.get(url).success(function(data) {
               $scope.data = data.data;
               if ($stateParams.isbanner == 1) {
                   $scope.data.replys.forEach(function(item) {
                       if (item.content !== '' && item.member_info.id != $rootScope.userInfo.id) {
                           item.content = item.content.substr(0, 10) + '**********';
                       }
                   })
               }

               // 图片预加载
               $scope.preloadImgs = [];
               data.data.pic_log.forEach(function(item) {
                   var img = new Image();
                   img.src = item.site;
                   $scope.preloadImgs.push(img);
               });


               //微信分享
               var config = {
                   title: '邀您参加「中国好影像」杯阅片大赛，优胜者可获现金奖励！', // 分享标题
                   desc: '火眼金睛识病灶， 优胜者将获得现金奖励！',
                   link: origin + '/#/active/' + $scope.data.activity_id, // 分享链接
                   imgUrl: $scope.data.pic_log.length == 0 ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg' : $scope.data.pic_log[0].site, // 分享图标
                   success: function(res) {
                       // 用户确认分享后执行的回调函数
                       MtaH5.clickStat('share');
                   },
                   fail: function(res) {
                       alert('error');
                   }
               }
               var config2 = {
                   title: '「中国好影像」杯阅片大赛开锣，现金奖励虚位以待！你也来试试？', // 分享标题
                   link: origin + '/#/active/' + $scope.data.activity_id, // 分享链接
                   imgUrl: $scope.data.pic_log.length == 0 ? 'http://img.kankanyisheng.com/94014773985655DFdjQcWDi.jpg' : $scope.data.pic_log[0].site, // 分享图标
                   success: function(res) {
                       // 用户确认分享后执行的回调函数
                       MtaH5.clickStat('share');
                   },
                   fail: function(res) {
                       alert('error');
                   }
               }
               wx.ready(function() {
                   wx.onMenuShareTimeline(config2);
                   wx.onMenuShareAppMessage(config);
                   wx.onMenuShareQQ(config);
               });
           });
       }

       //提交回答
       function submit() {
           $scope.ans.question_id = arguments[0];
           $scope.ans.answer_id = arguments[1];
           var data = $scope.ans,
               url = '/api/' + root + '/operation/reply';
           ajax.post(url, $.param(data)).success(function(res) {
               if (res.status == 0) {
                   layer.msg(res.msg);

                   MtaH5.clickStat('reply');
                   //清空表单
                   initAns();
                   // 重置page
                   $scope.page = 1;

                   // 更新数据
                   getData('/api/' + root + '/index/detail/' + $stateParams.id);

                   $('#reply').removeClass('reply-hide');
               } else {
                   layer.msg(res.msg);
               }
           })
       }

       //删除图片
       function deleteFiles(picname) {
           var index = $scope.ans.pics.indexOf(picname);
           $scope.ans.pics.splice(index, 1);
       }

   }
})(window,document);

;(function(window, document, undefined) {
  /**
   * 分享详情
   */
  shareDetailCtrl.$inject = ['storeData'];
  angular.module('app').controller('shareDetailCtrl',shareDetailCtrl);

  function shareDetailCtrl(storeData) {
    var vm = this;
    vm.data = storeData.getData();
  }
})(window,document);

;(function(window, document, undefined) {

  /**
   * 分享榜单
   */
  shareRankCtrl.$inject = ['$stateParams', '$state', 'ajax', 'storeData'];
  angular.module('app').controller('shareRankCtrl',shareRankCtrl);

  function shareRankCtrl($stateParams,$state,ajax,storeData) {
    var url = '/api/' + root + '/activity/match?activity_id=' + $stateParams.id;
    var vm = this;

    vm.data = null;
    vm.goDetail = goDetail;

    ajax.get(url)
      .success(function(res){
        vm.data = res.data;
      })

    function goDetail(data) {
      storeData.setData(data);
      $state.go('shareDetail');
    }
  }

})(window,document);

;(function(window, document, undefined) {
  /**
   * 活动详情
   */
   activeDetailCtrl.$inject = ['$scope', '$stateParams', 'ajax'];
   angular.module('app').controller('activeDetailCtrl', activeDetailCtrl);

   function activeDetailCtrl($scope, $stateParams, ajax) {
       var url = '/api/' + root + '/activity/match?activity_id=' + $stateParams.id;
       var img = new Image();
       var width;
       ajax.get(url).success(function(res) {
           $scope.data = res.data;
           $scope.Dom = {
               links: [],
               img: '',
               background: ''
           }

           var otherInfo = res.data.activity.other_info;
           var share_friends_title = null,
               share_friend_title = null,
               share_friend_desc = null;
           if (otherInfo.length > 0) {
               otherInfo.forEach(function(item) {
                   if (item.type == 1 && item.web_element == 'detail_image') {
                       $scope.Dom.img = item.content;
                       img.src = item.content;
                   } else if (item.type == 1 && item.web_element == 'share_friends_title') {
                       share_friends_title = item.content;
                   } else if (item.type == 1 && item.web_element == 'share_friend_title') {
                       share_friend_title = item.content;
                   } else if (item.type == 1 && item.web_element == 'share_friend_desc') {
                       share_friend_desc = item.content;
                   }
               })
               img.onload = function() {
                   otherInfo.forEach(function(item) {
                       if (item.type == 1 && item.web_element == "detail_link") {
                           var position = item.position.split(',');
                           var link = {};
                           link.href = item.content;
                           width = img.width;
                           var percent = $(window).width() / width;
                           link.position = {
                               left: position[0] * percent + 'px',
                               top: position[1] * percent + 'px'
                           }
                           $scope.$apply(function() {
                               $scope.Dom.links.push(link);
                           })
                       }
                   })
               }
           }

           //微信分享
           var config = {
               title: share_friend_title ? share_friend_title : '邀您参加「中国好影像」杯阅片大赛，优胜者可获现金奖励！', // 分享标题
               desc: share_friend_desc ? share_friend_desc : '火眼金睛识病灶， 优胜者将获得现金奖励！',
               link: origin + '/#/active/' + $scope.data.activity.activity_id, // 分享链接
               imgUrl: $scope.data.activity.thumbnail_pic_addr, // 分享图标
               success: function(res) {
                   // 用户确认分享后执行的回调函数
                   MtaH5.clickStat('share');
               },
               fail: function(res) {
                   alert('error');
               }
           }
           var config2 = {
               title: share_friends_title ? share_friends_title : '「中国好影像」杯阅片大赛开锣，现金奖励虚位以待！你也来试试？', // 分享标题
               link: origin + '/#/active/' + $scope.data.activity.activity_id, // 分享链接
               imgUrl: $scope.data.activity.thumbnail_pic_addr, // 分享图标
               success: function(res) {
                   // 用户确认分享后执行的回调函数
                   MtaH5.clickStat('share');
               },
               fail: function(res) {
                   alert('error');
               }
           }
           wx.ready(function() {
               wx.onMenuShareTimeline(config2);
               wx.onMenuShareAppMessage(config);
               wx.onMenuShareQQ(config);
           });
       })
   }
})(window,document);
