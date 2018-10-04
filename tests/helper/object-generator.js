const randomString = require('randomstring');
const User = require('../../src/models/user');
const createToken = require('../../src/lib/createToken');

let generateRandomEmail = () => {
    return `${randomString.generate(6)}@michno.pl`;
};
let generateFakeSocialToken = () => {
    return randomString.generate(30);
};
let generateToken = async () => {
    let user = new User({
        email: generateRandomEmail(),
        password: 'michno',
        fullName: 'Marcin Michno'
    });
    await user.save();
    return createToken(user.fullName, user.id);
};

module.exports = {
    generateRandomEmail,
    generateFakeSocialToken,
    generateToken
};