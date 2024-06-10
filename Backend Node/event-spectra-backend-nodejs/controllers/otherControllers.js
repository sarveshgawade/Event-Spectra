import AppError from "../utils/errorUtil.js"
import contact from "../models/contactModel.js"

const contactUs = async (req,res,next) => {
    try {
        const {name, email, message} = req.body

        if(!name || !email || !message){
            return next(new AppError(500,`All fields are required`))
        }

        const newSuggestion = await contact.create({
            name, email, message
        })

        if(!newSuggestion){
            return next(new AppError(500,`Error in submitting suggestion ...`))
        }

        await newSuggestion.save()

        res.status(200).json({
            success: true ,
            message: 'Message submitted successfully',
            newSuggestion
        })



    } catch (error) {
        return res.status(500).json({
            success: false ,
            message: error.message
        })
    }
}

export {contactUs}