# 💬 Chatty - Real-time Messaging Platform

A full-stack real-time chat application built with modern web technologies. Features instant messaging, offline support, typing indicators, and seamless message synchronization across devices.

[![Chatty Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Chatty+Real-time+Chat)](https://social-1-wc5k.onrender.com)


## 🚀 Features

### 💻 Core Functionality
- **Real-time Messaging** - Instant message delivery with WebSocket connections
- **Typing Indicators** - See when others are typing in real-time
- **Online Presence** - Live user status updates
- **File Sharing** - Image uploads with Cloudinary integration
- **Responsive Design** - Works seamlessly on desktop and mobile

### 🛡️ Reliability & Performance
- **Offline Message Queuing** - Messages are stored locally and sent when back online
- **Automatic Retry Logic** - Failed messages retry with exponential backoff
- **Infinite Scroll Pagination** - Smooth loading of large chat histories
- **Virtual Scrolling** - Optimized performance for thousands of messages
- **Cursor-based Pagination** - Efficient database queries for message history

### 🔒 Security & Architecture
- **JWT Authentication** - Secure login with token rotation
- **End-to-end Type Safety** - TypeScript across frontend and backend
- **Input Validation** - Comprehensive validation on client and server
- **Rate Limiting** - Protection against abuse and DDoS attacks

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Zustand** for state management
- **Socket.IO Client** for real-time communication
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **Socket.IO** for WebSocket connections
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for file storage
- **bcryptjs** for password hashing

### DevOps & Tools
- **TypeScript** end-to-end
- **ESLint** & **Prettier** for code quality
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn
