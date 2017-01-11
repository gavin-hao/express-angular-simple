/**
 * Created by Rebort_Chu on 2014/10/16.
 */
var venueSer = require('../services/venue.js');
var moment = require('moment');
var ajaxResult = require('../../util/ajaxResult');
var noticeSer = require('../services/notice.js');
var noticeType = require('../../util/constants').NoticeType;
exports.getVenuesByGymId = function (req, res, next) {
    var gym_id = req.user.profile.gymid;
    var start = req.query.start;
    var end = req.query.end;
    if (!end || end == 'undefined') {
        end = start;
    }
    new venueSer().getVenuesByGymId(gym_id, start, end, function (err, result) {
        if (req.timedout)return;
        if (err) {
            if (req.timedout) return;
            return next(err)//res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        } else {
            if (req.timedout) return;
            return res.send(result);
        }
    })
}
exports.getVenueByVenueId = function (req, res, next) {
    var venue_id = req.query.venue_id;
    new venueSer().getVenueByVenueId(venue_id, function (err, result) {
        if (req.timedout)return;
        if (err) {

            return next(err);
        } else {

            return res.send(JSON.parse(result).data);
        }
    })
}
exports.addvenue = function (req, res, next) {
    var obj = {};
    obj.gym_id = req.user.profile.gymid;//此处从当前登录session里获取
    obj.name = req.body.name;
    obj.floor_type = req.body.floor;
    obj.standerd = req.body.standerd;
    obj.indoor = req.body.indoor;

    obj.create_time = new Date(); //moment().format('YYYY-MM-DD HH:mm:ss');

    obj.operator_id = req.user.profile.id;

    obj.available = req.body.available;
    obj.floodlit = 0;
    obj.description = req.body.description;

    obj.serviceTime = req.user.profile.gymSetting.serviceTime;
    //obj.operator_name=req.body.operator_name;
    new venueSer().addvenue(obj, function (err, result) {
        if (req.timedout) return;
        if (err) {
            return next(err);//res.send(err);
        } else {

            return res.send(result);
        }
    })
}
exports.addprice = function (req, res, next) {
    var price = req.body.price;
    var prod = req.body.product_id;
    var prod_details = req.body.product_details;
    if (price == undefined || price == null || !prod_details || prod_details.length == 0) {
        return next(new Error('invalid parameters,[price,prod_details] is required! '))
    }
    else {
        new venueSer().addPrice({price: price, product: prod, product_details: prod_details}, function (err, result) {
            if (req.timedout) return;
            if (err) {
                return next(err);//res.send(err);
            } else {

                return res.send(result);
            }
        })
    }
}
/**adjust price
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.adjustprice = function (req, res, next) {
    var price = req.body.price;
    var prod = req.body.product_id;
    var prod_details = req.body.product_details;
    var start = req.body.start;
    var end = req.body.end;

    if (price == undefined || price == null || !start || !end || !prod_details || prod_details.length == 0) {
        return next(new Error('invalid parameters,[price,prod_details,start,end] is required! '))
    }
    else {
        var datelist = [];

        var s = new Date(start);
        var e = new Date(end);
        start = new Date(s.getFullYear(), s.getMonth(), s.getDate());
        end = new Date(e.getFullYear(), e.getMonth(), e.getDate());
        if ((end.getTime() - start.getTime()) / 864e5 > 30) {
            return next(new Error('一次最多设置30天的价格'))
        }
        if (start >= end) {
            datelist.push(moment(start).format('YYYY-MM-DD'));
        }
        else {
            try {
                var current = new Date(start);
                while (current.getTime() <= end.getTime()) {
                    datelist.push(moment(current).format('YYYY-MM-DD'));
                    current = new Date(+current + 1 * 864e5);
                }
            }
            catch (err) {
                return next(new Error(err))
            }
        }
        new venueSer().adjustPrice({price: price, product: prod, product_details: prod_details, dates: datelist}, function (err, result) {
            if (req.timedout) return;
            if (err) {
                return next(err);//res.send(err);
            } else {

                return res.send(result);
            }
        })
    }
}

exports.lockStock = function (req, res, next) {
    var reason = req.body.reason;
    var prod = req.body.product_id;
    var prod_details = req.body.product_details;
    var start = req.body.start;
    var end = req.body.end;
    var colorFlag = req.body.colorFlag;
    var alarm_lock = req.body.alarm;
    if (!start || !end || !prod_details || prod_details.length == 0) {
        return next(new Error('invalid parameters,[product_details,start,end] is required! '))
    }
    else {
        var datelist = [];

        var s = new Date(start);
        var e = new Date(end);
        start = new Date(s.getFullYear(), s.getMonth(), s.getDate());
        end = new Date(e.getFullYear(), e.getMonth(), e.getDate());
        if ((end.getTime() - start.getTime()) / 864e5 > 30) {
            return next(new Error('一次最多设置30天的价格'))
        }
        if (start >= end) {
            datelist.push(moment(start).format('YYYY-MM-DD'));
        }
        else {
            try {
                var current = new Date(start);
                while (current.getTime() <= end.getTime()) {
                    datelist.push(moment(current).format('YYYY-MM-DD'));
                    current = new Date(+current + 1 * 864e5);
                }
            }
            catch (err) {
                return next(new Error(err))
            }
        }
        (function t(alarm_lock, reason, prod, prod_details, datelist, colorFlag, start, end) {
            var user = req.user.profile;
            var lockObj = {reason: reason, product: prod, product_details: prod_details, dates: datelist,
                tag: colorFlag.isSetColor ? colorFlag.color : undefined, user_id: user.username};
            new venueSer().lock(lockObj,
                function (err, result) {
                    if (req.timedout) return;
                    if (err) {
                        return next(err);//res.send(err);
                    } else {
                        if (result.code == 0 && alarm_lock && alarm_lock.isAlarm != false) {

                            var content = user.username + '关闭了一块场地'
                                + ',关闭时间: '
                                + moment(start).format('YYYY-MM-DD')
                                + '到' + moment(end).format('YYYY-MM-DD')
                                + '关闭原因: ' + reason;
                            //todo:notice all staffs;
                            var notifyWho = [user.id];

                            var alarm = {content: content, title: alarm_lock.alarmContent,
                                reference: prod, notice_type: noticeType.Alarm, create_by: user.id,
                                alarmTime: alarm_lock.alarmTime || moment().add(1, 'days'), notify: notifyWho}
                            new noticeSer().add(alarm, function (err, result) {
                                if (req.timedout) return;
                                if (err) {
                                    return res.send(new ajaxResult({code: 1, data: err, errorMessage: '添加提醒时出错'}))
                                }

                                return res.send(result);
                            })
                        }
                        else {
                            if (req.timedout) return;
                            return res.send(result);
                        }
                    }
                });
        })(alarm_lock, reason, prod, prod_details, datelist, colorFlag, start, end);
    }
}
exports.unlockStock = function (req, res, next) {
    var reason = req.body.reason;
    var prod = req.body.product_id;
    var prod_details = req.body.product_details;
    var start = req.body.start;
    var end = req.body.end;
    var colorFlag = req.body.colorFlag;
    var alarm = req.body.alarm;
    if (!start || !end || !prod_details || prod_details.length == 0) {
        return next(new Error('invalid parameters,[product_details,start,end] is required! '))
    }
    else {
        var datelist = [];

        var s = new Date(start);
        var e = new Date(end);
        start = new Date(s.getFullYear(), s.getMonth(), s.getDate());
        end = new Date(e.getFullYear(), e.getMonth(), e.getDate());
        if ((end.getTime() - start.getTime()) / 864e5 > 30) {
            return next(new Error('一次最多设置30天的价格'))
        }
        if (start >= end) {
            datelist.push(moment(start).format('YYYY-MM-DD'));
        }
        else {
            try {
                var current = new Date(start);
                while (current.getTime() <= end.getTime()) {
                    datelist.push(moment(current).format('YYYY-MM-DD'));
                    current = new Date(+current + 1 * 864e5);
                }
            }
            catch (err) {
                return next(new Error(err))
            }
        }
        var user = req.user.profile;
        new venueSer().unlock({reason: reason, product: prod, user_id: user.username, product_details: prod_details, dates: datelist, tag: colorFlag.isSetColor ? colorFlag.color : undefined},
            function (err, result) {
                if (req.timedout) return;
                if (err) {
                    return next(err);//res.send(err);
                } else {

                    return res.send(result);
                }
            })
    }
}
exports.release = function (req, res) {
    var prod_id = req.query.prod;
    new venueSer().release(prod_id, function (err, result) {
        if (req.timedout) return;
        if (err) {
            return next(err);//res.send(err);
        } else {

            return res.send(result);
        }
    })
}
exports.unrelease = function (req, res) {
    var prod_id = req.query.prod;
    new venueSer().unrelease(prod_id, function (err, result) {
        if (req.timedout) return;
        if (err) {
            return next(err);//res.send(err);
        } else {

            return res.send(result);
        }
    })
}
exports.deletevenue = function (req, res, next) {
    var id = req.query.prod || 0;
    new venueSer().delete(id, function (err, result) {
        if (req.timedout) return;
        if (err) {
            return next(err);
        } else {
            return res.send(result);
        }
    })
}

exports.updatevenue = function (req, res) {
    var obj = {};
    obj.id = req.body.id;
    obj.name = req.body.name;
    obj.s_order = req.body.s_order;
    obj.description = req.body.description;
    obj.floor_type = req.body.floor_type;
    obj.standerd = req.body.standerd;
    obj.indoor = req.body.indoor;
    obj.floodlit = req.body.floodlit;
    obj.available = req.body.available;
    //obj.create_time=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    obj.operator_name = req.body.operator_name;
    new venueSer().updatevenue(obj, function (err, result) {
        if (req.timedout)return;
        if (err) {
            return res.send(err);
        } else {
            return res.send(JSON.parse(result));
        }
    })
}


exports.getVenuesByindoor = function (req, res) {
    var indoor = req.query.indoor;
    var gym_id = req.user.profile.gymid;
    new venueSer().getVenuesByindoor(indoor, gym_id, function (err, result) {
        if (req.timedout)return;
        if (err) {
            return res.send(err);
        } else {
            return res.send(JSON.parse(result).data);
        }
    })
}