;(function(window, document, undefined) {

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
