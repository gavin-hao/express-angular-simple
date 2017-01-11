/* GET home page. */

var ajaxResult = require('../../util/ajaxResult');
var noticeSer = require('../services/notice.js');
var noticeType = require('../../util/constants').NoticeType;
var index = function (req, res) {
    //res.render('index', { title: 'Express', layout: 'layout' });
    res.render('index');
};
var indicator = function (req, res, next) {
    if (!req.user || !req.user.profile.id) {
        res.send({code: 1, data: null});
    }
    var u = req.user.profile.id;
    new noticeSer().getIndicator(u, function (err, result) {
        if (req.timedout)return;
        if (err) return next(err);
        return res.send(new ajaxResult({data: result}));
    })
}
var getNotice = function (req, res, next) {
    if (!req.user || !req.user.profile.id) {
        res.send({code: 1, data: null});
    }

    var u = req.user.profile.id;
    var msgType = req.query.type || 0;
    var limit = req.query.top || 3;
    new noticeSer().getNewMessage({uid: u, type: msgType, top: limit}, function (err, result) {
        if (req.timedout)return;
        if (err) return next(err);
        return res.send(new ajaxResult({data: result}));
    });
}
module.exports = {
    index: index,
    indicator: indicator,
    notice:getNotice,
    user: require('./user.js'),
    gym: require('./gym.js'),
    venue: require('./venue.js'),
    product: require('./product.js'),
    account: require('./account.js'),
    order: require('./order.js'),
    booking: require('./booking.js')
}

