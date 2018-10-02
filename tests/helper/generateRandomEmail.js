const randomString = require('randomstring');
module.exports = () => {
    return `${randomString.generate(6)}@michno.pl`;
}