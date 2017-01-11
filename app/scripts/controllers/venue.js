/**
 * Created by zhigang on 14/12/24.
 */
'use strict';
angular.module('roshanGymDongkerApp')
    .controller('topMenu', function ($scope, $auth, $location) {

    })
    .service('venueService', function ($http, $q) {
        var _venue = {}

        _venue.getVenueList = function (start, end) {
            if (!end)
                end = start;
            /*var s = start.getFullYear()+'-'+start.getMonth()+'-'+start.getDate();
             var e = end.getFullYear()+'-'+end.getMonth()+'-'+end.getDate();*/
            var deferred = $q.defer();

            $http.get('/api/venue/list?start=' + start + '&end=' + end)
                .then(function (response) {
                    if (response) {
                        if (response.data == null || response.data.code > 0) {
                            deferred.reject(response);
                        }
                        else {
                            deferred.resolve(response);
                        }
                    } else {

                        deferred.reject(response);
                    }
                })
                .then(null, function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        }
        _venue.getStock = function (start, end, deffered) {

        }
        _venue.getStock = function (start, end, deffered) {

        }
        _venue.getProductBookingInfo = function (start, end, deferred) {

        }
        _venue.deleteVenue = function (prod_id) {
            var deferred = $q.defer();
            $http({method: 'GET', url: '/api/venue/delete?prod=' + prod_id})
                .then(function (response) {
                    if (response.data == null || response.data.code > 0) {
                        deferred.reject(response);
                    }
                    else {
                        deferred.resolve(response)
                    }
                }, function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }
        _venue.createVenue = function (venue) {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/api/venue/add', headers: { 'Content-Type': 'application/json' }, data: venue})
                .then(function (response) {
                    if (response.data == null || response.data.code > 0) {

                        deferred.reject('创建场地出错');
                    }
                    else {
                        deferred.resolve(response)
                    }

                }, function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }
        _venue.updatePrice = function (venue) {
            console.log(venue);
            var deferred = $q.defer();
            $http({method: 'POST', url: '/api/venue/price/adjust', headers: { 'Content-Type': 'application/json' }, data: venue})
                .then(function (response) {
                    deferred.resolve(response)
                }, function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }

        _venue.updateStock = function (stockOpts) {
            console.log(stockOpts);
            var deferred = $q.defer();
            var url = '/api/venue/stock/';
            if (stockOpts.isLock == 0) {
                url = url + 'unlock'
            }
            else {
                url = url + 'lock';
            }
            $http({method: 'POST', url: url, headers: { 'Content-Type': 'application/json' }, data: stockOpts})
                .then(function (response) {
                    deferred.resolve(response)
                }, function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }
        _venue.setBasicPrice = function (venue) {
            var deferred = $q.defer();
            $http({method: 'POST', url: '/api/venue/price/add', headers: { 'Content-Type': 'application/json' }, data: venue})
                .then(function (response) {
                    if (response.code > 0) {
                        deferred.reject(response.data.errorMessage);
                    }
                    deferred.resolve(response)
                }, function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }
        _venue.release = function (prod_id) {
            var deferred = $q.defer();
            $http({method: 'GET', url: '/api/venue/release?prod=' + prod_id})
                .then(function (response) {
                    deferred.resolve(response)
                }, function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }
        _venue.unrelease = function (prod_id) {
            var deferred = $q.defer();
            $http({method: 'GET', url: '/api/venue/unrelease?prod=' + prod_id})
                .then(function (response) {
                    deferred.resolve(response)
                }, function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }
        _venue.getgym=function(){
            var deferred = $q.defer();
            $http({method: 'GET', url: '/api/gym'})
                .then(function (response) {
                    deferred.resolve(response)
                }, function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }
        return _venue;
    })
    .service('venueUtil', function ($q) {
        var util = {}
        util.getDatePicker = function (today) {
            var datePickerList = [
                {date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), selected: true},
                {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), selected: false},
                {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), selected: false},
                {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), selected: false},
                {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4), selected: false},
                {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), selected: false},
                {date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6), selected: false}
            ]
            return datePickerList;
        }
        util.getTimeLine = function (start, end) {
            var times = []
            var index = start.getHours();
            var stop = end.getHours();
            while (index < stop) {
                var currentTime = new Date('2015-01-01');
                var timeStamp = {begin: currentTime.setHours(index), end: currentTime.setHours(index + 1)}
                times.push(timeStamp);
                index++;
            }
            return times
        }
        return util;
    })
    .controller('VenueListCtrl', function ($scope, $http, $q, $routeParams, $auth, $timeout, $rootScope, $alert, $modal, $const, venueService, venueUtil) {
        //view mode
        $scope.templates =
            [
                { name: '列表模式', value: 0, url: 'views/venue/venue_list.html'},
                { name: '摘要模式', value: 1, url: 'views/venue/venue_block.html'}
            ];
        $scope.template = $scope.templates[0];
        $scope.setShowMode = function (mode) {
            $scope.template = $scope.templates[mode];
        }

        $scope.venueNewProperty = angular.copy($const.defaultVenueProperty);

        var today = $rootScope.$current||new Date();
        $scope.today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        $scope.searchDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        $scope.datePickerList = venueUtil.getDatePicker(today);

        $scope.venuePropertiesModel = {
            floorTypeModel: angular.copy($const.floorTypeModel),
            standerdModel: angular.copy($const.standerdModel),
            indoorModel: angular.copy($const.indoorModel)
        }
        //initilize search option
        $scope.setSearchDay = function (index) {
            $scope.searchDay = $scope.datePickerList[index].date;
        }
        $scope.$watch('searchDay', function (newValue, oldValue) {

            var nd = new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate());
            angular.forEach($scope.datePickerList, function (value) {
                if (value.date.getTime() == nd.getTime())
                    value.selected = true;
                else {
                    value.selected = false;
                }
            });
            refreshVenueList(nd);
        });
        $scope.showProperSelect = false;
        $scope.selectedFloor = $scope.venuePropertiesModel.floorTypeModel[0];
        $scope.selectedIndoor = $scope.venuePropertiesModel.indoorModel[0];
        $scope.selectedStanderd = $scope.venuePropertiesModel.standerdModel[0];

        //initilize create venue model
        $scope.newVenue = {};

        $scope.properItemChanged = function (index, type) {
            switch (type) {
                case 0:
                    $scope.selectedIndoor = $scope.venuePropertiesModel.indoorModel[index];
                    break;
                case 1:
                    $scope.selectedFloor = $scope.venuePropertiesModel.floorTypeModel[index];
                    break;
                case 2:
                    $scope.selectedStanderd = $scope.venuePropertiesModel.standerdModel[index];
                    break;

            }
        }
        $scope.setProperty = function () {
            $scope.venueNewProperty.floor = $scope.selectedFloor;
            $scope.venueNewProperty.indoor = $scope.selectedIndoor;
            $scope.venueNewProperty.standerd = $scope.selectedStanderd;

            $scope.showProperSelect = false;
        }

        $scope.newVenueFormSubmit = function () {
            $scope.submitting = true;
            $scope.newVenue.indoor = $scope.venueNewProperty.indoor.value;
            $scope.newVenue.floor = $scope.venueNewProperty.floor.value;
            $scope.newVenue.standerd = $scope.venueNewProperty.standerd.value;
            $scope.newVenue.name;
            $scope.newVenue.available = 0,

                venueService.createVenue($scope.newVenue).then(function (res) {
                    $scope.submitting = false;
                    $scope.newVenue = {};
                    /*var myAlert = $alert({title: '恭喜!', content: '修改成功！', container: '#venue_add_msg', type: 'success',
                     show: true, duration: 3});*/
                    refreshVenueList();
                    $scope.newVenueForm.$setPristine();
                }, function (err) {
                    $scope.submitting = false;
                    var myAlert = $alert({title: '出错了', content: '创建失败！', container: '#venue_add_msg', type: 'danger',
                        show: true, duration: 5});
                })
        };
        $scope.clearKeys=function(){
            $("#newVenueName").attr("placeholder","");
        };

        $scope.setKeys=function(){
            $("#newVenueName").attr("placeholder","1号场");
        };


        //load venue list


        var payload = $auth.getPayload();
        /*$scope.gymServiceTime = payload ? payload.profile.gymSetting.serviceTime : {start: '0:00', end: '24:00'};
        var start = new Date('2015-01-01 ' + $scope.gymServiceTime.start);
        var end = new Date('2015-01-01 ' + $scope.gymServiceTime.end);
        $scope.venueTimeLine = venueUtil.getTimeLine(start, end);*/





        $scope.venueList = undefined;
//        getVenueList();
        function getVenueList() {
            venueService.getVenueList($scope.searchDay).then(function (res) {
                var v_list = res.data.data;
                for (var i = 0; i < v_list.length; i++) {
                    for (var j = 0; j < v_list[i].details.length; j++) {
                        if (v_list[i].details[j].basic_price > 0) {
                            v_list[i].price_exist = true;
                            break;
                        }
                    }
                }

                venueService.getgym().then(function (res) {

                    var start = new Date('2015-01-01 ' + res.data.data.gym.gym[0].start_time);
                    var end = new Date('2015-01-01 ' + res.data.data.gym.gym[0].end_time);
                    $scope.venueTimeLine = venueUtil.getTimeLine(start, end);
                    $scope.gymServiceTime = $scope.venueTimeLine;
                    $scope.serviceTime={"start_time":res.data.data.gym.gym[0].start_time,"end_time":res.data.data.gym.gym[0].end_time};
                    var start_time=$scope.serviceTime.start_time;
                    var end_time=$scope.serviceTime.end_time;
                    v_list.forEach(function(item){
                        item.details=$.grep(item.details,function(info){
                            return info.start_time>=new Date(2015,1,1,parseInt(start_time.slice(0,2)),0,0).getHours()&&info.end_time<=new Date(2015,1,1,parseInt(end_time.slice(0,2)),0,0).getHours();
                        });
                    });
                    $scope.venueList = v_list;
                    console.log(v_list);
                }, function (err) {
                    console.log(err);
                })

            }, function (err) {
                console.log(err);
            })
        }

        function refreshVenueList() {
            getVenueList();
            $scope.venueEditModel = {}
        }

        var modal_confirm = $modal({scope: $scope, placement: 'center', backdrop: 'static',
            template: '/views/venue/confirm_modal.html', show: false, animation: 'am-flip-x'});

        $scope.show_modal_confirm = function () {
            modal_confirm.$promise.then(modal_confirm.show);
        };
        $scope.hide_modal_confirm = function () {
            modal_confirm.$promise.then(modal_confirm.hide);
        };
        $scope.venueEditModel = {}
        $scope.setPrice = function (prod_id, index) {


            $scope.venueEditModel.current_venue = $scope.venueList[index];
            $scope.venueEditModel.operate_type = 0;
            $scope.venueEditModel.operate_title = '选择对哪些时段设置价格(只有设置了价格才能对外预订)';
            $scope.venueEditModel.basicPrice = 600;
            $scope.venueEditModel.venue_all_selected = false;
            $scope.venueEditModel.hasError = null;
            resetCurrentVenueState($scope.venueEditModel.current_venue);
            if ($scope.venueEditModel.current_venue.available > 0) {
//                var modal = new $scope.confirm_modal({title:'test',content:'hhehehe'});
                $scope.confirm_modal = {title: '设置价格', content: '该场地已上线,需要先将场地下线才能进行设置，确定要下线该场地？'};
                $scope.confirm_modal.onCancel = function () {
                    $scope.hide_modal_confirm();
                    return false;
                }
                $scope.confirm_modal.onOk = function () {
                    $scope.hide_modal_confirm();
                    $scope.setAvailable(0, prod_id, index);
                }
                $scope.show_modal_confirm();
            }
            else {
                $scope.venueEditModel.edit = prod_id;
            }
        }
        $scope.updatePrice = function (prod_id, index) {
            $scope.venueEditModel.edit = prod_id;
            $scope.venueEditModel.current_venue = $scope.venueList[index];
            $scope.venueEditModel.operate_type = 1;
            $scope.venueEditModel.operate_title = '选择调价时段';
            $scope.venueEditModel.venue_all_selected = false;
            $scope.venueEditModel.hasError = null;
            $scope.venueEditModel.startTime = $scope.searchDay;
            $scope.venueEditModel.endTime = $scope.searchDay;
            $scope.venueEditModel.maxDate = new Date($scope.searchDay.getFullYear(), $scope.searchDay.getMonth(), $scope.searchDay.getDate() + 30);
            delete $scope.venueEditModel['basicPrice'];
            resetCurrentVenueState($scope.venueEditModel.current_venue);
        }
        $scope.setStock = function (prod_id, index) {
            $scope.venueEditModel.edit = prod_id;
            $scope.venueEditModel.current_venue = $scope.venueList[index];
            $scope.venueEditModel.operate_type = 2;
            $scope.venueEditModel.operate_title = '选择关闭/开启的时段';
            $scope.venueEditModel.venue_all_selected = false;
            $scope.venueEditModel.hasError = null;
            $scope.venueEditModel.startTime = $scope.searchDay;
            $scope.venueEditModel.endTime = $scope.searchDay;
            $scope.venueEditModel.maxDate = new Date($scope.searchDay.getFullYear(), $scope.searchDay.getMonth(), $scope.searchDay.getDate() + 30);
            //lock time
            $scope.venueEditModel.stockLock_startTime = $scope.searchDay;
            $scope.venueEditModel.stockLock_endTime = $scope.searchDay;
            //lock or unlock? 0:unlock
            $scope.venueEditModel.isLockStock = 1;
            //color
            $scope.venueEditModel.colorFlag = 0;
            $scope.venueEditModel.isSetColor = false;
            //alarm
            $scope.venueEditModel.alarmDate = $scope.venueEditModel.startTime;
            $scope.venueEditModel.alarmContent = '一个场地关闭提醒';
            $scope.venueEditModel.Alarm = {};
            $scope.venueEditModel.isAlarm = false;

            $scope.venueEditModel.lockReason = '';

            delete $scope.venueEditModel['basicPrice'];
            delete  $scope.venueEditModel['price'];
            resetCurrentVenueState($scope.venueEditModel.current_venue);
        }
        $scope.setLockStockTime = function () {
            $scope.venueEditModel.startTime = $scope.venueEditModel.stockLock_startTime;
            $scope.venueEditModel.endTime = $scope.venueEditModel.stockLock_endTime;
            $scope.venueEditModel.dateSetting = false;
            return false;
        }

        $scope.setLockStockColorFlag = function () {
            $scope.venueEditModel.isSetColor = true;
            $scope.venueEditModel.flagSetting = false;
            return false;
        }
        $scope.clearLockStockColorFlag = function () {
            $scope.venueEditModel.isSetColor = false;
            $scope.venueEditModel.flagSetting = false;
        }
        $scope.setLockStockAlarm = function () {
            $scope.venueEditModel.Alarm = {};
            $scope.venueEditModel.Alarm.isAlarm = true;
            $scope.venueEditModel.Alarm.content = $scope.venueEditModel.alarmContent;
            $scope.venueEditModel.Alarm.alarmDate = $scope.venueEditModel.alarmDate;
//            $scope.venueEditModel.isAlarm = true;
            $scope.venueEditModel.alarmSetting = false;
            return false;
        }
        $scope.clearLockStockAlarm = function () {
            $scope.venueEditModel.Alarm = {};
            $scope.venueEditModel.alarmDate = $scope.venueEditModel.startTime;
            $scope.venueEditModel.alarmSetting = false;
        }
        function resetCurrentVenueState(venue) {
            angular.forEach(venue.details, function () {
                angular.forEach($scope.venueEditModel.current_venue.details, function (detail) {
                    delete detail['selected'];
                })
            })
        }

        $scope.cancelEdit = function () {
            $scope.venueEditModel = {};
        }

        function isSelectAll(list) {
            var f = true;
            angular.forEach(list, function (detail) {
                if (!detail.selected) {
                    f = false;
                    return;
                }
            })
            return f;
        }

        $scope.onCheckAllChanged = function () {
            console.log('changed ' + $scope.venueEditModel.current_venue.product_id);
            if (isSelectAll($scope.venueEditModel.current_venue.details)) {
                angular.forEach($scope.venueEditModel.current_venue.details, function (detail) {
                    detail.selected = false;
                });
            }
            else {
                angular.forEach($scope.venueEditModel.current_venue.details, function (detail) {
                    detail.selected = true;
                });
                $scope.venueEditModel.venue_all_selected = true;
            }
        };
        $scope.select = function (detail_id, index) {
            if ($scope.venueEditModel.current_venue.details[index].selected) {
                $scope.venueEditModel.current_venue.details[index].selected = false;
                $scope.venueEditModel.venue_all_selected = false;
            }
            else {
                $scope.venueEditModel.current_venue.details[index].selected = true;
                if (isSelectAll($scope.venueEditModel.current_venue.details)) {
                    $scope.venueEditModel.venue_all_selected = true;
                }
            }
        }
        function getSelectVenueItems(items) {
            var details = [];
            angular.forEach(items, function (detail) {
                if (detail.selected) {
                    details.push(detail.detail_id);
                }
            });
            return details;
        }

        $scope.onSetPriceSubmit = function (prod_id, index) {
            $scope.addpriceSubmitting = true;
            var details = getSelectVenueItems($scope.venueEditModel.current_venue.details);

            if (details.length == 0) {
                $scope.addpriceSubmitting = false;
                $scope.venueEditModel.hasError = '还没有选择要设置的时段!';
                return;
            }
            venueService.setBasicPrice({product_id: prod_id, price: $scope.venueEditModel.basicPrice, product_details: details})
                .then(function (res) {
                    angular.forEach($scope.venueList[index].details, function (detail) {
                        if (detail.selected) {
                            detail.basic_price = $scope.venueEditModel.basicPrice;
                        }
                    });
                    $scope.venueList[index].price_exist = true;
                    $scope.addpriceSubmitting = false;
                    $scope.venueEditModel.hasError = null;
                    $scope.venueEditModel.success = '设置成功!';
                    /*$timeout(function () {
                        $scope.venueEditModel = {}
                    }, 800);*/

                }, function (err) {
                    console.log(err);
                    $scope.venueEditModel.hasError = '保存出错';
                    $scope.addpriceSubmitting = false;
                })
        }
        $scope.onUpdatePriceSubmit = function (prod_id, index) {
            $scope.updatePriceSubmitting = true;
            var details = getSelectVenueItems($scope.venueEditModel.current_venue.details);
            if (details.length == 0) {
                $scope.updatePriceSubmitting = false;
                $scope.venueEditModel.hasError = '还没有选择要设置的时段!';
                return;
            }
            venueService.updatePrice(
                {product_id: prod_id, price: $scope.venueEditModel.price, product_details: details,
                    start: $scope.venueEditModel.startTime, end: $scope.venueEditModel.endTime})
                .then(function (res) {
                    if ($scope.searchDay >= $scope.venueEditModel.startTime) {
                        angular.forEach($scope.venueList[index].details, function (detail) {
                            if (detail.selected) {
                                detail.price = $scope.venueEditModel.price;
                            }
                        });
                    }
                    $scope.updatePriceSubmitting = false;
                    $scope.venueEditModel.hasError = null;
                    $scope.venueEditModel.success = '设置成功!';

                }, function (err) {
                    console.log(err);
                    $scope.venueEditModel.hasError = '保存出错';
                    $scope.updatePriceSubmitting = false;
                })
        }

        $scope.onUpdateStockSubmit = function (prod_id, index) {
            $scope.updateStockSubmitting = true;
            var details = getSelectVenueItems($scope.venueEditModel.current_venue.details);
            if (details.length == 0) {
                $scope.updateStockSubmitting = false;
                $scope.venueEditModel.hasError = '还没有选择要设置的时段!';
                return;
            }
            var stock = {
                product_id: prod_id,
                isLock: $scope.venueEditModel.isLockStock,
                product_details: details,
                start: $scope.venueEditModel.startTime,
                end: $scope.venueEditModel.endTime,
                alarm: {alarmTime: $scope.venueEditModel.Alarm.alarmDate, alarmContent: $scope.venueEditModel.Alarm.content, isAlarm: $scope.venueEditModel.Alarm.isAlarm},
                colorFlag: {  color: $scope.venueEditModel.colorFlag, isSetColor: $scope.venueEditModel.isSetColor},
                reason: $scope.venueEditModel.lockReason
            }
            venueService.updateStock(stock).then(
                function (res) {
                    $scope.updateStockSubmitting = false;
                    $scope.venueEditModel.hasError = null;
                    $scope.venueEditModel.success = '设置成功!';
                },
                function (err) {
                    console.log(err);
                    $scope.venueEditModel.hasError = '保存出错';
                    $scope.updateStockSubmitting = false;
                }
            )
        };
        $scope.setAvailable = function (on, pid, index) {
            if (on == 1) {
                var details = $scope.venueList[index].details;
                var f = false;
                angular.forEach(details, function (detail) {
                    if (detail.basic_price == 0) {
                        f = true;
                        return;
                    }
                })
                if (f) {
                    $scope.confirm_modal = {title: '场地上线', content: '该场地有些时段没有设置价格,确定要上线?'};
                    $scope.confirm_modal.onCancel = function () {
                        $scope.hide_modal_confirm();
                        return false;
                    }
                    $scope.confirm_modal.onOk = function () {
                        $scope.hide_modal_confirm();

                        venueService.release(pid).then(
                            function (res) {
                                console.log(res);
                                $scope.venueList[index].available = 1;
                            },
                            function (err) {
                                console.log(err);
                            }
                        );

                    }
                    $scope.show_modal_confirm();
                }
                else {
                    venueService.release(pid).then(
                        function (res) {
                            console.log(res);
                            $scope.venueList[index].available = 1;
                        },
                        function (err) {
                            console.log(err);
                        }
                    );
                }

            }
            else {
                $scope.confirm_modal = {title: '场地下线', content: '场地下线后将无法提供预订,确定要下线该场地?'};
                $scope.confirm_modal.onCancel = function () {
                    $scope.hide_modal_confirm();
                    return false;
                }
                $scope.confirm_modal.onOk = function () {
                    $scope.hide_modal_confirm();

                    venueService.unrelease(pid).then(
                        function (res) {
                            $scope.venueList[index].available = 0;
                        },
                        function (err) {
                            console.log(err);
                        }
                    )

                }
                $scope.show_modal_confirm();


            }
        }
        $scope.deleteVenue = function (prod_id, index) {
            $scope.confirm_modal = {title: '删除场地', content: '确定要删除该场地?'};
            $scope.confirm_modal.onCancel = function () {
                $scope.hide_modal_confirm();
                return false;
            }
            $scope.confirm_modal.onOk = function () {
                $scope.hide_modal_confirm();

                venueService.deleteVenue(prod_id).then(
                    function (res) {
                        refreshVenueList();
                    },
                    function (err) {
                        console.log(err);
                    }
                );

            }
            $scope.show_modal_confirm();
        }
    })
