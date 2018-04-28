const request = require('request');
const PromiseUtils = require('./PromiseUtils');
const Method = require('../lib/Method');

function setOption (ctx, key, value) {
    ctx.options[key] = value;
    return ctx;
}

class Request extends Method {

    constructor (url = '', method = Request.GET) {
        super();
        this.original = request;

        this.options = {
            url,
            method,
            timeout: 60000,
            maxContentLength: 3145728,
            headers: {}
        };
    }

    static create (url = '', method = Request.GET) {
        return new Request(url, method);
    }

    setHeaders (headers = {}) {
        return setOption(this, 'headers', headers);
    }

    setData (data = {}) {
        return setOption(this, 'body', data);
    }

    setParams (params = {}) {
        return setOption(this, 'qs', params);
    }

    setForm (form = {}) {
        return setOption(this, 'form', form);
    }

    setFormData (formData = {}) {
        return setOption(this, 'formData', formData);
    }

    setAuth (auth) {
        return setOption(this, 'auth', auth);
    }

    setOauth (oauth) {
        return setOption(this, 'oauth', oauth);
    }

    request (returnPromise = false) {
        let self = this;
        return PromiseUtils(new Promise((resolve, reject) => {
            const options = self.options;
            if (options.form) {
                options.headers['Content-type'] = 'application/x-www-form-urlencoded';
            }
            if (options.formData) {
                options.headers['Content-type'] = 'multipart/form-data';
            }
            self.original(options, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ body, response });
                }
            });
        }), returnPromise);
    }
}

module.exports = Request;