const chai = require('chai');
chai.should();

const request = require('supertest');
const server = require('../../../src/config/www');

let { generateRandomEmail } = require('../../helper/object-generator.js');

describe('REGISTER INTEGRATION TESTS', () => {
    let userEmail = generateRandomEmail();
    describe('Successful attempt', () => {
        let userData = {
            email: userEmail,
            fullName: 'Test Test',
            password: 'test',
        };
        it('Should return 200', () => {
            request(server)
            .post('/auth/register')
            .send(userData)
            .set('Accept', 'application/json')
            .expect(200);
        });
    });
    describe('Failed cases', () => {
        describe('Missing parameter', () => {
            let userData = {
                fullName: 'Test Test',
                password: 'test',
            };
            it('Returns 401', () => {
                request(server)
                .post('/auth/register')
                .send(userData)
                .set('Accept', 'application/json')
                .expect(401);
            });
        });
        describe('Email taken', () => {
            let userData = {
                email: userEmail,
                fullName: 'Test Test',
                password: 'test',
            };
            it('Should return 401', () => {
                request(server)
                .post('/auth/register')
                .send(userData)
                .set('Accept', 'application/json')
                .expect(401);
            });
        });
    });
});
