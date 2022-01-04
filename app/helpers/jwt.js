const jwt = require('jsonwebtoken');

const verifyJWT = async (token) => {
    return jwt.verify(token, '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');
};

const decodeJWT = async (token) => {
    return jwt.decode(token);
};

module.exports = {
    verifyJWT,
    decodeJWT
};