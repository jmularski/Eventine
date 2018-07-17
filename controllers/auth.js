require('express-validator');
const NotAuthenticated = require('../lib/errors/NotAuthenticated');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const encryptUtils = require('../lib/encryptUtils');

// TODO: unit testing, integration tests

/** @api { post } /auth/login Login
 *  @apiDescription Login user with given email and password
 *  @apiName authLocalLogin
 *  @apiGroup auth
 *  
 *  @apiParam (Body) {String} email - must be in email format (xxx@xxx.xx)
 *  @apiParam (Body) {String} password - must be at least 4 characters long
 *  
 *  @apiSuccess {Object} object with two fields success: true (why?) and token, which is used in future server actions
 */

let login = async (req, res, next) => {
    // validation
    req.checkBody({
        email: {
            notEmpty: { errorMessage: 'Missing email!' },
            isEmail: { errorMessage: 'Email is in bad format' },
        },
        password: {
            notEmpty: { errorMessage: 'Missing password!' },
            isLength: { options: { min: 4 }, errorMessage: 'Password is too short' },
        },
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new NotAuthenticated(validationErrors[0]));

    // login
    let { email, password } = req.body;
    let user = await User.findOne({email}).exec();

    if(!user) return next(new NotAuthenticated('User with this email doesn\'t exist!'));
    let passComparison = await encryptUtils.compare(password, user.password);
    if(!passComparison) return next(new NotAuthenticated('Bad password'));

    let token = jwt.sign({'fullName': user.fullName, 'id': user.id}, 'kalejdoskop', {expiresIn: '7d'});
    res.status(200).send({success: true, token});
};

/** @api { post } /auth/register Register
 *  @apiDescription Register user with given email and password and full name
 *  @apiName authLocalRegister
 *  @apiGroup auth
 *  
 *  @apiParam (Body) {String} email - must be in email format (xxx@xxx.xx)
 *  @apiParam (Body) {String} password - must be at least 4 characters long
 *  @apiParam (Body) {String} fullName - must be at least 6 characters long up to 60 characters, full name of the user, serves as username later
 *  
 *  
 *  @apiSuccess {Object} object with two fields success: true (why?) and token, which is used in future server actions
 */

let register = async (req, res, next) => {
    // validation
    req.checkBody({
        email: {
            notEmpty: { errorMessage: 'Missing email!' },
            isEmail: { errorMessage: 'Email is in bad format' },
        },
        password: {
            notEmpty: { errorMessage: 'Missing password!' },
            isLength: { options: { min: 4 }, errorMessage: 'Password is too short' },
        },
        fullName: {
            notEmpty: { errorMessage: 'Missing full name!' },
            isLength: { options: { min: 6, max: 60}, errorMessage: 'Is this your full name?' },
        },
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new NotAuthenticated(validationErrors[0]));

    // registration

    let { email, fullName, password } = req.body;

    let user = await User.findOne({email}).exec();
    if(user) return next(new NotAuthenticated('User with this email already exists!'));

    password = await encryptUtils.encrypt(password);
    if(password === null) return next(new NotAuthenticated('Sorry, backend fucked up!'));
    let newUser = new User({
        email,
        fullName,
        password,
    });
    await newUser.save();
    let token = jwt.sign({'fullName': newUser.fullName, 'id': newUser.id}, 'kalejdoskop', {expiresIn: '7d'});
    res.status(200).send({success: true, token});
};

/** @api { post } /auth/social Social
 *  @apiDescription Register user with given facebookId and full name
 *  @apiName authLocalRegister
 *  @apiGroup auth
 *  
 *  @apiParam (Body) {String} facebookId - facebook profile id (verify this with devs!), get it after logging in with facebook through facebooks Graph API
 *  @apiParam (Body) {String} fullName - must be at least 6 characters long up to 60 characters, full name of the user, serves as username later, get it after logging in with facebook through facebooks Graph API
 *  
 *  @apiSuccess {Object} object with two fields success: true (why?) and token, which is used in future server actions
 */

let social = async (req, res, next) => {
    // validation
    req.checkBody({
        facebookId: {
            notEmpty: { errorMessage: 'Missing facebookId!' },
        },
        fullName: {
            notEmpty: { errorMessage: 'Missing full name!' },
            isLength: { options: { min: 6, max: 60}, errorMessage: 'Is this your full name?' },
        },
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new NotAuthenticated(validationErrors[0]));

    // facebook register
    let { facebookId, fullName } = req.body;

    let user = await User.findOne({facebookId}).exec();
    if(!user) {
        let user = new User({
            facebookId,
            fullName,
        });
        await user.save();
    }

    let token = jwt.sign({'fullName': user.fullName, 'id': user.id}, 'kalejdoskop', {expiresIn: '7d'});
    res.status(200).send({success: true, token});
};

module.exports = {
    login,
    register,
    social,
};
