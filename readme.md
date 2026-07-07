# 🎥 VideoTube Backend API

A scalable RESTful backend for a YouTube-like video sharing platform built with Node.js, Express.js, and MongoDB. It provides secure authentication, video management, subscriptions, playlists, comments, and user profile APIs.

## 🚀 Features

- JWT Authentication (Access & Refresh Tokens)
- User Registration & Login
- Secure Password Hashing using bcrypt
- Video Upload API
- Thumbnail Upload
- Cloudinary Integration
- Create, Update & Delete Videos
- Like & Unlike Videos
- Comment System
- Playlist Management
- Channel Subscription
- Watch History
- User Profile Management
- Refresh Token Authentication
- RESTful APIs
- MongoDB Database

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Cloudinary
- Cookie Parser
- CORS

---

## Folder Structure

```
src/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── db/
├── utils/
├── constants.js
├── app.js
└── index.js
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/videotube-backend.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=8000

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ORIGIN=http://localhost:5173
```

Run the server

```bash
npm run dev
```

---

## API Modules

- Authentication
- Users
- Videos
- Comments
- Likes
- Playlists
- Subscriptions
- Dashboard

---

## Future Enhancements

- Video Streaming
- Notifications
- Live Streaming
- Video Recommendations
- Admin Dashboard

---

## Author

**Muskan Singh**
