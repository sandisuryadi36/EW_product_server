const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be at most 50 characters long'],
        required: [true, 'Name is required']
    },
    userName: {
        type: String,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [16, 'Username must be at most 16 characters long'],
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        maxlength: [255, 'Email must be at most 255 characters long'],
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [255, 'Password must be at most 255 characters long'],
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    customer_id: {
        type: Number
    },
    token: [String]
}, { timestamps: true })

// validate email
userSchema.path('email').validate((value) => { 
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
}, attr => `${attr.value} is not a valid email`)

// validate if email exists
userSchema.path('email').validate(async function(value) { 
    try {
        const user = await this.model('User').findOne({ email: value })
        if (user) {
            return false
        }
        return true
    } catch (error) { 
        return false
    }
}, attr => `${attr.value} is already in use`)

// validate if userName exists
userSchema.path('userName').validate(async function(value) { 
    try {
        const user = await this.model('User').findOne({ userName: value })
        if (user) {
            return false
        }
        return true
    } catch (error) { 
        return false
    }
}, attr => `${attr.value} is already in use`)

// hash password before saving
userSchema.pre('save', async function (next) { 
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10)
        }
        next()
    } catch (error) { 
        next(error)
    }
})
// hash password before updating
userSchema.pre('findOneAndUpdate', async function (next) { 
    try {
        if (this.getUpdate().password) {
            this.getUpdate().password = await bcrypt.hash(this.getUpdate().password, 10)
        }
        next()
    } catch (error) { 
        next(error)
    }
})

// auto increment customer id
userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' })

module.exports = mongoose.model('User', userSchema)