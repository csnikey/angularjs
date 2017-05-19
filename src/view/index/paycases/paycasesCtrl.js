;(function(window, document, undefined) {

  /**
   * 付费病例列表
   */
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
