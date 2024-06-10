import event from '../models/eventModel.js'
import Club from '../models/clubsModel.js'
import AppError from "../utils/errorUtil.js";
import cloudinary from 'cloudinary'
import fs from 'fs'

const createEvent = async (req,res,next) => {
    try {
        const {clubId} = req.params
        const {eventName,tagline,description} = req.body

        if(!clubId || !eventName || !description || !tagline){
            return next(new AppError('all fields are required',500))
        }

        const newEvent = await event.create({
            eventName,
            tagline,
            description,
            clubId
        })

        if(!newEvent){
            return next(new AppError('error in creating new event',500))
        }

        if(req.file){
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms'
            })
          
            if(result){
              newEvent.thumbnail.public_id = result.public_id;
              newEvent.thumbnail.secure_url = result.secure_url;
            }
          //  fs.rm(`../uploads/${req.file.filename}`)
        }

        // update event array in club
        await Club.findByIdAndUpdate(
            clubId,
            {$push :{eventId: newEvent._id}}
        )

        await newEvent.save()

        res.status(200).json({
            success: true ,
            message: 'new event created',
            newEvent
        })

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

const getAllEventsByClubID = async (req,res,next) => {
    try {
        const {clubId} = req.params

        if(!clubId){
            return next(new AppError('clubId is required',500))
        }

        const club = await Club.findById(clubId)
        
        if(!club){
            return next(new AppError('error in fetching events',500))
        }

        const events =  await Promise.all(club.eventId.map( e =>  event.findById(e))) 

        res.status(200).json({
            success: true ,
            message: 'fetched all events',
            events
        })

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

const deleteEvent = async (req,res,next) => {
    try {
        const {eventId,clubId} = req.params

        if(!eventId || !clubId){
            return next(new AppError('all fields are required',500))
        }

        await Club.findByIdAndUpdate(clubId,{$pull: {eventId: eventId}}) 

        await event.findByIdAndDelete(eventId)

        res.status(200).json({
            success: true ,
            message: 'event deleted !'
        })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

const getAllEvents = async (req,res,next) => {
    try {
        const events = await  event.find({})

        res.status(200).json({
            success:true,
            message: "All events.",
            events
        });

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

const getEventById = async (req,res,next) => {
    try {
        const {id} = req.params

        if(!id){
            return next(new AppError(500,
            'ID is required'))
        }

        const eventFromDB = await event.findById(id)

        if(!eventFromDB){
            return next(new AppError(500,'Event does not exist'))
        }

        res.status(200).json({
            success: true ,
            message: 'event found',
            eventFromDB
        })
    } catch (error) {
        return next(new AppError(500,error.message))
    }
}

export {createEvent,getAllEventsByClubID,deleteEvent,getAllEvents,getEventById}
