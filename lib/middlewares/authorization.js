/**
 * Created by zhigang on 14-10-9.
 */
var expressJwt = require('express-jwt');
var _ = require('lodash');
var config = require('config');
var jwtOption = require('../middlewares/jwtSecure.js').jwtSetting;


exports.authorize = expressJwt(jwtOption);
exports.unauthorizedHandler = function (err, req, res, next) {
    if (err.constructor.name === 'UnauthorizedError') {
        if (err.inner.name == 'TokenExpiredError') {
            res.status(419).send({status: 'Unauthorized', value: err});
        }
        else {
            res.status(401).send('Unauthorized');
        }
    }
};
exports.adminRequires = function (req, res, next) {
    if (!(req.user && req.user.profile)) {
        res.status(401).send('Unauthorized');
        return;
    }

    if (!req.user.profile['role'] || req.user.profile['role'].toLowerCase() != 'admin') {
        res.status(403).send('Unauthorized');
        return;
    }
    else {
        next();
    }
}