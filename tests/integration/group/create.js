const expect = require('chai').expect;

const request = require('supertest');
const server = require('../../../src/config/www');

const { generateToken } = require('../../helper/object-generator');
    
describe('GROUP CREATION INTEGRATION TESTS', () => {
    var token;
    before( async () => {
        token = await generateToken();
        console.log(token);
    })
    it('Successful creation with group name and token', () => {
        request(server)
        .post('/group/create')
        .send({groupName: "Test group!"})
        .set('X-Token', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.be.an.string();
        });
    });
    it('Failed creation without group name', () => {
        request(server)
        .post('/group/create')
        .send()
        .set('X-Token', token)
        .set('Accept', 'application/json')
        .expect(401)
        .end((err, res) => {
            expect(res.body).to.be.an.string();
        });
    })
    it('Failed creation without token', () => {
        request(server)
        .post('/group/create')
        .send({groupName: "Test group!"})
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.be.an.string();
        });
    })
})