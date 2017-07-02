var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10; //计算强度（全局）
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
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

// movieSchema.pre 表示每次存储数据之前都先调用这个方法
UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    // next();
    //genSalt:生成基本的盐
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            //hash加盐后的密码
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });

});

//User的实例方法
UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    }
};


// movieSchema 模式的静态方法
UserSchema.statics = {
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

module.exports = UserSchema;
