 import express from "express";
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from "../controllers/userController.js";
import upload from "../config/multer.js";
import { protectUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get User Data
router.get("/user", protectUser, getUserData)

// Apply for a Job
router.post("/apply", protectUser, applyForJob)

// Get applied jobs data
router.get("/applications", protectUser, getUserJobApplications)

// Update the resume
router.post('/update-resume', protectUser, upload.single("resume"), updateUserResume)


export default router;