;(function(window, document, undefined) {
    /**
     * 首页付费榜单
     */
    app.controller('caihuaCtrl', function($scope, $stateParams, indexData) {
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

    });
})(window, document);
