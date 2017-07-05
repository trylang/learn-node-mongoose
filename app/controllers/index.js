//index.js 作用就是：负责与首页进行交互

var Movie = require('../models/movie.js');
exports.index = function(req, res) {
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

};
