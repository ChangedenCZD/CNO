const CNO = require('../index');
const cno = new CNO();
cno.setConfig(require('./config.js'));
cno.usePlugin(CNO.Plugin.Request);
cno.usePlugin(CNO.Plugin.Mysql);
cno.usePlugin(CNO.Plugin.Redis);
cno.initialize();