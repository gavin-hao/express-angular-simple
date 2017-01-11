/**
 * Created by Rebort_Chu on 2014/10/21.
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
productService.prototype.addproduct = function (reqObj, cb) {
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/addproduct',
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
}
productService.prototype.addprice = function (reqObj, cb) {
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
    };
    var _this=this;
    var options = {
        host:_this.reqUrl,
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
}

productService.prototype.updateprice = function (reqObj, cb) {
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
    };
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/modifyOneprice',
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
}
productService.prototype.getallproduct = function (gym_id, cb) {
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/getallproduct?gym_id=' + gym_id+"&date=",
        method: 'GET',
        port: _this.reqPort,
        headers: {
            'Accept': 'text/html'
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (data) {

            info += data;
        });
        res.on('end', function (x) {

            //解析回调结果
            var result = JSON.parse(info);
            var objResult = {};
            objResult.code = result.code;
            if(result.code==1){
                return result;
            }
            var resultArray = [];
            result.data.forEach(function (item) {
                var obj = {};
                obj.venue_id = [];
                obj.venueNames=[];
                    if (resultArray.some(function(o){
                        return o.id==item.id;
                    }) ) {
                        resultArray.forEach(function(i){
                            if(i.id==item.id){
                                i.venue_id.push(item.venue_id);
                                i.venueNames.push(item.name);
                            }
                        })
                    }else{
                        obj.available = item.available;
                        obj.end_time = new Date('2000-01-01 ' + item.end_time).getHours();
                        obj.price = item.price;
                        obj.product_id = item.product_id;
                        obj.product_name = item.product_name;
                        obj.sale_starttime = moment(item.sale_starttime).format('YYYY-MM-DD');
                        obj.sale_endtime = moment(item.sale_endtime).format('YYYY-MM-DD');
                        obj.start_time = new Date('2000-01-01 ' + item.start_time).getHours();
                        obj.product_type = item.product_type;
                        obj.venue_id.push(item.venue_id);
                        obj.venueNames.push(item.name);
                        obj.id=item.id;
                        obj.price_starttime=moment(item.price_start).format('YYYY-MM-DD');
                        obj.price_endtime=moment(item.price_end).format('YYYY-MM-DD');
                        obj.parent_id=item.parent_id;
                        resultArray.push(obj);
                    }
            })
            //得到的resultArray是productprice的每一条，下面需要按productid分组
            var returnArray=[];

            resultArray.forEach(function(item){
                if(returnArray.length==0){
                    var returnObj={};
                    returnObj.products=[];
                    returnObj.product_id=item.product_id;
                    returnObj.products.push(item);
                    returnArray.push(returnObj);
                }
                else if(!returnArray.some(function(p){
                    return p.product_id==item.product_id;
                })){
                    var returnObj={};
                    returnObj.products=[];
                    returnObj.product_id=item.product_id;
                    returnObj.products.push(item);
                    returnArray.push(returnObj);
                }else{

                    returnArray.forEach(function(i){
                        if(i.product_id==item.product_id){
                            i.products.push(item);
                        }
                    })

                }
            })
            var x=returnArray;
            objResult.data = returnArray;
            return cb(null,objResult);

        })
    });
    req.on('error', function (e) {

        return cb(e);
    });
    req.end();
}

productService.prototype.getpricebyparentid=function(parent_id,cb){
    var _this=this;
    var options = {
        host: _this.reqUrl,
        path: '/product/getpricebyparentid/'+parent_id,
        method: 'GET',
        port:_this.reqPort,
        headers: {
            'Accept': 'text/html'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(data) {
            var obj={};
            obj.code=JSON.parse(data).code;
            obj.data=[];
            JSON.parse(data).data.forEach(function(item){
                var temp={};
                temp.product_id=item.product_id;
                temp.price_start=moment(item.price_start).format('YYYY-MM-DD');
                temp.price_end=moment(item.price_end).format('YYYY-MM-DD');
                temp.start_time=item.start_time;
                temp.end_time=item.end_time;
                temp.price=item.price;
                obj.data.push(temp);
            })
            return cb(null,obj);
        });
    });
    req.on('error', function (e) {
        return cb(e);
    });
    req.end();
}
//删除产品
productService.prototype.deleteproduct = function (price_id, cb) {
    var reqObj={};
    reqObj.price_id=price_id;
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
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
}
//产品上下线
productService.prototype.setprodstatus = function (status,product_id, cb) {
    var reqObj={};
    reqObj.product_id=product_id;
    reqObj.status=status;
    var headers = {
        'Content-Type': 'application/json'
        //如果使用的是varuserString='data='+userjson格式应将'Content-Type':设为'application/x-www-form-urlencoded'//form表单格式
        /*'Content-Length': JSON.stringify(reqJSON).length*/
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
}
module.exports = productService;
