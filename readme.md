# CNO
#### 一个服务器快速开发框架。其中加入了Mysql客户端管理，Redis客户端管理，Request网络请求功能。
#### 注意：请在Es6环境下运行。

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
cno.setConfig(require('./example/config.js'));
// 配置一个Express.js实例
cno.setExpress(customExpressInstance);
```
## 添加插件 Add Plugin
```js
// Request网络请求
cno.usePlugin(CNO.Plugin.Request);
// Mysql客户端管理
cno.usePlugin(CNO.Plugin.Mysql);
// Redis客户端管理
cno.usePlugin(CNO.Plugin.Redis);
```
## 初始化 Initialize
```js
// 初始化之后，cno实例无法在进行上述操作
cno.initialize();
```
## 使用插件 Use Plugin
### Plugin.Request
```js
co(function* () {
    const result = yield cno.request.create('https://img.shields.io/npm/v/egg.svg?style=flat-square', cno.request.GET).setParams({ a: 'a' }).request();
});
```
### Plugin.Mysql
```js
co(function *() {
    const config = new cno.mysql.Config({
    host,subHost,port,user,password,database,maxThread
    });
    const client = yield cno.mysql.create(config);
})
```
### Plugin.Redis
```js
const client = cno.redis(host, port, password);
```