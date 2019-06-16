const Redis = require('ioredis');
let redis;

const connect = (env) => {
  let redisUrl = env === 'dev' ? 'redis' : "localhost";
  redis = new Redis(6379, redisUrl);
};

const get = async (key) => {
  redis.get(key, (err, result) => {
    if(err) return {error};
    else return {result};
  });
};

const set = (key, value) => {
  redis.set(key, value);
};

const del = (key) => {
  redis.del(key);
};

module.exports = {
  connect,
  get,
  set,
  del,
};