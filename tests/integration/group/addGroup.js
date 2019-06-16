const randomString = require('randomstring');
const request = require('supertest');
const server = require('../../../src/config/www');
const { generateToken } = require('../../helper/object-generator');

describe('ADD GROUP INTEGRATION TESTS', () => {
  let token;
  beforeEach(async () => {
    token = await generateToken();
  });
  describe("Failed attempts", () => {
    it("Fails without token", () => {
      const userCase = {
        groupName: randomString.generate(),
      };
      request(server)
      .post('/group/create')
      .send(userCase)
      .set('Accept', 'application/json')
      .expect(401);
    });
    it("Fails without groupName", () => {
      request(server)
      .post('/group/create')
      .send({})
      .set('Accept', 'application/json')
      .set("x-token", token)
      .expect(401);
    });
  });
  describe("Successful attempts", () => {
    it("Returns 200 with all data", () => {
      const userCase = {
        groupName: randomString.generate(),
      };
      request(server)
      .post('/group/create')
      .send(userCase)
      .set('Accept', 'application/json')
      .set("x-token", token)
      .expect(200);
    });
  });
})