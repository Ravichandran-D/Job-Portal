# 🚀 Job Portal - Backend (Server)

This directory contains the backend application for the Job Portal, built with Node.js and Express.js. It provides the RESTful API that the frontend consumes, manages the database, and handles business logic like user authentication and data processing.

## ✨ Features

*   **RESTful API**: A complete set of endpoints for managing jobs, companies, users, and applications.
*   **Recruiter Authentication**: Secure authentication for recruiters using JSON Web Tokens (JWT).
*   **User Data Synchronization**: Real-time user data sync from Clerk Auth using webhooks, verified by Svix.
*   **File Uploads**: Handles multipart/form-data for resume (PDF) and company logo (image) uploads, with cloud storage via Cloudinary.
*   **Error & Performance Monitoring**: Integrated with Sentry for real-time error tracking and performance analysis.
*   **Database Management**: Uses Mongoose for object data modeling with MongoDB.

## 🛠️ Tech Stack

*   **Node.js**: JavaScript runtime for the server.
*   **Express.js**: Web application framework for building the API.
*   **MongoDB**: NoSQL database for data storage.
*   **Mongoose**: ODM library for MongoDB.
*   **JSON Web Token (JWT)**: For secure recruiter authentication.
*   **Bcrypt**: For hashing passwords.
*   **Multer**: Middleware for handling file uploads.
*   **Cloudinary**: For cloud-based image and file storage.
*   **Svix**: For verifying Clerk webhooks.
*   **Clerk Express**: Middleware for Clerk authentication.
*   **Sentry**: For error monitoring.
*   **dotenv**: For managing environment variables.
*   **CORS**: To enable cross-origin requests from the frontend.
*   **Nodemon**: For automatic server restarts during development.

## 📂 Folder Structure

The backend application is structured as follows:

```
server/
├── config/         # Configuration files (DB connection, Cloudinary, Multer, Sentry)
├── controllers/    # Business logic for API endpoints
├── middlewares/    # Custom Express middleware (e.g., JWT protection, Clerk auth)
├── models/         # Mongoose schemas for MongoDB collections
├── routes/         # API routes definitions
├── utils/          # Utility functions (e.g., token generation)
├── .env            # Environment variables for the server
├── server.js       # Main Express server entry point
└── package.json    # Backend dependencies and scripts
```

## 📦 Installation and Setup

Follow these steps to get the backend server running locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (or yarn)
*   MongoDB Atlas Account
*   Cloudinary Account
*   Clerk Account
*   Sentry Account

### Setup Steps

1.  **Navigate to Server Directory**:
    From the project root, navigate to the `server` directory.
    ```bash
    cd server
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables Configuration**:
    Create a `.env` file in the `server` directory and add the variables listed in the table below.

4.  **Run the Backend Server**:
    ```bash
    npm run server
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:5000`).

## 🔑 Environment Variables

| Variable Name             | Description                                          | Example Value                    |
| :------------------------ | :--------------------------------------------------- | :------------------------------- |
| `PORT`                    | Port number for the backend server.                  | `5000`                           |
| `MONGODB_URI`             | MongoDB Atlas connection string.                     | `mongodb+srv://user:password@cluster.mongodb.net/` |
| `JWT_SECRET`              | Secret key used for signing JWTs for recruiter authentication. | `devassecret`                    |
| `CLOUDINARY_API_KEY`      | Cloudinary API Key.                                  | `1234567890abcdefghij`           |
| `CLOUDINARY_API_SECRET`   | Cloudinary API Secret.                               | `secret_abcdefghijklmnop`        |
| `CLOUDINARY_CLOUD_NAME`   | Your Cloudinary Cloud Name.                          | `your_cloud_name`                |
| `CLERK_WEBHOOK_SECRET`    | Signing secret for Clerk webhooks.                   | `whsec_abcdefghijklmnop`         |
| `CLERK_PUBLISHABLE_KEY`   | Your Clerk application's publishable key.            | `pk_test_aWQ...`                 |
| `CLERK_SECRET_KEY`        | Your Clerk application's secret key.                 | `sk_test_aWQ...`                 |

## 🔗 API Documentation

Below are the key API endpoints available in the application:

### Public Routes (Job Search)

*   **`GET /api/jobs`**
    *   **Description**: Retrieves all job listings that are currently visible (public).
    *   **Authentication**: None required.
    *   **Response**: Array of job objects, populated with basic company details (excluding password).

*   **`GET /api/jobs/:id`**
    *   **Description**: Retrieves details for a single job post by its unique ID.
    *   **Authentication**: None required.
    *   **Parameters**: `id` (Job ID) in the URL path.
    *   **Response**: A single job object, populated with basic company details.

### Company/Recruiter Routes (Protected)

These routes require a JWT token in the `Authorization` header (`Bearer <token>`).

*   **`POST /api/company/register`**
    *   **Description**: Registers a new company account.
    *   **Authentication**: None required.
    *   **Request Body (multipart/form-data)**: `name`, `email`, `password`, `image` (company logo file).
    *   **Response**: Success status, company data, and an authentication token.

*   **`POST /api/company/login`**
    *   **Description**: Authenticates a company and provides a JWT token.
    *   **Authentication**: None required.
    *   **Request Body (JSON)**: `email`, `password`.
    *   **Response**: Success status, company data, and an authentication token.

*   **`GET /api/company/company`**
    *   **Description**: Retrieves the authenticated company's data.
    *   **Authentication**: Required (JWT token).
    *   **Response**: Success status and company details.

*   **`POST /api/company/postjob`**
    *   **Description**: Allows an authenticated company to post a new job listing.
    *   **Authentication**: Required (JWT token).
    *   **Request Body (JSON)**: `title`, `description`, `location`, `salary`, `category`, `level`.
    *   **Response**: Success status and the newly created job object.

*   **`GET /api/company/listjobs`**
    *   **Description**: Retrieves all job listings posted by the authenticated company, including applicant counts.
    *   **Authentication**: Required (JWT token).
    *   **Response**: Array of job objects posted by the company, with `applicants` count.

*   **`POST /api/company/changestatus`**
    *   **Description**: Changes the status of a job application (e.g., from pending to accepted/rejected).
    *   **Authentication**: Required (JWT token).
    *   **Request Body (JSON)**: `id` (Job Application ID), `status` (new status, e.g., "accepted", "rejected").
    *   **Response**: Success status and a confirmation message.

*   **`POST /api/company/changevisibility`**
    *   **Description**: Toggles the visibility status of a specific job post.
    *   **Authentication**: Required (JWT token).
    *   **Request Body (JSON)**: `id` (Job ID).
    *   **Response**: Success status and the updated job object with new visibility status.

*   **`GET /api/company/applicants`**
    *   **Description**: Retrieves all job applications for all jobs posted by the authenticated company.
    *   **Authentication**: Required (JWT token).
    *   **Response**: Array of job application objects, populated with user and job details.

### User Routes (Protected by Clerk)

These routes require a Clerk-generated token in the `Authorization` header (`Bearer <token>`).

*   **`GET /api/users/user`**: Retrieves the authenticated user's data.
*   **`POST /api/users/apply`**: Allows an authenticated user to apply for a job.
*   **`GET /api/users/applications`**: Retrieves all job applications made by the user.
*   **`POST /api/users/updateresume`**: Uploads or updates the user's resume.

### Webhook

*   **`POST /webhooks/clerk`**
    *   **Description**: Endpoint for Clerk webhooks to synchronize user data. Verified by Svix.