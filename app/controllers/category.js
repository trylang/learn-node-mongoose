var Movie = require('../models/movie.js');
var Category = require('../models/category.js');
var _ = require('underscore');

// category page 后台录入页
exports.new = function(req, res) {
    res.render('category-admin', {
        title: 'TRY 后台电影分类录入页',
        category: {}
    });
};

exports.save = function(req, res) {
    var _category = req.body.category;
    var category = new Category(_category);
    category.save(function(err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/category/list');
    });
};



//list 列表页
exports.list = function(req, res) {
    Category.fetch(function(err, returnObj) {
        if (err) {
            console.log(err);
        }
        //render 的事pages路径下的list页面
        res.render('categorylist', {
            title: 'TRY 电影分类列表页',
            categories: returnObj
        });
    });
};

//列表页删除
exports.delete = function(req, res) {
    var id = req.query.id;
    if (id) {
        Category.remove({
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
