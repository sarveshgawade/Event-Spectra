import Company from "../models/companyModel.js";
import AppError from "../utils/errorUtil.js";
// import fs from 'fs'
import multer from 'multer'
 
import cloudinary from 'cloudinary'

const getAllCompany = async(req,res)=>{
    try {
        const company = await   Company.find({})
        if(!company){
            res.status(500).json({
                success: false,
                message: 'All fields are required !'
        })
    }
    
   
        res.status(200).json({
            success: true,
            message: 'All company found !',
            company
        })
}
catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    }) 
 }
} 

const createnewCompany = async(req,res,next)=>{
    try {
        const {companyName,sscEligibility,hscEligibility,enggEligibility,activeBacklogs,gapYears,description,jobRole,arrivalDate,tagline} = req.body

        // const {thumbnail} = req.file

        if(!companyName || !sscEligibility || !hscEligibility || !enggEligibility || !activeBacklogs || !gapYears || !description || !jobRole || !arrivalDate ||!tagline){
            return next(new AppError(400,'All fields are required'))
        }
    
        const existingCompany = await Company.findOne({companyName})
        if(existingCompany){
            return next(new AppError(400,'Company with given name already exists'))
        }

        const newCompany = await Company.create({
            companyName,
            tagline, 
            sscEligibility, 
            hscEligibility, 
            enggEligibility, 
            activeBacklogs, 
            gapYears, 
            description, 
            jobRole, 
            arrivalDate,
            thumbnail:{
                public_id:'Dummy',
                secure_url:'Dummy'
            }
    
        })

        if(!newCompany){
            return next(new AppError(400,'Error in creating company ! '))
        }
    
        if(req.file){
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms'
            })
          
            if(result){
                newCompany.thumbnail.public_id = result.public_id;
                newCompany.thumbnail.secure_url = result.secure_url;
            }
        //    fs.rm(`../uploads/${req.file.filename}`)
          }
    
        await newCompany.save()
        res.status(200).json({
            success: true,
            message: 'New Comapny Added Successfully!',
            newCompany
        })
    } catch (error) {
        return next(new AppError(400,error.message))
    }
}

const updateCompany = async (req,res) =>{
    try {
        const {id} = req.params

        const companyUpdated = await Company.findByIdAndUpdate(
            id,
            {
                // overwrite all the parameters provided in body by user
                $set: req.body
            }
            // ,
            // {
            //     // validates parameters through the courseModel.js file
            //     runValidators: true
            // }
        )

        if(!companyUpdated){
            res.status(500).json({
                success: false,
                message: 'Unable to find comapny with given id !'
        })
        }

        await companyUpdated.save()

        const getUpdatedCompany = await Company.findById(id)

        res.status(200).json({
            success: true,
            message: `company updated successfully !`,
            getUpdatedCompany
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
} 

const removeCompany = async (req,res) =>{
    const {id} = req.params

    const courseToBeDeleted = await Company.findById(id)

    if(!courseToBeDeleted){
        res.status(500).json({
            success: false,
            message: 'Unable to find comapny with given id!'
    })
    }

    await Company.findByIdAndDelete(id)

    res.status(200).json({
        success:true,
        message: `Company deleted successfully`,
    })

} 

export{getAllCompany,createnewCompany,removeCompany,updateCompany}