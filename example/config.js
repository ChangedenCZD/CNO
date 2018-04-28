module.exports = {
    api: {
        duplicate: false,
        list: [require('./api/api1.js'), require('./api/api2.js')]
    },
    port: 3001,
    headers: [
        { 'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS' },
        { 'Access-Control-Allow-Headers': 'X-Requested-With' },
        { 'Access-Control-Allow-Headers': 'Content-Type' },
        { 'Access-Control-Allow-Origin': 'https://chansos.com' },
        { 'Access-Control-Allow-Origin': 'https://www.chansos.com' }
    ]
};