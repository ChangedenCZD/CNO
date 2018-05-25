const router = require('express').Router();
const Method = require('../lib/Method');
let cno = null;

class Func {
    constructor ($cb) {
        this._cb = (req, res, next) => {
            $cb.bind({
                cno, req, res, next, $cb
            })();
        };
    }
}

class ApiClass extends Method {
    static get Func () {
        return Func;
    }

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

    inject ($cno) {
        cno = $cno;
        this.routerList.forEach(routerItem => {
            const method = routerItem.method;
            const path = routerItem.path;
            const callback = routerItem.cb;
            if (typeof routerItem.cb === 'function') {
                const cb = function (req, res, next) {
                    callback(req, res, next, cno);
                };
                this.router[method](path, cb);
            } else {
                this.router[method](path, callback._cb);
            }
        });
        return this;
    }

}

module.exports = ApiClass;