# User Management and Post CRUD API

## Project Overview

This project provides a fully functional User Management and Post CRUD API system. It includes user registration,
authentication (including Google OAuth), and role-based access control for managing users and posts. The API supports
image uploads and features pagination and filtering for post retrieval.

## Features

1. **User Management**
    - User Registration
    - User Login (Email/Password & Google OAuth)
    - Profile Update with Image Upload
    - Role-based Access Control (User/Admin)
2. **Post Management**
    - Create, Read, Update, and Delete Posts
    - Pagination and Filtering Options
3. **Authentication**
    - JSON Web Token (JWT)-based secure authentication
4. **Google OAuth Integration**
5. **Docker Support**

## Technologies Used

- **Node.js**
- **Express.js** (Framework)
- **Mongoose** (MongoDB ODM)
- **Multer** (Image Uploads)
- **JSON Web Token (JWT)** (Authentication)
- **Passport.js** (Google OAuth 2.0)
- **Bcrypt.js** (Password Hashing)
- **Docker** (Containerization)

## How to Run the Project

### 1. Running Locally

#### Steps:

1. **Set up environment variables:**
    - Create a `.env` file in the root directory.
    - Copy the contents of `.env.sample` into `.env`.
    - Register an OAuth client on [Google Cloud Console](https://console.cloud.google.com/) with the redirect URL:
      ```
      http://localhost:8000/api/auth/google/callback
      ```
    - Copy the `client_id` and `client_secret` values into the `.env` file.
2. **Install dependencies:**
   ```bash
   yarn install # or npm install
   ```
3. **Start the server:**
   ```bash
   yarn run dev # or yarn start or npm run dev or npm start
   ```
4. The project will run at `http://localhost:8000`.

### 2. Running with Docker

#### Steps:

1. **Set up environment variables:**
    - Create a `.env.docker` file in the root directory.
    - Copy the contents of `.env.docker.sample` into `.env.docker`.
    - Follow the same steps for Google authentication as above.
2. **Start the project with Docker Compose:**
   ```bash
   docker compose up
   ```
3. The project will run at `http://localhost:8000` with MongoDB in Docker.

## API Documentation

### Authentication Endpoints

- **Google Login:**
    - `GET /api/auth/google`
        - Redirects to Google login.
    - `GET /api/auth/google/callback`
        - Callback URL for Google OAuth.

- **Email Login:**
    - `POST /api/auth/login`
      ```json
      {
        "email": "example@example.com",
        "password": "password123"
      }
      ```

- **Register:**
    - `POST /api/auth/register`
      ```multipart
      name: John Doe
      email: john@example.com
      password: password123
      profile_image: (File Upload)
      ```

- **Get Logged-in User Details:**
    - `GET /api/auth/user`
        - Requires Bearer Token in the Authorization header.

- **Update User Profile:**
    - `PUT /api/auth/user`
      ```json
      {
        "name": "New Name",
        "profile_image": (File Upload)
      }
      ```
    - Only admin can update user profile

- **Delete User Profile:**
    - `DELETE /api/auth/user`
    - Only admin can delete user

### Post Management Endpoints

- **Create Post:**
    - `POST /api/posts`
      ```json
      {
        "title": "My Post",
        "description": "This is a test post."
      }
      ```

- **Get Post by ID:**
    - `GET /api/posts/:id`

- **Update Post:**
    - `PUT /api/posts/:id`
      ```json
      {
        "title": "Updated Title",
        "description": "Updated description."
      }
      ```
    - Only admin can update post

- **Delete Post:**
    - `DELETE /api/posts/:id`
    - Only admin can delete post

- **Get Posts by User ID:**
    - `GET /api/posts/user/:userId`

- **Get Posts with Pagination & Filtering:**
    - `GET /api/posts?page=2&limit=10&status=Pending&startDate=2024-01-01`
    - Posts can be filter by their title also. `GET /api/posts?title=new_post`

## Models

### User Model

```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profile_image: {type: String, default: 'https://example.com/default.jpg'},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('User', UserSchema);
```

### Post Model

```javascript
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, enum: ['Pending', 'Approved'], default: 'Pending'},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model('Post', PostSchema);
```

## Role-Based Access Control

- **Admin:**
    - Can manage all users and posts.
- **User:**
    - Can manage their own data and posts.

## Additional Features

- **Docker Integration:**
    - Runs the project and MongoDB in a containerized environment.
- **Error Handling:**
    - Comprehensive error messages for validation, authentication, and authorization failures.

## Conclusion

This project implements a robust user and post management system with modern web development practices and tools. It is
extensible and ready for production deployment.
