# 🚀 Job Portal - Frontend (Client)

This directory contains the frontend application for the Job Portal, built with React.js and Vite. It provides the user interface for both job seekers and recruiters, interacting with the backend server to deliver a seamless experience.

## ✨ Features

*   **User Features**:
    *   **Job Search**: Search for job openings with filters for categories and location.
    *   **Job Application**: Apply for open positions directly through the platform.
    *   **Authentication & Profile Management**: Secure sign-in, sign-up, and profile updates powered by **Clerk Auth**.
    *   **Applied Jobs**: A dedicated page for users to track the status of their job applications (pending, accepted, rejected).
    *   **Resume Management**: Upload and manage PDF resumes.

*   **Recruiter Features (UI)**:
    *   **Recruiter Dashboard**: A complete UI for recruiters to manage job postings and applications.
    *   **Job Posting**: A rich-text editor powered by Quill for creating detailed job posts.
    *   **Job Management**: Interface to control job visibility.
    *   **Application Management**: View and manage job applications.

## 🛠️ Tech Stack

*   **React.js**: For building dynamic and interactive user interfaces.
*   **Vite**: For a fast and modern development experience.
*   **Tailwind CSS**: For utility-first CSS styling and responsive design.
*   **React Router DOM**: For client-side routing and navigation.
*   **Clerk React**: For integrating Clerk's pre-built authentication and user management components.
*   **Axios**: For making HTTP requests to the backend API.
*   **React Toastify**: For displaying user-friendly toast notifications.
*   **Quill**: A rich text editor for creating detailed job descriptions.
*   **Moment.js**: For displaying human-readable timestamps.
*   **K-Converter**: For formatting large numbers (e.g., salary).

## 📂 Folder Structure

The frontend application follows a standard React project structure:

```
client/
├── public/                 # Static assets for the application
├── src/
│   ├── assets/             # Images, icons, and other static resources
│   ├── components/         # Reusable React components (e.g., Navbar, JobCard, Hero)
│   ├── context/            # React Context for global state management
│   ├── pages/              # Main application pages (e.g., Home, AppliedJobs, ApplyJob)
│   ├── App.jsx             # Main application component, handles routing
│   ├── index.css           # Global CSS styles
│   └── main.jsx            # The entry point for the React application
```

## �� Installation and Setup

Follow these steps to get the frontend application running locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (or yarn)
*   Git

### Setup Steps

1.  **Clone the Repository**:
    If you haven't already, clone the main project repository.
    ```bash
    git clone <your-repository-url>
    cd job-portal # or your project's root directory name
    ```

2.  **Navigate to Frontend Directory**:
    ```bash
    cd client
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Environment Variables Configuration**:
    Create a `.env` file in the `client` directory and add the following variables. You'll need to get the values from your Clerk Dashboard and your backend server's URL.

    ```env
    VITE_BACKEND_URL=http://localhost:5000
    VITE_CLERK_PUBLISHABLE_KEY=<Your_Clerk_Publishable_Key>
    ```

5.  **Run the Frontend Application**:
    ```bash
    npm run dev
    ```
    The React application will start, and you can access it at `http://localhost:5173/`.

## 🔑 Environment Variables

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | URL of the backend server. | `http://localhost:5000` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Your Clerk application's publishable key. | `pk_test_aWQ...` |

## ❗ Important Note

This frontend application is part of a full-stack project. For all features to work correctly, the **backend server must be running**. Please refer to the `README.md` in the project's root directory for instructions on how to set up and run the backend server.