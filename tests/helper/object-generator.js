const randomString = require('randomstring');
const User = require('../../src/models/user');
const Group = require('../../src/models/group');
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
        password: randomString.generate(),
        fullName: 'Test Test'
    });
    await user.save();
    return user;
};
let generateToken = async () => {
    let user = await generateUser();
    let token = createToken(user.fullName, user.id);
    return token;
};

let generateGroup = async () => {
    let user = await generateUser();
    let group = new Group({
        groupCode: randomString.generate(),
        groupName: randomString.generate(),
        people: [{
            id: user.id,
            name: user.fullName,
            subgroup: 'admin',
            location: '',
        }]
    });
    await group.save();
    return group;
};

module.exports = {
    generateRandomEmail,
    generateFakeSocialToken,
    generateUser,
    generateToken,
    generateGroup
};