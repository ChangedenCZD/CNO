### 2018年6月5日
### 0.3.0
>新增对静态页面配置的支持
```js
const path = require('path');
// cno配置文件
module.exports = {
    publicDir: path.join(__dirname, 'static')
};
```

### 2018年5月26日
### 0.2.0
>新增Mongodb插件，（CNO.Plugin.Mongodb）。


>CNO.Plugin.Mysql,CNO.Plugin.Mongodb,CNO.Plugin.Redis,CNO.Plugin.Request 分别加入HELP方法以便获取更多详细教程。

### 2018年5月25日
### 0.1.0
>api的callback中支持以this.req、this.res、this.next、this.cno的方式引用express.router和cno实例中的信息；


>[相关例子](https://github.com/ChangedenCZD/CNO/tree/master/example/api/api3.js)