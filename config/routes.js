var Movie = require('../models/movie.js');
var User = require('../models/user');

//注入其他插件
var _ = require('underscore');

module.exports = function(app) {
    //用户信息预处理
    app.use(function(req, res, next) {
        //如果有session信息，就将用户信息存到本地locals信息中用于登录信息的展示
        var _user = req.session.user;
        if (_user) {
            app.locals.user = _user;
        }
        return next();
    });

    //配置路由
    app.get('/', function(req, res) {
        //登录首页，打印登录记录状态
        console.log('user in session:');
        console.log(req.session.user);
        //不在首页做预处理的原因是只有访问首页才会有用户信息，进入其他页面locals信息就丢失了
        //所有需要app.use做预处理
        // var _user = req.session.user;
        // if (_user) {
        //     app.locals.user = _user;
        // }
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

    //signup
    app.post('/user/signup', function(req, res) {
        var _user = req.body.user;
        var user = new User(_user);

        user.save(function(err, user) {
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/userlist');
        });
    });

    //signin
    app.post('/user/signin', function(req, res) {
        console.log(req.body);
        var _user = req.body.user;
        var name = _user.name;
        var password = _user.password;

        User.findOne({
            name: name
        }, function(err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {
                return res.redirect('/');
            }
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    //登录匹配成功之后，编辑session，记录会话状态 
                    req.session.user = user;
                    return res.redirect('/');
                } else {
                    console.log('Password is not matched');
                }
            });
        });

    });

    //signout
    //登出需要删除session信息，同时还需删除本地locals的信息，不然进入首页的本地信息一直还在
    app.get('/logout', function(req, res) {
        delete req.session.user;
        delete app.locals.user;
        res.redirect('/');
    });


    //用户列表
    app.get('/admin/userlist', function(req, res) {
        User.fetch(function(err, users) {
            if (err) {
                console.log(err);
            }
            res.render('userlist', {
                title: '用户列表页',
                users: users
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
};
