/**
 * Created by zhigang on 15/1/12.
 */
var http = require('http');
var moment = require('moment');
var querystring = require('querystring');
var requireclient = require('api_client');
var ajaxResult = require('../../util/ajaxResult');
var request = require('request');
var noticeType = require('../../util/constants').NoticeType,
    noticeState = require('../../util/constants').NoticeState;
function noticeService() {
    var roshanapiObj = requireclient("roshanApi");
    this.reqUrl = roshanapiObj ? roshanapiObj.server.host : "localhost";
    this.reqPort = roshanapiObj ? roshanapiObj.server.port : "4001";

    this.hostUri = roshanapiObj.server.hostUri;
    /* this.reqUrl='127.0.0.1';
     this.reqPort='4001';*/

}

noticeService.prototype.add = function (notice, cb) {
    var _this = this;

    var path = '/notice/addNotice ';
    var url = _this.hostUri + path;
    var _notice = {content: notice.content, title: notice.title,
        reference: notice.product_id, notice_type: notice.notice_type || noticeType.Message, create_by: notice.create_by};
    request.post({url: url, body: _notice, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            else {
                if (body.code > 0) {
                    return cb(new Error(body.errorMessage))
                }
                _notice.id = body.data.id;
                _notice.alarmTime = notice.alarmTime;
                _this.notify(_notice, notice.notify, function (err, result) {
                    if (err) return cb(err);
                    return cb(null, result);
                })
            }

        })
}
noticeService.prototype.notify = function (notice, uids, cb) {
    var _this = this;

    var path = '/notice/addReceivers';
    var url = _this.hostUri + path;

    var _notific = {notice_id: notice.id, uid: uids, state: noticeState.UnRead, time_line: notice.alarmTime,
        expired_time: moment(notice.alarmTime).add(7, 'days').format('YYYY-MM-DD')}
    request.post({url: url, body: _notific, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            else {
                if (body.code > 0) {
                    return cb(new Error(body.errorMessage))
                }
            }
            return cb(null, body);
        })
}
noticeService.prototype.update = function (notice, cb) {
    var _this = this;

    var path = '/notice/editNotice ';
    var url = _this.hostUri + path;
    request.post({url: url, body: {notice_id: notice.notice_id, content: notice.content, title: notice.content,
            reference: notice.product_id, notice_type: notice.notice_type, create_by: notice.create_by}, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}
noticeService.prototype.getIndicator = function (uid, cb) {
    var _this = this;

    var path = '/notice/getRemindMsg';
    var url = _this.hostUri + path;
    request.get({url: url, qs: {uid: uid}, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            if (body.code > 0) {
                return cb(new Error('获取数据出错: ' + body.errorMessage));
            }
            return cb(null, body.data);
        })
}
noticeService.prototype.getNewMessage=function(opts,cb){
    var _this = this;

    var path = '/notice/getTopmsg';
    var url = _this.hostUri + path;
    request.get({url: url, qs: opts, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            if (body.code > 0) {
                return cb(new Error('获取数据出错: ' + body.errorMessage));
            }
            return cb(null, body.data);
        })
}
module.exports = noticeService;