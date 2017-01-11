var express = require('express');
var path = require('path');
var config = require('config');
var log = require('log');
var auth = require('./middlewares/authorization');
var routes = require('./routes');
var users = routes.user;
var multipart = require('connect-multiparty');
var timeout = require('connect-timeout');
var logger = log.getLogger();


var app = express();
app.enable('trust proxy');
// view engine setup
app.set('views', path.resolve(__dirname, '../app'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

var web = config.get('web');
app.set('port', process.env.PORT || (web ? web.port : null) || 3000);
app.use(timeout(web.timeout || '60s'));


app.use(express.favicon(path.resolve(__dirname, '../app/favicon.ico')));
//app.use(express.logger('dev'));

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(express.bodyParser({uploadDir: './upload_temp'}))
var multipartMiddleware = multipart({
    uploadDir: path.join(__dirname, 'upload_tmp')
});
//app.use(multipartMiddleware);
var options = {
    dotfiles: 'ignore',
    etag: false,
    //extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
};

//app.use(express.static('public', options));

app.use(express.static(path.resolve(__dirname, '../app'), options));

app.use(log.connectLogger());

//app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}


//app.use(express.session({ secret: ((web && web.session.secret) ? web.session.secret : null) || "dongkerCN@123456" }));
// 引入 passport 中间件
//app.use(passport.initialize());
//app.use(passport.session());
app.use('/api', auth.authorize);
app.use(auth.unauthorizedHandler);


app.use(app.router);
// catch 404 and forward to error handler
app.use('/views|images|scripts|styles/*.*', function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(haltOnTimedout);
/// error handlers
// api request error handler
app.use('/api', function (err, req, res, next) {
    if (req.timedout) return;
    if (err) {
//        if (req.timedout && err.code === 'ETIMEDOUT')return;
        logger.error(err);
        res.status(err.status || 500);
        return  res.send({data: null, code: err.code, status: err.status, errorMessage: err.message});
    }
})
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

    app.use(function (err, req, res, next) {

        res.status(err.status || 500);
        return res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (req.xhr) {
        return res.send(err.message);
    }
    return res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});
//entry point main.html

app.get('/', routes.index);

app.get('/timesync', function (req, res) {
    return res.send(new Date());
});
//login
//app.get('/login', routes.account.login);
app.post('/authenticate', routes.account.authenticate);
app.post('/auth/token/renew', auth.authorize, routes.account.renewToken);

app.post('/file', function (req, res) {
    //console.log(req.files.uploadFile);
    console.log(req.body, req.files);
    res.set({"ContentType": "text/plain"})
    res.send("12345.jpg");
});
//api routes
require('./api')(app);
app.all('/*.:format', function (req, res, next) {
    res.status(404).send();
});
//use html5Mode
// All other routes to use Angular routing in app/scripts/app.js
app.get('*', routes.index);
/*var wechat = require('./routes/wechat');
 app.get("/wechatauth",wechat.wechatauth);*/
module.exports = app;
