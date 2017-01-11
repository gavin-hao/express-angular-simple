/**
 * Created by guan on 14/11/13.
 */
'use strict';
/* services.js */

// 别忘记将本 service 依赖注入到你的 app
var alertServices = angular.module('alertServices', []);

alertServices.service('alertService', function($rootScope) {
    var alertService = {};

    // 创建一个全局的 alert 数组
    $rootScope.alerts = [];

    alertService.add = function(type, msg) {
        $rootScope.alerts.push({'type': type, 'msg': msg, 'close': function(){ alertService.closeAlert(this); }});
    };

    alertService.closeAlert = function(alert) {
        alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
    };

    alertService.closeAlertIdx = function(index) {
        $rootScope.alerts.splice(index, 1);
    };

    return alertService;
});
