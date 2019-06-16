const chai = require('chai');
chai.should();

<<<<<<< HEAD
const request = require('supertest');
const server = require('../../../src/config/www');

let { generateRandomEmail } = require('../../helper/object-generator.js');

=======
const randomString = require('randomstring');

const request = require('supertest');
const server = require('../../../src/config/www');

let { generateRandomEmail } = require('../../helper/object-generator.js');

>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
describe('REGISTER INTEGRATION TESTS', () => {
    let userEmail = generateRandomEmail();
    describe('Successful attempt', () => {
        let userData = {
            email: userEmail,
<<<<<<< HEAD
            fullName: 'Test Test',
            password: 'test',
=======
            fullName: 'Michno Michno',
            password: 'michno',
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
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
<<<<<<< HEAD
                fullName: 'Test Test',
                password: 'test',
=======
                fullName: 'Michno Michno',
                password: 'Michno',
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
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
<<<<<<< HEAD
                fullName: 'Test Test',
                password: 'test',
=======
                fullName: 'Michno Michno',
                password: 'michno',
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
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
