var Movie = require('../models/movie.js');
var Category = require('../models/category.js');
var Comment = require('../models/comment.js');
// var User = require('../models/user.js');
var _ = require('underscore');


//detail page 详情页
exports.detail = function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function(err, movie) {
        Comment
            .find({
                movie: id
            })
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
                if (err) {
                    console.log(err);
                }
                res.render('detail', {
                    title: 'TRY 详情页',
                    movie: movie,
                    comments: comments
                });
            });

    });

};

// admin page 后台录入页
exports.new = function(req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: 'TRY 后台录入页',
            categories: categories,
            movie: {
                // title: '机械战警',
                // doctor: '何塞·帕迪利亚',
                // country: '美国',
                // year: 2017,
                // poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
                // flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
                // summary: '哈哈，科幻经典呀',
                // language: '英语'
            }
        });
    });

};

//admin post 后台录入提交
//在提交的时候踩的坑，原来下面if的判断是这样写的if(id !=='undifined');一直会报错：CastError: Cast to ObjectId failed for value "" at path "_id"
//改成''就好了，是因为id的数据类型是空，所以写成'undefined'肯定不对
exports.save = function(req, res) {
    console.log(req);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;

    if (id) {
        // if (id !== '') { //已存在数据（踩坑地方）
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
        // _movie = new Movie({
        //     doctor: movieObj.doctor,
        //     title: movieObj.title,
        //     country: movieObj.country,
        //     language: movieObj.language,
        //     year: movieObj.year,
        //     poster: movieObj.poster,
        //     summary: movieObj.summary,
        //     flash: movieObj.flash
        // });
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }
            if (categoryId) {
                Category.findById(categoryId, function(err, category) {
                    category.movies.push(movie._id);

                    category.save(function(err, category) {
                        res.redirect('/movie/' + movie._id);
                    });
                });
            } else if (categoryName) {
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });
                category.save(function(err, category) {
                    movie.category = category._id; //新添加分类需要将新建ID传回给movie
                    movie.save(function(err, movie) {
                        res.redirect('/movie/' + movie._id);
                    });
                });
            }

        });
    }
};

//admin 后台更新页
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, returnObj) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: 'TRY 后台更新页',
                    movie: returnObj,
                    categories: categories
                });
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
        //render 的事pages路径下的list页面
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
