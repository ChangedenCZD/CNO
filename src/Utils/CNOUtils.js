const Package = require('../../package.json');
const CNO_VERSION = Package.version;
const debug = require('debug')(`cno:${CNO_VERSION}`);
debug.enabled = true;
const Express = require('express');
const BodyParser = require('body-parser');
const http = require('http');
const logger = require('morgan');
const lessMiddleware = require('less-middleware');
const PromiseUtils = require('./PromiseUtils');
const PluginUtils = require('./PluginUtils');
const ApiBuilder = require('../Api/ApiBuilder');
const ApiClass = ApiBuilder.ApiClass;

const DEFAULT_PORT = 3000;

/**
 * 解析配置信息
 * */
function parseConfig (cno) {
    const config = cno.config;
    const apiConfig = config['api'] || {};
    cno.duplicateRoute = typeof apiConfig.duplicate === 'boolean' ? apiConfig.duplicate : false;
    const apiList = apiConfig.list || [];
    apiList.forEach(api => {
        if (api instanceof ApiClass) {
            cno.addApi(api);
        } else if (typeof api === 'object') {
            Object.keys(api).forEach(key => {
                cno.addApi(api[key]);
            });
        }
    });
    cno.port = config['port'] || DEFAULT_PORT;
    cno.headers = config['headers'] || [];
    cno.publicDir = config['publicDir'] || '';
    return cno;
}

/**
 * 创建express实例
 * */
function createExpress (cno) {
    const express = cno.express || Express();
    const headers = cno.headers;
    express.use(BodyParser.urlencoded({ extended: true }));
    express.use(BodyParser.json());
    express.all('*', (req, res, next) => {
        headers.forEach(header => {
            Object.keys(header).forEach(key => {
                res.header(key, header[key]);
            });
        });
        next();
    });
    express.set('port', cno.port);
    express.use(logger('dev'));
    const publicDir = cno.publicDir;
    if (!!publicDir) {
        express.use(lessMiddleware(publicDir));
        express.use(Express.static(publicDir));
    }
    cno.express = express;
    return cno;
}

/**
 * 装配所有接口信息
 * */
function assembleApi (cno) {
    cno.apiList.forEach(api => {
        api.inject(cno);
        cno.express.use(api.baseRoute, api.router);
    });
    return cno;
}

/**
 * 启动服务器
 * */
function startServer (cno) {
    const server = http.createServer(cno.express);
    const port = cno.port;
    server.listen(port);
    server.on('error', onServerError);
    server.on('listening', onServerListening);

    function onServerError (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    function onServerListening () {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        const startTime = cno.START_TIME;
        debug(`Listening on ${bind}`);
        debug(`Start at: ${startTime}`);
        debug(`Build time: ${Date.now() - startTime.getTime()}ms`);
    }

    cno.server = server;
    return cno;
}

/**
 * 锁定cno状态
 * */
function locked (cno) {
    if (cno.initialized) {
        cno.express = undefined;
        cno.setConfig = undefined;
        cno.setExpress = undefined;
    }
    return cno;
}

/**
 * 验证cno实例是否未初始化
 * */
function check (cno) {
    if (cno.initialized) {
        throw new Error('This instance has initialized, can not set config.');
    }
    return cno;
}

/**
 * 设置cno配置信息
 * */
function setConfig (cno, config) {
    check(cno);
    if (typeof config === 'object') {
        cno.config = config;
    } else {
        throw new Error('Config must be require a object.');
    }
    return cno;
}

/**
 * 手动添加接口信息
 * */
function addApi (cno, api) {
    check(cno);
    if (api) {
        if (!cno.duplicateRoute) {
            const baseRoute = api.baseRoute;
            api.routerList.forEach(router => {
                const fullRouter = `ROUTE:${baseRoute}/${router.path} METHOD:${router.method}`.replace(/\/\/\//g, '/').replace(/\/\//g, '/');
                if (cno.routerSet.has(fullRouter)) {
                    throw new Error(`Duplicate Api ${fullRouter}.`);
                }
                cno.routerSet.add(fullRouter);
            });
        }
        cno.apiList.push(api);
    }
    return cno;
}

/**
 * 使用插件
 * */
function usePlugin (cno, plugin) {
    check(cno);
    PluginUtils(cno, plugin);
    return cno;
}

/**
 * 初始化cno并运行服务器
 * */
function initialize (cno) {
    if (!cno.config) {
        throw new Error('Please set a config at first.');
    }
    startServer(assembleApi(createExpress(parseConfig(cno)))).initialized = true;
    return locked(cno);
}

/**
 * 关闭服务器
 * */
function shutDown (cno, returnPromise) {
    const server = cno.server;
    return PromiseUtils(new Promise(resolve => {
        if (server) {
            server.close(resolve);
        } else {
            resolve();
        }
    }), returnPromise);
}

/**
 * 自定义express实例
 * */
function setExpress (cno, expressInstance) {
    check(cno);
    cno.express = expressInstance || cno.express;
    return cno;
}

module.exports = {
    parseConfig,
    createExpress,
    assembleApi,
    startServer,
    locked,
    check,
    setConfig,
    addApi,
    usePlugin,
    initialize,
    shutDown,
    setExpress,
    PluginUtils,
    ApiBuilder
};