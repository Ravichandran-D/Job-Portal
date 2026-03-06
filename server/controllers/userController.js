 
import express from "express";
import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import { v2 } from "cloudinary";

// Get user Data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;

  console.log("User ID from request:", userId);
  console.log("Auth object:", req.auth);

  try {
    let user = await User.findById(userId);

    console.log("User found:", user);

    if (!user) {
      console.log("User not found in database, creating user on-demand");

      // Create user on-demand using available Clerk data
      const userData = {
        _id: userId,
        email: req.auth.emailAddress || "",
        name: req.auth.firstName ? `${req.auth.firstName} ${req.auth.lastName || ""}`.trim() : "",
        image: req.auth.imageUrl || "",
        resume: "",
      };

      user = await User.create(userData);
      console.log("User created on-demand:", user);
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Apply For a Job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;

  console.log("Apply for job - User ID:", userId);

  try {
    // Ensure user exists in database before applying
    let user = await User.findById(userId);

    if (!user) {
      console.log("User not found, creating on-demand for job application");

      // Create user on-demand using available Clerk data
      const userData = {
        _id: userId,
        email: req.auth.emailAddress || "",
        name: req.auth.firstName ? `${req.auth.firstName} ${req.auth.lastName || ""}`.trim() : "",
        image: req.auth.imageUrl || "",
        resume: "",
      };

      user = await User.create(userData);
      console.log("User created on-demand for job application:", user);
    }

    // Check if user has uploaded resume
    if (!user.resume) {
      console.log("User has not uploaded resume");
      return res.json({
        success: false,
        message: "Please upload a resume before applying",
      });
    }

    const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });

    if (isAlreadyApplied) {
      return res.json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    console.log("Apply error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get User applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location level salary")
      .exec();

    if (!applications) {
      return res.json({
        success: false,
        message: "No applications found for this User",
      });
    }

    return res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update User Profile (resume)
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;

    console.log("Resume file:", resumeFile);

    const userData = await User.findById(userId);

    if (resumeFile) {
    const resumeUpload = await v2.uploader.upload(resumeFile.path);

      userData.resume = resumeUpload.secure_url;
    }
    await userData.save();

    return res.json({ success: true, message: "Resume Updated Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};