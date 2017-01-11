/**
 * Created by Rebort_Chu on 2014/10/21.
 */
var prodSer=require('../services/product.js');
var moment=require('moment');
var ajaxResult=require('../../util/ajaxResult');
exports.addproduct=function(req,res){
    var obj={};
    obj.sale_starttime=moment(req.body.sale_starttime).format('YYYY-MM-DD');
    obj.sale_endtime=moment(req.body.sale_endtime).format('YYYY-MM-DD');
    obj.venue_id=req.body.venue_id;
    obj.gym_id=1;//此处读session
    obj.indoor=req.body.indoor;
    obj.floor_type=req.body.floor_type;
    obj.standerd=req.body.standerd;
    obj.product_type=req.body.product_type;
    obj.product_name=req.body.product_name;

    obj.issue=req.body.issue||"";
    new prodSer().addproduct(obj,function(err,result){
        if (req.timedout)return;
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}
exports.addprice=function(req,res){
    var obj={};
    obj.sale_starttime=req.body.sale_starttime;
    obj.sale_endtime=req.body.sale_endtime;
    obj.product_id=req.body.product_id;
    obj.start_time=req.body.start_time;
    obj.end_time=req.body.end_time;
    obj.tag=req.body.tag;
    obj.price=req.body.price;
    new prodSer().addprice(obj,function(err,result){
        if (req.timedout)return;
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}
exports.updateprice=function(req,res){
    var obj={};
    obj.price_id=req.body.price_id;
    obj.price=req.body.price;
    new prodSer().updateprice(obj,function(err,result){
        if (req.timedout)return;
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}
exports.getallproduct=function(req,res){
    console.log(req.user);
    var gym_id=req.user.profile.gymid;
    new prodSer().getallproduct(gym_id,function(err,result){
        if (req.timedout)return;
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}

exports.getpricebyparentid=function(req,res){
    var parent_id=req.params.parent_id;
    new prodSer().getpricebyparentid(parent_id,function(err,result){
        if (req.timedout)return;
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}
exports.deleteproduct=function(req,res){
    var price_id=req.body.price_id;
    new prodSer().deleteproduct(price_id,function(err,result){
        if (req.timedout)return;
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}
exports.setprodstatus=function(req,res){
    var product_id=req.body.product_id;
    var status=req.body.status;
    new prodSer().setprodstatus(status,product_id,function(err,result){
        if (req.timedout)return;
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}