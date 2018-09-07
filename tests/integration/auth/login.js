const expect = require('chai').expect;

const request = require('supertest');
const server = require('../../../src/config/www');

describe('LOGIN INTEGRATION TESTS', () =>{
    before( async () => {
        let userData = {
            email: 'michno@michno.pl',
            fullName: 'Michno Michno',
            password: 'michno',
        };
        await request(server).post('/auth/register').send(userData).set('Accept', 'application/json');
    })
    describe('Successful attempt', () => {
        let userData;
        before( async () => {
            userData = {
              email: 'michno@michno.pl',
              password: 'michno',
            };
        });
        it('Should return 200 and token', () => {
            return request(server)
            .post('/auth/login')
            .send(userData)
            .set('Accept', 'application/json')
            .expect(200);
        });
    });
    describe('Failed cases', () => {
        describe('No email sent', async () => {
            let userData;
            before( async () => {
                userData = {
                  password: 'michno',
                };
            });
            it('Should return 401', () => {
                return request(server)
                .post('/auth/login')
                .send(userData)
                .set('Accept', 'application/json')
                .expect(401);
            });
        });
        describe('No password sent', async () => {
            let userData;
            before( async () => {
                userData = {
                    email: 'marcin@michno.pl',
                };
            });
            it('Should return 401', () => {
                return request(server)
                .post('/auth/login')
                .send(userData)
                .set('Accept', 'application/json')
                .expect(401);
            });
        });
        describe('No user with that email', async () => {
            let userData;
            before( async () => {
                userData = {
                    email: 'marcin@michnov2.pl',
                    password: 'michno123',
                };
            });
            it('Should return 401', () => {
                return request(server)
                .post('/auth/login')
                .send(userData)
                .set('Accept', 'application/json')
                .expect(401);
            });
        });
        describe('Wrong password', async () => {
            let userData;
            before( async () => {
                userData = {
                    email: 'marcin@michno.pl',
                    password: 'michno123',
                };
            });
            it('Should return 401', () => {
                return request(server)
                .post('/auth/login')
                .send(userData)
                .set('Accept', 'application/json')
                .expect(401);
            });
        });
    });
});
