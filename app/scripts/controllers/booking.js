/**
 * Created by guan on 14/10/29.
 */
angular.module('roshanGymDongkerApp')
    .controller('bookingCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    })
    .controller('weixincntroller',function($scope,$http,$routeParams){
        var test=$routeParams.t;
        $scope.response=test;
    })
    .controller('getAllBookingProduct',function($scope,$http,$routeParams, $alert) {
        $scope.clickArr = [];
        $scope.allamount = 0;
        $scope.username = "";
        $scope.userphone = "";
        $scope.produtlist = [];
        $scope.bookingdate = "";
        $scope.submitdisabled = "";

        $scope.ishasproduct=false;//是否展示无产品信息
        $scope.isshowloading=true;
        $scope.isshowmain=false;
        var _this=this;
        $scope.alert ={};

        this.getproductbookinginfo=function(selectdate)
        {
            $scope.isshowmain=false;
            $scope.ishasproduct=false;
            $scope.isshowloading=true;
            $scope.clickArr.splice(0,$scope.clickArr.length);
            $scope.produtlist.splice(0,$scope.produtlist.length);
            $scope.allamount=0;
            var requesturl='/api/getproductbookinginfo';
            if(selectdate)
            {
                requesturl+='?bookingdate=' + selectdate;
            }
            //取数据
            $http({
                method: 'GET',
                url: requesturl,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, headers, config) {
                $scope.isshowloading=false;
                if(data.code=="1000")
                {
                    $scope.ishasproduct=true;
                }
                else {
                    $scope.bookingModel = data.data;
                    $scope.isshowmain=true;
                    if(selectdate)
                    {
                        $scope.bookingdate=selectdate;
                    }
                    else if (data.data.dateArr.length > 0) {
                        $scope.bookingdate = data.data.dateArr[0].date;
                    }
                }
            }).error(function (data, status, headers, config) {
                $scope.isshowloading=false;
                if(data.code=="1000")
                {
                    $scope.ishasproduct=true;
                }
                else {

                    $scope.alert = initalert("error", "获取数据失败", "danger");
                }
            });
        }
        this.getproductbookinginfo();
        //点击时间选项加载数据
        $scope.getproductbookinginfoForDate = function (selectdate) {

            _this.getproductbookinginfo(selectdate);
            return false;
        }
        //时段点击时间
        $scope.getdetailinfo = function (detailitem, productid, productname,venueid) {

            if (detailitem && detailitem.bookingCount > 0) {
                var index = $scope.clickArr.indexOf(detailitem.detailId);
                if (index >= 0) {
                    $scope.clickArr.splice(index, 1);
                    $scope.allamount = $scope.allamount - detailitem.price;
                    $scope.produtlist.splice(index, 1);
                }
                else {
                    $scope.clickArr.push(detailitem.detailId);
                    $scope.allamount = $scope.allamount + detailitem.price;
                    $scope.produtlist.push({productDetails: {productprice: detailitem.price, productreallyprice: detailitem.price,
                        detailproductid: detailitem.detailId, starttime: detailitem.start_time, endtime: detailitem.end_time,
                        timemark: detailitem.timemark}, productid: productid, productname: productname,venceid:venueid});
                }
            }

        }

        $scope.submitOrderInfo = function () {
            if ($scope.produtlist.length <= 0) {

                $scope.alert =initalert("waring","未选择预订时段","warning");
                return false;
            }

            var interval="";//定时器对象
            var requestCount=0;//请求次数
            $scope.submitdisabled = "disabled";
            var orderinfo = {};
            orderinfo.order_amount = $scope.allamount;
            orderinfo.order_reallyprice = $scope.allamount;
            orderinfo.order_type = "1";
            orderinfo.order_from = "1";
            orderinfo.order_username = $scope.username;
            orderinfo.order_userphone = $scope.userphone;
            orderinfo.order_discount = 0.9;
            orderinfo.order_isdiscount = 0;
            orderinfo.order_detail = "";
            orderinfo.productlist = $scope.produtlist;
            orderinfo.bookingdate = $scope.bookingdate;
            $http({
                method: 'POST',
                url: '/api/addorderinfo',
                headers: { 'Content-Type': 'application/json' },
                data: orderinfo
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    $scope.clickArr.splice(0,$scope.clickArr.length);
                    $scope.produtlist.splice(0,$scope.produtlist.length);
                    _this.getproductbookinginfo($scope.bookingdate);
                    $scope.allamount=0;
                    var orderid = data.data;

                    $scope.alert =initalert("success","提交成功","success");

                    /*interval = setInterval(getorderstate(orderid, function (err, data) {
                        requestCount++;
                        if (data == 1) {
                            clearInterval(interval);
                            requestCount=0;

                            $scope.alert =initalert("success","提交成功","alert alert-success alert-dismissible");
                        }
                    }), 1000);*/
                }
            }).error(function (data, status, headers, config) {
                //clearInterval(interval);
                requestCount=0;

                $scope.alert =initalert("error","提交失败","danger");
            });
            if(requestCount>=30)
            {
                //clearInterval(interval);
                requestCount=0;

                $scope.alert =initalert("error","提交失败","danger");
            }
        }

        $scope.calceloperate=function($scope)
        {
            $scope.username="";
            $scope.userphone="";
            $scope.clickArr.splice(0,$scope.clickArr.length);
            $scope.produtlist.splice(0,$scope.produtlist.length);
        }
        function getorderstate (orderid, cb) {
            var orderstate = 0;
            if (!orderid) {
                cb(null, 0);
            }
            $http({
                method: 'GET',
                url: '/api/getorderstate?orderid=' + orderid,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, headers, config) {
                orderstate = data;
                cb(null, orderstate);

            }).error(function (data, status, headers, config) {

            });
        }
        function initalert(title, content, type) {
            return $alert({
                "title": title,
                "content": content,
                "type": type,
                "duration":3,
                "container": '#alerts-container',
                "show":true
            });
        }


    });
