const request = require('supertest');
const server = require('../../../src/config/www');
const { generateUser } = require('../../helper/object-generator');
describe('LOGIN INTEGRATION TESTS', () => {
    var userData;
    before( async () => {
        userData = await generateUser();
    })
    it('Successful with all data needed', () => {
        request(server)
        .post('/auth/login')
        .send(userData)
        .set('Accept', 'application/json')
        .expect(200);
    });
    it('Failed without email', async () => {
        let userCase = {
            password: 'test',
        };
        request(server)
        .post('/auth/login')
        .send(userCase)
        .set('Accept', 'application/json')
        .expect(401);
    });
    it('Failed without password', async () => {
        let userCase = {
            email: userData.email
        };
        request(server)
        .post('/auth/login')
        .send(userCase)
        .set('Accept', 'application/json')
        .expect(401);
    });
    it('Failed for no user with email given', async () => {
        let userCase = {
            email: 'test@helloworld.pl',
            password: 'test',
        };
        request(server)
        .post('/auth/login')
        .send(userCase)
        .set('Accept', 'application/json')
        .expect(401);
    });
    it('Failed with wrong password given', async () => {
        let userCase = {
            email: userData.email,
            password: 'test',
        };    
        request(server)
        .post('/auth/login')
        .send(userCase)
        .set('Accept', 'application/json')
        .expect(401);
    });
})