const express = require('express');
const app = express();

// setup dotenv
const dotenv = require('dotenv');
const result = dotenv.config();

if(result.error) {
    throw result.error;
}

console.log(result);

// helmet
const helmet = require('helmet');
app.use(helmet());

// setup cors
const cors = require('cors');

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
    token: '7b198698-583b-4a1e-97fd-e478945561cb',
    subdomain: 'geteventine',
    tags: ['Winston-NodeJS'],
    json: true,
    handleExceptions: true,
});
winston.exitOnError = false;

winston.log('info', 'Started server/Rolled new update!', { tags: 'server' });

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
mongoose.connect(dbUrl, (err) => {
    console.log('Hi!');
    if(err) console.error(err);
});

//setup caching
//const redis = require('./lib/redis');
//console.log("I see you");
//redis.connect(nconf.get('NODE_ENV'));

// setup firebase
if(nconf.get('NODE_ENV') != 'test' && nconf.get('NODE_ENV') != 'CI' && nconf.get('NODE_ENV') != undefined) {
    const admin = require('firebase-admin');
    const serviceAccount = require(`../${process.env.FIREBASE_PRIVATE_KEY}`);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://kalejdoskopapp.firebaseio.com',
    });
}

// express-validator
const validator = require('express-validator');
app.use(validator());

// morgan
const morgan = require('morgan');
app.use(morgan('dev'));
try {
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
});

// middlewares
const botCatcher = require('./middlewares/botCatcher');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const ignoreFavicon = require('./middlewares/ignoreFavicon');

app.use(express.static(__dirname + '/public'));
app.use(ignoreFavicon);
app.use(botCatcher);
app.use(notFound);
app.use(errorHandler);
} catch(e) {
    console.log(e);
}
module.exports = app;
