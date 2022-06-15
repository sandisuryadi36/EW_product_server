const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/user/model');
const { Ability, AbilityBuilder } = require('@casl/ability')


// jwt
function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
}

function decodeToken() {
    return async (req, res, next) => { 
        try {
            const token = getToken(req);
            if (!token) return next();

            req.user = jwt.verify(token, config.secretKey);
            let user = await User.findOne({ token: { $in: [token] } });
            if (!user) {
                return res.json({
                    error: true,
                    message: 'Token is invalid'
                });
            }
        } catch (err) { 
            if (err && err.name === 'JsonWebTokenError') {
                return res.json({
                    error: true,
                    message: err.message
                });
            }
            next(err);
        }
        return next();
    }
}

// policy
const policies = {
    guest(user, {can}) {
        can('read', 'Product');
    },
    user(user, { can }) {
        can('read', 'Order');
        can('create', 'Order');
        can('read', 'Order', { user_id: user._id });
        can('update', 'User', { user_id: user._id });
        can('read', 'Cart', { user_id: user._id });
        can('update', 'Cart', { user_id: user._id });
        can('delete', 'Cart', { user_id: user._id });
        can('read', 'DeliveryAddress', { user_id: user._id });
        can('create', 'DeliveryAddress', { user_id: user._id });
        can('update', 'DeliveryAddress', { user_id: user._id });
        can('delete', 'DeliveryAddress', { user_id: user._id });
        can('read', 'Invoice');
        can('read', 'Invoice', { user_id: user._id});
    },
    admin(user, {can}) { 
        can('manage', 'all');
    }
}

const policyFor = user => { 
    let builder = new AbilityBuilder();
    if (user && typeof policies[user.role] === 'function') {
        policies[user.role](user, builder);
    } else { 
        policies['guest'](user, builder);
    }
    return new Ability(builder.rules);
}

function policeCheck(action, subject) {
    return function(req, res, next) {
        let policy = policyFor(req.user);
        if (!policy.can(action, subject)) {
            return res.status(403).json({
                error: true,
                message: 'Forbidden! You are not authorized to perform this action.'
            });
        }
        return next();
    }
}



module.exports = {
    getToken,
    decodeToken,
    policeCheck
}