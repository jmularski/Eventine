const expect = require('chai').expect;

const request = require('supertest');
const server = require('../../../src/config/www');

const { generateFakeSocialToken } = require('../../helper/object-generator');

describe("SOCIAL INTEGRATION TESTS", () => {
    describe("Successful attempt", () => {
        const userData = {
            facebookId: generateFakeSocialToken(),
            fullName: "Test Test"
        };
        it("Returns 200.", () => {
            request(server)
            .post('/auth/social')
            .send(userData)
            .set('Accept', 'application/json')
            .expect(200);
        });
    })
    describe("Unsuccessful attempts", () => {
        describe("Has no token", () => {
            const userData = {
                fullName: "Test Test"
            };
            it("Should return 401", () => {
                request(server)
                .post('/auth/social')
                .send(userData)
                .set('Accept', 'application/json')
                .expect(401);
            })
        });
        describe("Has no fullName", () => {
            const userData = {
                facebookId: generateFakeSocialToken(),
            }
            it("Should return 401", () => {
                request(server)
                .post('/auth/social')
                .send(userData)
                .set('Accept', 'application/json')
                .expect(401);
            });
        });
    })
});