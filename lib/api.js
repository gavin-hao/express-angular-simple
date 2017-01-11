/**
 * Created by zhigang on 14-9-25.
 */
var routes = require('./routes');
//var wechat=require('./routes/wechat.js');
module.exports = function (app) {
    function haltOnTimedout(req, res, next) {
        if (!req.timedout) next();
    }

    //gym example: /gym/bj/list
    app.post('/gym/add', routes.gym.add);//
    app.post('/user/addStaff', routes.account.addUnionStaff);
    app.post('/api/gym/updateOfficeTime', routes.gym.updateOfficeTime);//
    app.post('/api/gym/updateTel', routes.gym.updateTel);//
    app.post('/api/gym/updateAddress', routes.gym.updateAddress);//
    app.post('/api/gym/updateContact', routes.gym.updateContact);//
    app.post('/api/gym/updateDesc', routes.gym.updateDesc);//
    app.post('/api/gym/updateService', routes.gym.updateService);//


    app.get('/api/msg/getmymsg', routes.gym.getmymsg);
    app.post('/api/msg/deleteMymsg', routes.gym.deleteMymsg);
    app.post('/api/msg/readMsg', routes.gym.readMsg);


    app.get('/api/gym/getAddress', routes.gym.getAddress);
    app.get('/api/gym/list', routes.gym.list);//
    app.get('/api/gym', routes.gym.getOne);//
    app.get('/api/gym/service', routes.gym.getmetaService);// /api/gym/service
    app.get('/api/gym/images', routes.gym.getImages);//   /api/gym/images
    app.post('/api/gym/image/add', routes.gym.addImages);//   /api/gym/image/add
    app.post('/api/gym/image/delete', routes.gym.deleteImages);//  /api/gym/image/delete
    app.get('/gym/checkexists/:name',routes.gym.checkExists);

//    app.get('/api/gym/list/:flag', routes.gym.list);
//    app.get('/api/gym/:city/list', routes.gym.get);
    //省市区
    app.get('/api/region/province', routes.gym.getprovince);//  /api/region/province
    app.get('/api/region/:provinceid/cities', routes.gym.getcity);// /api/region/:province/cities
    app.get('/api/region/:cityid/areas', routes.gym.getarea);//   /api/region/:city/areas
    //场地
    app.get('/api/venue/list', routes.venue.getVenuesByGymId);//  /api/venue/list
    app.post('/api/venue/add', haltOnTimedout, routes.venue.addvenue);//     /api/venue/add
    app.post('/api/venue/price/add', routes.venue.addprice);
    app.post('/api/venue/price/adjust', routes.venue.adjustprice);
    app.post('/api/venue/stock/lock', routes.venue.lockStock);
    app.post('/api/venue/stock/unlock', routes.venue.unlockStock);
    app.get('/api/venue/release', routes.venue.release);
    app.get('/api/venue/unrelease', routes.venue.unrelease);
    app.get('/api/venue/delete', routes.venue.deletevenue);//     /api/venue/delete

    app.get('/api/venue', routes.venue.getVenueByVenueId);//      /api/getVenue
    app.post('/api/venue/update', routes.venue.updatevenue);//    /api/venue/update


    app.get('/api/venue/venues', routes.venue.getVenuesByindoor);//    /api/venue/venues?indoor=1

    //产品
    app.post('/api/product/add', routes.product.addproduct);//   /api/product/add
    app.get('/api/products', routes.product.getallproduct);//   /api/products
    app.get('/api/price/:parent_id', routes.product.getpricebyparentid);//  /api/price/:parent_id
    app.post('/api/product/delete', routes.product.deleteproduct);//  /api/product/delete
    app.post('/api/product/online', routes.product.setprodstatus);//  /api/product/online
    //价格
    app.post('/api/price/add', routes.product.addprice);//    /api/price/add
    app.post('/api/price/update', routes.product.updateprice);//    /api/price/update
    app.get('/api/product/getstock',routes.booking.getGymStock);//   /api/products
    app.get('/api/order/getorderlist', routes.order.getOrderList);
    app.get('/api/order/getorderlistbypage', routes.order.getOrderListByPage);
    app.get('/api/order/getorderdetail', routes.order.getOrderDetail);
    app.get('/api/product/getproductbookinginfo', routes.booking.getAllBookingProduct);
    app.post('/api/order/addorderinfo', routes.booking.addOrderInfo);
    app.get('/api/order/updateorderstate', routes.order.updateorderstate);
    app.get('/api/order/getorderstate', routes.booking.getorderstate);
    app.post('/api/order/cancelorder', routes.order.cancelOrder);
    app.post('/api/order/deleteorder', routes.order.deleteOrder);
    //app.post('/wechatauth',wechat.wechatauth);
    //app.get('/api/getorderlist',routes.);

    app.get('/api/indicator', routes.indicator);
    app.get('/api/notice', routes.notice);

    app.post('/api/user/changepwd', routes.account.changePwd);
    app.get('/api/user/getusername', routes.account.getUser);
    app.post('/api/user/addStaff', routes.account.addStaff);
    app.get('/api/user/getStaffList', routes.account.getStafflist);
    app.post('/api/user/deleteStaff', routes.account.deleteStaff);


}
