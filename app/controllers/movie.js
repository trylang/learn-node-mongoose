var Movie = require('../models/movie.js');
var _ = require('underscore');


//detail page 详情页
exports.detail = function(req, res) {
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

};

// admin page 后台录入页
exports.admin = function(req, res) {
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
};

//admin post 后台录入提交
//在提交的时候踩的坑，原来下面if的判断是这样写的if(id !=='undifined');一直会报错：CastError: Cast to ObjectId failed for value "" at path "_id"
//改成''就好了，是因为id的数据类型是空，所以写成'undefined'肯定不对
exports.new = function(req, res) {
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
};

//admin 后台更新页
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, returnObj) {
            res.render('admin', {
                title: 'TRY 后台更新页',
                movie: returnObj
            });
        });
    }
};

//list 列表页

exports.list = function(req, res) {
    Movie.fetch(function(err, returnObj) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'TRY 列表页',
            movies: returnObj
        });
    });
};

//列表页删除
exports.delete = function(req, res) {
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
};
