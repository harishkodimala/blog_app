# Blog App

A full-stack MERN Blog Application where users can create, manage, and explore articles with authentication and role-based access.

---

## Live Demo

Frontend: https://blog-app-alpha-lyart.vercel.app 
Backend: https://your-backend-url.onrender.com

---

#  Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-based Access

##  Blog Features
- Create Articles
- Edit Articles
- Delete Articles
- View All Articles
- View Single Article
- Author Dashboard

##  Frontend Features
- Responsive UI
- Modern Design
- Loading States
- Error Handling
- Dynamic Routing

## Backend Features
- REST API
- MongoDB Database
- JWT Security
- Middleware Authentication
- Express Routing

---

#  Tech Stack

## Frontend
- React.js
- React Router
- Axios
- Bootstrap / CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

# Project Structure

```txt
blog_app/
│
├── frontend/
│
├── backend/
│
└── README.md
```

---

#  Installation

## 1️ Clone Repository

```bash
git clone https://github.com/harishkodimala/blog_app.git
```

---

#  Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

#  Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

#  Environment Variables

## Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

#  API Endpoints

## Auth Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /user-api/user | Register User |
| POST | /user-api/login | Login User |

## Article Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | /author-api/articles | Get Articles |
| POST | /author-api/articles | Create Article |
| PUT | /author-api/articles/:id | Update Article |
| DELETE | /author-api/articles/:id | Delete Article |

---


#  Future Improvements

- Rich Text Editor
- Dark Mode
- Comments System
- Article Search
- Pagination
- Notifications
- Profile Management
- Image Uploads
- Admin Dashboard

---

#  Run Tests

```bash
npm test
```

---

#  Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

# License

This project is licensed under the MIT License.

---

#Author

Harish Kodimala

GitHub: https://github.com/harishkodimala
