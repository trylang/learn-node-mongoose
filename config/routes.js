var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

//注入其他插件
var _ = require('underscore');

module.exports = function(app) {
    //用户信息预处理
    app.use(function(req, res, next) {
        //如果有session信息，就将用户信息存到本地locals信息中用于登录信息的展示
        var _user = req.session.user;
        //在有controllers处理路由时，就不使用if判断了，有则赋值，无则赋空值
        // if (_user) {
        //     app.locals.user = _user;
        // }
        app.locals.user = _user;
        return next();
    });

    //Index
    app.get('/', Index.index);

    //User
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    // app.post('/signin', User.showSignin);
    // app.post('/signup', User.showSignup);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/logout', User.logout);
    //添加 User.signinRequired,User.adminRequired, 俩中间件，第一个用于确认用户已登录，第二个用于判断用户的角色以便分配权限
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

    //Movie
    app.get('/movie/:id', Movie.detail);
    app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.delete);

    //Comment
    app.post('/user/comment', User.signinRequired, Comment.save);

    //Category
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

    //results
    app.get('/results', Index.search);

};
