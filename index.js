const CNOUtils = require('./src/Utils/CNOUtils');

class CNO {
    /**
     * Api建造者
     * */
    static get ApiBuilder () {
        return CNOUtils.ApiBuilder;
    }

    /**
     * 插件
     * */
    static get Plugin () {
        return CNOUtils.PluginUtils.Plugin;
    }

    /**
     * 构造器
     * */
    constructor (config) {
        this.START_TIME = new Date();
        this.initialized = false;
        this.apiList = [];
        this.routerSet = new Set();
        if (config) {
            this.setConfig(config);
        }
    }

    /**
     * 设置cno配置信息
     * */
    setConfig (config) {
        return CNOUtils.setConfig(this, config);
    }

    /**
     * 自定义express实例
     * */
    setExpress (express) {
        return CNOUtils.setExpress(this, express);
    }

    /**
     * 手动添加接口信息
     * */
    addApi (api) {
        return CNOUtils.addApi(this, api);
    }

    /**
     * 使用插件
     * */
    usePlugin (plugin) {
        return CNOUtils.usePlugin(this, plugin);
    }

    /**
     * 初始化cno并运行服务器
     * */
    initialize () {
        return CNOUtils.initialize(this);
    }

    /**
     * 关闭服务器
     * */
    shutDown (returnPromise) {
        return CNOUtils.shutDown(this, returnPromise);
    }
}

module.exports = CNO;