const CNO = require('cno');
// 导入ApiBuilder
const ApiBuilder = CNO.ApiBuilder;
const co = require('co');
// 创建一个根路径为'/api/'的Api建造者
const api2 = ApiBuilder.create('/api/')
// 添加一个path为'/api2'的接口
/**
 * 请求方式
 * curl -X GET
 *   http://localhost:3001/api/api2
 * */
.add('/api2', ApiBuilder.GET, (req, res, next, cno) => {
    co(function* () {
        // 利用Request插件进行网络请求
        const result = yield cno.request.create('https://img.shields.io/npm/v/cno.svg?style=flat-square', cno.request.GET).setParams({ a: 'a' }).request();
        res.json({ img: result.response });
    });
})
// 创建接口信息
.build();

// 导出单个接口信息
module.exports = api2;