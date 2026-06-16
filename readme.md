# 🧠 MindVault

MindVault is a full-stack personal journaling and memory management platform built using the MERN stack. It helps users capture daily thoughts, organize memories with moods and tags, maintain writing streaks, and reflect on personal growth through a modern and focused writing experience.

---

## 🌟 Live Demo

**Frontend:**  https://mindvault-lime.vercel.app/

**Backend API:** https://proj-02-mindvault.onrender.com

---

## 📖 Project Overview

MindVault was built to serve as a personal  journal/logs writing system where users can securely record journal entries, track emotional patterns, organize thoughts, and build a consistent writing habit.

The application combines authentication, journaling, mood tracking, tagging, analytics, and streak management into a single productivity-focused platform.

---

## 🚀 Features

### 🔐 Authentication & Security

* JWT Authentication
* Protected Routes
* Secure Password Hashing (bcrypt)
* User-specific Journals

### 📝 Journal Management

* Create Journal Entries
* Edit Existing Entries
* Delete Entries
* Dedicated Journal Detail View
* Search Entries by Title, Content, Mood, Tags, and Dates

### 😊 Mood Tracking

* Mood Selection While Writing
* Mood-based Organization
* Most Used Mood Statistics
* Mood Analytics

### 🏷️ Tags System

* Custom Tags
* Tag-based Organization
* Quick Memory Categorization

### 📊 Productivity Insights

* Daily Writing Streaks
* Longest Streak Tracking
* Total Journals Count
* Total Words Written
* Monthly Activity Statistics

### 🎨 User Experience

* Modern Dark Theme UI
* Responsive Dashboard Layout
* Real-time Search
* Journal Detail Pages
* Smooth Navigation Experience

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* bcrypt

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 📂 Project Structure

```bash
mindvault/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── context/
│   │
│   └── public/
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd mindvault
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start Backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🎯 Learning Outcomes

Through MindVault, I strengthened my understanding of:

* MERN Stack Development
* REST API Design
* Authentication & Authorization
* MongoDB Data Modeling
* React State Management
* Custom Hooks
* Full-stack Deployment
* UI/UX Design Iteration
* Production Debugging

---

## 🔮 Future Scope

* Rich Text Editor
* Export Journals to PDF
* AI-powered Journal Insights
* Advanced Analytics Dashboard
* Journal Sharing
* Data Backup & Restore

---

## 👨‍💻 Author

**Vaibhav Rajale**

Portfolio project demonstrating full-stack MERN development, authentication systems, CRUD operations, analytics features, and modern frontend architecture.
