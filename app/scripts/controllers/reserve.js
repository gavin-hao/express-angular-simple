/**
 * Created by zhigang on 15/1/15.
 */
'use strict';
angular.module('roshanGymDongkerApp')
    .controller('ReserveCtrl', function ($scope,$http, $auth, $location,$alert, $modal) {
        var scroller1 = new IScroll("#scroll1", { scrollX: true, scrollY: false, mouseWheel: false });
        var scroller = new IScroll("#scrollx", { scrollX: true, scrollY: false, mouseWheel: false });
        $scope.filterdate="";//日期的筛选
        $scope.selecteddate=new Date();
        $scope.clickArr = [];
        $scope.allamount = 0;//选择的时段的总金额

        $scope.formobj={"username":"","userphone":"","invoicetitle":"","remark":""};
        $scope.produtlist = [];//选择的时段列表
        $scope.bookingdate = "";//当前选择的时间
        $scope.submitdisabled = false;//提交按钮是否可用

        $scope.ishasproduct=false;//是否展示无产品信息
        $scope.isshowloading=true;
        $scope.isshowmain=false;

        $scope.isshowfooter = false;//是否显示预订信息的底部
        $scope.ishsowfilter=false;//是否展示其他日期的筛选部分
        $scope.searchOrderResult=false;
        $scope.orderinfoModel=[];//订单查询结果
        $scope.selectDeilidList={};
        $scope.venueidArr=[];//选择了那些场地

        $scope.submiterrormessage=null;
        $scope.submittext="提交订单";
        var totalcount=0;
        var _this=this;
        var firsttimemark=9;
        var endtimemark=22;
        $scope.alert ={};
        //刷新库存
        this.refreshProduct=function()
        {
         /*   var interval=setInterval(function()
            {
                _this.getProductBookingInfo($scope.selecteddate);
            },60000);*/

            var interval=setInterval(function()
            {
                _this.getNewStock();
            },10000);
        }
        this.getNewStock=function()
        {
            var detailids="";
            if($scope.bookingModel&&$scope.bookingModel.length>0)
            {
                for(var i=0;i<$scope.bookingModel.length;i++)
                {
                    var productObj=$scope.bookingModel[i];
                    if(!productObj||productObj.productDetail.length<=0)
                    {
                        continue;
                    }
                    for(var k=0;k<productObj.productDetail.length;k++)
                    {
                        if(productObj.productDetail.bookingCount>0) {
                            detailids += productObj.productDetail[k].detailId + ",";
                        }
                    }
                }
            }
            var requesturl = '/api/product/getstock?detailids=' + detailids+"&bookingdate="+$scope.selecteddate;
            //取数据
            $http({
                method: 'GET',
                url: requesturl,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, headers, config) {

                if (data.code == "0" && data.data) {

                    $scope.orderinfoModel = data.data;
                }
                else
                {
                    $scope.orderinfoModel=null;
                }
            }).error(function (data, status, headers, config) {
                $scope.orderinfoModel=null;
                $scope.searchOrderResult = true;
                $scope.alert = initalert("", "获取数据失败", "danger");
            });
        }
        $scope.showBars=false;
        //得到产品的预定信息
        this.getProductBookingInfo=function(selectdate)
        {
            $scope.showBars=false;
            $scope.isshowmain=false;
            $scope.ishasproduct=false;
            $scope.isshowloading=true;
            $scope.clickArr.splice(0,$scope.clickArr.length);
            $scope.produtlist.splice(0,$scope.produtlist.length);
            $scope.selectDeilidList={};
            $scope.venueidArr.splice(0, $scope.venueidArr.length)
            $scope.allamount=0;
            $scope.dataViewModel=null;
            $scope.bookingModel=null;
            $scope.isshowfooter=false;
            var requesturl='/api/product/getproductbookinginfo';
            if(selectdate)
            {
                requesturl+='?bookingdate=' + selectdate;
                $scope.selecteddate=selectdate;
                _this.getSenvenDate(selectdate);
            }
            else
            {
                requesturl+='?isfirst=1';
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

                    $scope.bookingModel =data.data.dataArr;
                    if($scope.bookingModel.length>0)
                    {
                        firsttimemark=$scope.bookingModel[0].starttimemark;
                        endtimemark=$scope.bookingModel[0].endtimemark;
                        $scope.showBars=true;


                    }
                    if(!selectdate) {
                        $scope.dateViewModel = data.data.dateArr;
                    }

                    $scope.isshowmain=true;
                    $scope.showBars=true;
                    if(selectdate)
                    {
                        $scope.bookingdate=selectdate;
                    }
                    else if (data.data.dateArr.length > 0) {
                        $scope.bookingdate = data.data.dateArr[0].date;
                    }
                    setTimeout(function () {  scroller1.refresh();scroller.refresh();}, 0);
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
        this.getSenvenDate=function(selectdate)
        {
            for(var i=0;i<$scope.dateViewModel.length;i++)
            {
                var dateobj=$scope.dateViewModel[i];

                if(new Date(dateobj.date).getDate()==new Date(selectdate).getDate())
                {
                    dateobj.classname="active";
                }
                else
                {
                    dateobj.classname="";
                }
            }
        }
        //搜索得到订单列表
        this.getOrderList=function() {

            if (!$scope.userphone) {

                //$scope.alert =initalert("","请输入手机号或者订单号","danger");
                return false;
            }

            var requesturl = '/api/order/getorderlist?userphone=' + $scope.userphone;
            //取数据
            $http({
                method: 'GET',
                url: requesturl,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, headers, config) {
                $scope.searchOrderResult = true;
                if (data.code == "0" && data.data) {

                    $scope.orderinfoModel = data.data;
                }
                else
                {
                    $scope.orderinfoModel=null;
                }
            }).error(function (data, status, headers, config) {
                $scope.orderinfoModel=null;
                $scope.searchOrderResult = true;
                $scope.alert = initalert("", "获取数据失败", "danger");
            });
        }

        this.getProductBookingInfo();
        //this.refreshProduct();
        //点击时间选项加载数据
        $scope.getProductBookingInfoForDate = function (selectdate) {

            if (!selectdate) {
                return false;
            }
            else {
                _this.getProductBookingInfo(selectdate);
                $scope.ishsowfilter = false;
                return false;
            }

        }
        //搜索订单
        $scope.searchOrder=function()
        {
            _this.getOrderList();
        }
        //切换日期
        $scope.searchBySelectDate=function()
        {

            if(!$scope.filterdate)
            {
                return false;
            }
            else
            {
                _this.getProductBookingInfo($scope.filterdate);
                return false;
            }
        }
        //单元格点击事件
        $scope.getDetailInfo = function (detailitem,productitem ) {

            if(detailitem.order_id)
            {
                $scope.userphone=detailitem.order_id;
                _this.getOrderList();
                return false;
            }
            var venueid=productitem.venueid;
            var detailid=detailitem.detailId;
            var starttimenum=detailitem.start_time.split(":")[0];
            if (detailitem && detailitem.bookingCount > 0) {

                var index = $scope.clickArr.indexOf(detailid);
                if (index >= 0) {
                    $scope.clickArr.splice(index, 1);
                    $scope.allamount = $scope.allamount - detailitem.price;
                    $scope.produtlist.splice(index, 1);
                    delete $scope.selectDeilidList[venueid][starttimenum];//.splice(0,1);
                }
                else {
                    $scope.clickArr.push(detailitem.detailId);
                    $scope.allamount = $scope.allamount + detailitem.price;

                    var productObj={productDetails: {productprice: detailitem.price, productreallyprice: detailitem.price,
                        detailproductid: detailitem.detailId, starttime: detailitem.start_time, endtime: detailitem.end_time,
                        timemark: detailitem.timemark},"bookingdateformat":$scope.bookingdate, productid: productitem.productid, productname: productitem.productname,venceid:productitem.venueid,venueatribute:productitem.venueatribute,"indoor":productitem.indoor,"floortype":productitem.floortype,"standerd":productitem.standerd}
                    $scope.produtlist.push(productObj);
                    var tempstarttimemark = parseInt(productObj.productDetails.starttime.split(":")[0]);

                    if($scope.selectDeilidList[productObj.venceid])//包含了这块场地
                    {
                        var venueObj=$scope.selectDeilidList[productObj.venceid];
                        venueObj[tempstarttimemark]=productObj;
                    }
                    else
                    {
                        var detailObj={};
                        detailObj[tempstarttimemark]=productObj;
                        $scope.selectDeilidList[productObj.venceid]=detailObj;
                        $scope.venueidArr.push(productObj.venceid);
                    }


                }
                $scope.detailViewModel=_this.getSelectFormat();
            }

            if($scope.clickArr.length>0) {
                $scope.isshowfooter = true;
                $scope.submitdisabled=true;

            }
            else
            {
                $scope.isshowfooter = false;
                $scope.submitdisabled=false;
            }
        }
        this.getSelectFormat=function()
        {
            var selectArr=[];
            var testobj=null;
            var venueid="";
            for(var i=0;i<$scope.venueidArr.length;i++)
            {
                testobj=null;
                var venueObj=$scope.selectDeilidList[$scope.venueidArr[i]];
                var num=firsttimemark;
                var index=0;

                for(var k=firsttimemark;k<=endtimemark+1;k++)
                {
                    if(venueObj[k])
                    {

                        if(index==0)
                        {
                            testobj=venueObj[k];
                            testobj.productDetails.end_time= venueObj[k].productDetails.endtime;
                        }
                        else {
                            if ((k - num == 1))//上一时段
                            {
                                testobj.productDetails.end_time = venueObj[k].productDetails.endtime;
                            }
                            else if (k - num == 0) {
                                testobj = venueObj[k];
                                testobj.productDetails.end_time= venueObj[k].productDetails.endtime;
                            }
                            else {
                                selectArr.push(testobj);
                                testobj = venueObj[k];
                                testobj.productDetails.end_time= venueObj[k].productDetails.endtime;
                            }
                        }

                        num = k;
                        index++;
                    }
                    if(testobj&&k==endtimemark) {
                        if (selectArr.length < 1 || selectArr[selectArr.length - 1].productDetails.end_time != testobj.productDetails.end_time)
                            selectArr.push(testobj);
                    }
                }
                venueid=$scope.venueidArr[i];
            }
            return selectArr;
        }
        //清空选择
        $scope.clearSelect=function()
        {
            $scope.clickArr.splice(0,$scope.clickArr.length);

            $scope.allamount =0;
            $scope.produtlist.splice(0, $scope.produtlist.length);
            $scope.detailViewModel.splice(0, $scope.detailViewModel.length);
            $scope.selectDeilidList={};
            $scope.venueidArr.splice(0, $scope.venueidArr.length);
            if($scope.clickArr.length>0) {
                $scope.isshowfooter = true;
            }
            else
            {
                $scope.isshowfooter = false;
            }
            $scope.submitdisabled=false;
        }
        //提交订单
        $scope.submitOrderInfo = function () {
            $scope.submiterrormessage=null;
            if ($scope.produtlist.length <= 0) {
                $scope.submiterrormessage={"type":"alert alert-danger","content":"未选择预订时段"}

                return false;
            }
            if (!$scope.formobj.userphone) {
                $scope.submiterrormessage={"type":"alert alert-danger","content":"请输入预定手机号"}
                return false;
            }
            var reg=/^(13|15|17|)\d{9}$/;
            if(!reg.exec($scope.formobj.userphone))
            {
                $scope.submiterrormessage={"type":"alert alert-danger","content":"请输入正确的预定手机号"}
                return false;
            }
            var isinvoice=$scope.formobj.invoicetitle?"1":"0";
            $scope.submittext="提交中...";
            $scope.submitdisabled = true;
            var orderinfo = {};
            orderinfo.order_amount = $scope.allamount;
            orderinfo.order_reallyprice = $scope.allamount;
            orderinfo.order_type = "1";
            orderinfo.order_from = "1";
            orderinfo.order_username = $scope.formobj.username;
            orderinfo.order_userphone = $scope.formobj.userphone;
            orderinfo.order_discount = 0.9;
            orderinfo.order_isdiscount = 0;
            orderinfo.order_detail = "";
            orderinfo.productlist = $scope.produtlist;
            orderinfo.bookingdate = $scope.bookingdate;
            orderinfo.order_invoicetitle=$scope.formobj.invoicetitle;
            orderinfo.order_Isinvoice=isinvoice;
            orderinfo.remark=$scope.formobj.remark;
            $http({
                method: 'POST',
                url: '/api/order/addorderinfo',
                headers: { 'Content-Type': 'application/json' },
                data: orderinfo
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {//提交成功后清空所选的

                    var orderid=data.data;

                    if(orderid)
                    {
                        var interval=setInterval(function(){
                            _this.getOrderState(orderid,function(err,orderState){

                                if(orderState=="1")
                                {
                                    clearInterval(interval);
                                    $scope.clickArr.splice(0,$scope.clickArr.length);
                                    $scope.produtlist.splice(0,$scope.produtlist.length);

                                    $scope.allamount=0;
                                    $scope.submitdisabled = false;
                                    var orderid = data.data;
                                    $scope.isshowfooter=false;

                                    $scope.submittext="提交订单";
                                    $scope.formobj={"username":"","userphone":"","invoicetitle":"","remark":""};
                                    $scope.confirm_modal = {title: '提交订单', content: '订单提交成功。'};
                                    $scope.show_modal_confirm();
                                    $scope.confirm_modal.onOk = function () {
                                        $scope.hide_modal_confirm();
                                    }
                                    $scope.confirm_modal.onCancel = function () {
                                        $scope.hide_modal_confirm();
                                        return false;
                                    }
                                    _this.getProductBookingInfo($scope.selecteddate);
                                }
                                else if(orderState!="0")
                                {
                                    clearInterval(interval);
                                    $scope.submitdisabled=false;
                                    $scope.submittext="提交订单";
                                    $scope.confirm_modal = {title: '提交订单', content: '订单提交失败。'};
                                    $scope.show_modal_confirm();
                                    $scope.confirm_modal.onOk = function () {
                                        $scope.hide_modal_confirm();
                                    }
                                    $scope.confirm_modal.onCancel = function () {
                                        $scope.hide_modal_confirm();
                                        return false;
                                    }

                                }
                            });

                        },1000);
                    }


                }
            }).error(function (data, status, headers, config) {
                $scope.submitdisabled = false;
                $scope.alert =initalert("error","提交失败","danger");
            });

        }
        //支付订单
        $scope.payOrder=function(orderid)
        {
            if(!orderid){
                return false;
            }
            if(confirm("确定要消费此订单吗"))
            {
                $http({
                    method: 'GET',
                    url: '/api/order/updateorderstate?orderid='+orderid+"&orderstate=2",
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data, status, headers, config) {
                    if(data.code==0)
                    {
                        $scope.alert =initalert("","支付成功","success");
                        _this.getOrderList();
                    }
                    else
                    {
                        $scope.alert =initalert("","支付失败","danger");
                    }
                }).error(function (data, status, headers, config) {
                    $scope.alert =initalert("","支付失败","danger");
                });
            }
            $scope.confirm_modal.onCancel = function () {
                $scope.hide_modal_confirm();
                return false;
            }

        } ;
        //消费订单
        $scope.expenseOrder=function(orderid)
        {
            if(!orderid){
                return false;
            }
            if(confirm("确定要消费此订单吗"))
            {
                $http({
                    method: 'GET',
                    url: '/api/order/updateorderstate?orderid='+orderid+"&orderstate=8",
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data, status, headers, config) {
                    if(data.code==0)
                    {
                        $scope.alert =initalert("","消费成功","success");
                        _this.getOrderList();
                    }
                    else
                    {
                        $scope.alert =initalert("","消费失败","danger");
                    }
                }).error(function (data, status, headers, config) {
                    $scope.alert =initalert("","消费失败","danger");
                });
            }
        }

        var modal_confirm = $modal({scope: $scope, placement: 'center', backdrop: 'static',
            template: '/views/venue/confirm_modal.html', show: false, animation: 'am-flip-x'});

        $scope.show_modal_confirm = function () {
            modal_confirm.$promise.then(modal_confirm.show);
        };
        $scope.hide_modal_confirm = function () {
            modal_confirm.$promise.then(modal_confirm.hide);
        };
        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
            _this.getOrderList();
        }}
        this.getOrderState=function (orderid, callback) {
            totalcount++;

            if (!orderid) {
                cb(null, 2);
            }
            $http({
                method: 'GET',
                url: '/api/order/getorderstate?orderid=' + orderid,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, headers, config) {
                if ((data.code == "0")) {

                    var orderstate=data.data.data?data.data.data:0;
                    callback(null,orderstate);
                }
                else if(totalcount>=30)
                {
                    callback(null,"2");

                }

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

    })