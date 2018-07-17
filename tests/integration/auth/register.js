const chai = require('chai');
chai.should();

const randomString = require('randomstring');

let requester = require('../../helper/requester');

function generateRandomEmail() {
    return `${randomString.generate(6)}@michno.pl`;
};

describe('REGISTER INTEGRATION TESTS', () => {
    describe('Successful attempt', () => {
        let response; let userData;
        before( async () => {
            userData = {
                email: generateRandomEmail(),
                fullName: 'Michno Michno',
                password: 'michno',
            };
            response = await requester.post('/auth/register', userData);
        });
        it('Should return 200', () => {
            (response.status).should.equal(200);
        });
        it('Should return jwt', () => {
            (response.data).should.have.property('token');
        });
    });
    describe('Failed cases', () => {
        describe('Missing parameter', () => {
            let response;
            before( async () => {
                let userData = {
                    fullName: 'Michno Michno',
                    password: 'Michno',
                };
                let data = await requester.post('/auth/register', userData);
                response = data.response;
            });
            it('Returns 401', () => {
                (response.status).should.equal(401);
            });
        });
        describe('Email taken', () => {
            let response;
            before( async () => {
                let userData = {
                    email: 'michno@michno.pl',
                    fullName: 'Michno Michno',
                    password: 'michno',
                };
                let data = await requester.post('/auth/register', userData);
                response = data.response;
            });
            it('Should return 401', () => {
                (response.status).should.equal(401);
            });
        });
    });
});
