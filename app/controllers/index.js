//index.js 作用就是：负责与首页进行交互

var Movie = require('../models/movie.js');
var Category = require('../models/category.js');
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
    // =============================  以下是在没有电影分类之前对所有电影做的遍历  =================================
    // Movie.fetch(function(err, returnObj) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     res.render('index', {
    //         title: 'TRY 首页',
    //         movies: returnObj
    //     });

    // });

    Category
        .find({})
        .populate({
            path: 'movies',
            options: {
                limit: 5
            }
        })
        .exec(function(err, categories) {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: 'TRY 首页',
                categories: categories
            });
        });

};

exports.search = function(req, res) {
    var catId = req.query.cat;
    var q = req.query.q;
    var page = parseInt(req.query.p) || 0;
    var count = 2;
    var index = page * count;
    if (catId) { //说明是点击分类跳转的
        Category
            .find({
                _id: catId
            })
            .populate({
                path: 'movies',
                select: 'title poster'
                    // options: {
                    //     limit: 2,
                    //     skip: index //这里需要注释掉， 不然category.movies里是空值
                    // }
            })
            .exec(function(err, categories) {
                if (err) {
                    console.log(err);
                }
                var category = categories[0] || {};
                var movies = category.movies || [];
                var results = movies.slice(index, index + count);
                res.render('results', {
                    title: 'TRY 结果列表页面',
                    keyword: category.name,
                    query: 'cat=' + catId,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            });
    } else { //搜索过来的
        Movie
            .find({
                title: new RegExp(q + '.*', 'i')
            })
            .exec(function(err, movies) {
                if (err) {
                    console.log(err);
                }
                var results = movies.slice(index, index + count);
                res.render('results', {
                    title: 'TRY 结果列表页面',
                    keyword: q,
                    query: 'q=' + q,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            });
    }


};
