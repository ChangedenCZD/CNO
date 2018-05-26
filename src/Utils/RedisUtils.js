/**
 * Redis 工具类
 */
const redis = require('redis');
const PromiseUtils = require('./PromiseUtils');
const DEFAULT_REFRESH_DURATION = 44444;
const REDIS_LIST = {};

function startLooper (ctx) {
    ctx.looperId = setInterval(() => {
        createClient(ctx);
    }, DEFAULT_REFRESH_DURATION);
    return ctx;
}

function stopLooper (ctx) {
    if (ctx.looperId) {
        clearInterval(ctx.looperId);
    }
    ctx.looperId = undefined;
    ctx.quit();
    return ctx;
}

function createClient (ctx) {
    if (!ctx.lastUpdate || ctx.lastUpdate < (Date.now() - DEFAULT_REFRESH_DURATION)) {
        ctx.quit();
        ctx.lastUpdate = Date.now();
        ctx.client = redis.createClient(port, host, ctx);
        startLooper(ctx);
    }
    return ctx;
}

function genId (host, port) {
    return md5(`${host}:${port}`);
}

class Redis {
    constructor (host, port, password) {
        this.id = genId(host, port);
        this.host = host;
        this.port = port;
        this.password = password;
        this.looperId = undefined;
        createClient(this);
        startLooper(this);
        REDIS_LIST[this.id] = this;
    }

    static create (host, port, password) {
        const id = genId(host, port);
        const client = REDIS_LIST[id];
        return client ? client : new Redis(host, port, password);
    }

    setData (key, value, expire) {
        this.check().client.set(key, value || '', 'EX', expire || 86400);
        return this;
    }

    getData (key, returnPromise = false) {
        this.check();
        const self = this;
        return PromiseUtils(new Promise((resolve, reject) => {
            self.client.get(key, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }), returnPromise);
    }

    removeData (key) {
        return this.check().setData(key, null, 1);
    }

    quit () {
        stopLooper(this);
        if (this.client) {
            this.client.quit();
        }
        this.client = undefined;
        return this;
    }

    check () {
        if (!this.client) {
            throw new Error('Client has shut down.');
        }
        return this;
    }

    /**
     * 教程
     * */
    static get HELP () {
        return 'https://github.com/NodeRedis/node_redis/blob/master/README.md';
    }
}

module.exports = Redis.create;
