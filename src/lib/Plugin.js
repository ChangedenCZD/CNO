class Plugin {
    constructor (name, key, path) {
        this.name = name;
        this.key = key;
        this.path = path;
    }

    req () {
        return require(this.path);
    }
}

module.exports = class {
    static get Mysql () {
        return new Plugin('Mysql', 'mysql', '../Utils/MysqlUtils');
    }

    static get Request () {
        return new Plugin('Request', 'request', '../Utils/RequestUtils');
    }

    static get Redis () {
        return new Plugin('Redis', 'redis', '../Utils/RedisUtils');
    }
};