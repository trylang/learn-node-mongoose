var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie.js'); //引入'../schemas/movie.js'导出的模式模块

// 编译生成movie模型 (这里需思考一个问题，为什么模型是Movie，怎么和数据库的movies集合联系起来的)
//终于闹明白这个问题了，这里的模型也就是集合，如果数据库里没有这个集合，就会新创建一个集合，在mongodb里
//刷新查找即可
var Movie = mongoose.model('Movies3', MovieSchema);


// 将movie模型[构造函数]导出
module.exports = Movie;
