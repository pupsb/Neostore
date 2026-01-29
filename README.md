# WoexStore V2

A full-stack e-commerce platform for top-up services, game credits, and digital products. This application handles user authentication, product management, order processing, payment gateways, wallet systems, and comprehensive admin controls.

## 🚀 Quick Start - How to Run This Project

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

### Installation & Setup

#### 1. Clone the Repository if using from github
```bash
git clone <repository-url>
cd WoexStore_V2
```

#### 2. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT = 8080
NODE_MODE = "production" for development - NODE_MODE = "development"
# MONGO_URL = "your mongodb url"
ISSUER = "https://dev-80n1i28isf7wne1s.us.auth0.com/"
JWKURI = "https://dev-80n1i28isf7wne1s.us.auth0.com/.well-known/jwks.json"
AUDIENCE = 'This is a unique identifier'
JWT_SECRET = 'your jwt secret'

#UPI GATEWAY API
API_KEY = 'your upigateway api key'

#google app password
EMAIL =  'google email
PASSWORD = 'app password'

#Smile API
API_EMAIL = "email"
API_UID = "uid"
API_MKEY = "mkey"

# MG Api
MG_PARTNERID = 'partnerid'
MG_SECRET_KEY = 'secretkey'

# REDIRECT_DOMAIN = "https://woexsupply.com"
REDIRECT_DOMAIN = "http://localhost:5173"

#Points System
MIN_REDEEM_POINTS = 10
POINTS_RATIO = 100

FAST2SMS_API_KEY = "your fast2sms api key"
```

Start the backend server:
```bash
npm start
```
The backend will run on `http://localhost:3001`

#### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

you can change the base url in src/context/variableContext.jsx file

Start the frontend development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

#### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/keep-alive

### Production Build

#### Backend Production
```bash
cd backend
NODE_MODE=production npm start
```

#### Frontend Production
```bash
cd frontend
npm run build
```
The production build will be created in `frontend/dist` directory.

---

## 📁 Project Structure

```
WoexStore_V2/
├── backend/                    # Node.js/Express backend
│   ├── controller/            # Request handlers
│   │   ├── Admin/            # Admin-specific controllers
│   │   ├── Auth/             # Authentication controllers
│   │   ├── IdChecker/        # ID verification
│   │   ├── PaymentGateway/   # Payment processing
│   │   └── ProcessApiOrder/  # API order processing
│   ├── middleware/           # Custom middleware (auth, multer, etc.)
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API route definitions
│   ├── uploads/              # User uploaded files
│   ├── index.js              # Main server entry point
│   ├── mailer.js             # Email service configuration
│   └── sendOtp.js            # OTP service
│
└── frontend/                  # React + Vite frontend
    ├── public/               # Static assets
    ├── src/
    │   ├── assets/          # Images, fonts, etc.
    │   ├── components/      # Reusable React components
    │   ├── context/         # React Context API
    │   ├── hooks/           # Custom React hooks
    │   ├── pages/           # Page components
    │   ├── Routes/          # Route configuration
    │   └── utils/           # Utility functions
    ├── App.jsx              # Main App component
    └── main.jsx             # Entry point
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken), Auth0 OAuth
- **Security**: Helmet, CORS, bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer
- **API Requests**: Axios
- **Development**: Nodemon

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Bootstrap 5
- **UI Components**: Flowbite, React Bootstrap
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: Font Awesome
- **Authentication**: Auth0 React SDK

---

## 📡 API Endpoints Overview

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /otp/send` - Send OTP
- `POST /otp/verify` - Verify OTP
- `POST /password/forgot` - Forgot password
- `POST /password/reset` - Reset password

### Products & Items
- `GET /product` - Get all products
- `GET /product/:id` - Get product by ID
- `GET /item` - Get all items
- `GET /item/:id` - Get item by ID

### Orders
- `POST /order` - Create new order
- `GET /order/:userId` - Get user orders
- `PUT /order/:id` - Update order status

### Wallet & Points
- `GET /wallet/:userId` - Get wallet balance
- `POST /wallet/add` - Add balance
- `GET /points/:userId` - Get user points

### Admin
- `GET /admin/users` - Get all users
- `POST /admin/product` - Create product
- `PUT /admin/order/:id` - Update order
- `GET /admin/transactions` - Get all transactions
---

## 🔧 Development Workflow

### Running in Development Mode

1. **Start Backend** (Terminal 1):
```bash
cd backend
npm start
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

#### Database Operations
The application automatically initializes the database with:
- Dummy user for testing
- Wallet entries for existing users
- Points entries for existing users

#### File Uploads
Files are stored in `backend/uploads/` directory and served statically.

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists with correct credentials
- Ensure port 3001 is not in use
- Check Node.js version (v16+)

### Frontend won't start
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is available

### Database Connection Issues
- Verify `MONGO_URL` in `.env` is correct
- For local MongoDB, ensure service is running
- For MongoDB Atlas, check network access and IP whitelist

### CORS Errors
- Ensure `REDIRECT_DOMAIN` in backend `.env` matches frontend URL
- Check CORS configuration in `backend/index.js`

---

## 📝 Environment Variables Reference

### Required Backend Variables For Running The Application
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `3001` |
| `NODE_MODE` | Environment mode (`development`/`production`) |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/woexstore` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `REDIRECT_DOMAIN` | Frontend URL | `http://localhost:5173` |
| `EMAIL_USER` | Email service username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email service password | `your-app-password` |

---