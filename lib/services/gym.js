/**
 * Created by Rebort_Chu on 2014/9/28.
 */
/**
 * Created by Rebort_Chu on 2014/9/28.
 */
var http = require('http');
var querystring=require('querystring');
var request = require('request');
var requireclient=require('api_client');
var moment=require("moment");
function gymService() {
    var roshanapiObj=requireclient("roshanApi");
    this.reqUrl=roshanapiObj?roshanapiObj.server.host:"localhost";
    this.reqPort=roshanapiObj?roshanapiObj.server.port:"4001";
    /*this.reqUrl='127.0.0.1';
    this.reqPort='4001';*/
    this.hostUri = roshanapiObj.server.hostUri;
}
//flag 0市 1区 code
gymService.prototype.list = function (flag,code,cb) {
   var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/gym/list/'+flag+'/'+code,
        method: 'GET',
        port:_this.reqPort,
        headers: {
            'Accept': 'text/html'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (chunk) {
            info += chunk;
        });
        res.on('end', function (x) {

            //解析回调结果
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    });
    req.end();

}
gymService.prototype.add = function (reqObj,cb) {
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
    };
    //var host = require('config').get('apiInfo').url;
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/gym/add',
        port:_this.reqPort,
        method: 'POST',
        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (chunk) {
            info += chunk;
        });
        res.on('end', function (x) {

            //解析回调结果
            try {
                var result = JSON.parse(info);
                return cb(null,result);
            } catch (e) {
                return cb(e);
            }
        })
    });
    req.on('error', function (e) {

        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
}
gymService.prototype.updateTel = function (reqObj,cb) {
    var _this = this;
    var path = '/gym/updateTel ';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}

gymService.prototype.updateOfficeTime = function (reqObj,cb) {
    var _this = this;
    var path = '/gym/updateOfficeTime ';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}
gymService.prototype.updateAddress = function (reqObj,cb) {
    var _this = this;
    var path = '/gym/updateAddress ';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}

gymService.prototype.updateContact = function (reqObj,cb) {
    var _this = this;
    var path = '/gym/updateContact ';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}

gymService.prototype.updateDesc = function (reqObj,cb) {
    var _this = this;
    var path = '/gym/updateDesc ';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}

gymService.prototype.updateService = function (reqObj,cb) {
    var _this = this;
    var path = '/gym/updateService ';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}

gymService.prototype.getAddress = function (reqObj,cb) {
    var _this = this;
    //var path = '/gym/getAddress';
    var url = "http://api.map.baidu.com/place/v2/search?query="+reqObj.keyword+"&region="+reqObj.city+"&output=json&ak=ADc351a0a0ce93935cb005e83d0b44cd";
    request.get({url: url, qs: {keyword: reqObj.keyword, city: reqObj.city}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    });
}
gymService.prototype.getmymsg = function (reqObj,cb) {
    var _this = this;
    var path = '/notice/getMynotice';
    var url = _this.hostUri + path;
    request.get({url: url, qs: {uid: reqObj.userid, type: reqObj.type, start: reqObj.start,end:reqObj.end}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        if(body.data==null||body.data[1]=="undefined"){
            return cb(null,null);
        }
        body.data[1].forEach(function(item){
            item.create_time=moment(item.create_time).format("YYYY-MM-DD HH:mm:ss");
        })
        return cb(null, body);
    });
}

gymService.prototype.deleteMymsg = function (reqObj,cb) {
    var _this = this;
    var path = '/notice/deleteMynotice';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}

gymService.prototype.checkExists = function (reqObj,cb) {
    var _this = this;
    var path = '/gym/checkGymExists';
    var url = _this.hostUri + path;
    request.get({url: url, qs: {gymName: reqObj.name}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    });
}
gymService.prototype.readMsg = function (reqObj,cb) {
    var _this = this;
    var path = '/notice/readMsg';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}
gymService.prototype.getOne=function(gym_id,cb){
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/gym?gym_id='+gym_id,
        method: 'GET',
        port:_this.reqPort,
        headers: {
            'Accept': 'text/json'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (chunk) {
            info += chunk;
        });
        res.on('end', function (x) {

            //解析回调结果
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    });
    req.end();
}

gymService.prototype.getmetaService=function(gym_id,cb){
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/gym/mataservice',
        method: 'GET',
        port:_this.reqPort,
        headers: {
            'Accept': 'text/json'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (chunk) {
            info += chunk;
        });
        res.on('end', function (x) {

            //解析回调结果
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    });
    req.end();
}

gymService.prototype.getImages=function(gym_id,cb){
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/gym/getimages?gym_id='+gym_id,
        method: 'GET',
        port:_this.reqPort,
        headers: {
            'Accept': 'text/json'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (chunk) {
            info += chunk;
        });
        res.on('end', function (x) {

            //解析回调结果
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    });
    req.end();
}

gymService.prototype.addImages = function (reqObj,cb) {
    var _this=this;
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
    };
    //var host = require('config').get('apiInfo').url;

    var options = {
        host: _this.reqUrl,
        path: '/gym/addimages',
        port:_this.reqPort,
        method: 'POST',
        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (chunk) {
            info += chunk;
        });
        res.on('end', function (x) {

            //解析回调结果
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
}

gymService.prototype.deleteImages = function (reqObj,cb) {
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
    };
    //var host = require('config').get('apiInfo').url;
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/gym/deleteImages',
        port:_this.reqPort,
        method: 'POST',
        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (chunk) {
            info += chunk;
        });
        res.on('end', function (x) {
            //解析回调结果
            return cb(null,info);
        })
    });
    req.on('error', function (e) {
        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
}
gymService.prototype.getprovince=function(cb){
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/getprovince',
        method: 'GET',
        port:_this.reqPort,
        headers: {
            'Accept': 'text/json'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var info='';
        res.on('data', function(data) {
            info+=data;
        });
        res.on('end',function(data){
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    });
    req.end();
}
gymService.prototype.getcity=function(proid,cb){
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/getcity/'+proid,
        method: 'GET',
        port:_this.reqPort,
        headers: {
            'Accept': 'text/json'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var info='';
        res.on('data', function(data) {
            info+=data;
        });
        res.on('end',function(data){
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    });
    req.end();
}
gymService.prototype.getarea=function(cityid,cb){
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/getarea/'+cityid,
        method: 'GET',
        port:_this.reqPort,
        headers: {
            'Accept': 'text/json'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var info='';
        res.on('data', function(data) {
            info+=data;

        });
        res.on('end',function(data){
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    });
    req.end();
}
module.exports = gymService;