/**
 * Created by talentpig on 14/12/9.
 */
var http = require('http');
var querystring = require('querystring');
var moment = require('moment');
var requireclient=require('api_client');
function productService() {
    var roshanapiObj=requireclient("roshanApi");
    this.reqUrl=roshanapiObj?roshanapiObj.server.host:"localhost";
    this.reqPort=roshanapiObj?roshanapiObj.server.port:"4001";
    /*this.reqUrl='127.0.0.1';
     this.reqPort='4001';*/
}
//创建场地和产品
productService.prototype.createVenueProduct=function(reqObj,cb){
    var headers = {
        'Content-Type': 'application/json'
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/venue/add',
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
            return cb(null,info);
        })
    });
    req.on('error', function (e) {

        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
};
productService.prototype.deleteVenueProduct=function(reqObj,cb){
    var headers = {
        'Content-Type': 'application/json'
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/deleteproduct',
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
            return cb(null,info);
        })
    });
    req.on('error', function (e) {
        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
};
productService.prototype.modifySomePrice=function(reqObj,cb){
    var headers = {
        'Content-Type': 'application/json'
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/modifySomePrice',
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
            return cb(null,info);
        })
    });
    req.on('error', function (e) {
        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
};
productService.prototype.stockSetting=function(reqObj,cb){
    var headers = {
        'Content-Type': 'application/json'
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/stockSetting',
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
            return cb(null,info);
        })
    });
    req.on('error', function (e) {
        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
};
productService.prototype.groupSale=function(reqObj,cb){
    var headers = {
        'Content-Type': 'application/json'
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/groupSale',
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
            return cb(null,info);
        })
    });
    req.on('error', function (e) {
        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
};
productService.prototype.getGroupSaleInfo=function(reqObj,cb){
    var headers = {
        'Content-Type': 'application/json'
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/getGroupSaleInfo',
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
            return cb(null,info);
        })
    });
    req.on('error', function (e) {
        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
};
productService.prototype.addprice=function(reqObj,cb){
    var headers = {
        'Content-Type': 'application/json'
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/addprice',
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
            return cb(null,info);
        })
    });
    req.on('error', function (e) {
        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
};
productService.prototype.setProductStatus=function(reqObj,cb){
    var headers = {
        'Content-Type': 'application/json'
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/setProductStatus',
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
            return cb(null,info);
        })
    });
    req.on('error', function (e) {
        return cb(e);
    })
    req.write(JSON.stringify(reqObj));
    req.end();
};
