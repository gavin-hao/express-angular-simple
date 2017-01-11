/**
 * Created by zhigang on 14-9-26.
 */
'use strict';
angular.module('roshanGymDongkerApp')
    .controller('GymCtrl', function ($scope, $http, $routeParams, $auth, $location, $upload, $alert, $timeout, $modal) {
        $scope.tab = {title: '场地服务信息', contentTemplate: '/views/gym/venue2.html'};
        $scope.selectedCity = "";
        $scope.cities = ["北京", "上海", "广州", "天津"];
        //$scope.selectedArea = "";
        $scope.areas = ["东城区", "西城区", "崇文区", "宣武区","朝阳区","丰台区","石景山区","海淀区","门头沟区","房山区","通州区","顺义区","昌平区","大兴区","怀柔区","平谷区","密云县","延庆县"];
        $scope.selectedIcon = "Heart";
        $scope.icons = [{"value":"Gear","label":"<i class=\"fa fa-gear\"></i> Gear"},{"value":"Globe","label":"<i class=\"fa fa-globe\"></i> Globe"},{"value":"Heart","label":"<i class=\"fa fa-heart\"></i> Heart"},{"value":"Camera","label":"<i class=\"fa fa-camera\"></i> Camera"}];
        $scope.time  ; // (formatted: )
        $scope.selectedTimeAsNumber = 36000000; // (formatted: 6:00 PM)
        $scope.vm={};
        $scope.$watch(function(){
            return $scope.vm.selectedArea;
        },function(){
            //alert($scope.vm.selectedArea);
        })

        $http.get("/api/gym")
            .success(function (response) {
                if (response.code == 0) {
                    $scope.viewModel = response.data.gym.gym[0];
                    $scope.selectedCity = $scope.viewModel.city;
                    $scope.vm.selectedArea=$scope.viewModel.area;
                    $scope.viewModel.tel1 = $scope.viewModel.tel.split('-').length > 0 ? $scope.viewModel.tel.split('-')[0] : "";
                    $scope.viewModel.tel2 = $scope.viewModel.tel.split('-').length > 0 ? $scope.viewModel.tel.split('-')[1] : "";
                    $http.get("/api/venue/list")
                        .success(function (response) {
                            if (response.code == 0) {
                                $scope.viewModel.venues = response.data;
                                $scope.isshow = $scope.viewModel.venues.length === 0;
                            } else {
                                //alert('调用api失败');
                                $scope.isshowtip=true;
                                $scope.alert =initalert("error","获取场地信息失败","alert alert-danger alert-dismissible");
                            }
                        });
                    $http.get("/api/gym/service")
                        .success(function (response) {
                            if (response.code == 0) {
                                $scope.viewModel.mataservice = response.data;
                            }
                        })
                        .error(function (msg) {

                        });
                } else {
                    $scope.isshowtip=true;
                    $scope.alert =initalert("error","获取场馆信息失败","alert alert-danger alert-dismissible");
                }
            });

        $scope.toggleClass = function (index, item) {
            var className = $("#service-" + index).attr("class");
            if (className == "cklight") {
                $("#service-" + index).removeClass("cklight");
            } else {
                $("#service-" + index).addClass("cklight");
            }
        }
        $scope.processForm = function () {
            //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            $scope.viewModel.province = '';//$scope.province;
            $scope.viewModel.city = $scope.selectedCity;
            $scope.viewModel.area = $scope.vm.selectedArea;
            $scope.viewModel.tel = $scope.viewModel.tel1 + '-' + $scope.viewModel.tel2;
            $scope.viewModel.services = $scope.viewModel.services;
            var serviceArray=[];

            $("a[tag='service-A']").each(function (index, item) {
                var id = item.id;
                var className = $("#" + id).attr("class");
                if (className == "cklight") {
                    var serviceValue=$("#" + id).attr("svalue");
                    serviceArray.push(serviceValue);
                } else {

                }
            })
            $scope.viewModel.services=serviceArray.join(',');
            //编辑基础信息
            $http({
                method: 'POST',
                //url: '/api/gym/add',这是新增的api地址
                url: '/api/gym/update',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },//application/x-www-form-urlencoded
                data: $scope.viewModel // pass in data as strings
            }).success(function (data, status, headers, config) {
                //信息应该在外部新增，此处应为编辑
                if (data.code == 0) {
                    var myAlert = $alert({title: '恭喜!', content: '修改成功！', container: '#alerts-container', type: 'success',
                        show: true, duration: 3});
                }
                else{
                    var myAlert = $alert({title: '抱歉!', content: '创建失败！', container: '#alerts-container', type: 'danger',
                        show: true, duration: 3});
                }
            }).error(function (data, status, headers, config) {
                var myAlert = $alert({title: '抱歉!', content: '创建失败！', container: '#alerts-container', type: 'danger',
                    show: true, duration: 3});
            });
        }

    })
    .controller('GymImageCtrl', function ($scope, $http, $routeParams,$auth, $location, $upload, $alert, $timeout) {
        $scope.tab = {title: '场地图片信息', contentTemplate: '/views/gym/image.html'};
        $http.get("/api/gym")
            .success(function (response) {
                if (response.code == 0) {
                    $scope.fileDomain = response.data.fileDomain;
                    $scope.images = $scope.images || [];
                    $scope.uploadUrl = "http://" + $scope.fileDomain + "/image/upload";
                    response.data.gym.gymImages.forEach(function (item) {
                        $scope.images.push({"id": item.id, "url": "http://" + $scope.fileDomain + "/" + item.url});
                    });
                } else {
                    $scope.isshowtip=true;
                    $scope.alert =initalert("error","获取场馆图片信息失败","alert alert-danger alert-dismissible");
                }
            });

        var payload = $auth.getPayload();
        $scope.user = payload ? payload.profile : {};
        $scope.images = [];//原来已经上传的图片;
        $scope.uploadUrl = "http://" + $scope.fileDomain + "/image/upload";//img/upload';//上传地址
        $scope.usingFlash = FileAPI && FileAPI.upload != null;
        $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
        //$scope.progress = [];
        $scope.showfileDialg = function () {
            /*setTimeout(function () {
             $('#imgUploader').click();
             }, 0);*/
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, false);
            document.getElementById('imgUploader').dispatchEvent(evt);
        };
        $scope.upload = [];//{uploader:uploadfunc,progress:0,result:{id:1,url:'localhost/img/1.jpg'},preview:'url:base64data'}
        $scope.selectedIndex = 0; //上传文件的计数器
        $scope.onFileSelect = function ($files) {
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                $scope.upload[$scope.selectedIndex] = {};
                if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    var loadFile = function (fileReader, index) {
                        fileReader.onload = function (e) {
                            $timeout(function () {
                                $scope.upload[index].preview = e.target.result;


                            });
                        }
                    }(fileReader, $scope.selectedIndex);
                }
                $scope.upload[$scope.selectedIndex].selectedFile = $file;
                $scope.upload[$scope.selectedIndex].result = {"success": true};
                $scope.upload[$scope.selectedIndex].progress = -1;
                $scope.upload[$scope.selectedIndex].deleted = false;
                //$scope.progress[i] = -1;
                $scope.uploadRightAway = true;
                if ($scope.uploadRightAway) {
                    $scope.start($scope.selectedIndex);
                }
                $scope.selectedIndex++;
            }

        };
        $scope.start = function (index) {
            $scope.upload[index].uploader = $upload.upload({
                url: $scope.uploadUrl,
                method: 'POST',
                headers: {'Authorization': 'Bearer ' + $auth.getToken()},
                //withCredentials: true,
                data: { gym: $scope.user.gymid },
                file: $scope.upload[index].selectedFile // or list of files ($files) for html5 only
                //fileFormDataName: 'gymImg'
            }).progress(function (evt) {
                $scope.upload[index].progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                $timeout(function () {
                    $scope.upload[index].result = angular.extend($scope.upload[index].result, {"id": data.id, "url": data.url, "success": true});
                    $scope.upload[index].preview = "http://"+$scope.fileDomain+"/" + data.url;//"/images/upload.png";
                    $scope.upload[index].uploader = null;
                    var obj = {};
                    obj.url = data.url;
                    obj.img_type = '';
                    obj.img_id = data.id;
                    $http({
                        method: 'POST',
                        //url: '/api/gym/add',这是新增的api地址
                        url: '/api/gym/image/add',
                        // set the headers so angular passing info as form data (not request payload)
                        headers: { 'Content-Type': 'application/json' },
                        data: obj  // pass in data as strings
                    }).success(function (data, status, headers, config) {
                        if (data.code == 0) {
                            //alert('修改成功');
                        }
                    }).error(function (data, status, headers, config) {
                        //alert("error");
                    });

                });
            }).error(function (err) {
                $scope.upload[index].preview = null;
                $scope.upload[index].uploader = null;
                $scope.upload[index].result = angular.extend($scope.upload[index].result, {"errMessage": err, "success": false});
                $alert({
                    content: 'Error occured during upload [' + err + ']',
                    animation: 'fadeZoomFadeDown',
                    type: 'material',
                    duration: 3
                });

            });
        };

        $scope.deleteImg = function (index, newImage) {
            //delete image
            if (newImage) {
                var img = $scope.upload[index];
                if (!img)
                    return;
                if (img.progress < 100) {
                    if ($scope.upload[index].uploader) {
                        $scope.upload[index].uploader.abort();
                    }
                    $scope.upload[index].result['success'] = false;
                }
                $scope.upload[index].deleted = true;
                $scope.deleteImageFile($scope.upload[index].preview);
                $scope.deleteImageData(img.result.id,1);
                //delete img from file.dongker.cn;

            }
            else {
                var img = $scope.images[index];
                //delete img from file.dongker.cn;
                //delete from db gym_image
                $scope.images.splice(index, 1);
                $scope.deleteImageFile(img.url);
                $scope.deleteImageData(img.id,0);
            }
        };
        $scope.deleteImageFile=function(imgUrl){
            var x=imgUrl;
            $http({
                method: 'delete',
                //url: '/api/gym/add',这是新增的api地址
                url: imgUrl,
                // set the headers so angular passing info as form data (not request payload)
                headers: {'Authorization': 'Bearer ' + $auth.getToken()},
                data: {}  // pass in data as strings
            }).success(function (data, status, headers, config) {

            }).error(function (data, status, headers, config) {

            });
        }
        $scope.deleteImageData=function(img_id,flag){
            var obj = {};
            obj.img_id=img_id;
            obj.flag=flag;
            $http({
                method: 'POST',
                //url: '/api/gym/add',这是新增的api地址
                url: '/api/gym/image/delete',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    //alert('图片删除成功');
                }
            }).error(function (data, status, headers, config) {
                alert("error");
            });
        }

    })
    .controller('GymQualifiCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

    })
    .controller('GymBalanceCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

    });
var uploadUrl = (window.location.protocol || 'http:') + '//file';
window.uploadUrl = window.uploadUrl || 'upload';


