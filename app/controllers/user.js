var User = require('../models/user');
//signup
exports.signup = function(req, res) {
    var _user = req.body.user;
    var user = new User(_user);

    user.save(function(err, user) {
        if (err) {
            console.log(err);
        }
        User.findOne({
            name: _user.name
        }, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                req.session.user = user;
                res.redirect('/admin/user/list');

            }
        });

    });

};

//signin
exports.signin = function(req, res) {
    console.log(req.body);
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({
        name: name
    }, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect('/signup');
        }
        if (!user) {
            return res.redirect('/signin');
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
                return res.redirect('/signup');
            }
            if (isMatch) {
                //登录匹配成功之后，编辑session，记录会话状态 
                req.session.user = user;
                return res.redirect('/');
            } else {
                console.log('Password is not matched');
                return res.redirect("/signin");
            }
        });
    });

};

exports.showSignin = function(req, res) {
    res.render('signin', {
        title: '登录页面'
    });
};

exports.showSignup = function(req, res) {
    res.render('signup', {
        title: '注册页面'
    });
};

exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect('/signin');
    }
    next();
};
exports.adminRequired = function(req, res, next) {
    var user = req.session.user;
    if (user.role <= 10 || !user.role) {
        return res.redirect('/signin');
    }
    next();
};

//signout
//登出需要删除session信息，同时还需删除本地locals的信息，不然进入首页的本地信息一直还在
exports.logout = function(req, res) {
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/signin');
};


//用户列表
exports.list = function(req, res) {
    //在这里处理角色问题，就很低效了，每个地方都需要添加重复的代码，这时就需使用中间件了。
    // var user = req.session.user;
    // if (!user) {
    //     return res.redirect('/signin');
    // }
    // if (user.role > 10) {
    //     User.fetch(function(err, users) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         res.render('userlist', {
    //             title: '用户列表页',
    //             users: users
    //         });
    //     });
    // }
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: '用户列表页',
            users: users
        });
    });

};
