const chai = require('chai');
chai.should();

const randomString = require('randomstring');

const request = require('supertest');
const server = require('../../../src/config/www');

let { generateRandomEmail } = require('../../helper/object-generator.js');

describe('REGISTER INTEGRATION TESTS', () => {
    let userEmail = generateRandomEmail();
    describe('Successful attempt', () => {
        let userData = {
            email: userEmail,
            fullName: 'Michno Michno',
            password: 'michno',
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
                fullName: 'Michno Michno',
                password: 'Michno',
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
                fullName: 'Michno Michno',
                password: 'michno',
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
