const expect = require('chai').expect;

const request = require('supertest');
const server = require('../../../src/config/www');
const mongoose = require('mongoose');
const { generateUser } = require('../../helper/object-generator');
describe('LOGIN INTEGRATION TESTS', () =>{
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
            password: 'michno',
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
            email: 'marcin@michnov2.pl',
            password: 'michno123',
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
            password: 'michno123',
        };    
        request(server)
        .post('/auth/login')
        .send(userCase)
        .set('Accept', 'application/json')
        .expect(401);
    });
})