const router = require('express').Router();
const Method = require('../lib/Method');

class ApiClass extends Method {

    constructor (baseRoute = '/') {
        super();
        if (typeof baseRoute === 'string' && baseRoute.length > 0) {
            this.baseRoute = baseRoute.startsWith('/') ? baseRoute : `/${baseRoute}`;
        } else {
            throw new Error('BaseRoute must be a string and non null.');
        }
        this.router = router;
        this.routerList = [];
    }

    add (path, method, cb) {
        this.routerList.push({
            path, method, cb
        });
        return this;
    }

    inject (cno) {
        this.cno = cno;
        this.routerList.forEach(routerItem => {
            const cb = function (req, res, next) {
                routerItem.cb(req, res, next, cno);
            };
            this.router[routerItem.method](routerItem.path, cb);
        });
        return this;
    }
}

module.exports = ApiClass;