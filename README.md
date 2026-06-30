# 🏛️ Panchayat

A full-stack web application built with modern technologies for efficient management and analytics. This project features a responsive React frontend with beautiful animations and a robust Node.js backend powered by Express and MongoDB.

**Live Demo:** [https://panchayat-5bv7iuuh0-himanshius-projects.vercel.app](https://panchayat-5bv7iuuh0-himanshius-projects.vercel.app)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**Panchayat** is a full-stack application that combines a modern, interactive React frontend with a comprehensive backend API. The application provides user management, authentication, document generation, and analytics capabilities using AI-powered features.

---

## ✨ Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Password Security**: Bcrypt-based password hashing
- **Real-time Analytics**: Interactive charts and data visualization
- **Document Generation**: PDF generation capabilities
- **AI Integration**: OpenAI API integration for intelligent features
- **Responsive UI**: Beautiful, animated React components
- **Data Persistence**: MongoDB for reliable data storage
- **CORS Support**: Ready for cross-origin requests
- **Development Tools**: Hot-reload development environment

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.4 - UI library
- **Vite** 8.0.4 - Next-generation build tool
- **Tailwind CSS** 4.2.2 - Utility-first CSS framework
- **Framer Motion** 12.38.0 - Animation library
- **React Router DOM** 7.14.0 - Routing
- **Recharts** 3.8.1 - Charts and graphs
- **Lucide React** 1.8.0 - Icon library
- **React Hot Toast** 2.6.0 - Toast notifications
- **TSParticles** 3.9.1 - Particle animation effects
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express** 5.2.1 - Web framework
- **MongoDB** - Database
- **Mongoose** 9.4.1 - MongoDB ODM
- **JWT** (jsonwebtoken 9.0.3) - Authentication
- **Bcryptjs** 3.0.3 - Password hashing
- **OpenAI** 6.34.0 - AI API integration
- **PDFKit** 0.18.0 - PDF generation
- **CORS** 2.8.6 - Cross-Origin Resource Sharing
- **Morgan** 1.10.1 - HTTP request logger
- **Dotenv** 17.4.1 - Environment variables
- **Nodemon** 3.1.14 - Development auto-reload

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v7 or higher) - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **Git** - [Download](https://git-scm.com/)

---

## 📂 Project Structure

```
Panchayat/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── Server/                # Backend Node.js application
│   ├── server.js          # Main server file
│   ├── routes/            # API routes
│   ├── models/            # Mongoose models
│   ├── middleware/        # Custom middleware
│   ├── controllers/       # Route controllers
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HimanshuRawat77/Panchayat.git
cd Panchayat
```

### 2. Install Backend Dependencies

```bash
cd Server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Client
npm install
```

---

## 🔐 Configuration

### Backend Environment Setup

1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Create a `.env` file in the Server directory:
   ```bash
   touch .env
   ```

3. Add the following environment variables to `.env`:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
   # or for local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/panchayat

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here

   # Port
   PORT=5000

   # OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here

   # CORS Origin
   CORS_ORIGIN=http://localhost:5173
   ```

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Start MongoDB service
# On Windows:
mongod

# On macOS:
brew services start mongodb-community
```

**Option 2: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string and add it to `.env`

### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Generate an API key
4. Add it to your `.env` file

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd Server
npm run dev
```

The backend will start on `http://localhost:5000` (or your configured PORT)

### Start Frontend Development Server

Open a new terminal and run:

```bash
cd Client
npm run dev
```

The frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to: `http://localhost:5173`

---

## 📜 Available Scripts

### Frontend (Client)

```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code linting
npm run lint
```

### Backend (Server)

```bash
# Start production server
npm run start

# Start development server with auto-reload
npm run dev

# Run tests
npm run test
```

---

## 📡 API Documentation

The backend provides various API endpoints for:

- **Authentication**: User login, registration, token management
- **Users**: CRUD operations for user data
- **Documents**: PDF generation and management
- **Analytics**: Data retrieval for charts and analytics
- **AI Features**: Integration with OpenAI for intelligent operations

All API requests should include:
- **Content-Type**: `application/json`
- **Authorization**: `Bearer <JWT_TOKEN>` (for protected routes)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [GitHub Issues](https://github.com/HimanshuRawat77/Panchayat/issues)
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

## 🎨 Features Highlights

- ✅ Modern React 19 with Vite for fast development
- ✅ Beautiful UI with Tailwind CSS and Framer Motion animations
- ✅ Secure authentication with JWT and Bcrypt
- ✅ MongoDB integration for scalable data storage
- ✅ AI-powered features with OpenAI integration
- ✅ PDF document generation
- ✅ Interactive charts with Recharts
- ✅ Particle animation effects
- ✅ Toast notifications for user feedback
- ✅ Responsive design for all devices

---

**Made with ❤️ by [HimanshuRawat77](https://github.com/HimanshuRawat77)**