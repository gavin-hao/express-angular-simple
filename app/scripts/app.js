'use strict';

/**
 * @ngdoc overview
 * @name roshanGymDongkerApp
 * @description
 * # roshanGymDongkerApp
 *
 * Main module of the application.
 */
angular
    .module('roshanGymDongkerApp', [
        'ngCookies',
        'ngRoute',
        'ngAnimate',
        'mgcrea.ngStrap',
        'angularFileUpload',
        'ngMessages',
        'dongker.auth',
        'dongker.calendar',
        'notificationWidget'
    ])

    .config(function ($typeaheadProvider, $datepickerProvider) {
        angular.extend($datepickerProvider.defaults, {
//            container: 'body',
            dateFormat: 'yyyy/MM/dd',//'dd/MM/yyyy',
            startWeek: 1,
            autoclose: true
        });
        angular.extend($typeaheadProvider.defaults, {
            animation: 'am-flip-x',
            minLength: 2,
            limit: 8
        });
    })
    .config(function ($routeProvider, $locationProvider, $authProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/default.html',
                controller: 'MainCtrl',
                requiresLogin: false
            })
            .when('/index', {
                templateUrl: '/views/main.html',
                controller: 'MainCtrl',
                requiresLogin: false
            })
            .when('/venue', {
                templateUrl: '/views/venue/index.html',
                controller: 'VenueListCtrl',
                requiresLogin: true
            })
            .when('/venue/setting/price', {
                templateUrl: '/views/venue/price.html',
                controller: 'VenueSettingPriceCtrl',
                requiresLogin: true
            })
            .when('/venue/setting/stock', {
                templateUrl: '/views/venue/stock.html',
                controller: 'VenueSettingStockCtrl',
                requiresLogin: true
            })
            .when('/reserve', {
                templateUrl: '/views/reserve/index.html',
                controller: 'ReserveCtrl',
                requiresLogin: true
            })
            .when('/setting', {
                templateUrl: '/views/setting/index.html',
                controller: 'SettingCtrl',
                requiresLogin: true
            })
            .when('/setting/security', {
                templateUrl: '/views/setting/secure.html',
                controller: 'SecuritySettingCtrl',
                requiresLogin: true
            })
            .when('/setting/account', {
                templateUrl: '/views/setting/account.html',
                controller: 'AccountSettingCtrl',
                requiresLogin: true
            })
            .when('/setting/message/:page', {
                templateUrl: '/views/setting/message.html',
                controller: 'MsgSettingCtrl',
                requiresLogin: true
            })
            .when('/setting/message', {
                templateUrl: '/views/setting/message.html',
                controller: 'MsgSettingCtrl',
                requiresLogin: true
            })
            .when('/setting/notice/:page', {
                templateUrl: '/views/setting/notice.html',
                controller: 'NoticeSettingCtrl',
                requiresLogin: true
            })
            .when('/gym/prod', {
                templateUrl: '/views/gym/index2.html',
                controller: 'GymCtrl',
                requiresLogin: true
            })
            .when('/gym/venue', {
                templateUrl: '/views/gym/index2.html',
                controller: 'GymVenueCtrl',
                requiresLogin: true
            })
            .when('/gym/image', {
                templateUrl: '/views/gym/index2.html',
                controller: 'GymImageCtrl',
                requiresLogin: true
            })
            .when('/login', {
                templateUrl: '/views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: '/views/logout.html',
                controller: 'LogoutCtrl'
            })
            .when('/signup', {
                templateUrl: '/views/signup.html',
                controller: 'SignupCtrl',
                requiresLogin: false
            })
            .when('/signup/:step', {
                templateUrl: '/views/signup.html',
                controller: 'SignupCtrl',
                requiresLogin: false
            })
            .when('/gym/basic', {
                templateUrl: '/views/gym/index.html',
                controller: 'GymCtrl',
                requiresLogin: true
            })
            .when('/gym/venue_list', {
                templateUrl: '/views/gym/venue_list.html',
                controller: 'GymVenueListCtrl',
                requiresLogin: true
            })
            .when('/gym/qualification', {
                templateUrl: '/views/gym/qualification.html',
                controller: 'GymQualifiCtrl',
                requiresLogin: true
            })
            .when('/gym/balance', {
                templateUrl: '/views/gym/balance.html',
                controller: 'GymBalanceCtrl',
                requiresLogin: true
            })
            .when('/p/list', {
                templateUrl: '/views/prod/list.html',
                controller: 'ProdCtrl',
                requiresLogin: true
            })
            .when('/p/product', {
                templateUrl: '/views/prod/product.html',
                controller: 'ProductCtrl',
                requiresLogin: true
            })
            .when('/order/list', {
                templateUrl: '/views/order/list.html',
                controller: 'OrderListCtrl',
                requiresLogin: true
            })
            .when('/order/detail', {
                templateUrl: '/views/order/orderdetail.html',
                controller: 'getOrderDetail',
                requiresLogin: true
            })
            .when('/booking/list', {
                templateUrl: '/views/booking/bookinglist.html',
                controller: 'getAllBookingProduct',
                requiresLogin: true
            })
            .when('/settings', {
                templateUrl: '/views/about.html',
                controller: 'AboutCtrl',
                requiresLogin: true
            })
            .when('/booking/getbookingproduct', {
                templateUrl: '/views/booking.html',
                controller: 'getAllBookingProduct',
                requiresLogin: true
            })
            .when('/about', {
                templateUrl: '/views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/weixin',
            {
                templateUrl: '/views/weixin.html',
                controller: 'weixincntroller'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode(true);
        //$auth options settings
        $authProvider.loginUrl = '/authenticate';
        $authProvider.loginRedirect = '/index';
        $authProvider.minutesToRenewToken = 5;
        $authProvider.on('unauthorized', function (res) {
            $locationProvider.path('/login');
        });
    })
    .run(['$const', function ($const) {
        $const.syncTime();
    }])
    .factory('$const', function ($http, $timeout, $rootScope, $auth, $q) {
        var dongkerConst = {};

        function syncTime() {
            $http.get('/timesync').success(function (response) {
                $rootScope.$current = new Date(response);
                $timeout(syncTime, 60000)
            }).error(function (data) {
                $timeout(syncTime, 600000)
            });
        }

        dongkerConst.syncTime = function () {
            syncTime();
        }

        dongkerConst.standerdModel = [
            {
                text: '全场', value: 1
            },
            {
                text: '半场', value: 0
            }

        ];
        dongkerConst.floorTypeModel = [
            {
                text: '木地板', value: 0, display: '木地板'
            },
            {
                text: '塑胶', value: 1, display: '塑胶地板'
            },
            {
                text: '水泥', value: 2, display: '水泥地板'
            },
            {
                text: '沥青', value: 3, display: '沥青地板'
            }
        ];
        dongkerConst.indoorModel = [
            {
                text: '室内', value: 0
            },
            {
                text: '室外', value: 1
            }
        ];
        dongkerConst.defaultVenueProperty = {
            indoor: dongkerConst.indoorModel[0],
            floor: dongkerConst.floorTypeModel[0],
            standerd: dongkerConst.standerdModel[0]
        }
        return dongkerConst;
    })
    .filter('venuePropertyFilter', function () {
        return function (input) {
            var ret = input.display || input.text;
            return ret;
        }
    })
    .filter('colorFlagFilter', function () {
        return function (input) {
            switch (input.toString()) {
                case "0":
                    return {name: '红色', css: 'text-red'};
                case "1":
                    return {name: '黄色', css: 'text-yellow'};
                case "2":
                    return {name: '蓝色', css: 'text-blue'};
                case "3":
                    return {name: '绿色', css: 'text-green'};
            }
        }
    })
    .filter('standerdFilter', [function () {
        return function (input) {
            switch (input.toString()) {
                case "0":
                    return '半场';
                case "1":
                    return '全场';

            }
        }
    }])
    .filter('floorFilter', [function () {
        return function (input) {
            switch (input.toString()) {
                case "0":
                    return '木地板';
                case "1":
                    return '塑胶地板';
                case "2":
                    return '水泥地板';
                case "3":
                    return '沥青地板';
            }
        }
    }])
    .filter('indoorFilter', [function () {
        return function (input) {
            var inputs = typeof(input) != "undefined" ? input.toString() : '';
            switch (inputs) {
                case "0":
                    return '室内';
                case "1":
                    return '室外';
            }
        }
    }])
    .filter('productTypeFilter', [function () {
        return function (input) {
            switch (input) {
                case 0:
                    return '整场';
                case 1:
                    return '散场';
            }
        }
    }])
    .filter('productStateFilter', [function () {
        return function (input) {
            switch (input) {
                case 0:
                    return '未上线';
                case 1:
                    return '已上线';
                case 2:
                    return '已下线';
            }
        }
    }])
    .filter('changePriceFilter', [function () {
        return function (input) {
            switch (input) {
                case 0:
                    return '设置';
                case null:
                    return '设置';
                default:
                    return input + '元/小时';
            }
        }
    }])
    .filter('orderState', [function () {
        return function (input) {
            switch (input) {
                case '1':
                    return '待付款';
                    break;
                case '2':
                    return '付款成功';
                    break;
                case '3':
                    return '付款失败';
                    break;
                case '4':
                    return '超时未付款 ';
                    break;
                case '5':
                    return '自动确认';
                    break;
                case '6':
                    return '生成错误';
                    break;
                case '7':
                    return '取消 ';
                    break;
            }
        }
    }])
;
