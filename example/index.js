// 导入cno模块
const CNO = require('cno');
// const CNO = require('../index');
// 创建cno实例
const cno = new CNO();
// 添加cno配置文件
cno.setConfig(require('./config.js'));
// 添加网络请求插件
cno.usePlugin(CNO.Plugin.Request);
// 添加Mysql客户端插件
cno.usePlugin(CNO.Plugin.Mysql);
// 添加Redis客户端插件
cno.usePlugin(CNO.Plugin.Redis);
// 初始化cno并运行服务器
cno.initialize();
