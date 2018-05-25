const mocha = require('mocha');
const chai = require('chai');
chai.should();

var requester = require('../../helper/requester');

describe("LOGIN INTEGRATION TESTS", () => {
    describe("Successful attempt", () => {
        var response;
        before( async () => {
            let userData = {
                email: "michno@michno.pl",
                password: "michno"
            };
            response = await requester.post('/auth/login', userData);
        });
        it("Should return 200", () => {
            response.status.should.equal
        });
        it("Should return jwt", () => {

        });
        it("jwt should contain id", () => {

        });
        it("jwt should contain fullName", () => {

        });
    });
    describe("Failed cases", () => {

    });
});