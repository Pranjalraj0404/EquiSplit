# SplitApp

A scalable full-stack MERN application for intelligent group expense tracking and automated debt settlement.

---

## Overview

SplitApp is a production-oriented expense sharing platform that simplifies group financial management.  
It enables users to create groups, track shared expenses, automatically compute balances, and visualize spending patterns through interactive dashboards.

The system is built with clean backend architecture, modular routing, secure authentication, and optimized MongoDB queries.

---

## Application Preview

### Dashboard
![Dashboard](./Screenshots/dashboard-main-transparent.png)

### Group View
![Group View](./Screenshots/Group%20View%20Page.jpg)

### Combined Overview
![Overview](./Screenshots/combined-screenshot.png)

---

## Core Features

### Authentication & Security
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes via middleware
- Environment-based configuration
- Centralized input validation

### Group Management
- Create, update, and delete groups
- Add members dynamically
- Group-specific dashboards
- Automatic balance recalculation

### Expense Tracking
- Multi-currency support
- Category-based expense tagging
- Automated equal split logic
- Real-time balance updates
- Activity tracking

### Analytics Dashboard
- Category-wise expense distribution
- Member contribution comparison
- Monthly expense trends
- Interactive visualizations using Chart.js

### User Experience
- Fully responsive design
- Material UI interface
- Dark / Light theme support
- SPA routing with React Router

---

## Architecture

Client (React)  
→ Express REST API (Node.js)  
→ MongoDB Atlas  

Design Principles:
- Separation of concerns
- Modular route-controller structure
- Middleware-driven validation and logging
- Stateless authentication
- Optimized aggregation queries

---

## Tech Stack

### Frontend
- React.js

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Joi Validation
- Custom logging middleware

---

## Project Structure

```

SplitApp/
│
├── client/               # React frontend
├── components/           # Business logic controllers
├── routes/               # API routes
├── model/                # Database schemas
├── helper/               # Split logic, validation, logging
├── logs/                 # Application logs
│
├── app.js                # Express entry point
├── check-users.js        # Utility script
└── Screenshots/          # UI preview images
```

---

## Installation & Setup

### 1. Clone Repository

```
git clone <your-repository-url>
cd SplitApp
```

### 2. Install Backend Dependencies

```
npm install
```

### 3. Install Frontend Dependencies

```
cd client
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Run Application

Backend:
```
npm run dev
```

Frontend:
```
cd client
npm start
```

---

## Engineering Highlights

- Designed scalable MongoDB schema for Users, Groups, and Expenses
- Implemented automated split and balance computation logic
- Used aggregation pipelines to optimize dashboard queries
- Built centralized error-handling middleware
- Structured backend using modular REST architecture
- Integrated logging for debugging and observability

---

