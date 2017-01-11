/**
 * Created by Administrator on 2014/10/17.
 */
var config=require('config');
var http=require('http');
var requireclient=require('api_client');

function orderService()
{
    var roshanapiObj=requireclient("roshanApi");
    var orderapiObj=requireclient("orderApi");
    this.orderapiHost=orderapiObj?orderapiObj.server.host:"192.168.1.191";
    this.orderapiPort=orderapiObj?orderapiObj.server.port:"4002";
    this.roshanapiHost=roshanapiObj?roshanapiObj.server.host:"192.168.1.191";//config.get('dataserviceurl').getorderlist;
    this.roshanapiPort=roshanapiObj?roshanapiObj.server.port:"4001";

    this.orderapitimeout=orderapiObj?orderapiObj.server.timeout:"30000";
    this.roshanrapitimeout=roshanapiObj?roshanapiObj.server.timeout:"30000";

//    this.roshanapiHost="127.0.0.1";//config.get('dataserviceurl').getorderlist;
//    this.roshanapiPort="4001";
//    this.orderapiHost="127.0.0.1";
//    this.orderapiPort="4002";

}
orderService.prototype.getOrderList=function(gym_id,filterObj,callback)
{
    if(!gym_id)
    {
        return callback(new Error("gym_id is null"),null);
    }


    var _this = this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host:_this.orderapiHost,
        port:_this.orderapiPort,
        path:"/order/getorderlist?gym_id="+gym_id+"&filter="+JSON.stringify(filterObj),
        method: 'GET',
        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on('data', function (data) {
            body += data;
        });

        res.on('end', function () {
            return callback(null,JSON.parse(body).data);
        })
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}
orderService.prototype.getOrderListByPage=function(gym_id,filterObj,callback)
{
    if(!gym_id)
    {
        return callback(new Error("gym_id is null"),null);
    }


    var _this = this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host:_this.orderapiHost,
        port:_this.orderapiPort,
        path:"/order/getorderlistbypage?gym_id="+gym_id+"&filter="+JSON.stringify(filterObj),
        method: 'GET',
        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on('data', function (data) {
            body += data;
        });

        res.on('end', function () {
            return callback(null,JSON.parse(body).data);
        })
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}
orderService.prototype.getOrderDetail=function(orderid,callback)
{

    if(!orderid)
    {
        return callback(new Error("orderid is null"),null);
    }
    var _this = this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host: _this.orderapiHost,//"http://127.0.0.1:3003/order/getorderdetail?content="+content,
        port:_this.orderapiPort,
        path:"/order/getorderdetail?orderid="+orderid,
        method: 'GET',

        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on('data', function (data) {
            body += data;
        });
        res.on('end', function () {
            return callback(null,JSON.parse(body).data);
        })
    });
    req.on('error', function(e) {
        return callback(e,null);
    });
    req.end();
}
orderService.prototype.updateorderstate=function(order_id,order_state,callback)
{
    if(!order_id)
    {
        return callback(new Error("orderid is null"),null);
    }
    var _this = this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host: _this.orderapiHost,//"http://127.0.0.1:3003/order/getorderdetail?content="+content,
        port:_this.orderapiPort,
        path:"/order/updateorderstate?orderid="+order_id+"&orderstate="+order_state,
        method: 'GET',

        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on('data', function (data) {
            body += data;
        });
        res.on('end', function () {
            console.log(body);

            return callback(null,JSON.parse(body));
        })
    });
    req.on('error', function(e) {
        return callback(e,null);
    });
    req.end();
}
orderService.prototype.getVenueList=function(gym_id,callback)
{
    if(!gym_id)
    {
        return callback(new Error("gym_id is null"),null);
    }
    var _this = this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host: _this.orderapiHost,//"http://127.0.0.1:3003/order/getorderdetail?content="+content,
        port:_this.roshanapiPort,
        path:"/venue/search/?gymid="+gym_id,
        method: 'GET',

        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on('data', function (data) {
            body += data;
        });
        res.on('end', function () {
            return callback(null,JSON.parse(body));
        })
    });
    req.on('error', function(e) {
        return callback(e,null);
    });
    req.end();
}
orderService.prototype.cancelOrder=function(orderid,productstate,callback)
{
    if(!orderid||!productstate)
    {
        return callback(new Error("orderid or productstate is null"),null);
    }
    var _this = this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host: _this.orderapiHost,//"http://127.0.0.1:3003/order/getorderdetail?content="+content,
        port:_this.orderapiPort,
        path:"/order/cancelorder",
        method: 'POST',

        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on('data', function (data) {
            body += data;
        });
        res.on('end', function () {
            return callback(null,JSON.parse(body));
        })
    });
    req.on('error', function(e) {
        return callback(e,null);
    });
    req.write(JSON.stringify({orderid:orderid,productstate:productstate}));
    req.end();

}
orderService.prototype.deleteOrder=function(orderid,callback)
{
    if(!orderid)
    {
        return callback(new Error("orderid  is null"),null);
    }
    var _this = this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host: _this.orderapiHost,//"http://127.0.0.1:3003/order/getorderdetail?content="+content,
        port:_this.orderapiPort,
        path:"/order/deleteorder",
        method: 'POST',

        headers: headers
    };
    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on('data', function (data) {
            body += data;
        });
        res.on('end', function () {
            return callback(null,JSON.parse(body));
        })
    });
    req.on('error', function(e) {
        return callback(e,null);
    });
    req.write(JSON.stringify({orderid:orderid}));
    req.end();

}
module.exports=new orderService();