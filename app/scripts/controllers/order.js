/**
 * Created by zhigang on 14-9-26.
 */
angular.module('roshanGymDongkerApp')
    .controller('OrderListCtrl', function ($rootScope,$scope,$modal,$http) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var _this=this;
        var pageNum=10;
        $scope.pageIndex=1;
        $scope.pageCount=0;
        this.init=function()
        {
            var orderStateArr=[];
            orderStateArr.push({"state":-1,"text":"请选择"});
            orderStateArr.push({"state":1,"text":"未付款"});
            orderStateArr.push({"state":2,"text":"已付款"});
            orderStateArr.push({"state":8,"text":"已消费"});
            orderStateArr.push({"state":7,"text":"已取消"});

            $scope.orderStateViewModel=orderStateArr;
            $scope.selectState=-1;
            $scope.searchStartTime="";
            $scope.searchEndTime="";
        }
        this.getorderlist=function(pageIndex,pageNum,orderState,orderstarttime,orderendtime)
        {
            $scope.orderlistViewmodel=null;
            $scope.totalcount=0;
            var filter="?pageIndex="+pageIndex+"&pageNum="+pageNum;
            if(orderState>=0)
            {
                filter+="&orderState="+orderState;
            }
            if(orderstarttime&&orderendtime)
            {
                filter+="&orderStartTime="+orderstarttime+"&orderEndTime="+orderendtime;
            }
            $http({
                method: 'GET',
                url: '/api/order/getorderlistbypage'+filter,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, headers, config) {

                $scope.orderlistViewmodel=data.data.data;
                $scope.totalcount=data.data.totalCount;
                _this.setPage();
            }).error(function (data, status, headers, config) {
                //alert("error");
            });
        };
        this.setPage=function()
        {
            if($scope.totalcount%pageNum==0)
            {
                $scope.pageCount=$scope.totalcount/pageNum;
            }
            else
            {
                $scope.pageCount=$scope.totalcount/pageNum+1;
            }
            var pageArr=[];
            if($scope.pageCount<=1)
            {
                pageArr.push(1);
            }
            else if($scope.pageCount<=5)
            {
                for(var i=1;i<$scope.pageCount;i++)
                {
                    pageArr.push(i);
                }
            }
            else
            {
                if($scope.pageIndex<=2)
                {
                    pageArr.push(1,2,3,4,5);
                }
                else if($scope.pageIndex>=$scope.pageCount-2)
                {
                    pageArr.push($scope.pageCount-4,$scope.pageCount-3,$scope.pageCount-2,$scope.pageCount-1,$scope.pageCount);
                }

            }
            if($scope.pageIndex>2&&$scope.pageIndex<=$scope.pageCount-2)
            {
                pageArr.push($scope.pageIndex-2,$scope.pageIndex-1,$scope.pageIndex,$scope.pageIndex+1,$scope.pageIndex+2);
            }
            $scope.pageArr=pageArr;
        }
        _this.init();
        this.getorderlist(0,pageNum);
        $scope.updateorderstate=function(orderid,orderstate,orderfrom)
        {

            if(!orderid||orderstate!=1||orderfrom!=1)
            {
                return false;
            }
            if(confirm("确定要为此订单支付吗"))
            {
                $http({
                    method: 'GET',
                    url: '/api/order/updateorderstate?orderid='+orderid+"&orderstate=2",
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data, status, headers, config) {
                    if(data.code==0)
                    {
                        alert("付款成功");
                        _this.getorderlist($scope.pageIndex,pageNum);

                    }
                }).error(function (data, status, headers, config) {
                    alert("error");
                });
            }
        }
        $scope.cancelorder=function(orderid,orderstate,productstate)
        {

            if(!orderid||orderstate!=1)
            {
                return false;
            }
            if(confirm("确定要取消此订单吗"))
            {
                $http({
                    method: 'POST',
                    url: '/api/order/cancelorder',
                    headers: { 'Content-Type': 'application/json' },
                    data: {orderid:orderid,productstate:productstate}

//                    method: 'POST',
//                    url: '/api/cancelorder',
//                    headers: { 'Content-Type': 'application/json' },
//                    data:{orderid:orderid,productstate:productstate}
                }).success(function (data, status, headers, config) {
                    if(data.code==0)
                    {
                        alert("取消成功");
                        _this.getorderlist($scope.pageIndex,pageNum);

                    }
                }).error(function (data, status, headers, config) {
                    alert("error");
                });
            }
        }

$scope.deleteorer=function(orderid,orderstate)
{
    if(!orderid||orderstate!=7)
    {
        return false;
    }
    if(confirm("确定要删除此订单吗"))
    {
        $http({
            method: 'POST',
            url: '/api/order/deleteorder',
            headers: { 'Content-Type': 'application/json' },
            data: {orderid:orderid}

        }).success(function (data, status, headers, config) {
            if(data.code==0)
            {
                alert("删除成功");
                _this.getorderlist($scope.pageIndex,pageNum);

            }
        }).error(function (data, status, headers, config) {
            alert("error");
        });
    }
}

        $scope.addModal = function (orderid) {

            var scope = $rootScope.$new();
            scope.data = {
                orderid:orderid
            }

            var myOtherModal = $modal({ template: '/views/order/orderdetail.html', placement: 'center',show: true,
                templateUrl: '/views/order/orderdetail.html',
                controller: 'getOrderDetail',
                scope:scope
            });

        }
        $scope.gotoCurrentPage=function(currentPage)
        {
            $scope.pageIndex=currentPage*1;
            _this.getorderlist($scope.pageIndex,pageNum);
        }
        $scope.gotoNextPage=function()
        {
            if($scope.pageIndex==$scope.pageCount)
            {
                return false;
            }
            else
            {
                $scope.pageIndex--;
                _this.getorderlist($scope.pageIndex,pageNum);
            }
        }
        $scope.gotoNextPage=function()
        {
            if($scope.pageIndex==1)
            {
                return false;
            }
            else
            {
                $scope.pageIndex++;
                _this.getorderlist($scope.pageIndex,pageNum);
            }
        }
        $scope.searchOrder=function()
        {
            var state=$scope.selectState;
            var startTime=$scope.searchStartTime;
            var endTime=$scope.searchEndTime;
            _this.getorderlist(0,10,state);
        }
    })
    .controller('getOrderDetail',function($scope,$http)
    {
        var orderid = $scope.data.orderid;

        if(!orderid)
        {
            return false;
        }

        $http({
            method: 'GET',
            url: '/api/order/getorderdetail?orderid='+orderid,
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data, status, headers, config) {

            if(data.data&&data.data.length>0) {
                $scope.orderDetailModel = data.data[0];
            }

        }).error(function (data, status, headers, config) {
            alert("error");
        });
    })

