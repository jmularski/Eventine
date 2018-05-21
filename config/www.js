var http = require('http');
var app = require('../app');

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, () => {
    console.log("Hello world!");
})