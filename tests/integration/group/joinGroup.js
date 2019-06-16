const randomString = require('randomstring');
const request = require('supertest');
const server = require('../../../src/config/www');
const { generateToken, generateGroup } = require('../../helper/object-generator');

describe('JOIN GROUP', () => {
  let token, group;
  beforeEach(async () => {
    token = await generateToken();
    group = await generateGroup();
  });

  describe("Failed actions" , () => {
    it("Sends no groupName", () => {
      const userCase = {};
      request(server)
      .post('/group/join')
      .send(userCase)
      .set('Accept', 'application/json')
      .set("x-token", token)
      .expect(401);
    });
    it("Group with given name does not exist", () => {
      const userCase = {
        groupName: 'testingFailure',
      };
      request(server)
      .post('/group/join')
      .send(userCase)
      .set('Accept', 'application/json')
      .set('x-token', token)
      .expect(401);
    });
  });

  describe("Successful actions", () => {
    it("Returns 200", () => {
      const userCase = {
        groupName: group.groupName,
      };
      request(server)
      .post('/group/join')
      .send(userCase)
      .set('Accept', 'application/json')
      .set('x-token', token)
      .expect(200);
    });
  })
});