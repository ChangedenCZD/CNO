const Package = require('./package.json');
const CNO_VERSION = Package.version;
const Express = require('express');
const debug = require('debug')(`cno:${CNO_VERSION}`);
debug.enabled = true;
const http = require('http');
const logger = require('morgan');
const ApiBuilder = require('./src/Api/ApiBuilder');
const ApiClass = ApiBuilder.ApiClass;
const PluginUtils = require('./src/Utils/PluginUtils');
const PromiseUtils = require('./src/Utils/PromiseUtils');

const DEFAULT_PORT = 3000;

class CNO {

    static get ApiBuilder () {
        return ApiBuilder;
    }

    static get Plugin () {
        return PluginUtils.Plugin;
    }

    constructor (config) {
        this.START_TIME = new Date();
        this.initialized = false;
        this.apiList = [];
        this.routerSet = new Set();
        if (config) {
            this.setConfig(config);
        }
    }

    initialize () {
        if (!this.config) {
            throw new Error('Please set a config at first.');
        }
        parseConfig(this);
        createExpress(this);
        assembleApi(this);
        startServer(this);
        this.initialized = true;
        locked(this);
        return this;
    }

    setConfig (config) {
        this.check();
        if (typeof config === 'object') {
            this.config = config;
        } else {
            throw new Error('Config must be require a object.');
        }
        return this;
    }

    setExpress (express) {
        this.check();
        this.express = express || this.express;
        return this;
    }

    addApi (api) {
        this.check();
        if (api) {
            if (!this.duplicateRoute) {
                const cno = this;
                const baseRoute = api.baseRoute;
                api.routerList.forEach(router => {
                    const fullRouter = `ROUTE:${baseRoute}/${router.path} METHOD:${router.method}`.replace(/\/\/\//g, '/').replace(/\/\//g, '/');
                    if (cno.routerSet.has(fullRouter)) {
                        throw new Error(`Duplicate Api ${fullRouter}.`);
                    }
                    cno.routerSet.add(fullRouter);
                });
            }
            this.apiList.push(api);
        }
        return this;
    }

    check () {
        if (this.initialized) {
            throw new Error('This instance has initialized, can not set config.');
        }
        return this;
    }

    usePlugin (plugin) {
        this.check();
        PluginUtils(this, plugin);
        return this;
    }

    shutDown (returnPromise) {
        const server = this.server;
        return PromiseUtils(new Promise(resolve => {
            if (server) {
                server.close(resolve);
            } else {
                resolve();
            }
        }), returnPromise);
    }
}

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
    return cno;
}

function createExpress (cno) {
    const express = cno.express || Express();
    const headers = cno.headers;
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
    cno.express = express;
    return cno;
}

function assembleApi (cno) {
    cno.apiList.forEach(api => {
        api.inject(cno);
        cno.express.use(api.baseRoute, api.router);
    });
    return cno;
}

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

function locked (cno) {
    if (cno.initialized) {
        cno.express = undefined;
        cno.setConfig = undefined;
        cno.setExpress = undefined;
    }
}

module.exports = CNO;