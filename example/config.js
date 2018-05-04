// cno配置文件
module.exports = {
    // 接口信息
    api: {
        // 是否开启重复接口声明（忽略重复接口）
        duplicate: false,
        // 接口文件列表
        list: [require('./api/api1.js'), require('./api/api2.js')]
    },
    // 启动端口
    port: 3001,
    // 默认响应头
    headers: [
        { 'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS' },
        { 'Access-Control-Allow-Headers': 'X-Requested-With' },
        { 'Access-Control-Allow-Headers': 'Content-Type' },
        { 'Access-Control-Allow-Origin': 'https://chansos.com' },
        { 'Access-Control-Allow-Origin': 'https://www.chansos.com' }
    ]
};