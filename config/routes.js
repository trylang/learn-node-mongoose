var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');

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
    app.get('/logout', User.logout);
    app.get('/admin/userlist', User.list);

    //Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie', Movie.admin);
    app.post('/admin/movie/new', Movie.new);
    app.get('/admin/update/:id', Movie.update);
    app.get('/admin/list', Movie.list);
    app.delete('/admin/list', Movie.delete);

};
