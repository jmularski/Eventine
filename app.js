var express = require('express');
var app = express();

//setup nconf
const nconf = require('nconf');
nconf
    .argv()
    .env()
    .file('./keys.json');

//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//setup database
let dbUsername = nconf.get('DB_USERNAME');
let dbPassword = nconf.get('DB_PASSWORD');

var mongoose = require('mongoose');
mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@35.205.131.216:27017/kalejdoskop`, (err) => {
    console.log(err);
    if(err) console.log(err);
});

//setup firebase
var admin = require('firebase-admin');
var serviceAccount = require('./kalejdoskopapp-privatekey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kalejdoskopapp.firebaseio.com"
});

//express-validator
var validator = require('express-validator');
app.use(validator());

//morgan
var morgan = require('morgan');
app.use(morgan('dev'));

//routes
var auth = require('./routes/auth');
app.use('/auth', auth);

var groups = require('./routes/groups');
app.use('/group', groups);

var notifications = require('./routes/notifications');
app.use('/notif', notifications);

//middlewares
var notFound = require('./middlewares/notFound');
var errorHandler = require('./middlewares/errorHandler');
var ignoreFavicon = require('./middlewares/ignoreFavicon');

app.use(notFound);
app.use(errorHandler);
app.use(ignoreFavicon);

module.exports = app;
