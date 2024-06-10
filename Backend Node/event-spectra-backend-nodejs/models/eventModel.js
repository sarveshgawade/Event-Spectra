import mongoose, { Mongoose, model } from "mongoose";

const eventSchema = new mongoose.Schema({
    // eventId:{
    //     type: String,
    //     required : [true,'EventId is required'],
    // },
    clubId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club' ,
        required : [true,'Club is required']
    },
    eventName:{
        type: String,
        required : [true,'EventName is required']
    },
    tagline:{
        type: String,
        required : [true,'Tagline is required'],
    },
    description:{
        type: String,
        required : [true,'Description is required'],
        minLength: [5,'minLength should be atleast 5 characters']
    },
    thumbnail: {
        public_id: {
          type: String,
        },
        secure_url: {
          type: String,
        },
    }
    
    
},{timestamps:true})

const event = model('Event',eventSchema)

export default event