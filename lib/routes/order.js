
var orderService=require('../services/order.js');
var ajaxResult=require('../../util/ajaxResult');

exports.getOrderList=function(req,res)
{

    var gym_id=req.user.profile.gymid;
    var userphone=req.query["userphone"];
    var filterObj={};
    filterObj.userphone=userphone;
    orderService.getOrderList(gym_id,filterObj,function(err,result)
    {
        if (req.timedout)return;
        if(err)
        {
            res.send(new ajaxResult({
                data:null,
                code:"1",
                status:"failed",
                errorMessage:err.message
            }))
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
    });
}
exports.getOrderListByPage=function(req,res)
{

    var gym_id=req.user.profile.gymid;
    var pageNum=req.query.pageNum;
    var pageIndex=req.query.pageIndex;
    var orderState=req.query.orderState;
    var orderStartTime=req.query.orderStartTime;
    var orderEndTime=req.query.orderEndTime;



    var filterObj={};
    filterObj.pageNum=pageNum;
    filterObj.pageIndex=pageIndex;
    filterObj.orderState=orderState;
    filterObj.orderStartTime=orderStartTime;
    filterObj.orderEndTime=orderEndTime;
    orderService.getOrderListByPage(gym_id,filterObj,function(err,result)
    {
        if (req.timedout)return;
        if(err)
        {
            res.send(new ajaxResult({
                data:null,
                code:"1",
                status:"failed",
                errorMessage:err.message
            }))
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
    });
}
exports.getOrderDetail=function(req,res){
    var orderid=req.query["orderid"];
    orderService.getOrderDetail(orderid,function(err,result)
    {
        if (req.timedout)return;
        if (req.timedout)return;
        if(err)
        {
            res.send(new ajaxResult({
                data:null,
                code:"0",
                status:"failed",
                errorMessage:err.message
            }))
        }
        else
        {
            res.send(new ajaxResult({
                data:result,
                code:"1",
                status:"success",
                errorMessage:null
            }))
        }
    });
}
exports.getVenueList=function(req,res)
{
    var gym_id=req.user.profile.gymid;
    orderService.getVenueList(gym_id,function(err,data)
    {
        if (req.timedout)return;
        if(err)
        {
            res.send(new ajaxResult({
                data:null,
                code:"1",
                status:"failed",
                errorMessage:err.message
            }))
        }
        else
        {
            res.send(new ajaxResult({
                data:data,
                code:"0",
                status:"success",
                errorMessage:null
            }))
        }
    })
}
exports.updateorderstate=function(req,res){
    var orderid=req.query["orderid"];
    var orderstate=req.query["orderstate"];

    orderService.updateorderstate(orderid,orderstate,function(err,result)
    {
        if (req.timedout)return;
        if(err)
        {
            res.send(new ajaxResult({
                data:null,
                code:"1",
                status:"failed",
                errorMessage:err.message
            }))
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
    });
}
exports.cancelOrder=function(req,res)
{
    var orderid=req.body.orderid;
    var productstate=req.body.productstate;
    orderService.cancelOrder(orderid,productstate,function(err,result)
    {
        if (req.timedout)return;
        if(err)
        {
            res.send(new ajaxResult({
                data:null,
                code:"1",
                status:"failed",
                errorMessage:err.message
            }))
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
exports.deleteOrder=function(req,res)
{
    var orderid=req.body.orderid;

    orderService.deleteOrder(orderid,function(err,result)
    {
        if (req.timedout)return;
        if(err)
        {
            res.send(new ajaxResult({
                data:null,
                code:"1",
                status:"failed",
                errorMessage:err.message
            }))
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
