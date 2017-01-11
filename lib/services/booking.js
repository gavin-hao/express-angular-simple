/**
 * Created by Administrator on 2014/10/11.
 */
var http=require('http');
var moment=require('moment');
var querystring=require('querystring');
var requireclient=require('api_client');
var log=require('log').getLogger();
var async=require('async');
function booking(){
    var roshanapiObj=requireclient("roshanApi");
    var orderapiObj=requireclient("orderApi");
    this.orderapiHost=orderapiObj?orderapiObj.server.host:"127.0.0.1";
    this.orderapiPort=orderapiObj?orderapiObj.server.port:"4002";
    this.roshanapiHost=roshanapiObj?roshanapiObj.server.host:"127.0.0.1";//config.get('dataserviceurl').getorderlist;
    this.roshanapiPort=roshanapiObj?roshanapiObj.server.port:"4001";


}
booking.prototype.getProductBookingInfo=function(gym_id,bookingdate,isfirst,callback)
{
    var _this=this;
    var bookingdates=[];
    bookingdates.push(bookingdate);
    var _this=this;
    var paramobj={gym_id:gym_id,bookingdates:bookingdates}
    var headers = {
        'Content-Type': 'application/json'
    };
    //var host = require('config').get('apiInfo').url;

    var options = {
        host: _this.roshanapiHost,//"http://127.0.0.1:3003/order/getorderdetail?content="+content,
        port:_this.roshanapiPort,
        path:"/product/getproductbookinginfo?param="+JSON.stringify(paramobj),
        method: 'GET',
        headers: headers

    };

    var req = http.request(options, function (res) {

        res.setEncoding('utf8');
        var info = '';
        res.on('data', function (chunk) {
            info += chunk;
        });
        res.on('end', function (x) {

            var result = JSON.parse(info);
            if(result.code=="0")
            {
                var data=[];
                if(result)
                {
                    data=result.data[0].data;
                }
                var returnResult=_this.getTableContent(data,bookingdate,isfirst);

                return callback(null,returnResult);
            }
           else
            {
                return callback(new Error(result.errorMessage),null);
            }

        })
    });
    req.on('error', function (e) {
        console.log(e.message.toString());
        return callback(e,null);
    })

    req.end();
}
booking.prototype.getSenvenDate=function(result)
{
    var _this=this;
    var dateArr = [];
    if (result && result.length > 0) {
        var bookingdate = result[0].bookingdate;
        var startdate = result[0].startdate;

        var date = new Date(startdate);
        dateArr.push(_this.getdateformatObj(date, bookingdate))
        for (var i = 1; i < 7; i++) {
            var currentDate=new Date(Date.parse(date)+86400000 * i);
            dateArr.push(_this.getdateformatObj(currentDate, bookingdate));
        }
    }
    return dateArr;

}
booking.prototype.getdateformatObj=function(date, bookingdate)
{
    var week = date.getDay();
    var weekformat = "星期日";
    switch (week) {
        case 1:
            weekformat = "星期一";
            break;
        case 2:
            weekformat = "星期二";
            break;
        case 3:
            weekformat = "星期三";
            break;
        case 4:
            weekformat = "星期四";
            break;
        case 5:
            weekformat = "星期五";
            break;
        case 6:
            weekformat = "星期六";
            break;

    }

    var classname = "";
    if (date.getDate() == new Date(bookingdate).getDate()) {
        classname = "active";
    }
    var formatdate=moment(date).format("YYYY-MM-DD");//date.getFullYear().toString()+"-"+(date.getMonth()+1).toString()+"-"+date.getDate().toString();
    return {week: weekformat, date: date, classname: classname,formatdate:formatdate};
}
booking.prototype.getTableContent=function(result,bookingdate,isfirst)
{
    var _this=this;
    var resultData = {};

    if (result && result.length > 0) {

        var starttime =  result[0].productDetail[0].timemark?result[0].productDetail[0].timemark:0;
        var endtime = 0;
        var resultArr = [];
        var rows = [];
        result.forEach(function (item) {

            if (item.productDetail.length > 0) {
                var detailLength = item.productDetail.length;
                if (item.productDetail[0].timemark < starttime) {
                    starttime = item.productDetail[0].timemark;
                }
                if (item.productDetail[detailLength - 1].timemark > endtime) {
                    endtime = item.productDetail[detailLength - 1].timemark;
                }
            }
        });

        result.forEach(function (item) {
            var contentObj = {};
            contentObj.productid = item.productid;
            contentObj.productname = item.productname;
            contentObj.floortype=item.floortype;
            contentObj.indoor=item.indoor;
            contentObj.standerd=item.standerd;
            contentObj.venueid=item.venue_id;
            var venueAtribute="";
            venueAtribute+=item.indoor=="1"?"室外":"室内";
            venueAtribute+=item.floortype=="1"?"塑胶地板":item.floortype=="0"?"木地板":"水泥地";
            venueAtribute+=item.standerd=="1"?"全场":"半场";
            contentObj.venueatribute=venueAtribute;
            contentObj.starttimemark=starttime;
            contentObj.endtimemark=endtime;
            var contentdetailArr = [];
            var timemarkArr = [];
            for (var m = 0; m < item.productDetail.length; m++) {
                var detailItem = item.productDetail[m];
                timemarkArr.push(detailItem.timemark);
            }
            for (var i = starttime; i <= endtime; i++) {
                var index = timemarkArr.indexOf(i);
                if (index >= 0) {

                    var detailItem = item.productDetail[index];
                    var pricedes = "";
                    var classname="";//表格显示的样式

                    if (detailItem.bookingCount > 0) {
                        pricedes = detailItem.price + "元";
                    }
                   var outlineclass="";
                    var detailstarttime =moment("2014-01-01 "+detailItem.start_time).format("HH:mm");
                    var detailendtime =moment("2014-01-01 "+detailItem.end_time).format("HH:mm");

                    var bookingcount=detailItem.bookingCount;
                    var text="";//下线或者预订系显示内容
                    if(bookingcount<=0)
                    {
                        classname="disabled";
                        if(detailItem.bookingreason=="2")//下线
                        {
                            text=detailItem.outlineReason;
                            outlineclass=_this.getColorTag(detailItem.outlinetag).css;

                            pricedes="";
                        }
                        if(detailItem.bookingreason=="1")//被预定
                        {
                            text=detailItem.order_userphone;

                            pricedes="";

                        }
                        if(detailItem.bookingreason=="3")//未维护价格
                        {
                            pricedes='';

                        }
                    }
                    contentdetailArr.push({detailId: detailItem.detailId,  timemark: detailItem.timemark, start_time: detailstarttime,order_id:detailItem.order_id,
                        end_time: detailendtime, price: detailItem.price, bookingCount: detailItem.bookingCount, pricedes: pricedes,classname:classname,bookingreason:detailItem.bookingreason,text:text,outlineclass:outlineclass});
                }
                else {
                    contentdetailArr.push({detailId: 0,  timemark: i, start_time: i > 9 ? i + ":00" : "0" + i.toString() + ":00",
                        end_time: i > 8 ? (i + 1).toString() + ":00" : "0" + (i + 1).toString() + ":00", price: "", bookingCount: 0, pricedes: "",
                        classname:"disabled"});
                }

            }
            contentObj.productDetail = contentdetailArr;
            resultArr.push(contentObj);
        });
        if (resultArr.length > 0) {

            var detailtime = resultArr[0].productDetail[resultArr[0].productDetail.length - 1].end_time;
            var endtimearr=detailtime.split(':');
            var detailstarttime =detailtime;
            if(endtimearr.length>1)
            {
                detailstarttime=endtimearr[0]+":"+endtimearr[1];
            }


            resultData.lasttime = detailstarttime;
        }
        else {
            resultData.lasttime = "";
        }
        resultData.dataArr = resultArr;
      if(isfirst=="1") {
          resultData.dateArr = _this.getSenvenDate(result);
          resultData.selectDate = new Date(bookingdate);
      }
    }
    return resultData;

}
booking.prototype.getColorTag=function(input){
    switch (input.toString()) {
        case "0":
            return {name:'红色',css:'lock text-red'};
        case "1":
            return {name:'黄色',css:'lock text-yellow'};
        case "2":
            return {name:'蓝色',css:'lock text-blue'};
        case "3":
            return {name:'绿色',css:'lock text-green'};
        default :
            return {name:'',css:'lock'};
    }
}
/**
 *
 * @param orderInfo 订单详情json对象
 * @param callback
 */
booking.prototype.insertOrderInfo=function(orderInfo,callback)
{
    var _this=this;
    var headers = {
        'Content-Type': 'application/json'
    };
    //var host = require('config').get('apiInfo').url;
   /* this.roshanapiHost="127.0.0.1";//config.get('dataserviceurl').getorderlist;
    this.roshanapiPort="3001";*/
    var options = {
        host: _this.orderapiHost,//"http://127.0.0.1:3003/order/getorderdetail?content="+content,
        port:_this.orderapiPort,
        path:"/order/addorderinfo",
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
            var resultdata=JSON.parse(info);
            if(resultdata.code=="0")
            {
                callback(null,resultdata.data);
            }
            else
            {
                callback(new Error(resultdata.errorMessage),null);
            }

        })
    });
    req.on('error', function (e) {
        console.log(e.message.toString());
        return callback(e,null);
    })
    req.write(JSON.stringify(orderInfo));
    req.end();

}
booking.prototype.getorderstate=function(orderid,callback)
{
    var _this=this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host:_this.orderapiHost,
        port:_this.orderapiPort,
        path:"/order/getorderstate?orderid="+orderid,
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
        return callback(null,null);

    });

    req.end();
}
booking.prototype.getGymStock=function(detailds,bookingdate,callback)
{
    if(!detailds||!bookingdate)
    {
        return callback(new Error("detailids or bookingdate is null"),null);
    }
    var _this=this;
    var headers = {
        'Content-Type': 'application/json'
    }
    var options = {
        host:_this.roshanapiHost,
        port:_this.roshanapiPort,
        path:"/product/getgymstock?bookingdate='"+moment(bookingdate).format("yyyy-mm-dd")+"'&detailids='"+detailds+"'",
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
booking.prototype.getstockResult=function(productlist,stockResult) {
    var _this = this;
    for (var i = 0; i < productlist.length; i++) {
        var productObj = productlist[i];
        for (var k = 0; k < productObj.productDetail.length; k++) {
            var detailObj = productObj.productDetail[k];
            async.filter(stockResult, function (item, cb) {
                cb(item.detailId == detailObj.detailId);
            }, function (filterresults) {
                if (filterresults && filterresults.length > 0) {
                    var classname = "disabled";
                    var text = "";
                    var outlinecalss = "";
                    var pricedes = "";
                    if (filterresults[0].bookingreason == "2")//下线
                    {
                        text = detailItem.outlineReason;
                        outlineclass = _this.getColorTag(filterresults[0].outlinetag).css;

                        pricedes = "";
                    }
                    if (filterresults[0].bookingreason == "1")//被预定
                    {
                        text = filterresults[0].order_userphone;

                        pricedes = "";

                    }
                    if (filterresults[0].bookingreason == "3")//未维护价格
                    {
                        pricedes = '';

                    }
                    detailObj.bookingCount = 0;

                    detailObj.bookingreason = filterresults[0].outlineReason;
                    detailObj.outlineclass = outlinecalss;
                    detailObj.order_id = filterresults[0].order_id;
                    detailObj.pricedes = pricedes;
                    detailObj.calssname = classname;
                    detailObj.text = text;

                }
            });
        }
    }
    return productlist;
}
module.exports=new booking();
