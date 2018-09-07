const express = require('express');
const app = express();

// helmet
const helmet = require('helmet');
app.use(helmet());

// setup cors
const cors = require('cors');
const corsOptions = {
    origin: 'https://kalejdoskop-e9e20.firebaseapp.com',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors());

// setup nconf
const nconf = require('nconf');
nconf
    .argv()
    .env()
    .file('../keys.json');

// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setup DB
const mongoose = require('mongoose');
let dbUrl = nconf.get('NODE_ENV') == 'production' ? 'mongodb://10.55.241.117:27017/kalejdoskop' : `mongodb://mongo:27017/kalejdoskop`;

mongoose.connect(dbUrl, (err) => {
    if(err) console.error(err);
});


// setup firebase
const admin = require('firebase-admin');
const serviceAccount = require('../kalejdoskopapp-privatekey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://kalejdoskopapp.firebaseio.com',
});

// express-validator
const validator = require('express-validator');
app.use(validator());

// morgan
const morgan = require('morgan');
app.use(morgan('dev'));

// routes
const auth = require('./routes/auth');
app.use('/auth', auth);

const groups = require('./routes/groups');
app.use('/group', groups);

const notifications = require('./routes/notifications');
app.use('/notif', notifications);

const user = require('./routes/user');
app.use('/user', user);

const ping = require('./routes/ping');
app.use('/ping', ping);

const info = require('./routes/info');
app.use('/info', info);

// middlewares
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const ignoreFavicon = require('./middlewares/ignoreFavicon');

app.use(notFound);
app.use(errorHandler);
app.use(ignoreFavicon);

module.exports = app;
