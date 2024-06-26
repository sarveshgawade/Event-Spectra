import mongoose, { model } from 'mongoose'
import bcrypt from 'bcrypt'
import jwtToken from 'jsonwebtoken'
import { config } from 'dotenv'
config()
import crypto from 'crypto'


const userSchema = new mongoose.Schema({
    fullName:{
        type:'String',
        required: [true,`Name is a required field`] ,
        trim: true ,

    },
    email:{
        type:'String',
        required: [true,`Email is a required field`] ,
        trim: true ,
        unique: true ,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address'
          ] 

    },
    password:{
        type:'String',
        required: [true,`Password is a required field`] ,
        trim: true ,
        select : false   ,
        minLength : [6,`Password must be atleast of 6 characters`]  


        // select: false => whenever a user requests data don't give password with the data by default, only give if it is explicitly required
    },
    avatar:{
        public_id :{ type: 'String'},
        secure_url :{ type: 'String'}
    },
    role:{
        type:'String',
        enum: ['USER','ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken:{
        type: 'String'
    },
    forgotPasswordExpiry :{
        type: 'Date'
    },
    subscription:{
        id: 'String',
        status: 'String'
    }

    /**
     * can also be declared as =>
     * 
     forgotPasswordToken : String,
     forgotPasswordExpiry: Date
     */
},{
    timestamps:true
})

// ENCRYPTING PASSWORD
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,7)
})


// JWT TOKEN GENERATION
userSchema.methods = {
    generateJWTtoken: async function(){
        return await jwtToken.sign(
            {id:this._id, email: this.email, subscription: this.subscription, role: this.role, fullName: this.fullName},
            process.env.SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    },
    comparePassword: async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password)
    },
    generatePasswordResetToken: async function(){
        const resetToken = crypto.randomBytes(20).toString('hex')

        this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

        // set expiry 15 mins from now
        this.forgotPasswordExpiry = Date.now() + (15*60*1000)

        return  resetToken
    },

}

const user = model('User',userSchema)

export default user