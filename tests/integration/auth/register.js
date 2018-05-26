const mocha = require('mocha');
const chai = require('chai');
chai.should();

var randomString = require('randomstring');

var mongoose = require('mongoose');
var User = require('../../../models/user');

var requester = require('../../helper/requester');

function generateRandomEmail(){
    return `${randomString.generate(6)}@michno.pl`;
};

describe("REGISTER INTEGRATION TESTS", () => {
    describe("Successful attempt", () => {
        var response, userData;
        before( async () => {
            userData = {
                email: generateRandomEmail(),
                fullName: "Michno Michno",
                password: "michno"
            };
            response = await requester.post('/auth/register', userData);
        });
        it("Should return 200", () => {
            (response.status).should.equal(200);
        });
        it("Should return jwt", () => {
            (response.data).should.have.property('token');
        });
    });
    describe("Failed cases", () => {
        describe("Missing parameter", () => {
            var response;
            before( async () => {
                let userData = {
                    fullName: "Michno Michno",
                    password: "Michno"
                };
                var data = await requester.post('/auth/register', userData);
                response = data.response;
            });
            it("Returns 401", () => {
                (response.status).should.equal(401);
            });
        });
        describe("Email taken", () => {
            var response;
            before( async () => {
                let userData = {
                    email: "michno@michno.pl",
                    fullName: "Michno Michno",
                    password: "michno"
                };
                var data = await requester.post('/auth/register', userData);
                response = data.response;
            });
            it("Should return 401", () => {
                (response.status).should.equal(401);
            })
        });
    });
});