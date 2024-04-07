const mongoose = require('mongoose')


const loginSchema = new mongoose.Schema({
   

    userid: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    secretKey: {
        type: String,
        required: true
    },
})

loginSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

loginSchema.set('toJSON', {
    virtuals: true
})

exports.Login = mongoose.model('Login', loginSchema)
exports.loginSchema = loginSchema