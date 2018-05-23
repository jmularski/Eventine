var express = require('express');
var app = express();

//setup nconf
const nconf = require('nconf');
nconf
    .argv()
    .env();

//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//setup database

let dbUsername = nconf.get('DB_USERNAME');
let dbPassword = nconf.get('DB_PASSWORD');

var mongoose = require('mongoose');
mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@35.233.93.250:27017/kalejdoskop`, (err) => {
    console.log(err);
    if(err) console.log(err);
});

//routes
var auth = require('./routes/auth');
app.use('/auth', auth);

var groups = require('./routes/groups');
app.use('/group', groups);

//middlewares
var notFound = require('./middlewares/notFound');
var errorHandler = require('./middlewares/errorHandler');
var ignoreFavicon = require('./middlewares/ignoreFavicon');

app.use(notFound);
app.use(errorHandler);
app.use(ignoreFavicon);

module.exports = app;