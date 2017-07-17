var Movie = require('../models/movie.js');
var Category = require('../models/category.js');
var Comment = require('../models/comment.js');
// var User = require('../models/user.js');
var _ = require('underscore');
var fs = require('fs'); //文件读取中间件
var path = require('path'); //图片需要路径中间件


//detail page 详情页
exports.detail = function(req, res) {
    var id = req.params.id;
    //使用update方法$inc每次自增1，为了监控此数据的访问量，刷新即可自增1
    Movie.update({
        _id: id
    }, {
        $inc: {
            pv: 1
        }
    }, function(err) {
        if (err) {
            console.log(err);
        }
    });
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

exports.savePoster = function(req, res, next) {
    var posterData = req.files.uploadPoster; //通过表单中的name属性的值uploadPoster获取到值
    var filePath = posterData.path; //获取文件路径
    var originalFilename = posterData.originalFilename; //通过图片名字判断是否上传了图片
    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1]; //图片类型
            var poster = timestamp + '.' + type; //设置图片名称
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster); //拼成存放到服务器上的图片路径，

            //将图片数据data数据读写到新的路径中
            fs.writeFile(newPath, data, function(err) {
                req.poster = poster; //将图片名称传给请求体req的poster字段中
                next();
            });
        });
    } else {
        next(); //没有上传图片，则跳到下一个中间件，直接保存
    }
};

//admin post 后台录入提交
//在提交的时候踩的坑，原来下面if的判断是这样写的if(id !=='undifined');一直会报错：CastError: Cast to ObjectId failed for value "" at path "_id"
//改成''就好了，是因为id的数据类型是空，所以写成'undefined'肯定不对
exports.save = function(req, res) {
    console.log(req);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;
    if (req.poster) {
        movieObj.poster = req.poster;
    }

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
