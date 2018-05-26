/**
 * 数据库工具类
 */
const mysql = require('mysql');
const PromiseUtils = require('./PromiseUtils');
const MAX_THREAD = require('os').cpus().length * 2 + 1;

class Config {
    constructor (mysqlConfig = {}) {
        this.connectionLimit = Math.max(mysqlConfig.maxThread || MAX_THREAD, 3);
        this.multipleStatements = typeof mysqlConfig.multipleStatements === 'boolean' ? mysqlConfig.multipleStatements : true;
        this.hostChecked = false;
        this.mainHost = this.host = mysqlConfig.host;
        this.user = mysqlConfig.user;
        this.password = mysqlConfig.password;
        this.database = mysqlConfig.database;
        this.subHost = mysqlConfig.subHost;
        this.id = mysqlConfig.id;
        this.port = mysqlConfig.port;
        this.pool = null;
    }

    convert () {
        if (this.host === this.mainHost) {
            this.host = this.subHost;
        } else {
            this.host = this.mainHost;
        }
        console.debug(`Database's host is convert to ${this.host}`);
        return this;
    }

    setCheck (toggle) {
        this.hostChecked = toggle || false;
        return this;
    }

    isCheck () {
        if (!this.hostChecked) {
            this.createPool();
        }
        return this.hostChecked;
    }

    createPool () {
        let ctx = this;
        ctx.pool = mysql.createPool(ctx);
        ctx.pool.getConnection((err, connection) => {
            if (err && err.message.indexOf('connect ECONNREFUSED 127.0.0.1') >= 0) {
                ctx.pool = mysql.createPool(ctx.convert());
            }
            ctx.setCheck(true);
            destroy(connection);
        });
    }

    createClient (resolve) {
        let ctx = this;
        ctx.pool.getConnection((err, connection) => {
            if (err) {
                if (err.message.indexOf('connect ECONNREFUSED 127.0.0.1') >= 0) {
                    ctx.pool = mysql.createPool(ctx.convert());
                }
                connection = mysql.createConnection(ctx);
            }
            typeof resolve === 'function' && resolve(connection);
        });
    }
}

/**
 * 连接数据库
 * */

function create (mysqlConfig, returnPromise = false) {
    return PromiseUtils(new Promise((resolve) => {
        let id = setInterval(() => {
            if (mysqlConfig.isCheck()) {
                clearInterval(id);
                mysqlConfig.createClient(resolve);
            }
        }, 100);
    }), returnPromise);
}

function destroy (client) {
    if (client) {
        if (client.release && typeof client.release === 'function') {
            client.release();
            console.debug(`Database connect is release in ${new Date()}.`);
        } else if (client.end && typeof client.end === 'function') {
            client.end();
            console.debug(`Database connect is end in ${new Date()}.`);
        }
    }
    client = null;
}

function exec (client, sql = '', args = [], returnPromise = false) {
    return PromiseUtils(new Promise((resolve, reject) => {
        client.then(client => {
            client.query(sql, args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                destroy(client);
            });
        });
    }), returnPromise);
}

/**
 * 教程
 * @return {string}
 * */
function HELP () {
    return 'https://github.com/mysqljs/mysql/blob/master/Readme.md';
}

module.exports = {
    Config, create, exec, destroy, HELP
};
