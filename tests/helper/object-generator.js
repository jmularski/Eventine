const randomString = require('randomstring');
const User = require('../../src/models/user');
const createToken = require('../../src/lib/createToken');

let generateRandomEmail = () => {
    return `${randomString.generate(6)}@michno.pl`;
};
let generateFakeSocialToken = () => {
    return randomString.generate(30);
};
let generateUser = async () => {
    let user = new User({
        email: generateRandomEmail(),
        password: 'michno',
        fullName: 'Marcin Michno'
    });
    await user.save();
    return user;
};
let generateToken = async () => {
    let user = await generateUser();
    let token = createToken(user.fullName, user.id);
    return token;
};

module.exports = {
    generateRandomEmail,
    generateFakeSocialToken,
    generateUser,
    generateToken
};