const express = require('express');
const app = express();

// helmet
const helmet = require('helmet');
app.use(helmet());

// setup cors
const cors = require('cors')
/*const corsoptions = {
    origin: 'https://findme-186320.firebaseapp.com',
    credentials: true,
    optionsSuccessStatus: 200,
};*/
app.use(cors());

// setup nconf
const nconf = require('nconf');
nconf
    .argv()
    .env()
    .file('../keys.json');

// setup loggly
var winston = require('winston');
require('winston-loggly-bulk');
 
winston.add(winston.transports.Loggly, {
    token: "7b198698-583b-4a1e-97fd-e478945561cb",
    subdomain: "geteventine",
    tags: ["Winston-NodeJS"],
    json: true,
    handleExceptions: true,
});
winston.exitOnError = false;

winston.log('info', "Started server/Rolled new update!",  { tags: 'server' });

// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// setup DB
const mongoose = require('mongoose');
console.log(nconf.get('NODE_ENV'));
let dbUrl;
if(nconf.get('NODE_ENV') == 'production') dbUrl = 'mongodb://10.55.241.117:27017/kalejdoskop';
else if(nconf.get('NODE_ENV') == 'dev' || nconf.get('NODE_ENV') == 'CI' ) dbUrl = 'mongodb://mongo:27017/kalejdoskop';
else dbUrl = 'mongodb://localhost:27017/kalejdoskop';
console.log(dbUrl);
mongoose.connect(dbUrl, (err) => {
    console.log("Hi!");
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

const actions = require('./routes/actions');
app.use('/actions', actions);

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.get('/.well-known/acme-challenge/:ping', (req, res) => {

    res.send(req.params.ping + '.TOzwmPscKGMCrpuOkfiqdvhIxqwL8_BIzDeUFoou47Y');
})

// middlewares
const botFucker = require('./middlewares/botFucker');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const ignoreFavicon = require('./middlewares/ignoreFavicon');

app.use(express.static(__dirname + '/public'));
app.use(ignoreFavicon);
app.use(botFucker);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
