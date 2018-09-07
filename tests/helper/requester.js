const request = require('supertest');
const server = require('../../src/config/www');
let post = async (endpoint, data) => {
    return request(server)
            .post(endpoint)
            .send(data)
            .set('Accept', 'application/json')
};

let get = async (endpoint, data) => {
    return request(server)
            .get(endpoint)
            .send(data)
            .set('Accept', 'application/json')
};

module.exports = {
    post,
    get,
};
