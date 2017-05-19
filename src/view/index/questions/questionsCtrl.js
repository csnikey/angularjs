;(function(window, document, undefined) {
    /**
     * 首页问题榜2
     */
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
