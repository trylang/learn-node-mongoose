var express = require('express');
var app = express();
//1.process.env.PORT指的是环境变量中保存的默认端口号，如可以使用下面命令指定端口号：PORT=8080 node app.js
var port = process.env.PORT || 3000;
var path = require('path');
//加载app中的模块
var fs = require('fs');
var dbUrl = 'mongodb://127.0.0.1:27017/imooc';

//bodyParser中间件用来解析http请求体，是express默认使用的中间件之一
var bodyParser = require('body-parser');

//添加mongoose 服务
var mongoose = require('mongoose');

//设置登录状态持久性
var cookieParser = require('cookie-parser');
var session = require('express-session');

var mongoStore = require('connect-mongo')(session);

//开发环境配置
var logger = require('morgan');


//找静态资源，就去bower下,express4需要单独下载static模块
var serveStatic = require('serve-static');
app.use(serveStatic(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public'))); express不再适用


mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);


var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) { //是文件即直接加载
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath);
                }
            } else if (stat.isDirectory) { //如果是文件夹，则继续遍历
                walk(newPath);
            }

        });
};
walk(models_path);

//注入其他插件
var bcrypt = require('bcrypt'); //文件加密工具模块

app.locals.moment = require('moment');

//设置视图的根目录，以及默认的模版引擎
app.set('views', './app/views/pages');
app.set('view engine', 'pug');


app.use(bodyParser.urlencoded({
    extended: true
}));

//图片上传处理enctype多数据类型上传问题,这里需要npm下载中间件,因为此中间件只是在movie文件上传图片时才使用,
//所以这里可不做加载，放到route.js中作为中间件按需加载
// var multipart = require('connect-multiparty');
// app.use(multipart());



//1.因为现在session和cookieparser没有包含在express里面了，所以要单独安装这两个模块
//然后把var mongoStore = require('connect-mongo')(express);
//替换成var mongoStore = require('connect-mongo')(session);
//2.var mongoStore = require('connect-mongo')(session);
//这一句前面一定要有 var session = require("express-session")
//3.持久化会话需要用到这个中间件，还需要在session中配置store

app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'session'
    })
}));

//引入路由的入口文件
require('./config/routes')(app);

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('learn-node listening at http: ', port);

});



var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.set('showStackErro', true); //显示错误信息
    //express.logger 中间件已经独立
    // app.use(express.logger(':method :url :status')); //打印express路由的信息并预置格式
    app.use(logger(':method :url :status')); //打印express路由的信息并预置格式
    app.locals.pretty = true; //设置网页源码格式为非压缩，可读
    mongoose.set('debug', true); //打开mongoDb调试模式
}
