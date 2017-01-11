/**
 * Created by zhigang on 14/10/23.
 */

var jwt = require('jsonwebtoken');
var jwtOption = require('../middlewares/jwtSecure.js').jwtSetting;
var accountService = require('../services/account.js');
var _ = require('lodash');
var loginErrorMessage = {
    usernotexist: '用户不存在',
    invalidpassword: '用户名或密码错误'
};
var changeErrorMessage = {
    invalid_password: '初始密码错误'
};
exports.login = function (req, res) {
    res.render('./views/login');
};

exports.authenticate = function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.send(401, 'username and password is required');
    }
    var service = new accountService();
    service.validUser({username: req.body.username, password: req.body.password}, function (err, result) {
        if (req.timedout)return;
        if (err) {
            return res.send(401, {code: 1, data: 'error', errorMessage: '登录错误'});
        }
        else {
            if (result.code > 0) {
                return res.send(401, {code: 401, data: 'error', errorMessage: result.errorMessage});
            }
            if (result == null || result.data.userProfile == null) {
                return res.send(401, {code: 401, data: result.data.code, errorMessage: loginErrorMessage[result.data.code]});

            } else {
                /*var profile = {
                 username: 'hehehe@dongker.cn',
                 email: 'hehehe@dongker.cn',
                 id: 123,
                 role: 'admin',
                 gymid: 1,
                 gymSetting: {
                 name: encodeURI('五棵松hi-park'),
                 serviceTime: {start: '9:00', end: '22:00'}
                 }
                 }*/
                var profile = {
                    username: result.data.userProfile.userName || '',
                    email: result.data.userProfile.email || '',
                    id: result.data.userProfile.id,
                    role: result.data.userProfile.userType,
                    gymid: result.data.userProfile.gymId,
                    gymSetting: {
                        name: encodeURI(result.data.userProfile.gymName),
                        serviceTime: {start: result.data.userProfile.start_time, end: result.data.userProfile.end_time}
                    }
                }
                var token = '';
                if (req.body.rememberMe) {
                    var opts = _.cloneDeep(jwtOption);
                    opts.expiresInMinutes = 60 * 24 * 7;
                    token = jwt.sign({profile: profile}, jwtOption.secret, opts);
                }
                else {
                    token = jwt.sign({profile: profile}, jwtOption.secret, jwtOption);
                }
                return res.json({token: token});
            }

        }
    });

};

exports.renewToken = function (req, res) {
    var user = req.user.profile;

    var token = jwt.sign({profile: user}, jwtOption.secret, opts);
    return res.send({token: token});
}
exports.changePwd = function (req, res) {
    if (!req.body.oldPwd || !req.body.newPwd || !req.body.confirmPwd) {
        return res.send(200, {code: "1", "result": 'oldPwd and newPwd and confirmPwd is required'});
    }
    //req.user.profile.id;
    var service = new accountService();
    service.changePwd({id: req.user.profile.id, oldPwd: req.body.oldPwd, newPwd: req.body.newPwd, confirmPwd: req.body.confirmPwd}, function (err, result) {
        if (req.timedout)return;
        if (err) {
            return res.send(200, {"code": "1", "result": err});

        }
        else {
            if (!result.data.success) {
                return res.send(200, {"code": "1", "result": changeErrorMessage[result.data.message]});
            }
            else {
                return res.send(200, {"code": "0", "result": changeErrorMessage[result.data.message]});
            }
        }
    });
};
exports.getUser = function (req, res) {
    return res.send(200, {"code": "0", "username": req.user.profile.email});

};
exports.addStaff = function (req, res) {
    if (!req.body.userName || !req.body.password) {
        return res.send(200, {"code": "0", "result": 'username and password is required'});
    }
    var service = new accountService();
    service.addStaff({gym: req.user.profile.gymid, userName: req.body.userName, email: req.body.email, mobile: req.body.mobile, pwd: req.body.password}, function (err, result) {
        if (req.timedout)return;
        if (err) {
            return res.send(200, {"code": "1", "result": err});

        }
        else {
            if (!result.data && !result.data.success) {
                return res.send(200, {"code": "1", "result": result.data.message});
            }
            else {
                return res.send(200, {"code": "0", "result": result});
            }
        }
    });
};

exports.addUnionStaff = function (req, res) {
    if (!req.body.insertId||!req.body.email||!req.body.mobile) {
        return res.send(200, {"code": "0", "result": 'username and password is required'});
    }
    var service = new accountService();
    service.addStaff({gym: req.body.insertId, userName: "", email: req.body.email, mobile: req.body.mobile, pwd: "123456"}, function (err, result) {
        if (req.timedout)return;
        if (err) {
            return res.send(200, {"code": "1", "result": err});

        }
        else {
            if (!result.data && !result.data.success) {
                return res.send(200, {"code": "1", "result": result.data.message});
            }
            else {
                return res.send(200, {"code": "0", "result": result});
            }
        }
    });
};

exports.getStafflist = function (req, res) {
    var service = new accountService();
    service.getStafflist({gym: req.user.profile.gymid}, function (err, result) {
        if (req.timedout)return;
        if (err) {
            return res.send(200, {"code": "1", "result": err});
        }
        else {
            return res.send(200, {"code": "0", "result": result});
        }
    });
}
exports.deleteStaff = function (req, res) {
    if (!req.body.staffId) {
        return res.send(200, {"code": "0", "result": 'gymId is required'});
    }
    var service = new accountService();
    service.deleteStaff({gym: req.user.profile.gymid, staffId: req.body.staffId}, function (err, result) {
        if (req.timedout)return;
        if (err) {
            return res.send(200, {"code": "1", "result": err});

        }
        else {
            return res.send(200, {"code": "0", "result": result});
        }
    });
}