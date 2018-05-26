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
            (response.status).should.equal(200);
        });
        it("Should return jwt", () => {
            (response.data).should.have.property('token');
        });
    });
    describe("Failed cases", () => {
        describe("No email sent", async () => {
            var response;
            before( async () => {
                let userData = {
                    password: "michno"
                };
                var data = await requester.post('/auth/login', userData); 
                response = data.response;   
            });
            it("Should return 401", () => {
                (response.status).should.equal(401);
            });
        });
        describe("No password sent", async () => {
            var response;
            before( async () => {
                let userData = {
                    email: "marcin@michno.pl"
                };
                var data = await requester.post('/auth/login', userData); 
                response = data.response;
            });
            it("Should return 401", () => {
                (response.status).should.equal(401);
            });
        });
        describe("No user with that email", async () => {
            var response;
            before( async () => {
                let userData = {
                    email: "marcin@michnov2.pl",
                    password: "michno123"
                };
                var data = await requester.post('/auth/login', userData); 
                response = data.response;
            });
            it("Should return 401", () => {
                (response.status).should.equal(401);
            });
        });
        describe("Wrong password", async () => {
            var response;
            before( async () => {
                let userData = {
                    email: "marcin@michno.pl",
                    password: "michno123"
                };
                var data = await requester.post('/auth/login', userData); 
                response = data.response;
            });
            it("Should return 401", () => {
                (response.status).should.equal(401);
            });
        })
    });
});