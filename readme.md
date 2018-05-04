# CNO

[![NPM version](https://img.shields.io/npm/v/cno.svg)](https://npmjs.org/package/cno)
[![NPM download](https://img.shields.io/npm/dm/cno.svg)](https://npmjs.org/package/cno)
[![Package Quality](http://npm.packagequality.com/shield/cno.svg)](http://packagequality.com/#?package=cno)

#### 一个服务器快速开发框架。其中加入了Mysql客户端管理，Redis客户端管理，Request网络请求功能。
#### This is a quick develop framework for web server.Including Mysql Client Manager,Redis Client Manager,Network request kit,etc. 
#### 注意：请在ES6环境下运行。
#### Attention: Please make sure running in ES6.

[实例源码 / Sample][sample-url]

## 安装 Install
```commandline
npm install -save cno
```
## 导入 Import
```js
const CNO = require('cno');
```
## 创建实例 New Instance
```js
const configFilePath = './example/config.js'
const configObject = require(configFilePath)
const cno = new CNO(configObject);
```
## 配置 Configure
```js
// 添加配置
// config.api 配置接口
// config.api.duplicate // 是否支持重复声明接口
// config.api.list // 接口文件列表
// config.port 启动端口
// config.headers // 配置http默认的headers，例如跨域
cno = cno.setConfig(require('./example/config.js'));
// 配置一个Express.js实例
cno = cno.setExpress(customExpressInstance);
```
## 添加插件 Add Plugin
```js
// Request网络请求
cno = cno.usePlugin(CNO.Plugin.Request);
// Mysql客户端管理
cno = cno.usePlugin(CNO.Plugin.Mysql);
// Redis客户端管理
cno = cno.usePlugin(CNO.Plugin.Redis);
```
## 初始化 Initialize
```js
// 初始化之后，cno实例无法在进行上述操作
cno = cno.initialize();
```
## 使用插件 Use Plugin
### Plugin.Request
#### 该插件是以[request](https://www.npmjs.com/package/request)为基础进行封装的。
```js
// 获取插件
cno = cno.usePlugin(CNO.Plugin.Request);
cno = cno.initialize();
request = cno.request;

// url 请求的url
// method 请求方法，cno.request.GET，cno.request.POST，cno.request.PUT，cno.request.DELETE
requestInstance = request.create(url,method);

// params 请求参数对象，eg：url='/api',params={a:1},request.url='/api?a=1'
requestInstance = requestInstance.setParams(params);
// data 请求body对象，eg：url='/api',data={a:1},request.payload={a:1}
requestInstance = request.create(url,cno.request.POST).setData(data);

// 'content-type': 'application/x-www-form-urlencoded'
requestInstance = request.create(url,cno.request.POST).setForm(data);
// 'content-type': 'multipart/form-data'
requestInstance = request.create(url,cno.request.POST).setFormData(data);

// headers 自定义headers
requestInstance = requestInstance.setHeaders(headers);

// auth 授权信息
requestInstance = requestInstance.setAuth(auth);
// oauth 授权信息
requestInstance = requestInstance.setOauth(oauth);

// 执行请求
// returnPromise 是否返回Promise对象，默认返回async/await
requestInstance.request (returnPromise);
```
```js
co(function* () {
    const result = yield cno.request.create('https://img.shields.io/npm/v/cno.svg?style=flat-square', cno.request.GET).setParams({ a: 'a' }).request();
});
```
### Plugin.Mysql
#### 该插件是以[mysql](https://www.npmjs.com/package/mysql)为基础进行封装的。
```js
// 获取插件
cno = cno.usePlugin(CNO.Plugin.Mysql);
cno = cno.initialize();
mysql = cno.mysql;

// options 数据库配置
// options.host 主机
// options.subHost 备用主机
// options.port 端口
// options.user 用户名
// options.password 密码
// options.database 数据库
// options.maxThread 最大线程数，默认为 核心数 * 2 + 1，最少值为3
// options.multipleStatements 是否开启多行表达式，默认支持
mysqlConfig = new mysql.Config(options);
client = yield mysql.create(mysqlConfig);
    
// 执行sql
// client 由mysql.create创建的实例
// sql 合法的sql语句
// args 用于置换sql中的未知参数
result = yield mysql.exec(client, sql, args);
    
// 销毁client
mysql.destroy(client);
```
```js
co(function *() {
    const config = new cno.mysql.Config({
        host,subHost,port,user,password,database,maxThread
    });
    const client = yield cno.mysql.create(config);
})
```
### Plugin.Redis
#### 该插件是以[redis](https://www.npmjs.com/package/redis)为基础进行封装的。
```js
// 获取插件
cno = cno.usePlugin(CNO.Plugin.Redis);
cno = cno.initialize();
redis = cno.redis;

// 创建实例
// host 主机
// port 端口
// password 密码
client = redis(host, port, password);

// 设置数据
// key 键
// value 值
// expire 有效时间（单位：秒），默认为86400（一天）
client = client.setData(key, value, expire);

// 获取数据
// key 键
value = yield client.getData(key);

// 删除数据
// key 键
client = client.removeData(key);
```
```js
const client = cno.redis(host, port, password);
```
## 关闭 ShutDown
```js
// returnPromise 是否以Promise形式返回，默认async/await
const result = yield cno.shutDown(returnPromise);
```
## 添加接口 Add Api
#### 在config.js中添加接口文件
```js
module.exports = {
    api: {
        duplicate: false, // 不支持重复声明接口
        list: [require('./api/api1.js')]
    }
}
```
#### 创建接口文件
```commandline
mkdir api && cd api && vi api1.js
```
#### 编辑接口文件
```js
const CNO = require('cno');
const ApiBuilder = CNO.ApiBuilder;

// path支持RESTful语法
/* eg：
* add('/api1/:key',ApiBuilder.GET,(req)=>{
*   key = req.params.key
* })
* /

// ApiBuilder.create('/api/') 创建一个根路径为'/api/'的建造者
const api1 = ApiBuilder.create('/api/')
// 添加一个path为'/api1'，方法为GET的接口
.add('/api1', ApiBuilder.GET, (req, res, next, cno) => {
    res.json({ route: api2.baseRoute });
})
// 添加一个path为'/api1/api2'，方法为POST的接口
.add('/api1/api2', ApiBuilder.POST, (req, res, next, cno) => {
    res.json({ route: api2.baseRoute });
})
// 生成cno可用的接口信息
.build();

// ApiBuilder.create('/api/') 创建一个根路径为'/api/'的建造者
const api2 = ApiBuilder.create('/api/')
// 添加一个path为'/api2'，方法为POST的接口
.add('/api2', ApiBuilder.POST, (req, res, next, cno) => {
    res.json({ route: api2.baseRoute });
})
// 生成cno可用的接口信息
.build();

// 只导出一个接口信息
// module.exports = api1;

// 同时导出两个接口信息
module.exports = { api1, api2 };
```
##### 在执行cno.initialize方法后，config.js所注册的接口将会添加到httpServer中。

## 添加默认响应头
```js
// 编辑config.js，添加headers字段
module.exports = {
    headers: [
        { 'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS' },
        { 'Access-Control-Allow-Headers': 'X-Requested-With' },
        { 'Access-Control-Allow-Headers': 'Content-Type' },
        { 'Access-Control-Allow-Origin': 'https://chansos.com' },
        { 'Access-Control-Allow-Origin': 'https://www.chansos.com' }
    ]
};
```
## 自定义启动端口
```js
// 编辑config.js，添加port字段
module.exports = {
    port: 3001 // 默认3000
};
```

## 更多内容
[开源官网][official-url]
&nbsp;&nbsp;&nbsp;&nbsp;
[实例源码][sample-url]
&nbsp;&nbsp;&nbsp;&nbsp;
[意见反馈][issues-url]
&nbsp;&nbsp;&nbsp;&nbsp;
[邮箱(changeden520@gmail.com)]()
<br><br>
[Official][official-url]
&nbsp;&nbsp;&nbsp;&nbsp;
[Sample][sample-url]
&nbsp;&nbsp;&nbsp;&nbsp;
[Issues][issues-url]
&nbsp;&nbsp;&nbsp;&nbsp;
[Email(changeden520@gmail.com)]()


[official-url]: https://www.chansos.com
[sample-url]: https://github.com/ChangedenCZD/CNO/tree/master/example
[issues-url]: https://github.com/ChangedenCZD/CNO/issues

## 打赏 Donate
<img width="192" alt="支付宝" src="https://github.com/ChangedenCZD/CNO/blob/master/assets/img/alipay.png?raw=true"/>
&nbsp;&nbsp;&nbsp;&nbsp;
<img width="192" alt="微信" src="https://github.com/ChangedenCZD/CNO/blob/master/assets/img/wechat_pay.png?raw=true"/>