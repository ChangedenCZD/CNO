const CNO = require('../../index');
const ApiBuilder = CNO.ApiBuilder;
const co = require('co');
const api2 = ApiBuilder.create('/api/').add('/api2', ApiBuilder.GET, (req, res, next, cno) => {
    co(function* () {
        const result = yield cno.request.create('https://img.shields.io/npm/v/cno.svg?style=flat-square', cno.request.GET).setParams({ a: 'a' }).request();
        res.json({ img: result.response });
    });
})
.build();

module.exports = api2;