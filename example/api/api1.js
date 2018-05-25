const CNO = require('cno');
// const CNO = require('../../index');
// 导入ApiBuilder
const ApiBuilder = CNO.ApiBuilder;
// 创建一个根路径为'/api/'的Api建造者
const api1 = ApiBuilder.create('/api/')
// 添加一个path为'/api1'的接口
/**
 * 请求方式
 * curl -X GET
 *   http://localhost:3001/api/api1
 * */
.add('/api1', ApiBuilder.GET, (req, res, next) => {
    res.json({ query: req.query });
})
// 添加一个path为'/api1/api2'的接口
/**
 * 请求方式
 * curl -X POST
 *   -d '{"host": "localhost","port": 3001,"flag": true}'
 *   http://localhost:3001/api/api1/api2
 * */
.add('/api1/api2', ApiBuilder.POST, (req, res, next, cno) => {
    res.json({ body: req.body });
})
// 创建接口信息
.build();

// 创建一个根路径为'/api/'的Api建造者
const api2 = ApiBuilder.create('/api/')
// 添加一个path为'/api2'的接口
/**
 * 请求方式
 * curl -X PUT
 *   -d '{"host": "localhost","port": 3001,"flag": true}'
 *   http://localhost:3001/api/api2
 * */
.add('/api2', ApiBuilder.PUT, (req, res, next, cno) => {
    res.json({ body: req.body });
})
// 创建接口信息
.build();

// 同时导出两个接口信息
module.exports = { api1, api2 };
// 只导出一个接口信息
// module.exports = api2;