'use strict';

/**
 * @ngdoc function
 * @name roshanGymDongkerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the roshanGymDongkerApp
 */
angular.module('roshanGymDongkerApp')
    .controller('GCtrl', function ($scope, $auth, $location, $upload) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        var payload = $auth.getPayload();
        $scope.user = payload ? payload.profile : {};

        $scope.tab = {title: '商家基本信息', contentTemplate: '/views/gym/basic.html'};

    })
    .controller('SwichController', ['$scope', function ($scope) {
        $scope.items = ['settings', 'home', 'other'];
        $scope.selection = $scope.items[0];
    }])
    .controller('calendarCtrl', function ($scope, $location, calendarHelper, $timeout) {
        $scope.current = new Date();
        $scope.calendarView = 'month';
        var startDate = new Date();
        var calendarOpts = {};
        $scope.selectedItem = [new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 2), new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 3)]
        var currentView = calendarHelper.getMonthView($scope.current, $scope.selectedItem, calendarOpts);
        currentView.build();
        //var yearView=calendarHelper.getYearView($scope.current, $scope.selectedItem, calendarOpts);
        $scope.view = currentView;
        $scope.select = function (date) {
            var exist = -1;
            for (var i = 0; i < $scope.selectedItem.length; i++) {
                var day = $scope.selectedItem [i];
                if (day.getTime() == date.getTime()) {
                    exist = i;
                    break;
                }
            }
            if (exist > -1) {
                $scope.selectedItem.splice(i, 1);
            }
            else {
                $scope.selectedItem.push(date);
            }
            $scope.view.updateSelected(date);
        }
        var events = [
            {date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 2), title: 'test1', id: 1},
            {date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 2), title: 'test2', 'id': 2},
            {date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 5), title: 'test3', id: 3}
        ];
        var promise = $timeout(function () {
            $scope.view.bindEvents(events)
        }, 200);
        $scope.prev = function () {
            $scope.view.prev();
            $timeout(function () {
                $scope.view.bindEvents(events)
            }, 2000);
        }

        $scope.changeView = function (view) {
            switch (view) {
                case 'month':
                    $scope.view = calendarHelper.getMonthView($scope.current, $scope.selectedItem, calendarOpts);
                    $scope.view.build();
                    $timeout(function () {
                        $scope.view.bindEvents(events)
                    }, 200);
                    break;
                case 'year':
                    $scope.view = calendarHelper.getYearView($scope.current, $scope.selectedItem, calendarOpts);
                    $scope.view.build();
                    $timeout(function () {
                        $scope.view.bindEvents(events)
                    }, 200);
                    $scope.view;
            }
        }
    })
    .controller('VenueCtrl', function ($scope, $auth, $location, $upload) {

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
            0: '全场',
            1: '半场'
        }
        $scope.indoorProp = [];
        angular.forEach(enumIndoor, function (v, k) {
            $scope.indoorProp.push({value: k, name: v});
        });
        $scope.floorProp = [];
        angular.forEach(enumFloor, function (v, k) {
            $scope.floorProp.push({value: k, name: v});
        });
        $scope.standerdProp = [];
        angular.forEach(enumStanderd, function (v, k) {
            $scope.standerdProp.push({value: k, name: v});
        });
        $scope.loading = false;
        $scope.hasVenue = false;
        $scope.calenderView = true;
        $scope.am = true;
        $scope.venues = [];//todo:load from db;

        $scope.events = [
            {
                title: 'My event title', // The title of the event
                type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                starts_at: new Date(2013, 5, 1, 1), // A javascript date object for when the event starts
                ends_at: new Date(2014, 8, 26, 15), // A javascript date object for when the event ends
                editable: true, // If calendar-edit-event-html is set and this field is explicitly set to false then dont make it editable
                deletable: false// If calendar-delete-event-html is set and this field is explicitly set to false then dont make it deleteable
            }
        ];


    })
    .controller('UploadCtrl', function ($scope, $auth, $location, $upload, $alert, $timeout, $modal) {

        // Pre-fetch an external template populated with a custom scope
//        var myOtherModal = $modal({scope: $scope, template: 'views/modal-demo.html', show: false});
//        // Show when some event occurs (use $promise property to ensure the template has been loaded)
//        $scope.showModal = function() {
//            myOtherModal.$promise.then(myOtherModal.show);
//        };
        $scope.noVenue = true;
        $scope.venues = [];
        $scope.showAddVenue = function () {
            $scope.venueAdding = true;
        }
        $scope._i = 1;
        $scope.submitVenueForm = function () {
            $scope.venues.push({no: _i++})
        }


        $scope.selectedCity = "";
        $scope.cities = ["北京", "上海", "广州", "天津"];
        $scope.selectedIcon = "Heart";
        $scope.icons = [
            {"value": "Gear", "label": "<i class=\"fa fa-gear\"></i> Gear"},
            {"value": "Globe", "label": "<i class=\"fa fa-globe\"></i> Globe"},
            {"value": "Heart", "label": "<i class=\"fa fa-heart\"></i> Heart"},
            {"value": "Camera", "label": "<i class=\"fa fa-camera\"></i> Camera"}
        ];
        $timeout(function () {
            $scope.selectedCity = '北京';
        }, 500);
        var ar1 = ['chaoyang', 'fengtai', 'haidian'];
        var ar2 = ['chaoyang2', 'fengtai2', 'haidian2'];
        $scope.areas = [];
//        $scope.$watch('selectedCity', function () {
//            //alert('selectedCity has changed: ' + $scope.selectedCity);
//            if ($scope.selectedCity == '北京')
//                $scope.areas = ar1;
//            else
//                $scope.areas = ar2;
//        });
        $scope.test1 = function () {
            alert($scope.selectedCity);
        }
        $scope.time; // (formatted: )
        $scope.selectedTimeAsNumber = 36000000; // (formatted: 6:00 PM)


        $scope.popover = {title: 'Title', content: 'Hello Popover<br />This is a multiline message!'};
        var payload = $auth.getPayload();
        $scope.user = payload ? payload.profile : {};

        $scope.uploadUrl = 'http://localhost:6001/image/upload';//img/upload';//上传地址
        $scope.images = [];//原来已经上传的图片;

        $scope.images.push({"id": 1, "url": '/images/upload.png'});
        $scope.images.push({"id": 2, "url": '/images/upload.png'});


        $scope.usingFlash = FileAPI && FileAPI.upload != null;
        $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
        //$scope.progress = [];
        $scope.showfileDialg = function () {
            setTimeout(function () {
                $('#imgUploader').click();
            }, 0);
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
                data: { gym: $scope.user.gym },
                file: $scope.upload[index].selectedFile, // or list of files ($files) for html5 only
                //fileFormDataName: 'gymImg'
            }).progress(function (evt) {
                $scope.upload[index].progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                $timeout(function () {
                    $scope.upload[index].result = angular.extend($scope.upload[index].result, {"id": data.id, "url": data.url, "success": true});
                    $scope.upload[index].preview = 'http://localhost:6001/' + data.url;//"/images/upload.png";
                    $scope.upload[index].uploader = null;

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
                //delete img from file.dongker.cn;
            }
            else {
                var img = $scope.images[index];
                //delete img from file.dongker.cn;
                //delete from db gym_image
                $scope.images.splice(index, 1);
            }
        }
    })
    .controller('GCtrl2', function ($scope, $auth, $location) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };
        var payload = $auth.getPayload();
        $scope.user = payload ? payload.profile : {};
        $scope.login = function () {
            $location.path('/login');
        }
        $scope.logout = function () {
            $location.path('/logout');
        }
        $scope.tab = {title: '场地服务信息', contentTemplate: '/views/gym/venue2.html'};
        $scope.selectedIcon = "{{selectedIcon}}";
        $scope.selectedIcons = "{{selectedIcons}}";
        $scope.icons = "{{icons}}";

    })
    .controller('LoginCtrl', function ($scope, $rootScope, $auth, $location, $document, $alert) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        var payload = $auth.getPayload();
        $scope.user = payload ? payload.profile : {};
        $scope.login = function () {
            $scope.submitting = true;
            if ($scope.loginForm.$invalid) {
//                $scope.loginForm.username
                $scope.loginForm.username.$setDirty();
                $scope.loginForm.password.$setDirty();
                $scope.submitting = false;
                return;
            }
            $auth.login({ username: $scope.username, password: $scope.password, rememberMe: $scope.rememberMe })
                .then(function (res) {
                    if (res.code > 0) {

                        $scope.loginErrorMessage = res.errorMessage || '用户名或密码错误';
                    }
                    else {
                        $location.path('/index');
                    }
                    $scope.submitting = false;
                }).then(null, function (err) {
                    console.log(err);
                    $scope.loginErrorMessage = err.data.errorMessage || '登录错误';
                    $scope.submitting = false;
                })
        };
        $rootScope.$on('$auth.loginFailure', function (e, d) {
            $scope.loginErrorMessage = d.errorMessage;
            $scope.submitting = true;
        })
        $scope.swichUser = function () {
            $auth.logout().then(function () {
                $location.path('/login');
            });
        }
        $document[0].title = '欢迎回到动客';
        $scope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };
    })
    .controller('LogoutCtrl', function ($scope, $auth, $location) {
        if (!$auth.isAuthenticated()) {
            return $location.path('/login');
        }

        $auth.logout().then(function () {
            $location.path('/login');
        });

    })
    .controller('SignupCtrl', function ($scope, $auth, $location, $routeParams,$http,$window) {
        var stp = $routeParams.step;
        if (stp && stp == 'step2') {
            $scope.step = 2;
        }
        else if (stp && stp == 'step3') {
            $scope.step = 3;
        }
        else {
            $scope.step = 1;
        }
        //初始化
        $scope.showTag=false;
        $scope.submitting = false;
        $scope.goNext = function (next) {
            if(next==2){
                if ($scope.form1.$invalid) {
//                $scope.loginForm.username
                    $scope.form1.gymName.$setDirty();
                    /*$scope.form1.city.$setDirty();*/
                    return;
                }
                $scope.submitting = true;
                //检查场馆名字是否已经存在
                ///api/gym/checkexists
                $http.get("/gym/checkexists/"+$scope.gymName)//$scope.viewModel.gymName
                    .success(function (response) {
                        if (response.code == 0) {
                            if(response.data.exist){
                                $scope.showTag=true;
                                $scope.submitting = false;
                                $scope.existaddress=response.data.address;
                            }else{
                                var gymobj={};
                                gymobj.name=$scope.gymName;
                                gymobj.city=$scope.city="北京市";
                                gymobj.address=$scope.address;

                                //提交场馆
                                $http({
                                    method: 'POST',
                                    //url: '/api/gym/add',这是新增的api地址
                                    url: '/gym/add',
                                    // set the headers so angular passing info as form data (not request payload)
                                    headers: { 'Content-Type': 'application/json' },//application/x-www-form-urlencoded
                                    data: gymobj // pass in data as strings
                                }).success(function (data, status, headers, config) {
                                    //信息应该在外部新增，此处应为编辑
                                    if (data.code == 0) {
                                        $scope.submitting = false;
                                        $location.url('/signup/step2?insertId='+data.data);
                                        //$window.location.href='/signup/step2?insertId='+data.data;
                                    }
                                    else{
                                        $scope.submitting = false;
                                    }
                                }).error(function (data, status, headers, config) {
                                    $scope.submitting = false;
                                });
                            }
                        }
                        else{
                            $scope.submitting = false;
                            $scope.showTag=true;
                            return;
                        }
                    })
                    .error(function (msg) {
                        $scope.submitting = false;
                        return;
                    });

            }
            else if(next==3){
                if ($scope.form2.$invalid) {
//                $scope.loginForm.username
                    $scope.form2.email.$setDirty();
                    $scope.form2.mobile.$setDirty();
                    $scope.submitting = false;
                    return;
                }
                $scope.submitting = true;
                var staff={};
                staff.insertId=$routeParams.insertId;
                staff.email=$scope.email;
                staff.mobile=$scope.mobile;
                //添加员工
                $http({
                    method: 'POST',
                    //url: '/api/gym/add',这是新增的api地址
                    url: '/user/addStaff',
                    // set the headers so angular passing info as form data (not request payload)
                    headers: { 'Content-Type': 'application/json' },//application/x-www-form-urlencoded
                    data: staff // pass in data as strings
                }).success(function (data, status, headers, config) {
                    //信息应该在外部新增，此处应为编辑
                    if (data.code == 0) {
                        $location.path('/signup/step3');
                    }
                    else{

                    }
                }).error(function (data, status, headers, config) {

                });
                //$location.path('/signup/step3')
            }
            else{
                $location.path('/signup');
            }
        }
        $scope.hideShowTag=function(){
            $scope.showTag=false;
        }
    })
    .controller('MainCtrl', function ($scope, $http, $auth, $document) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };

    });
var uploadUrl = (window.location.protocol || 'http:') + '//file';
window.uploadUrl = window.uploadUrl || 'upload';


var MyCtrl = [ '$scope', '$http', '$timeout', '$upload', function ($scope, $http, $timeout, $upload) {
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function () {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function ($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function (fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.start = function (index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        if ($scope.howToSend == 1) {
            //$upload.upload()
            $scope.upload[index] = $upload.upload({
                url: '/file',
                method: $scope.httpMethod,
                headers: {'my-header': 'my-header-value'},
                data: {
                    myModel: $scope.myModel,
                    errorCode: $scope.generateErrorOnServer && $scope.serverErrorCode,
                    errorMessage: $scope.generateErrorOnServer && $scope.serverErrorMsg
                },
                /* formDataAppender: function(fd, key, val) {
                 if (angular.isArray(val)) {
                 angular.forEach(val, function(v) {
                 fd.append(key, v);
                 });
                 } else {
                 fd.append(key, val);
                 }
                 }, */
                /* transformRequest: [function(val, h) {
                 console.log(val, h('my-header')); return val + '-modified';
                 }], */
                file: $scope.selectedFiles[index],
                fileFormDataName: 'myFile'
            });
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function (xhr) {
//				xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
            });
        } else if ($scope.howToSend == 2) {
            //$upload.http()
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                console.log('file is loaded in filereader');
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {'Content-Type': $scope.selectedFiles[index].type},
                    data: e.target.result
                });
                $scope.upload[index].then(function (response) {
                    $scope.uploadResult.push(response.data);
                }, function (response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    console.log('progres', Math.min(100, parseInt(100.0 * evt.loaded / evt.total)))
                });
                $scope.upload[index].xhr(function (xhr) {
                    xhr.upload.addEventListener('progress', function (evt) {
                        console.log('progres2', Math.min(100, parseInt(100.0 * evt.loaded / evt.total)))
                    }, false);
                    xhr.addEventListener('progress', function (evt) {
                        console.log('progres3', Math.min(100, parseInt(100.0 * evt.loaded / evt.total)))
                    }, false);
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        } else {
            //s3 upload
            $scope.upload[index] = $upload.upload({
                url: $scope.s3url,
                method: 'POST',
                data: {
                    key: $scope.selectedFiles[index].name,
                    AWSAccessKeyId: $scope.AWSAccessKeyId,
                    acl: $scope.acl,
                    policy: $scope.policy,
                    signature: $scope.signature,
                    "Content-Type": $scope.selectedFiles[index].type === null || $scope.selectedFiles[index].type === '' ?
                        'application/octet-stream' : $scope.selectedFiles[index].type,
                    filename: $scope.selectedFiles[index].name
                },
                file: $scope.selectedFiles[index]
            });
            $scope.upload[index].then(function (response) {
                $timeout(function () {
                    $scope.uploadResult.push(response.data);
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            if (localStorage) {
                localStorage.setItem("s3url", $scope.s3url);
                localStorage.setItem("AWSAccessKeyId", $scope.AWSAccessKeyId);
                localStorage.setItem("acl", $scope.acl);
                localStorage.setItem("success_action_redirect", $scope.success_action_redirect);
                localStorage.setItem("policy", $scope.policy);
                localStorage.setItem("signature", $scope.signature);
            }
        }
    };

    $scope.dragOverClass = function ($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    $scope.generateSignature = function () {
        $http.post('/s3sign?aws-secret-key=' + encodeURIComponent($scope.AWSSecretKey), $scope.jsonPolicy).
            success(function (data) {
                $scope.policy = data.policy;
                $scope.signature = data.signature;
            });
    }
    if (localStorage) {
        $scope.s3url = localStorage.getItem("s3url");
        $scope.AWSAccessKeyId = localStorage.getItem("AWSAccessKeyId");
        $scope.acl = localStorage.getItem("acl");
        $scope.success_action_redirect = localStorage.getItem("success_action_redirect");
        $scope.policy = localStorage.getItem("policy");
        $scope.signature = localStorage.getItem("signature");
    }
    $scope.success_action_redirect = $scope.success_action_redirect || window.location.protocol + "//" + window.location.host;
    $scope.jsonPolicy = $scope.jsonPolicy || '{\n  "expiration": "2020-01-01T00:00:00Z",\n  "conditions": [\n    {"bucket": "angular-file-upload"},\n    ["starts-with", "$key", ""],\n    {"acl": "private"},\n    ["starts-with", "$Content-Type", ""],\n    ["starts-with", "$filename", ""],\n    ["content-length-range", 0, 524288000]\n  ]\n}';
    $scope.acl = $scope.acl || 'private';
} ];
angular.module('roshanGymDongkerApp').controller('upload', MyCtrl);

