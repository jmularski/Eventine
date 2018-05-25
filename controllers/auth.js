require('express-validator');
var NotAuthenticated = require('../lib/errors/NotAuthenticated');
var User = require('../models/user');
var jwt = require('jsonwebtoken');

var encryptUtils = require('../lib/encryptUtils');

//TODO: some tests

var login = async (req, res, next) => {
    //validation
    req.checkBody({
        email: {
            notEmpty: { errorMessage: "Missing email!" },
            isEmail: { errorMessage: "Email is in bad format" }
        },
        password: {
            notEmpty: { errorMessage: "Missing password!" },
            isLength: { options: { min: 4 }, errorMessage: "Password is too short" }
        }
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new NotAuthenticated(validationErrors[0]));

    //login
    var { email, password } = req.body;
    var user = await User.findOne({email}).exec();

    if(!user) return next(new NotAuthenticated("User with this email doesn't exist!"));
    if(await !encryptUtils.compare(password, user.password)) return next(new NotAuthenticated("Bad password"));
    
    var token = jwt.sign({'fullName': user.fullName, 'id': user.id}, 'kalejdoskop', {expiresIn: '1h'});
    res.status(200).send({success: true, token});
};

var register = async (req, res, next) => {

    //validation
    req.checkBody({
        email: {
            notEmpty: { errorMessage: "Missing email!" },
            isEmail: { errorMessage: "Email is in bad format" }
        },
        password: {
            notEmpty: { errorMessage: "Missing password!" },
            isLength: { options: { min: 4 }, errorMessage: "Password is too short" }
        },
        fullName: {
            notEmpty: { errorMessage: "Missing full name!" },
            isLength: { options: { min: 6, max: 60}, errorMessage: "Is this your full name?" },
        }
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new NotAuthenticated(validationErrors[0]));

    //registration
    
    var { email, fullName, password } = req.body;

    let user = await User.findOne({email}).exec();
    if(user) return next(new NotAuthenticated("User with this email already exists!"));

    password = await encryptUtils.encrypt(password);
    if(password === null) return next(new NotAuthenticated("Some monkeys tampered with our code, fixing it as fast as possible!"));
    let newUser = new User({
        email,
        fullName,
        password
    });
    await newUser.save();
    var token = jwt.sign({'fullName': newUser.fullName, 'id': newUser.id}, 'kalejdoskop', {expiresIn: '1h'});
    res.status(200).send({success: true, token});
};

var social = async (req, res, next) => {

    //validation
    req.checkBody({
        facebookId: {
            notEmpty: { errorMessage: "Missing facebookId!" },
        },
        fullName: {
            notEmpty: { errorMessage: "Missing full name!" },
            isLength: { options: { min: 6, max: 60}, errorMessage: "Is this your full name?" },
            matches: { options: /^[A-Za-z]+$/, errorMessage: "Don't use nonalphabetic characters!" }
        }
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new NotAuthenticated(validationErrors[0]));

    //facebook register
    var { facebookId, fullName } = req.body;

    let user = await User.findOne({facebookId}).exec();
    if(!user){
        let user = new User({
            facebookId,
            fullName
        });
        await user.save();
    }

    var token = jwt.sign({'fullName': user.fullName, 'id': user.id}, 'kalejdoskop', {expiresIn: '1h'});
    res.status(200).send({success: true, token});

};

module.exports = {
    login,
    register,
    social
};