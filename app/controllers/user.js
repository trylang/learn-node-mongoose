var User = require('../models/user');
//signup
exports.signup = function(req, res) {
    var _user = req.body.user;
    var user = new User(_user);

    user.save(function(err, user) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/userlist');
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

//signout
//登出需要删除session信息，同时还需删除本地locals的信息，不然进入首页的本地信息一直还在
exports.logout = function(req, res) {
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/signin');
};


//用户列表
exports.list = function(req, res) {
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
