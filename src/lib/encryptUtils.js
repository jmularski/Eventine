const bcrypt = require('bcrypt');

let compare = async (pass, passToCompare) => {
    if( !pass || !passToCompare) return false;
    return await bcrypt.compare(pass, passToCompare);
};

let encrypt = async (pass) => {
    return await bcrypt.hash(pass, 10);
};

module.exports = {
    compare,
    encrypt,
};
