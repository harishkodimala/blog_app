# Backend - Blog App

Backend API for the MERN Blog Application built using Node.js, Express.js, and MongoDB.

---

#  Features

- REST API
- JWT Authentication
- MongoDB Integration
- Middleware Authorization
- CRUD Operations
- Error Handling
- Secure Password Hashing

---

#  Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

#  Folder Structure

```txt
backend/
│
├── routes/
├── models/
├── middleware/
├── config/
├── server.js
└── package.json
```

---

# Installation

```bash
npm install
```

---

#  Run Backend Server

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

Runs on:

```txt
http://localhost:5000
```

---

#  Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

#  API Endpoints

# Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /user-api/user | Register User |
| POST | /user-api/login | Login User |

---

# Articles

| Method | Endpoint | Description |
|---|---|---|
| GET | /author-api/articles | Get Articles |
| POST | /author-api/articles | Create Article |
| PUT | /author-api/articles/:id | Update Article |
| DELETE | /author-api/articles/:id | Delete Article |

---

#  Authentication

JWT Token based authentication is used.

Protected routes require:

```txt
Authorization: Bearer <token>
```

---

#  Testing API

Recommended Tools:
- Postman
- Thunder Client

---

#  Deployment

Recommended Platforms:
- Render
- Railway
- Cyclic

---

# Important Notes

- Keep `.env` file private
- Never push secrets to GitHub
- Use strong JWT secrets

---

#  Developer

Harish Kodimala
