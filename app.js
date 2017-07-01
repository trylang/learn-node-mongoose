var express = require('express');
var app = express();
//1.process.env.PORT指的是环境变量中保存的默认端口号，如可以使用下面命令指定端口号：PORT=8080 node app.js
var port = process.env.PORT || 3000;
var path = require('path');

//找静态资源，就去bower下
app.use(express.static(path.join(__dirname, 'public')));

//添加mongoose 服务
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/imooc');

var Movie = require('./models/movie.js');

//注入其他插件
var _ = require('underscore');

app.locals.moment = require('moment');

//设置视图的根目录，以及默认的模版引擎
app.set('views', './views/pages');
app.set('view engine', 'pug');

//bodyParser中间件用来解析http请求体，是express默认使用的中间件之一
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));


var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('learn-node listening at http: ', port);

});

//配置路由
app.get('/', function(req, res) {

    Movie.fetch(function(err, returnObj) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'TRY 首页',
            movies: returnObj
        });

    });

});

//detail page 详情页
app.get('/movie/:id', function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function(err, returnObj) {
        if (err) {
            console.log(err);
        }
        res.render('detail', {
            title: 'TRY 详情页',
            movie: returnObj
        });
    });

});

// admin page 后台录入页
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'TRY 后台录入页',
        movie: {
            title: '机械战警',
            doctor: '何塞·帕迪利亚',
            country: '美国',
            year: 2017,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: '哈哈，科幻经典呀',
            language: '英语'
        }
    });
});

//admin post 后台录入提交
//在提交的时候踩的坑，原来下面if的判断是这样写的if(id !=='undifined');一直会报错：CastError: Cast to ObjectId failed for value "" at path "_id"
//改成''就好了，是因为id的数据类型是空，所以写成'undefined'肯定不对
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;

    if (id !== '') { //已存在数据（踩坑地方）
        Movie.findById(id, function(err, returnObj) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(returnObj, movieObj);
            _movie.save(function(err, movie) {
                res.redirect('/movie/' + movie._id);
            });
        });
    } else { //新加的数据
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
});

//admin 后台更新页
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, returnObj) {
            res.render('admin', {
                title: 'TRY 后台更新页',
                movie: returnObj
            });
        });
    }
});

//list 列表页
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, returnObj) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'TRY 列表页',
            movies: returnObj
        });
    });
});

//列表页删除
app.delete('/admin/list', function(req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({
            _id: id
        }, function(err, movie) {
            if (err) {
                console.log(err);
            }
            res.json({
                success: 1
            });
        });
    }
});
