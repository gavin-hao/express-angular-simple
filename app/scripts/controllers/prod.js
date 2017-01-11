/**
 * Created by zhigang on 14-9-26.
 */
'use strict';
angular.module('roshanGymDongkerApp')
    .directive('operate', function () {
        return {
            scope: {item: '='},
            restrict: 'E',
            template: '<span> {{item.product_name}}</span>',
            replace: true
        };
    })
    .controller('addproCtrl', function ($scope, $http, $routeParams, $popover) {

        $scope.test = function () {
            alert(1);
        };
        $scope.changeIndoor = function (cb) {
            cb = cb || function () {
            };
            $http.get('/api/venue/venues?indoor=' + $scope.indoor.id)
                .success(function (response) {
                    $scope.venueResult = response;
                    cb();
                });
        };
        $scope.changeFloor = function (cb) {
            cb = cb || function () {
            };
            $scope.changeIndoor(function () {
                var floortype = $scope.floor.id;
                $scope.venueResult = $.grep($scope.venueResult, function (obj) {
                    return obj.floor_type == floortype;
                })
                cb();
            });
        };
        $scope.changeStanderd = function () {
            $scope.changeFloor(function () {
                var standerd = $scope.standerd.id;
                $scope.venueResult = $.grep($scope.venueResult, function (obj) {
                    return obj.standerd == standerd;
                })
            })
        };
        $scope.operateVenue = function (venue) {
            if ($('#v-' + venue.id).attr('class').indexOf('active') >= 0) {
                $('#v-' + venue.id).removeClass('active');
                /*$scope.venueResult= $.grep($scope.venueResult,function(obj){
                 return obj.id!=venue.id;
                 })*/
            } else {
                $('#v-' + venue.id).addClass('active');
                /*$scope.venueResult.push(venue);*/
            }

        };
        $scope.processForm = function () {
            var obj = {};
            obj.sale_starttime = $scope.viewModel.sdate;
            obj.sale_endtime = $scope.viewModel.edate;
            obj.venue_id = [];
            if ($scope.venueResult.length > 0) {
                /*$scope.venueResult.forEach(function(item){
                 obj.venue_id.push(item.id);
                 })*/
                $("a[tag='venue']").each(function (index, item) {
                    var id = item.id;
                    var className = $("#" + id).attr("class");
                    if (className.indexOf("active") >= 0) {
                        obj.venue_id.push($("#" + id).attr("vid"));
                    }
                })
            }
            //obj.gym_id=
            obj.indoor = $scope.indoor.id;
            obj.floor_type = $scope.floor.id;
            obj.standerd = $scope.standerd.id;
            obj.product_type = $scope.producttype;
            obj.product_name = $scope.productName || $scope.indoor.productName + $scope.floor.productName + $scope.standerd.productName;
            obj.issue = $scope.viewModel.issue;
            $http({
                method: 'POST',
                url: '/api/product/add',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data && data.code == 0) {
                    //alert(data.code + '操作成功'+data.data);
                    obj.product_id = data.data;
                    obj.start_time = $scope.shours.getHours();
                    obj.end_time = $scope.ehours.getHours();
                    obj.price = $scope.price;
                    obj.tag = '';
                    $http({
                        method: 'POST',
                        url: '/api/price/add',
                        // set the headers so angular passing info as form data (not request payload)
                        headers: { 'Content-Type': 'application/json' },
                        data: obj  // pass in data as strings
                    }).success(function (dt, status, headers, config) {
                        if (dt && dt.code == 0) {
                            //alert('操作成功');
                            $scope.isshowtip = true;
                            $scope.alert = initalert("success", "提交成功", "alert alert-success alert-dismissible");

                        }
                        else {
                            $scope.isshowtip = true;
                            $scope.alert = initalert("error", "提交失败", "alert alert-danger alert-dismissible");
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.isshowtip = true;
                        $scope.alert = initalert("error", "提交失败", "alert alert-danger alert-dismissible");
                    });

                }
                else {
                    $scope.isshowtip = true;
                    $scope.alert = initalert("error", "提交失败", "alert alert-danger alert-dismissible");
                }
            }).error(function (data, status, headers, config) {
                $scope.isshowtip = true;
                $scope.alert = initalert("error", "提交失败", "alert alert-danger alert-dismissible");
            });
        };

        $scope.selected = '';
        $scope.ptmodel = ptmodel;
        $scope.indoormodel = indoormodel;
        $scope.floormodel = floormodel;
        $scope.standerdmodel = standerdmodel;
        $scope.hourModel = hourModel;

    })
    .controller('ProdCtrl', function ($scope, $timeout, $alert, $http, $popover, $sce, $modal) {
        $scope.ptmodel = ptmodel;
        $scope.indoormodel = indoormodel;
        $scope.floormodel = floormodel;
        $scope.standerdmodel = standerdmodel;
        $scope.hourModel = hourModel;
        $scope.loading = false;
        $scope.hasProd = false;
        $scope.newProd = {};

        $scope.selectedVenues = [];
        $scope.avilableVenues = [];
        /*$scope.venues = [
         {name: '1号场', floor: '2', indoor: '0', standerd: '1'},
         {name: '2号场', floor: '木地板', indoor: '室内', standerd: '全场'},
         {name: '3号场', floor: '木地板', indoor: '室内', standerd: '全场'},
         {name: '4号场', floor: '塑胶地板', indoor: '室外', standerd: '全场'},
         {name: '5号场', floor: '水泥地板', indoor: '室外', standerd: '半场'}
         ];*/
        $http.get("/api/venue/list")
            .success(function (response) {
                if (response.code == 0) {
                    $scope.venues = response.data;
                    //$scope.isshow = $scope.viewModel.venues.length === 0;
                } else {
                    //alert('调用api失败');
                    //$scope.isshowtip=true;
                    //$scope.alert =initalert("error","获取场地信息失败","alert alert-danger alert-dismissible");

                }
            });

        $scope.showCreateForm = function () {
            $scope.newProd = {}
            $scope.prodAdding = true;
        }

        $scope.addProdCancel = function () {

            $scope.prodAdding = false;
        };


        $scope.createProdSubmit = function () {
            $scope.submitting = true;
            $timeout(function () {
                //todo:imp your business
                //alert(JSON.stringify($scope.newProd));


                var obj = {};
                obj.sale_starttime = $scope.newProd.fromDate;
                obj.sale_endtime = $scope.newProd.untilDate;
                obj.venue_id = [];
                if ($scope.avilableVenues.length > 0) {
                    /*$scope.venueResult.forEach(function(item){
                     obj.venue_id.push(item.id);
                     })*/
                    $("a[tag='venue']").each(function (index, item) {
                        var id = item.id;
                        var className = $("#" + id).attr("class");
                        if (className.indexOf("active") >= 0) {
                            obj.venue_id.push($("#" + id).attr("vid"));
                        }
                    })
                }
                //obj.gym_id=
                obj.indoor = $scope.newProd.indoor;
                obj.floor_type = $scope.newProd.floor;
                obj.standerd = $scope.newProd.standerd;
                obj.product_type = $scope.newProd.category;
                obj.product_name = $scope.newProd.name || enumIndoor[$scope.newProd.indoor] + enumFloor[$scope.newProd.floor] + enumStanderd[$scope.newProd.standerd];
                obj.issue = $scope.newProd.issue;
                $http({
                    method: 'POST',
                    url: '/api/product/add',
                    // set the headers so angular passing info as form data (not request payload)
                    headers: { 'Content-Type': 'application/json' },
                    data: obj  // pass in data as strings
                }).success(function (data, status, headers, config) {
                    if (data && data.code == 0) {
                        //alert(data.code + '操作成功'+data.data);
                        obj.product_id = data.data;
                        obj.start_time=[];
                        obj.start_time.push($scope.newProd.fromTime.getHours());
                        obj.start_time.push($scope.newProd.untilTime.getHours());
                        //obj.end_time = $scope.newProd.untilTime.getHours();
                        obj.price = $scope.newProd.price;
                        obj.tag = '';
                        $http({
                            method: 'POST',
                            url: '/api/price/add',
                            // set the headers so angular passing info as form data (not request payload)
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            transformRequest: function (obj) {
                                var str = [];
                                for (var p in obj)
                                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                return str.join("&");
                            },
                            data: obj  // pass in data as strings
                        }).success(function (dt, status, headers, config) {
                            if (dt && dt.code == 0) {
                                /*//alert('操作成功');
                                $scope.isshowtip = true;
                                $scope.alert = initalert("success", "提交成功", "alert alert-success alert-dismissible");*/
                                var myAlert = $alert({title: '恭喜!', content: '创建成功！您可以在产品列表中找到该产品继续编辑。', container: '#alerts-container', type: 'success',
                                    show: true, duration: 3});
                            }
                            else {
                                /*$scope.isshowtip = true;
                                $scope.alert = initalert("error", "提交失败", "alert alert-danger alert-dismissible");*/
                                var myAlert = $alert({title: '抱歉!', content: '创建失败！', container: '#alerts-container', type: 'danger',
                                    show: true, duration: 3});
                            }
                        }).error(function (data, status, headers, config) {
                            var myAlert = $alert({title: '抱歉!', content: '创建失败！', container: '#alerts-container', type: 'danger',
                                show: true, duration: 3});
                        });

                    }
                    else {
                        var myAlert = $alert({title: '抱歉!', content: '创建失败！', container: '#alerts-container', type: 'danger',
                            show: true, duration: 3});
                    }
                }).error(function (data, status, headers, config) {
                    var myAlert = $alert({title: '抱歉!', content: '创建失败！', container: '#alerts-container', type: 'danger',
                        show: true, duration: 3});
                });

                $timeout(function () {
                    getAllproducts($scope,$http);
                    $scope.submitting = false;
                    $scope.prodAdding = false;
                }, 3000)
            }, 800);

        }
        function searchVenues(venues, predicate) {
            if (!venues || venues.length == 0)
                return [];
            var result = [];
            angular.forEach(venues, function (venue, index) {
                if ((predicate.floor == undefined || venue.floor_type == predicate.floor) &&
                    (predicate.indoor == undefined || venue.indoor == predicate.indoor) &&
                    (predicate.standerd == undefined || venue.standerd == predicate.standerd)) {
                    result.push(venue);
                }
            });
            return result;
        }

        $scope.$watch(function () {
            return $scope.newProd.indoor + ',' + $scope.newProd.floor + ',' + $scope.newProd.standerd;
        }, function () {
            $scope.newProd.name = (enumIndoor[$scope.newProd.indoor] || '')
                + (enumFloor[$scope.newProd.floor] || '')
                + (enumStanderd[$scope.newProd.standerd] || '');
            /*var paramsObj={indoor: $scope.newProd.indoor||-1,
             floor: $scope.newProd.floor==='undefined'?-1:$scope.newProd.floor,
             standerd:  $scope.newProd.standerd==='undefined'?-1:$scope.newProd.standerd};*/
            var paramsObj = {indoor: $scope.newProd.indoor, floor: $scope.newProd.floor, standerd: $scope.newProd.standerd}
            $scope.avilableVenues = searchVenues($scope.venues, paramsObj);
        });
        $scope.operateVenue = function (venue) {
            if ($('#v-' + venue.id).attr('class').indexOf('active') >= 0) {
                $('#v-' + venue.id).removeClass('active');
                /*$scope.venueResult= $.grep($scope.venueResult,function(obj){
                 return obj.id!=venue.id;
                 })*/
            } else {
                $('#v-' + venue.id).addClass('active');
                /*$scope.venueResult.push(venue);*/
            }

        };
        $scope.open = function (item) {
            $scope.product_id = item.products[0].product_id;
            $scope.price_starttime = item.products[0].price_starttime;
            $scope.price_endtime = item.products[0].price_endtime;
            $scope.title = '添加时段';
            $modal({scope: $scope, template: '/views/prod/addtime.html', show: true, placement: 'bottom'});
        };
        $scope.editprice = function (item,pro) {
            $scope.productName = item.products[0].product_name;
            $scope.price_starttime=pro.price_starttime;
            //$scope.price_endtime=pro.price_endtime;
            $modal({scope: $scope, template: '/views/prod/editprice.html', show: true, placement: 'bottom'});
        }
        $scope.editrePertory=function(){
            $modal({scope: $scope, template: '/views/prod/editrepertory.html', show: true, placement: 'bottom'});
        }
        getAllproducts($scope,$http);
        $scope.setprice = function (item) {
            //alert(item.id);
            $scope.price_id = item.id;
            $scope.title = '添加价格';
            $modal({scope: $scope, template: '/views/prod/changeprice.html', show: true, placement: 'bottom'});
        };
        $scope.showMorePrice = function (item) {
            $scope.item = item;
            $modal({scope: $scope, template: '/views/prod/pricerecord.html', show: true});
        };
        $scope.setProductStatus = function (product_id, status) {
            var obj = {};
            obj.product_id = product_id;
            obj.status = status;
            $http({
                method: 'POST',
                url: '/api/product/online',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data && data.code == 0) {
                    //alert('操作成功');
                    window.location = window.location;
                }
            }).error(function (data, status, headers, config) {

            });
        };
        $scope.deleteproduct = function (price_id, product_state) {
            if (!confirm("确定要删除吗?"))return;
            if (product_state == 1) {
                alert("请先将产品下线再执行删除操作");
                return;
            }
            var obj = {};
            obj.price_id = price_id;
            $http({
                method: 'POST',
                url: '/api/product/delete',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data && data.code == 0) {
                    //alert('操作成功');
                    window.location = window.location;
                }
            }).error(function (data, status, headers, config) {
                //alert("error");
            });
        };


    })
    .controller('ProductCtrl', function ($scope, $http, $q) {
        //维护价格
        $scope.priceForm = function () {
            var obj = {};
            obj.sale_starttime = $scope.viewModel.sdate;
            obj.sale_endtime = $scope.viewModel.edate;
            obj.product_id = 2;
            obj.start_time = $scope.shours.value;
            obj.end_time = $scope.ehours.value;
            obj.price = $scope.price;
            obj.tag = '';
            $http({
                method: 'POST',
                url: '/api/price/add',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                alert('操作成功');
            }).error(function (data, status, headers, config) {
                //alert("error");
            });
        }

    }).controller('addtimeCtrl',function($scope,$http){
        $scope.hourModel = hourModel;
        $scope.submitForm = function () {
            var obj = {};
            obj.sale_starttime = $scope.price_starttime;
            obj.sale_endtime = $scope.price_endtime;
            obj.product_id = $scope.product_id;
            obj.start_time = $scope.shours.getHours();
            obj.end_time = $scope.ehours.getHours();
            obj.price = $scope.price;
            obj.tag = '';
            $http({
                method: 'POST',
                url: '/api/price/add',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                $scope.isshowtip = true;
                $scope.alert = initalert("success", "提交成功", "alert alert-success alert-dismissible");
                window.location = window.location;
            }).error(function (data, status, headers, config) {
                $scope.isshowtip = true;
                $scope.alert = initalert("error", "提交失败", "alert alert-danger alert-dismissible");
            });
        }
    })
    .controller('changepriceCtrl',function($scope,$http){
        $scope.submitForm = function () {
            var obj = {};
            obj.price_id = $scope.price_id;
            obj.price = $scope.price;
            $http({
                method: 'POST',
                url: '/api/price/update',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                $scope.isshowtip = true;
                $scope.alert = initalert("success", "提交成功", "alert alert-success alert-dismissible");
                window.location = window.location;
            }).error(function (data, status, headers, config) {
                $scope.isshowtip = true;
                $scope.alert = initalert("error", "提交失败", "alert alert-danger alert-dismissible");
            });
        }
    })
    .controller('changeRecordCtrl',function($scope,$http){
        var item = $scope.item;
        var parent_id = item.id;
        $http.get("/api/price/" + parent_id)
            .success(function (response) {
                if (response.code == 0) {
                    $scope.morePrice = response.data;

                }
            })
            .error(function (msg) {
                //alert('调用api失败');
            });
    })
    .controller('dateModifyCtrl',function($scope,$http){
        var year=$scope.price_year=new Date($scope.price_starttime).getFullYear();
        var month=$scope.price_month=new Date($scope.price_starttime).getMonth();
        $scope.weekArrays=setCalendar(year,month);
        $scope.changeDate=function(){
            $scope.weekArrays=setCalendar($scope.price_year,$scope.price_month);
        }

    })
    .controller('repertoryCtrl',function($scope,$http,$modal){
        $scope.batchedit=function(){
            $modal({scope: $scope, template: '/views/prod/batchedit.html', show: true, placement: 'bottom'});
        }
    })
    .controller('batchCtrl',function($scope,$http){

    })
;
var getAllproducts=function($scope,$http){
    $scope.loading=true;
    $http.get("/api/products")
        .success(function (response) {
            if (response.code == 0) {
                $scope.proModel = response.data;
                $scope.loading = false;
                $scope.hasProd = $scope.proModel && $scope.proModel.length > 0;
            }
        })
        .error(function (msg) {
            $scope.loading = false;
            $scope.hasProd = false;
            //alert('调用api失败');
        });
}
var enumProdType = {
    0: '整场预定',
    1: '散场预定'
};
var enumIndoor = {
    0: '室内',
    1: '室外'
}
var enumFloor = {
    0: '木地板',
    1: '塑胶地板',
    2: '水泥地'
};
var enumStanderd = {
    0: '半场',
    1: '全场'
}
var ptmodel = [
    {
        id: 0,
        productName: enumProdType[0]
    },
    {
        id: 1,
        productName: enumProdType[1]
    }
];
var indoormodel = [
    {
        id: 0,
        productName: enumIndoor[0]
    },
    {
        id: 1,
        productName: enumIndoor[1]
    }
];
var floormodel = [
    {
        id: 0,
        productName: enumFloor[0]
    },
    {
        id: 1,
        productName: enumFloor[1]
    },
    {
        id: 2,
        productName: enumFloor[2]
    }
];
var standerdmodel = [
    {
        id: 0,
        productName: enumStanderd[0]
    },
    {
        id: 1,
        productName: enumStanderd[1]
    }
];
var hourModel = [
    {
        value: 0,
        text: '00:00'
    },
    {
        value: 1,
        text: '01:00'
    },
    {
        value: 2,
        text: '02:00'
    },
    {
        value: 3,
        text: '03:00'
    }
];
//提示框
var initalert = function (title, content, type) {
    return {
        "title": title,
        "content": content,
        "type": type
    };
}
//获取当前系统时间
function getNow() {
    var oDate = new Date();        //声明一个日期对象
    var hour = oDate.getHours();        //获取当前时
    var minute = oDate.getMinutes();//获取当前分
    var updown;        //上午下午

    //判断上下午
    if (hour >= 12) {
        hour -= 12;
        updown = "下午";
    }
    else {
        updown = "上午";
    }

    hour = (hour == 0) ? 12 : hour;        //判断是否为０时

    //分钟数小于１０则补零
    if (minute < 10) {
        minute = "0" + minute;
    }
    return (hour + ':' + minute + '' + updown);
}

function isDouble(year) {
    if (year % 4 == 0)        //年份能被４整除为闰年
    {
        return true;
    }
    else {
        return false;
    }
}
//获取选择月对应的实际天数
function getDays(month, year) {
    //设定每月的实际天数（１２个月中只有２月会在闰年和非闰年时天数不同）
    var days = new Array(12);
    days[0] = 31;
    days[1] = (isDouble(year)) ? 29 : 28;        //２月份时闰年为29天，否则为28天
    days[2] = 31;
    days[3] = 30;
    days[4] = 31;
    days[5] = 30;
    days[6] = 31;
    days[7] = 31;
    days[8] = 30;
    days[9] = 31;
    days[10] = 30;
    days[11] = 31;
    return days[month];
}

//获取月名称
function getMonthName(m) {
    var month = new Array(12);
    month[0] = "1月";
    month[1] = "2月";
    month[2] = "3月";
    month[3] = "4月";
    month[4] = "5月";
    month[5] = "6月";
    month[6] = "7月";
    month[7] = "8月";
    month[8] = "9月";
    month[9] = "10月";
    month[10] = "11月";
    month[11] = "12月";
    return month[m];
}

//设置日历参数
function setCalendar(year,month) {
    var oDate = new Date(year,month-1,"1");
    var year = oDate.getFullYear();        //获取当前时间年份

    var month = oDate.getMonth(); //获取当前时间月份
    var monthName = getMonthName(month);        //获取月份名称
    var currentDay = oDate.getDate();        //获取当前日期中的日

    var firstWeekDay = (new Date(year, month, 1)).getDay();  //获取本月的第一天对应的星期数

    var thisMonthDay = getDays(month, year);        //获取当前日期天数（也是当月对应的最后一天）

    //显示日历
    return showCalendar(firstWeekDay + 1, thisMonthDay, currentDay, monthName, year);
}
//显示日历
function showCalendar(firstWeekDay, thisMonthDay, currentDay, monthName, year) {
    var day = 1;                //显示日
    var pos = 1;        //单元格定位
    var returnArray=[];
    for (var row = 1; row <= Math.ceil((thisMonthDay + firstWeekDay - 1) / 7); ++row) {
        var insideArray=[];
        for (var cell = 1; cell <= 7; ++cell) {
            if (day > thisMonthDay) {
                //循环补足最后一行的下月数据
                for(var t=0;t<7-cell+1;t++){
                    insideArray.push('');
                }
                break;
            }
            if (pos < firstWeekDay) {
                insideArray.push('');
                pos++;
            }
            else {
                if (day == currentDay)        //如果日期为当天则用红色加粗显示
                {

                }
                else {

                }
                insideArray.push(day);
                day++;
            }
        }
        returnArray.push(insideArray);
    }
    return returnArray;
}