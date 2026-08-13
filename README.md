# 🏛️ Panchayat

A full-stack web application built with modern technologies for efficient management and analytics. This project features a responsive React frontend with beautiful animations and a robust Node.js [...]

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
- [Razorpay Integration (Easy Guide)](#razorpay-integration-easy-guide)

---

## 🎯 About

**Panchayat** is a full-stack application that combines a modern, interactive React frontend with a comprehensive backend API. The application provides user management, authentication, document ge[...]

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

- �� Modern React 19 with Vite for fast development
- ✅ Beautiful UI with Tailwind CSS and Framer Motion animations
- ✅ Secure authentication with JWT and Bcrypt
- ✅ MongoDB integration for scalable data storage
- ✅ AI-powered features with OpenAI integration
- ✅ PDF document generation
- ✅ Interactive charts with Recharts
- ✅ Particle animation effects
- ✅ Toast notifications for user feedback
- ✅ Responsive design for all devices

## ⚡ Redis Integration (Caching & Rate Limiting)

Panchayat utilizes Redis to enhance the performance and security of its AI Assistant capabilities. The integration employs a graceful fallback mechanism, ensuring the application remains fully functional even if Redis is temporarily unavailable.

### What is Cached?

The RAG (Retrieval-Augmented Generation) knowledge base is cached in Redis to minimize repetitive MongoDB queries.

- **Rules (`society:default:rules`)**: Society rules and policies.
- **Notices (`society:default:notices`)**: Active notices.
- **Society Info (`society:default:info`)**: General society information (timings, addresses).
- **Community Posts (`society:default:posts`)**: Recent community posts.

_Note: User-specific conversations and private AI queries are NEVER cached to ensure privacy._

### Cache Invalidation

When rules or community posts are created, updated, or deleted through their respective endpoints, the associated Redis cache keys are instantly invalidated. This guarantees the AI Assistant always has the most up-to-date context.

### Rate Limiting

To prevent abuse of the OpenAI API, the `/ask` endpoint is protected by a Redis-backed rate limiter.

- **Default Limit**: 10 requests per user per 60 seconds.
- **Fallback**: If Redis is offline, a lightweight, single-node in-memory rate limiter takes over automatically.

### Running with Redis Locally

You can run a local Redis instance easily with Docker:

```bash
docker run --name redis-panchayat -p 6379:6379 -d redis
```

Ensure your `Server/.env` file contains the Redis URL:

```env
REDIS_URL=redis://localhost:6379
```

---

## Razorpay Integration (Easy Guide)

Here is a short, plain-language guide to adding Razorpay payments to Panchayat. It explains what to change, where to store secrets, and how the flow works — written for someone who wants to implement this next.

What kind of integration

- We'll use a server-verified flow (recommended). The steps are: backend creates an order -> frontend opens Razorpay Checkout -> backend verifies the payment signature -> then we activate the user's plan.
- Sources: Razorpay Node.js Integration and Standard Checkout docs.

Important security notes (do NOT commit secrets)

- The test key ID is safe to include in frontend config: example test key id: `rzp_test_T9IUijB4dqodq3`.
- The key secret MUST never be put in frontend code or committed. Keep it only in the Server/.env as `RAZORPAY_KEY_SECRET`.

Environment variables

- Server (.env):
  - RAZORPAY_KEY_ID (your Razorpay key id)
  - RAZORPAY_KEY_SECRET (your Razorpay key secret — keep private)
  - CLIENT_URL (e.g. http://localhost:5173)
- Client (Client/.env):
  - VITE_RAZORPAY_KEY_ID=rzp_test_T9IUijB4dqodq3 (test key id is ok to expose)

Backend changes (high level)

1. Install SDK:
   - `npm install razorpay` in Server/
2. Update User model (Server/models/User.js) to store subscription fields:
   - planName: Free | Quarterly | Half Yearly | Annual
   - planStatus: active | expired
   - planActivatedAt
   - planExpiresAt
   - razorpayOrderId
   - razorpayPaymentId
3. Add a plan configuration (Server/services/planService.js) listing durations and prices:
   - Free: 30 days, ₹0
   - Quarterly: 90 days, ₹15000
   - Half Yearly: 180 days, ₹28000
   - Annual: 365 days, ₹55000
4. Add payment-related API routes and controllers (register them in Server/server.js):
   - POST /api/payments/free-trial — activate 30-day free trial for the user
   - POST /api/payments/create-order — create a Razorpay order (returns order id and amount)
   - POST /api/payments/verify — verify Razorpay signature, save payment ids, activate plan
   - GET /api/payments/subscription — return user's current plan details; also check for expiry and auto-mark expired plans

Frontend changes (high level)

1. Pricing UI (Client/src/components/ui/pricing-section.jsx):
   - Free plan button calls POST /api/payments/free-trial
   - Paid plan button calls POST /api/payments/create-order, then opens Razorpay Checkout with the returned order id
   - On successful checkout, call POST /api/payments/verify with payment details
2. Add a small payment service (Client/src/services/paymentService.js) to call the backend endpoints and load Razorpay Checkout script
3. Add `VITE_RAZORPAY_KEY_ID` to Client/.env (test id OK for frontend)
4. After successful verification redirect to `/dashboard?plan=activated`
5. In Client/src/pages/UserDashboard.jsx show a success popup if the URL has `plan=activated`. Show trial-expiry popup when days remaining ≤ 2 and renewal popup if paid plan expired
6. In Client/src/pages/Profile.jsx replace `subscriptionMode` field with clear plan details: current plan, status, activation date, expiry date, days remaining

Expiry logic (simple and safe)

- On each login, and on calls to `/auth/me` and `/payments/subscription`, backend checks `planExpiresAt`. If now > planExpiresAt, backend sets `planStatus = 'expired'`.
- This keeps things correct without requiring a cron job immediately. You can add a daily cron later to clean up if you want.

Notes and next steps

- I did NOT add any secret values to the README. The README shows the test key id as an example and instructs to keep the secret in Server/.env.
- If you want, I can now implement the backend routes and model updates, or create a PR with the code changes for review.

---

**Made with ❤️ by [HimanshuRawat77](https://github.com/HimanshuRawat77)**
