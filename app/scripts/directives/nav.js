/**
 * Created by zhigang on 14/10/24.
 */
'use strict';
angular.module('roshanGymDongkerApp')
    .config(function ($navbarProvider) {
        angular.extend($navbarProvider.defaults, {
            strict: true
        });
    })
    .directive('navTop', [ function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: function ($auth, $scope, $location, $http, $timeout) {
                var payload = $auth.getPayload();
                $scope.user = payload ? payload.profile : {};
                $scope.gymName = decodeURI($scope.user.gymSetting.name);
                console.log($scope.gymName)
                $scope.login = function () {
                    $location.path('/login');
                }
                $scope.logout = function () {
                    $location.path('/logout');
                }
                $scope.isAuthenticated = $auth.isAuthenticated();
                $scope.dropdown = [
                    {text: '账户设置', href: '/setting/account'},
//                    {divider: true},
                    {text: '退出', href: '/logout'}
                ];

                $scope.noticeList = {};
                $scope.messageList = [];
                $scope.clearNotice = function (id,index) {

                    $http.post('/api/msg/readMsg', {notice_id: id}).success(function (response) {
                        $scope.noticeList = {};
                    });
                }
                $scope.clearMessage = function (id,index) {

                    $http.post('/api/msg/readMsg', {notice_id: id}).success(function (response) {
                        $scope.messageList = {};
                    });
                }
                $scope.showMessage = function () {
                    $location.path('/setting/message/0');
                }
                function indicator() {
                    if ($auth.isAuthenticated()) {
                        var payload = $auth.getPayload();
                        var user = payload ? payload.profile : {};
                        if (user.id) {
                            $http.get('/api/indicator').success(function (response) {

                                if (response.code == 0) {
                                    $scope.indicator = response.data;
                                    if ($scope.indicator['msg'] && $scope.indicator['msg'] > 0) {
                                        $http.get('/api/notice?type=0&top=3').success(function (response) {
                                            if (response.data) {
                                                $scope.messageList = response.data;
                                            }
                                        })
                                    }
                                    if ($scope.indicator['notice'] && $scope.indicator['notice'] > 0) {
                                        $http.get('/api/notice?type=1&top=1').success(function (response) {
                                            if (response.data) {
                                                $scope.noticeList = response.data[0];
                                                $scope.noticeList.length = $scope.indicator['notice'];
                                            }
                                        })
                                    }
                                }
                                else {
                                    $scope.indicator = {};
                                }
                                //console.log($rootScope.$indicator);
                                $timeout(indicator, 10000);
                            }).error(function (err) {
                                console.log(err);
                                $scope.indicator = {};
                                $timeout(indicator, 10000 * 60);
                            });
                        }
                    }
                    else {
                        $timeout(indicator, 60000);
                    }
                }

                indicator();

            },
            templateUrl: '/views/navtop.html'
        }
    }])
    .directive('navLeft', function ($auth) {
        return {
            restrict: 'E',
            controller: function ($auth, $scope, $location) {

                var payload = $auth.getPayload();
                $scope.user = payload ? payload.profile : {};
                $scope.isAuthenticated = $auth.isAuthenticated();

            },
            transclude: true,
            scope: {

            },
            templateUrl: '/views/navleft.html'
        }
    })
    .directive('mycalendar', function () {
        return {
            template: '<div NG-BIND-HTML="calendarHtml" ng-transclude="true"></div>',
            replace: true,
            transclude: true,
            restrict: 'E',
            controller: function ($scope, $sce) {
                var html = setCalendar();
                $sce.trustAsHtml($scope.calendarHtml);
                $scope.calendarHtml = html;

            },
            scope: {

            },
            link: function (scope, element, attrs) {
                /*var html=setCalendar();

                 scope.calendarHtml=html;*/


            }
        }
    })
    .directive('bodyHeight', function () {
        return{
            template: '<div style="display: none"></div>',
            controller: function ($scope) {
                $scope.bodyheight = document.body.clientHeight + "px" || document.documentElement.clientHeight + 'px';

            },
            restrict: 'E',
            transclude: true,
            scope: {

            },
            link: function (scope, element, attrs) {
                /*var html=setCalendar();

                 scope.calendarHtml=html;*/
                alert('hehe' + document.getElementById('navleft'));
                document.getElementById('navleft').style.height = '2000px'//scope.bodyHeight;

            }
        }
    })

//    .directive('navTab', function () {
//        return {
//            restrict: 'E',
//            transclude: true,
//
//            controller: function ($scope) {
//                var panes = $scope.panes = [];
//
//                $scope.select = function (pane) {
//                    angular.forEach(panes, function (pane) {
//                        pane.selected = false;
//                    });
//                    pane.selected = true;
//                };
//
//                this.addPane = function (pane) {
//                    if (panes.length === 0) {
//                        $scope.select(pane);
//                    }
//                    panes.push(pane);
//
//                };
//            },
//            scope: {
//
//            },
//            templateUrl: '/views/navTab.html'
//        }
//
//    })
//    .directive('tabPane', function () {
//        return {
//            require: ['^navTab', '^ngModel'],
//            restrict: 'E',
//            transclude: true,
//            scope: {
//                title: '@'
//            },
//            link: function (scope, element, attrs, controllers) {
//                var tabsCtrl = controllers[0],
//                    modelCtrl = controllers[1];
//
//                tabsCtrl.addPane(scope);
//            },
//            template:""
//        };
//    });
