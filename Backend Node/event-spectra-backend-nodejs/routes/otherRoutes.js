import { Router } from "express";
import { contactUs } from "../controllers/otherControllers.js";

const router = Router()

router.post('/contact',contactUs)



export default router