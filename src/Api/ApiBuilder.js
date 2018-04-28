const ApiClass = require('./ApiClass');
const Method = require('../lib/Method');

class Builder extends Method {
    static get ApiClass () {
        return ApiClass;
    }

    constructor (baseRoute) {
        super();
        this.api = new ApiClass(baseRoute);
    }

    static create (baseRoute) {
        return new Builder(baseRoute);
    }

    add (path, method, cb) {
        this.api.add(path, method.toLowerCase(), cb);
        return this;
    }

    build () {
        return this.api;
    }
}

module.exports = Builder;