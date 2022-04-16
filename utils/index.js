const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/user/model');

function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

function decodeToken() {
    return async (req, res, next) => { 
        try {
            const token = getToken(req);
            if (!token) return next();

            req.user = jwt.verify(token, config.secretKey);
            let user = await User.findOne({ token: { $in: [token] } });
            if (!user) {
                return res.status(401).json({
                    error: true,
                    message: 'Token is invalid'
                });
            }
        } catch (err) { 
            if (err && err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    error: true,
                    message: err.message
                });
            }
            next(err);
        }
        return next();
    }
}

module.exports = {
    getToken,
    decodeToken
}