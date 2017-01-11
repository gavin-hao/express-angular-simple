/**
 * Created by guan on 14/10/29.
 */
var bookingService=require('../services/booking.js');
var ajaxResult=require('../../util/ajaxResult');
var moment=require('moment');
exports.getAllBookingProduct=function(req,res)
{
    var gym_id=req.user.profile.gymid;
    var bookingdate=req.query["bookingdate"];
    var isfirst=req.query["isfirst"];
    var fromatdate="";
    if(!bookingdate)
    {
        fromatdate=moment(new Date()).format('YYYY-MM-DD');
    }
    else {
        fromatdate = moment(bookingdate).format('YYYY-MM-DD');// "2014-12-12";
    }
    var restutnObj=bookingService.getProductBookingInfo(gym_id,fromatdate,isfirst,function(err,result)
    {
        if(err)
        {
            if(err.message=="no product")
            {
                res.send(new ajaxResult({
                    data:null,
                    code:"1000",
                    status:"failed",
                    errorMessage:err.message
                }))
            }
            else
            {
                res.send(new ajaxResult({
                    data:null,
                    code:"1",
                    status:"failed",
                    errorMessage:err.message
                }))
            }
        }
        else
        {
            res.send(new ajaxResult({
                data:result,
                code:"0",
                status:"success",
                errorMessage:null
            }))
        }
    })
}

exports.addOrderInfo=function(req,res)
{
    var gym_id=req.user.profile.gymid;
    var orderinfo=req.body;

    var orderobj={};
    if(orderinfo)
    {
        var orderjson=orderinfo;
        orderobj.gymnasium_id=gym_id;
        orderobj.order_amount=orderjson.order_amount;
        orderobj.order_reallyprice=orderjson.order_reallyprice;
        orderobj.order_type=1;
        orderobj.order_from=1;
        orderobj.order_username=orderjson.order_username;
        orderobj.order_userphone=orderjson.order_userphone;
        orderobj.order_detail="";
        orderobj.order_discount=orderjson.order_discount;
        orderobj.order_isdiscount=orderjson.order_isdiscount;
        orderobj.order_discountype=orderjson.order_discountype;
        orderobj.order_privilegecode=orderjson.order_privilegecode;
        orderobj.order_Isinvoice=orderjson.order_Isinvoice;
        orderobj.order_invoicetitle=orderjson.order_invoicetitle;
        orderobj.order_detail=JSON.stringify({"remark":orderjson.remark});


        var productArr=[];
        var productList=[];
        orderjson.productlist.forEach(function(item)
        {
            var index=productArr.indexOf(item.productid);
            if(index>=0)
            {
                productList[index].productDetails.push(item.productDetails);
            }
            else
            {
                var productObj={};
                productObj.productid=item.productid;
                productObj.productname=item.productname;
                productObj.venueid=item.venceid;
                productObj.floortype=item.floortype;
                productObj.indoor=item.indoor;
                productObj.standerd=item.standerd;
                var productDetails=[];
                productDetails.push(item.productDetails);
                productObj.productDetails=productDetails;
                productObj.bookingdate=orderjson.bookingdate;
                productList.push(productObj);
                productArr.push(item.productid);
            }

        })
        orderobj.orderproducts=productList;
        bookingService.insertOrderInfo(orderobj,function(err,result)
        {
            if(err)
            {
                res.send(new ajaxResult({
                    data:null,
                    code:"1000",
                    status:"failed",
                    errorMessage:err.message
                }))
            }
            else
            {
                res.send(new ajaxResult({
                    data:result,
                    code:"0",
                    status:"successed",
                    errorMessage:""
                }))
            }
        })

    }
    else
    {
        res.send(new ajaxResult({
            data:null,
            code:"1000",
            status:"failed",
            errorMessage:"orderinfo is null"
        }))
    }
}

exports.getorderstate=function(req,res)
{
    var orderid=req.query['orderid'];
    if(orderid)
    {
        bookingService.getorderstate(orderid,function(err,result)
        {
            if(err)
            {
                res.send(new ajaxResult({
                    data:null,
                    code:"1000",
                    status:"failed",
                    errorMessage:err.message
                }))
            }
            else
            {
                res.send(new ajaxResult({
                    data:result,
                    code:"0",
                    status:"successed",
                    errorMessage:""
                }))
            }
        });
    }
}
exports.getGymStock=function(req,res)
{
    var detailids=req.query.detailids;
    var bookingdate=req.query.bookingdate;
    bookingService.getGymStock(detailids,bookingdate,function(err,result)
    {
        if(err)
        {
            res.send(new ajaxResult({
                data:null,
                code:"1000",
                status:"failed",
                errorMessage:err.message
            }))
        }
        else
        {
            res.send(new ajaxResult({
                data:result,
                code:"0",
                status:"successed",
                errorMessage:""
            }))
        }
    })

}