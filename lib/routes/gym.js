/**
 * Created by Rebort_Chu on 2014/9/28.
 */
var ajaxResult=require('../../util/ajaxResult');
var gymSer=require('../services/gym.js');
var conf=require('config');
exports.add=function(req,res){
    var obj={};
    obj.name=req.body.name;
    obj.address=req.body.address;
    obj.latitude=req.body.latitude;
    obj.longitude=req.body.longitude;
    obj.tel=req.body.tel;
    obj.tags=req.body.tags;
    obj.description=req.body.description;
    obj.services=req.body.services;
    obj.createTime=req.body.createTime;
    obj.from=req.body.from;
    obj.stat=req.body.stat;
    obj.available=req.body.available;
    obj.cover_img_url=req.body.cover_img_url;
    obj.contact_tel=req.body.contact_tel;
    obj.contact_name=req.body.contact_name;
    obj.city=req.body.city;
    obj.area=req.body.area;
    obj.province=req.body.province;
    obj.logo_img_url=req.body.logo_img_url;
    new gymSer().add(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}

exports.updateOfficeTime=function(req,res){
    var obj={};
    obj.gym_id=req.user.profile.gymid;
    obj.start_time=req.body["start_time"];
    obj.end_time=req.body["end_time"];
    if(!obj.gym_id || !obj.start_time||!obj.end_time){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'gym_id,start_time,end_time must not be null'}));
    }
    new gymSer().updateOfficeTime(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}
exports.updateTel=function(req,res){
    var obj={};
    obj.gym_id=req.user.profile.gymid;
    obj.tel=req.body["tel"];
    if(!obj.gym_id || !obj.tel){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'gym_id,tel must not be null'}));
    }
    new gymSer().updateTel(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}
exports.updateAddress=function(req,res){
    var obj={};
    obj.gym_id=req.user.profile.gymid;
    obj.address=req.body["address"];
    obj.lat=req.body["lat"];
    obj.lon=req.body["lon"];
    if(!obj.gym_id || !obj.address){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'gym_id,tel must not be null'}));
    }
    new gymSer().updateAddress(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}

exports.updateContact=function(req,res){
    var obj={};
    obj.gym_id=req.user.profile.gymid;
    obj.contact_tel=req.body["contact_tel"];
    obj.contact_name=req.body["contact_name"];
    if(!obj.gym_id || !obj.contact_tel||!obj.contact_name){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'gym_id,contact_tel,contact_name must not be null'}));
    }
    new gymSer().updateContact(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}

exports.updateDesc=function(req,res){
    var obj={};
    obj.gym_id=req.user.profile.gymid;
    obj.description=req.body["description"];
    if(!obj.gym_id){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'gym_id must not be null'}));
    }
    new gymSer().updateDesc(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}

exports.updateService=function(req,res){
    var obj={};
    obj.gym_id=req.user.profile.gymid;
    obj.service=req.body["service"].join(',')||"";
    if(!obj.gym_id){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'gym_id must not be null'}));
    }
    new gymSer().updateService(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}

exports.getAddress=function(req,res){
    var obj={};
    obj.keyword=req.query.keyword;
    obj.city=req.query.city;
    if(!obj.keyword){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'keyword must not be null'}));
    }
    new gymSer().getAddress(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}
exports.getmymsg=function(req,res){
    var obj={};
    obj.userid=req.user.profile.id;
    obj.type=req.query.type;
    obj.start=req.query.start||0;
    obj.end=req.query.end||10;
    if(!obj.userid){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'userid must not be null'}));
    }
    new gymSer().getmymsg(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}

exports.deleteMymsg=function(req,res){
    var obj={};
    obj.userid=req.user.profile.id;
    obj.notice_id=req.body.notice_id;
    if(!obj.userid||!obj.notice_id){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'userid,notice_id must not be null'}));
    }
    new gymSer().deleteMymsg(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}

exports.readMsg=function(req,res){
    var obj={};
    obj.userid=req.user.profile.id;
    obj.notice_id=req.body.notice_id;
    if(!obj.userid||!obj.notice_id){
        return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:'userid,notice_id must not be null'}));
    }
    new gymSer().readMsg(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}
exports.list=function(req,res){
    var flag=req.query.flag;
    var code=req.query.code;
    new gymSer().list(flag,code,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result).data);
        }
    })
}
exports.getOne=function(req,res,next){
    var gym_id=req.user.profile.gymid;
    new gymSer().getOne(gym_id,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            try{
                var info=JSON.parse(result);
                var file=conf.get('web').fileDomain;
                return res.send(new ajaxResult({data:{fileDomain:file||'file.dongker.cn',gym:info.data},code:info.code,status:info.status}));
            }
            catch(e){
                return next(e);
            }

        }
    })
}
exports.getmetaService=function(req,res){
    var gym_id=req.user.profile.gymid;
    new gymSer().getmetaService(gym_id,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}

exports.getImages=function(req,res){
    var gym_id=req.user.profile.gymid;
    new gymSer().getImages(gym_id,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}

exports.addImages=function(req,res){
    var obj={};
    obj.gym_id=req.user.profile.gymid;
    obj.url=req.body.url;
    obj.img_type=req.body.img_type;
    obj.img_id=req.body.img_id;
    new gymSer().addImages(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}

exports.deleteImages=function(req,res){
    var obj={};
    obj.gym_id=req.user.profile.gymid;
    obj.img_id=req.body.img_id;
    obj.flag=req.body.flag;
    new gymSer().deleteImages(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}

exports.checkExists=function(req,res){
    var obj={};
    obj.name=req.params.name;
    new gymSer().checkExists(obj,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(result);
        }
    })
}
exports.getprovince=function(req,res){
    new gymSer().getprovince(function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}
exports.getcity=function(req,res){
    var proid=req.params.provinceid;
    new gymSer().getcity(proid,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}
exports.getarea=function(req,res){
    var cityid=req.params.cityid;
    new gymSer().getarea(cityid,function(err,result){
        if(err){
            return res.send(new ajaxResult({data:null,code:1,status:1,errorMessage:err}));
        }else{
            return res.send(JSON.parse(result));
        }
    })
}