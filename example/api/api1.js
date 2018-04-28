const CNO = require('../../index');
const ApiBuilder = CNO.ApiBuilder;

const api1 = ApiBuilder.create('/api/')
.add('/api1', ApiBuilder.GET, (req, res, next, cno) => {
    res.json({ route: api2.baseRoute });
})
.add('/api1/api2', ApiBuilder.POST, (req, res, next, cno) => {
    res.json({ route: api2.baseRoute });
})
.build();

const api2 = ApiBuilder.create('/api/').add('/api2', ApiBuilder.POST, (req, res, next, cno) => {
    res.json({ route: api2.baseRoute });
})
.build();

module.exports = { api1, api2 };
// module.exports = api2;