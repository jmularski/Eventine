var request = require('axios');

var post = async (endpoint, data) => {
    try {
        let response = await request.post(`http://localhost:3000${endpoint}`, data);
        return response;
    } catch(err) {
        return err;
    }
};

var get = async (endpoint, data) => {
    try {
        let response = await request.get(endpoint, {params: data});
        return response;
    } catch(err) {
        return err;
    }
};

module.exports = {
    post,
    get
};