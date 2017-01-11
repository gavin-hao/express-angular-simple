/**
 * Created by Rebort_Chu on 2014/10/16.
 */
var http = require('http');
var querystring = require('querystring');
var requireclient = require('api_client');
var ajaxResult = require('../../util/ajaxResult');
var request = require('request');
var noticeType = require('../../util/constants').NoticeType;
function venueService() {
    var roshanapiObj = requireclient("roshanApi");
    this.reqUrl = roshanapiObj ? roshanapiObj.server.host : "localhost";
    this.reqPort = roshanapiObj ? roshanapiObj.server.port : "4001";

    this.hostUri = roshanapiObj.server.hostUri;
    /* this.reqUrl='127.0.0.1';
     this.reqPort='4001';*/


}
venueService.prototype.getVenuesByGymId = function (gym_id, start, end, cb) {

    var _this = this;
    if (typeof cb === 'undefined' && typeof end === 'function') {
        cb = end;
        end = start;
    }
    if (typeof end === 'undefined' && typeof cb === 'undefined' && typeof start === 'function') {
        cb = start;
        start = end = new Date();
    }
    if (!end || typeof end === 'undefined') {
        end = start;
    }
    var path = '/product/list';
    var url = _this.hostUri + path;
    request.get({url: url, qs: {gym_id: gym_id, sdate: start, edate: end}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    });

}


venueService.prototype.getVenueByVenueId = function (venue_id, cb) {
    var _this = this;
    var options = {
        host: _this.reqUrl,
        path: '/venue/getVenue/' + venue_id,
        method: 'GET',
        port: _this.reqPort,
        headers: {
            'Accept': 'text/html'
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {

            return cb(null, data);
        });
    });
    req.on('error', function (e) {

        return cb(new ajaxResult({data: null, code: 1, status: 1, errorMessage: e}));
    });
    req.end();
}

venueService.prototype.addvenue = function (reqObj, cb) {

    var _this = this;

    var path = '/venue/add';
    var url = _this.hostUri + path;
    request.post({url: url, body: reqObj, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    })
}
venueService.prototype.addPrice = function (priceObj, cb) {
    var _this = this;

    var path = '/product/updateBasePrice';
    var url = _this.hostUri + path;
    request.post({url: url, body: {price: priceObj.price, detailIds: priceObj.product_details}, json: true}, function (err, res, body) {
        if (err) {
            return cb(new Error(err));
        }
        return cb(null, body);
    })
}
venueService.prototype.adjustPrice = function (priceObj, cb) {
    var _this = this;

    var path = '/product/modifySomePrice';
    var url = _this.hostUri + path;
    request.post({url: url, body: {price: priceObj.price, detailIds: priceObj.product_details, priceDates: priceObj.dates}, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}

venueService.prototype.lock = function (stock, cb) {
    var _this = this;

    var path = '/product/stockSetting';
    var url = _this.hostUri + path;
    request.post({url: url, body: {reason: stock.reason, isclose: 1, detailIds: stock.product_details,
            dates: stock.dates, tag: stock.tag, operator_id: stock.user_id}, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }

            return cb(null, body);
        })
}

venueService.prototype.unlock = function (stock, cb) {
    var _this = this;

    var path = '/product/stockSetting';
    var url = _this.hostUri + path;
    request.post({url: url, body: {reason: stock.reason, isclose: 0, detailIds: stock.product_details, dates: stock.dates, tag: stock.tag, operator_id: stock.user_id}, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}
venueService.prototype.release = function (prod, cb) {
    var _this = this;

    var path = '/product/setproductstatus';
    var url = _this.hostUri + path;
    request.post({url: url, body: {product_id: prod, status: 1}, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}
venueService.prototype.unrelease = function (prod, cb) {
    var _this = this;

    var path = '/product/setproductstatus';
    var url = _this.hostUri + path;
    request.post({url: url, body: {product_id: prod, status: 0}, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}
venueService.prototype.delete = function (prod, cb) {
    var _this = this;

    var path = '/product/deleteproduct';
    var url = _this.hostUri + path;
    request.post({url: url, body: {productId: prod}, json: true},
        function (err, res, body) {
            if (err) {
                return cb(new Error(err));
            }
            return cb(null, body);
        })
}


venueService.prototype.updatevenue = function (reqObj, cb) {
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
    };
    var _this = this;
    var options = {
        host: _this.reqUrl,
        path: '/venue/update',
        port: _this.reqPort,
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
            return cb(null, info);
        })
    });
    req.on('error', function (e) {

        return cb(new ajaxResult({data: null, code: 1, status: 1, errorMessage: e}));
    })
    req.write(JSON.stringify(reqObj));
    req.end();
}
venueService.prototype.deletevenue = function (id, cb) {
    var reqObj = {};
    reqObj.id = id;
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
    };
    var _this = this;
    var options = {
        host: _this.reqUrl,
        path: '/venue/delete',
        port: _this.reqPort,
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

            return cb(null, info);
        })
    });
    req.on('error', function (e) {

        return cb(new ajaxResult({data: null, code: 1, status: 1, errorMessage: e}));
    })
    req.write(JSON.stringify(reqObj));
    req.end();
}
venueService.prototype.getVenuesByindoor = function (indoor, gym_id, cb) {
    var _this = this;
    var options = {
        host: _this.reqUrl,
        path: '/venue/getVlist/' + indoor + '/' + gym_id,
        method: 'GET',
        port: _this.reqPort,
        headers: {
            'Accept': 'text/html'
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {

            return cb(null, data);
        });
    });
    req.on('error', function (e) {

        return cb(new ajaxResult({data: null, code: 1, status: 1, errorMessage: e}));
    });
    req.end();
}
module.exports = venueService;