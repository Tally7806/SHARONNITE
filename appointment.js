const mongoose = require('mongoose')


const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
        
    },
    gender: {
        type: String,
        required: true
        
    },
    reason: {
        type: String,
        required: true
    }, 
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' },
})

appointmentSchema.virtual('computedDate').get(function(){
    return this._date.toHexString()
})

appointmentSchema.set('toJSON', {
    virtuals: true
})

exports.Appointment = mongoose.model('Appointment', appointmentSchema)
exports.appointmentSchema = appointmentSchema