var express = require('express');
var app = express();

//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set database access
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kalejdoskop', (err) => {
    if(err) console.log(err);
});

//routes
var auth = require('./routes/auth');
app.use('/auth', auth);

//middlewares
var notFound = require('./middlewares/notFound');
var errorHandler = require('./middlewares/errorHandler');
var ignoreFavicon = require('./middlewares/ignoreFavicon');

app.use(notFound);
app.use(errorHandler);
app.use(ignoreFavicon);

module.exports = app;