const randomString = require('randomstring');
const User = require('../../src/models/user');
<<<<<<< HEAD
const Group = require('../../src/models/group');
=======
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
const createToken = require('../../src/lib/createToken');

let generateRandomEmail = () => {
    return `${randomString.generate(6)}@michno.pl`;
};
<<<<<<< HEAD

let generateFakeSocialToken = () => {
    return randomString.generate(30);
};

let generateUser = async () => {
    let user = new User({
        email: generateRandomEmail(),
        password: randomString.generate(),
        fullName: 'Test Test'
=======
let generateFakeSocialToken = () => {
    return randomString.generate(30);
};
let generateUser = async () => {
    let user = new User({
        email: generateRandomEmail(),
        password: 'michno',
        fullName: 'Marcin Michno'
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
    });
    await user.save();
    return user;
};
<<<<<<< HEAD

=======
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
let generateToken = async () => {
    let user = await generateUser();
    let token = createToken(user.fullName, user.id);
    return token;
};

<<<<<<< HEAD
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

=======
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
module.exports = {
    generateRandomEmail,
    generateFakeSocialToken,
    generateUser,
<<<<<<< HEAD
    generateToken,
    generateGroup
=======
    generateToken
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
};