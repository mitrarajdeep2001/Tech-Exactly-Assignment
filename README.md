# Bloggy

A full-stack blog application with real-time features, role-based access control, and multiple authentication methods.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Multi-provider Authentication**: Email/Password, Google, and Facebook login
- **Role-Based Access Control (RBAC)**: Admin and User roles with different permissions
- **Secure Session Management**

### 👥 User Features
- Create, update, and delete own posts
- Comment on posts
- Edit own comments
- Delete own comments

### ⚙️ Admin Features
- Full CRUD operations on users
- Manage all users
- Manage all posts (own and others')
- Manage all comments (own and others')

### 💬 Real-time Features
- Socket.io integration for real-time comment notifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v20 or higher)
- MongoDB - URI (Local or Atlas)
- Cloudinary - API Key & API Secret
- Facebook - APP ID & APP Secret
- Google - Client ID & Client Secret

### Frontend Setup

# Navigate to frontend directory
cd ./client

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev

### Backend Setup

# Navigate to backend directory
cd ./server

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev

# Default Admin Credentials

If using the provided MongoDB URI:
Email: admin@admin.com
Password: abcABC@123

# To create a new admin user:
cd ./server
npm run create:admin
Note*: You will get the new admin credentials on your terminal where you run the command.