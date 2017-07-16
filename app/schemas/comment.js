var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    movie: {
        type: ObjectId,
        ref: 'movie3'
    },
    from: {
        type: ObjectId,
        // ref: 'User' 踩坑13:用populate查询的时候 要注意comments模式里的ref指向的user 要和 
        //mongoose.model()里面的user一样 注意大小写,不然在controllers/movie.js中就会报错，说找不到user
        ref: 'user'
    },
    reply: [{
        from: {
            type: ObjectId,
            ref: 'user'
        },
        to: {
            type: ObjectId,
            ref: 'user'
        },
        content: String
    }],
    // to: { 双向评论就不需要to了
    //     type: ObjectId,
    //     // ref: 'User'
    //     ref: 'user'
    // },
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

// CommentSchema.pre 表示每次存储数据之前都先调用这个方法
CommentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});


// CommentSchema 模式的静态方法
CommentSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb);
    }
};

module.exports = CommentSchema;
