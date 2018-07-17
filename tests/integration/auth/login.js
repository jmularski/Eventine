const chai = require('chai');
chai.should();

let requester = require('../../helper/requester');

describe('LOGIN INTEGRATION TESTS', () => {
    describe('Successful attempt', () => {
        let response;
        before( async () => {
            let userData = {
                email: 'michno@michno.pl',
                password: 'michno',
            };
            response = await requester.post('/auth/login', userData);
        });
        it('Should return 200', () => {
            (response.status).should.equal(200);
        });
        it('Should return jwt', () => {
            (response.data).should.have.property('token');
        });
    });
    describe('Failed cases', () => {
        describe('No email sent', async () => {
            let response;
            before( async () => {
                let userData = {
                    password: 'michno',
                };
                let data = await requester.post('/auth/login', userData);
                response = data.response;
            });
            it('Should return 401', () => {
                (response.status).should.equal(401);
            });
        });
        describe('No password sent', async () => {
            let response;
            before( async () => {
                let userData = {
                    email: 'marcin@michno.pl',
                };
                let data = await requester.post('/auth/login', userData);
                response = data.response;
            });
            it('Should return 401', () => {
                (response.status).should.equal(401);
            });
        });
        describe('No user with that email', async () => {
            let response;
            before( async () => {
                let userData = {
                    email: 'marcin@michnov2.pl',
                    password: 'michno123',
                };
                let data = await requester.post('/auth/login', userData);
                response = data.response;
            });
            it('Should return 401', () => {
                (response.status).should.equal(401);
            });
        });
        describe('Wrong password', async () => {
            let response;
            before( async () => {
                let userData = {
                    email: 'marcin@michno.pl',
                    password: 'michno123',
                };
                let data = await requester.post('/auth/login', userData);
                response = data.response;
            });
            it('Should return 401', () => {
                (response.status).should.equal(401);
            });
        });
    });
});
