/**
 * Created by zhigang on 14/12/26.
 */
'use strict';

/**
 * @ngdoc function
 * @name roshanGymDongkerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the roshanGymDongkerApp
 */
angular.module('roshanGymDongkerApp')
    .controller('TopNavCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    })
    .controller('LeftNavCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });