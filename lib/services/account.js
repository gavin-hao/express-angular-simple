/**
 * Created by zhigang on 14-10-8.
 */
var http = require('http');
var querystring = require('querystring');
var requireclient = require('api_client');
var ajaxResult = require('../../util/ajaxResult');
var request = require('request');
var noticeType = require('../../util/constants').NoticeType;

function accountService() {
    var roshanapiObj = requireclient("roshanApi");
    this.reqUrl = roshanapiObj ? roshanapiObj.server.host : "localhost";
    this.reqPort = roshanapiObj ? roshanapiObj.server.port : "4001";

    this.hostUri = roshanapiObj.server.hostUri;
}
accountService.prototype.validUser = function (user, cb) {
    ///account/valid
    var _this = this;

    var path = '/account/valid';
    var url = _this.hostUri + path;
    request.get({url: url, qs: {userName: user.username, pwd: user.password}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    });
    //return cb(null, true);
}

accountService.prototype.changePwd = function (user, cb) {
    var _this = this;
    var path = '/u/'+user.id+'/changepassword';
    var url = _this.hostUri + path;
    request.post({url: url, body: user, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    })
}

accountService.prototype.addStaff = function (user, cb) {
    var _this = this;
    var path = '/u/create/staff';
    var url = _this.hostUri + path;
    request.post({url: url, body: user, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    })
}

accountService.prototype.deleteStaff = function (user, cb) {
    var _this = this;
    var path = '/account/deleteStaff';
    var url = _this.hostUri + path;
    request.post({url: url, body: user, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    })
}
accountService.prototype.getStafflist = function (user, cb) {
    var _this = this;
    var path = '/u/getStaffList';
    var url = _this.hostUri + path;
    request.get({url: url, qs: {gym_id:user.gym}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    });
}
accountService.prototype.createAdmin = function (user, cb) {
    var _this = this;

    var path = '/u/create/admin';
    var url = _this.hostUri + path;
    request.post({url: url, body: {userName: user.username, pwd: user.password, gym: user.gym, nickName: user.nickName}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    })
}
accountService.prototype.createStaff = function (user, cb) {
    var _this = this;

    var path = '/u/create/staff';
    var url = _this.hostUri + path;
    request.post({url: url, body: {userName: user.username, pwd: user.password, gym: user.gym, nickName: user.nickName}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    })
}

module.exports = accountService;