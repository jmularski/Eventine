module.exports = {
    generateRandomData
};

const faker = require('faker');

function generateRandomData(userContext, events, done) {
    // generate data with Faker:
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const email = faker.internet.exampleEmail();
    // add variables to virtual user's context:
    userContext.vars.name = name;
    userContext.vars.email = email;
    // continue with executing the scenario:
    return done();
}