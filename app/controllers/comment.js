var Comment = require('../models/comment.js');
var _ = require('underscore');
// var mongoose = require('mongoose');
// var Comment = mongoose.model('comment');

exports.save = function(req, res) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;

    console.log(_comment.cid);
    console.log(_comment);
    if (_comment.cid) { //说明是给别人评论
        Comment.findById(_comment.cid, function(err, comment) {
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            };
            comment.reply.push(reply);
            comment.save(function(err, comment) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movieId);
            });
        });
    } else { // 普通评论
        var comment = new Comment(_comment);
        comment.save(function(err, comment) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movieId);
        });
    }



};
