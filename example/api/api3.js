const CNO = require('cno');
// const CNO = require('../../index');
// 导入ApiBuilder
const ApiBuilder = CNO.ApiBuilder;
const co = require('co');
// 创建一个根路径为'/api/'的Api建造者
const api3 = ApiBuilder.create('/api/')
// 添加一个path为'/api3'的接口
/**
 * 请求方式
 * curl -X GET
 *   http://localhost:3001/api/api3
 * */
.add('/api3', ApiBuilder.GET, new ApiBuilder.ApiClass.Func(function () {
    this.res.json({ query: this.req.query });
}))
// 创建接口信息
.build();

// 导出单个接口信息
module.exports = api3;