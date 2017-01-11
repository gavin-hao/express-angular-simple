/**
 * Created by zhigang on 15/1/21.
 */

'use strict';
angular.module('roshanGymDongkerApp')
    .controller('SettingCtrl', function ($scope, $auth, $location, $alert, $http, $timeout, $upload) {
        var payload = $auth.getPayload();
        $scope.user = payload ? payload.profile : {};
        $scope.gymName = decodeURI($scope.user.gymSetting.name);
        $scope.templates =
            [
                { name: '基本信息', value: 0, url: 'views/setting/basic.html'},
                { name: '场馆图片', value: 1, url: 'views/setting/img.html'},
                { name: '资质信息', value: 2, url: 'views/setting/qualification.html'}
            ];
        $scope.template = $scope.templates[0];
        $scope.setShowMode = function (mode) {
            $scope.template = $scope.templates[mode];
        }
        $scope.isactive = false;
        $scope.showStart = function () {
            $scope.isactive = !$scope.isactive;
        }
        $scope.isactive1 = false;
        $scope.showEnd = function () {
            $scope.isactive1 = !$scope.isactive1;
        }
        $scope.selectTime = function (time) {
            $scope.viewModel.start_time = time;
        }
        $scope.selectTime1 = function (time) {
            $scope.viewModel.end_time = time;
        }
        $scope.saveTime = function () {
            $http({
                method: 'POST',
                url: '/api/gym/updateOfficeTime',
                headers: { 'Content-Type': 'application/json' },
                data: {"start_time": $scope.viewModel.start_time, "end_time": $scope.viewModel.end_time}
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    var myAlert = $alert({title: '恭喜!', content: '修改成功！', container: '#alerts-time', type: 'success',
                        show: true, duration: 3});
                } else {
                    var myAlert = $alert({title: '抱歉!', content: '修改失败！', container: '#alerts-time', type: 'danger',
                        show: true, duration: 3});
                }
            }).error(function (data, status, headers, config) {
                var myAlert = $alert({title: '抱歉!', content: '修改失败！', container: '#alerts-time', type: 'danger',
                    show: true, duration: 3});
            });
        }
        $scope.modifyTel = function () {
            $http({
                method: 'POST',
                url: '/api/gym/updateTel',
                headers: { 'Content-Type': 'application/json' },
                data: {"tel": $scope.viewModel.tel}
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    var myAlert = $alert({title: '恭喜!', content: '修改成功！', container: '#alerts-container', type: 'success',
                        show: true, duration: 3});
                }
                else {
                    var myAlert = $alert({title: '抱歉!', content: '修改失败！', container: '#alerts-container', type: 'danger',
                        show: true, duration: 3});
                }
            }).error(function (data, status, headers, config) {
                var myAlert = $alert({title: '抱歉!', content: '修改失败！', container: '#alerts-container', type: 'danger',
                    show: true, duration: 3});
            });
        };


        $scope.modifyContact = function () {
            $http({
                method: 'POST',
                url: '/api/gym/updateContact',
                headers: { 'Content-Type': 'application/json' },
                data: {"contact_tel": $scope.viewModel.contact_tel, "contact_name": $scope.viewModel.contact_name}
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    var myAlert = $alert({title: '恭喜!', content: '修改成功！', container: '#alerts-contact', type: 'success',
                        show: true, duration: 3});
                }
                else {
                    var myAlert = $alert({title: '抱歉!', content: '修改失败！', container: '#alerts-contact', type: 'danger',
                        show: true, duration: 3});
                }
            }).error(function (data, status, headers, config) {
                var myAlert = $alert({title: '抱歉!', content: '修改失败！', container: '#alerts-contact', type: 'danger',
                    show: true, duration: 3});
            });
        };

        $scope.modifyDesc = function () {
            $http({
                method: 'POST',
                url: '/api/gym/updateDesc',
                headers: { 'Content-Type': 'application/json' },
                data: {"description": $scope.viewModel.newDescription}
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    $scope.viewModel.description=$scope.viewModel.newDescription;
                } else {

                }
            }).error(function (data, status, headers, config) {

            });
        };

        $scope.modifyService = function () {
            var newService = [];
            $("input[name='services']:checked").each(function (i, item) {
                newService.push($(item).attr("value"));
            })
            $http({
                method: 'POST',
                url: '/api/gym/updateService',
                headers: { 'Content-Type': 'application/json' },
                data: {"service": newService}
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {

                }
            }).error(function (data, status, headers, config) {

            });
        };
        $scope.modifyAddress = function () {
            if(!$scope.viewModel.newAddress){
                alert('请选择新地址');
                return;
            }
            $http({
                method: 'POST',
                url: '/api/gym/updateAddress',
                headers: { 'Content-Type': 'application/json' },
                data: {"address": $scope.viewModel.newAddress, "lat": $scope.viewModel.latitude, "lon": $scope.viewModel.longitude}
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {

                }
            }).error(function (data, status, headers, config) {

            });
        };
        $scope.ischoose = false;
        $scope.searchAddress = function () {
            var params = '?keyword=' + $scope.viewModel.newAddress + '&city=' + $scope.viewModel.city;
            $http.get("/api/gym/getAddress" + params)
                .success(function (response) {
                    $scope.viewModel.addressResult = response.results;
                    $scope.issuggest = true;
                    if (response.results.length > 0) {
                        $scope.ischoose = true;
                    }
                    else {
                        $scope.ischoose = false;
                    }
                })
                .error(function (msg) {

                });
        }

        $scope.choose = function (index) {
            $scope.ischoose = false;
            $scope.issuggest = false;
            $scope.viewModel.newAddress = $scope.viewModel.address = $scope.viewModel.addressResult[index].address;
            $scope.viewModel.latitude = $scope.viewModel.addressResult[index].location.lat;
            $scope.viewModel.longitude = $scope.viewModel.addressResult[index].location.lng;

        }
        $http.get("/api/gym")
            .success(function (response) {
                if (response.code == 0) {
                    $scope.viewModel = response.data.gym.gym[0];
                    $scope.viewModel.newDescription = $scope.viewModel.description;
                    var myservice = $scope.viewModel.services;
                    $http.get("/api/gym/service")
                        .success(function (response) {
                            if (response.code == 0) {
                                //服务信息
                                $scope.viewModel.mataservice = response.data;
                                var gps = $scope.viewModel.groupService = [];
                                angular.forEach($scope.viewModel.mataservice, function (value, key) {
                                    gps.push({"id": value.id, "name_cn": value.name_cn, "ischeck": (myservice!=null&&myservice.split(',').indexOf(value.id.toString()) >= 0) ? true : false});
                                }, gps);
                            }
                        })
                        .error(function (msg) {

                        });
                    //图片信息
                    $scope.fileDomain = response.data.fileDomain;
                    $scope.images = $scope.images || [];
                    $scope.uploadUrl = "http://" + $scope.fileDomain + "/image/upload";
                    response.data.gym.gymImages.forEach(function (item) {
                        $scope.images.push({"id": item.id, "url": "http://" + $scope.fileDomain + "/" + item.url});
                    });
                } else {

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
                                $("#save").removeClass("disabled");
                                $scope.showProcess=false;
                                $scope.upload[0].progress = 1;

                            });
                        }
                    }(fileReader, $scope.selectedIndex);
                }
                $scope.upload[$scope.selectedIndex].selectedFile = $file;
                $scope.upload[$scope.selectedIndex].result = {"success": true};
                $scope.upload[$scope.selectedIndex].progress = -1;
                $scope.upload[$scope.selectedIndex].deleted = false;
                //$scope.progress[i] = -1;
                /*$scope.uploadRightAway = true;
                 if ($scope.uploadRightAway) {
                 $scope.start($scope.selectedIndex);
                 }
                 $scope.selectedIndex++;*/
            }

        };
        $scope.showProcess=true;
        $scope.gotoUpload = function () {
            $scope.uploadRightAway = true;
            if ($scope.uploadRightAway) {
                $scope.showProcess=true;
                $scope.start(0);
            }

        }
        $scope.start = function (index) {
            $("#save").addClass("disabled");
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
                    $scope.upload[index].preview = "http://" + $scope.fileDomain + "/" + data.url;//"/images/upload.png";
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
                            var myAlert = $alert({title: '恭喜!', content: '上传成功！', container: '#alerts-container', type: 'success',
                                show: true, duration: 3});
                            var obj = {"id": data.data.insertId, "url": $scope.upload[0].preview};
                            $scope.images.push(obj);
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
                var myAlert = $alert({title: '抱歉!', content: '上传失败！', container: '#alerts-container', type: 'danger',
                    show: true, duration: 3});

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
                $scope.deleteImageData(img.result.id, 1);
                //delete img from file.dongker.cn;

            }
            else {
                var img = $scope.images[index];
                //delete img from file.dongker.cn;
                //delete from db gym_image
                $scope.images.splice(index, 1);
                $scope.deleteImageFile(img.url);
                $scope.deleteImageData(img.id, 0);
            }
        };
        $scope.deleteImageFile = function (imgUrl) {
            var x = imgUrl;
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
        $scope.deleteImageData = function (img_id, flag) {
            var obj = {};
            obj.img_id = img_id;
            obj.flag = flag;
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
    .controller('SecuritySettingCtrl', function ($scope, $auth, $location, $http, $alert) {
        $http.get("/api/user/getusername")
            .success(function (response) {
                if (response.code == 0) {
                    $scope.email = response.username;
                } else {

                }
            });
        $scope.changePwd = function () {
            var obj = {};
            obj.oldPwd = $scope.viewModel.oldPwd;
            obj.newPwd = $scope.viewModel.newPwd;
            obj.confirmPwd = $scope.viewModel.confirmPwd;
            if (obj.newPwd != obj.confirmPwd) {
                var myAlert = $alert({title: '抱歉!', content: '请确保新密码和确认密码一致!！', container: '#alerts-container', type: 'danger',
                    show: true, duration: 3});
                return;
            }
            $http({
                method: 'POST',
                url: '/api/user/changepwd',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    var myAlert = $alert({title: '恭喜!', content: '修改成功！', container: '#alerts-container', type: 'success',
                        show: true, duration: 3});
                }
                else {
                    var myAlert = $alert({title: '抱歉!', content: data.result, container: '#alerts-container', type: 'danger',
                        show: true, duration: 3});
                }
            }).error(function (data, status, headers, config) {
                var myAlert = $alert({title: '抱歉!', content: data.result, container: '#alerts-container', type: 'danger',
                    show: true, duration: 3});
            });
        }


    })
    .controller('AccountSettingCtrl', function ($scope, $auth, $location, $http, $alert) {
        $scope.addAccount = function () {
            var obj = {};
            obj.userName = $scope.viewModel.userName;
            obj.password = $scope.viewModel.password;
            obj.email = $scope.viewModel.email;
            obj.mobile = $scope.viewModel.mobile;
            $http({
                method: 'POST',
                url: '/api/user/addStaff',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    var myAlert = $alert({title: '恭喜!', content: '添加成功！', container: '#alerts-container', type: 'success',
                        show: true, duration: 3});
                    $scope.viewModel.email='';
                    $scope.viewModel.userName='';
                    $scope.viewModel.mobile='';
                    $scope.viewModel.password='';
                    $http.get("/api/user/getStaffList")
                        .success(function (response) {
                            if (response.code == 0) {
                                $scope.staffList = response.result.data;
                            } else {

                            }
                        });
                }
                else {
                    var myAlert = $alert({title: '抱歉!', content: "添加失败", container: '#alerts-container', type: 'danger',
                        show: true, duration: 3});
                }
            }).error(function (data, status, headers, config) {
                var myAlert = $alert({title: '抱歉!', content: "添加失败", container: '#alerts-container', type: 'danger',
                    show: true, duration: 3});
            });
        }

        $http.get("/api/user/getStaffList")
            .success(function (response) {
                if (response.code == 0) {
                    $scope.staffList = response.result.data;
                } else {

                }
            });
        $scope.deleteStaff=function(staffId){
            var obj = {};
            obj.staffId = staffId;
            $http({
                method: 'POST',
                url: '/api/user/deleteStaff',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: obj  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    $scope.staffList= $.grep($scope.staffList, function (obj) {
                        return obj.id!=staffId;
                    })
                }
                else {
                    alert('删除失败');
                }
            }).error(function (data, status, headers, config) {
                alert('删除失败');
            });

        }

    })
    .controller('NoticeSettingCtrl', function ($scope, $auth, $location, $http, $routeParams) {
        var pageCount = 10;
        var startNum = ($routeParams.page || 0) * pageCount;
        var params = "?type=1&start=" + startNum + "&end=" + pageCount;
        //当前页
        $scope.currentPage = $routeParams.page || 0;
        $scope.showPager = false;
        $http.get("/api/msg/getmymsg" + params)
            .success(function (response) {
                if (response.code == 0) {
                    $scope.msgtotal = response.data[0][0].total!="0"?response.data[0][0].total:"";
                    $scope.noticetotal = response.data[2][0].total!="0"?response.data[2][0].total:"";
                    $scope.viewModel = response.data[1];
                    var all = response.data[3][0].total;
                    var p = all % pageCount;
                    var y = Math.floor(all / pageCount);
                    y = (p == 0) ? y : (y + 1);
                    $scope.msgAlltotal = [];
                    for (var i = 0; i < y; i++) {
                        $scope.msgAlltotal.push(i);
                    }

                    if ($scope.msgAlltotal.length >= 1) {
                        $scope.showPager = true;
                    }
                    if ($scope.msgAlltotal.length < 6) {
                        $scope.currentArray = $scope.msgAlltotal.slice(0, 5);
                    }
                    else {
                        if ($scope.currentPage >= 3) {
                            $scope.currentArray = $scope.msgAlltotal.slice(parseInt($scope.currentPage) - 2, parseInt($scope.currentPage) + 3);
                        }
                        else {
                            $scope.currentArray = $scope.msgAlltotal.slice(0, 5);
                        }

                    }


                    if ($scope.currentPage < $scope.msgAlltotal.length - 1) {
                        $scope.nextPager = parseInt($scope.currentPage) + 1;
                    }
                    else {
                        $scope.nextPager = parseInt($scope.currentPage);
                    }
                    if ($scope.currentPage > 0) {
                        $scope.prePager = parseInt($scope.currentPage) - 1;
                    }
                    else {
                        $scope.prePager = 0;
                    }
                } else {

                }
            });
        $scope.getMymsg = function (type) {
            //window.location = type == 0 ? '/setting/message/0' : '/setting/notice/0';
            if(type==0){
                $location.path('/setting/message/0');
            }else {
                $location.path('/setting/notice/0');
            }


        }
        $scope.readMsg = function (notice_id, state) {
            if (state == 0) {
                $http({
                    method: 'POST',
                    //url: '/api/gym/add',这是新增的api地址
                    url: '/api/msg/readMsg',
                    // set the headers so angular passing info as form data (not request payload)
                    headers: { 'Content-Type': 'application/json' },
                    data: {"notice_id": notice_id}  // pass in data as strings
                }).success(function (data, status, headers, config) {
                    if (data.code == 0) {
                        $scope.msgtotal--;
                        if($scope.msgtotal==0){
                            $scope.msgtotal="";
                        }
                        $scope.viewModel.forEach(function (item, i) {
                            if (item.id == notice_id) {
                                item.state = 1;
                            }
                        })
                    }
                }).error(function (data, status, headers, config) {

                });
            }
        }
        $scope.deleteMsg = function (notice_id) {

            $http({
                method: 'POST',
                //url: '/api/gym/add',这是新增的api地址
                url: '/api/msg/deleteMymsg',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: {"notice_id": notice_id}  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    $scope.msgtotal--;
                    if($scope.msgtotal==0){
                        $scope.msgtotal="";
                    }
                    $scope.viewModel = $.grep($scope.viewModel, function (item, i) {
                        return item.id != notice_id;
                    })
                }
            }).error(function (data, status, headers, config) {

            });
        }
    })
    .controller('MsgSettingCtrl', function ($scope, $auth, $location, $http, $routeParams) {
        var pageCount = 10;
        var startNum = ($routeParams.page || 0) * pageCount;
        var params = "?type=0&start=" + startNum + "&end=" + pageCount;
        //当前页
        $scope.currentPage = $routeParams.page || 0;
        $scope.showPager = false;

        $http.get("/api/msg/getmymsg" + params)
            .success(function (response) {
                if (response.code == 0) {
                    $scope.msgtotal = response.data[0][0].total!="0"?response.data[0][0].total:"";
                    $scope.noticetotal = response.data[2][0].total!="0"?response.data[2][0].total:"";
                    $scope.viewModel = response.data[1];

                    var all = response.data[3][0].total;
                    var p = all % pageCount;
                    var y = Math.floor(all / pageCount);
                    y = (p == 0) ? y : (y + 1);
                    $scope.msgAlltotal = [];
                    for (var i = 0; i < y; i++) {
                        $scope.msgAlltotal.push(i);
                    }


                    if ($scope.msgAlltotal.length >= 1) {
                        $scope.showPager = true;
                    }
                    if ($scope.msgAlltotal.length < 6) {
                        $scope.currentArray = $scope.msgAlltotal.slice(0, 5);
                    }
                    else {
                        if ($scope.currentPage >= 3) {
                            $scope.currentArray = $scope.msgAlltotal.slice(parseInt($scope.currentPage) - 2, parseInt($scope.currentPage) + 3);
                        }
                        else {
                            $scope.currentArray = $scope.msgAlltotal.slice(0, 5);
                        }

                    }


                    if ($scope.currentPage < $scope.msgAlltotal.length - 1) {
                        $scope.nextPager = parseInt($scope.currentPage) + 1;
                    }
                    else {
                        $scope.nextPager = parseInt($scope.currentPage);
                    }
                    if ($scope.currentPage > 0) {
                        $scope.prePager = parseInt($scope.currentPage) - 1;
                    }
                    else {
                        $scope.prePager = 0;
                    }
                } else {

                }
            });
        $scope.getMymsg = function (type) {
            if(type==0){
                $location.path('/setting/message/0');
            }else {
                $location.path('/setting/notice/0');
            }
        }
        $scope.deleteMsg = function (notice_id,$event) {
            $http({
                method: 'POST',
                //url: '/api/gym/add',这是新增的api地址
                url: '/api/msg/deleteMymsg',
                // set the headers so angular passing info as form data (not request payload)
                headers: { 'Content-Type': 'application/json' },
                data: {"notice_id": notice_id}  // pass in data as strings
            }).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    $scope.msgtotal--;
                    if($scope.msgtotal==0){
                        $scope.msgtotal="";
                    }
                    $scope.viewModel = $.grep($scope.viewModel, function (item, i) {
                        return item.id != notice_id;
                    })
                }
            }).error(function (data, status, headers, config) {

            });
            //$event.stopPropagation();
            //return false;
        }
        $scope.readMsg = function (notice_id, state) {
            if (state == 0) {
                $http({
                    method: 'POST',
                    //url: '/api/gym/add',这是新增的api地址
                    url: '/api/msg/readMsg',
                    // set the headers so angular passing info as form data (not request payload)
                    headers: { 'Content-Type': 'application/json' },
                    data: {"notice_id": notice_id}  // pass in data as strings
                }).success(function (data, status, headers, config) {
                    if (data.code == 0) {
                        $scope.msgtotal--;
                        if($scope.msgtotal==0){
                            $scope.msgtotal="";
                        }
                        $scope.viewModel.forEach(function (item, i) {
                            if (item.id == notice_id) {
                                item.state = 1;
                            }
                        })
                    }
                }).error(function (data, status, headers, config) {

                });
            }
        }
    })