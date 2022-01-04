const jwt = require('jsonwebtoken');

const verifyJWT = async (token) => {
    return jwt.verify(token, '');
};

const decodeJWT = async (token) => {
    return jwt.decode(token);
};

module.exports = {
    verifyJWT,
    decodeJWT
};