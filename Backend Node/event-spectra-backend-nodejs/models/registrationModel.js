import mongoose, { model } from "mongoose";

const registrationSchema = new mongoose.Schema({
    eventId:[{
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'event'
    }],
    isRegistered: {
        type: Boolean,
        enum: ['true','false'],
        default: 'false'
    },
    prn:{
        type:String,
        maxLength: [10,'Length should be of 10 characters'],
        minLength: [10,'Length should be of 10 characters'],
        required:true
    },
    department:{
        type:String,
        required: true
    },
    year:{
        type:String,
        required: true
    },
    fullName:{
        type:'String',
        required: true
    },
    email:{
        type: String,
        required: true
    }

},{timestamps:true})

const registration = model('Registration',registrationSchema)

export default registration