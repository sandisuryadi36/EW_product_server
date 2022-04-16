const User = require('../user/model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { getToken } = require('../../utils')

const register = async (req, res, next) => { 
    try {
        const user = await User.create(req.body)
        res.status(200).json({
            error: false,
            message: 'User successfully created',
            data: user
        })
    } catch (err) { 
        if (err && err.name === "ValidationError") { 
            return res.status(400).json({
                error: true,
                message: err.message,
                fields: err.errors
            })
        }
        next(err);
    }
}

const localStrategy = async (email, password, done) => { 
    try {
        const user = await User
            .findOne({ email })
            .select('-__v, -createdAt, -updatedAt, -token')
        if (!user) return done()
        if (bcrypt.compareSync(password, user.password)) {
            ({ password, ...userWithoutPassword } = user.toJSON())
            return done(null, userWithoutPassword)
        }
    } catch (err) { 
        return done(err, null)
    }
    done()
}

const login = (req, res, next) => { 
    passport.authenticate('local', async function(err, user) {
        if (err) return next(err)
        if (!user) return res.status(401).json({
            error: true,
            message: "Email or Password is incorrect"
        })
        const token = jwt.sign( user , config.secretKey)
        await User.findByIdAndUpdate(user._id, { $push: {token} })
        res.status(200).json({
            error: false,
            message: 'User successfully logged in',
            data: {
                user,
                token
            }
        })
    })(req, res, next)
}

const logout = async (req, res, next) => { 
    const token = getToken(req)
    let user = await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { useFindAndModify: false })
    
    if (!token || !user) {
        return res.status(401).json({
            error: true,
            message: 'User is not logged in or token is invalid'
        })
    }

    return res.status(200).json({
        error: false,
        message: 'User successfully logged out'
    })
}

const me = (req, res, next) => { 
    if (!req.user) {
        res.status(401).json({
            error: true,
            message: 'User is not logged in or token is invalid'
        })
    }

    res.status(200).json({
        error: false,
        user: req.user
    })
}

module.exports = {
    register,
    localStrategy,
    login,
    logout,
    me
}