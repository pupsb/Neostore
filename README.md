# NeoStore - Digital Gaming & Services Platform

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

## 💳 Payment Gateway Integration (ExPay3)

This project uses **ExPay3** as the primary payment gateway. Here's how to implement it in your own project:

### 1. ExPay3 Account Setup
1. Sign up at ExPay3 payment gateway provider
2. Get your API credentials:
   - `EXPAY_USER_TOKEN` - Your unique user token
   - `EXPAY_WEBHOOK_SECRET` - Secret for webhook signature verification
3. Add these to your `.env` file

### 2. Backend Implementation

#### Order Payment Controller (`backend/controller/PaymentGateway/expayorders.js`)

```javascript
import crypto from 'crypto';
import axios from 'axios';
import Order from '../../models/Order.js';

// Create Order
export const createExpayOrder = async (req, res) => {
  try {
    const { amount, customer_name, customer_mobile, customer_email } = req.body;
    
    // Generate unique transaction ID
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000000).toString();
    
    // ExPay3 API payload
    const payload = {
      user_token: process.env.EXPAY_USER_TOKEN,
      amount: amount,
      order_id: uniqueId,
      redirect_url: `${process.env.REDIRECT_DOMAIN}/confirmation?client_txn_id=${uniqueId}`,
      customer_name,
      customer_mobile,
      customer_email,
    };
    
    // Call ExPay3 Create Order API
    const response = await axios.post('https://api.expay3.com/createorder', payload);
    
    // Save order to database
    const order = new Order({
      transactionid: uniqueId,
      amount,
      status: 'Created',
      customer_name,
      customer_mobile,
      // ... other fields
    });
    await order.save();
    
    // Return payment URL to frontend
    res.json({ 
      payment_url: response.data.payment_url,
      order_id: uniqueId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Webhook Handler (receives payment confirmation)
export const expayWebhook = async (req, res) => {
  try {
    // Verify HMAC signature
    const signature = req.headers['x-expay-signature'];
    const timestamp = req.headers['x-expay-timestamp'];
    
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', process.env.EXPAY_WEBHOOK_SECRET)
      .update(timestamp + payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process webhook data
    const { order_id, status, txn_id } = req.body;
    
    if (status === 'SUCCESS') {
      // Update order status
      const order = await Order.findOneAndUpdate(
        { transactionid: order_id },
        { status: 'Queued', payment_txn_id: txn_id },
        { new: true }
      );
      
      // Trigger fulfillment (game API call, etc.)
      await fulfillOrder(order);
    }
    
    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Wallet Top-up Controller (`backend/controller/PaymentGateway/expaywallet.js`)

Similar structure to orders but for wallet balance:

```javascript
export const expayTopUp = async (req, res) => {
  // Create wallet top-up transaction
  // Similar to createExpayOrder but saves to Transactions collection
};

export const expayWalletWebhook = async (req, res) => {
  // Verify signature
  // Update wallet balance
  // Send confirmation email
};
```

### 3. Frontend Implementation

#### Hook for Creating Orders (`frontend/src/hooks/usePostOrder.js`)

```javascript
import axios from 'axios';
import { useContext } from 'react';
import { VariableContext } from '../context/VariableContext';

export const usePostOrder = () => {
  const { host, token } = useContext(VariableContext);
  
  const createOrder = async (orderData) => {
    try {
      const response = await axios.post(
        `${host}/order/expay/createOrder`,
        orderData,
        {
          headers: {
            'x-api-key': 'your-api-key',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Redirect user to payment page
      window.location.href = response.data.payment_url;
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };
  
  return { createOrder };
};
```

### 4. Webhook Configuration

**Important**: Configure webhooks in your ExPay3 dashboard:

- **Development**: Use ngrok to expose localhost
  ```bash
  ngrok http 8080
  # Webhook URL: https://your-ngrok-url.ngrok.io/order/expay/webhook
  ```

- **Production**: Use your domain
  ```
  https://yourdomain.com/order/expay/webhook
  https://yourdomain.com/wallet/expay/webhook
  ```

### 5. Security: HMAC Signature Verification

```javascript
// Always verify webhook signatures to prevent fraud
const verifySignature = (payload, signature, timestamp, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(timestamp + JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
};
```

---

## 🎮 Game Fulfillment API Integration

The platform integrates with game provider APIs to automatically fulfill orders.

### SmileOne API Integration

#### 1. Get API Credentials
- Email: Your SmileOne account email
- UID: User ID from dashboard
- MKEY: API key from dashboard

#### 2. Implementation (`backend/controller/ProcessApiOrder/smileOne.js`)

```javascript
import axios from 'axios';
import crypto from 'crypto';

export const processSmileOneOrder = async (orderId, itemId, item, product, order, date) => {
  try {
    // SmileOne requires MD5 signature
    const sign = crypto.createHash('md5')
      .update(`${process.env.API_UID}${process.env.API_MKEY}${orderId}`)
      .digest('hex');
    
    const payload = {
      email: process.env.API_EMAIL,
      uid: process.env.API_UID,
      sign: sign,
      game_code: item.smgamecode,  // e.g., 'mobilelegendsbr'
      server_id: order.input2,      // Server ID
      player_id: order.input1,      // Player ID
      product_id: item.smproductid, // Product SKU
      order_id: orderId,
    };
    
    const response = await axios.post(
      'https://api.smile.one/ph/v1/pay',
      payload,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (response.data.status === 'success') {
      return true;  // Order fulfilled successfully
    }
    
    return false;
  } catch (error) {
    console.error('SmileOne API Error:', error);
    return false;
  }
};
```

#### 3. Game ID Validation

```javascript
export const checkGameId = async (req, res) => {
  try {
    const { userId, serverId, gameCode } = req.body;
    
    const response = await axios.post(
      'https://api.smile.one/checkid',
      {
        email: process.env.API_EMAIL,
        uid: process.env.API_UID,
        game_code: gameCode,
        player_id: userId,
        server_id: serverId,
      }
    );
    
    if (response.data.valid) {
      res.json({ 
        valid: true, 
        username: response.data.username 
      });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Moogold API Integration

Similar structure but with different authentication:

```javascript
export const processMoogoldApiOrder = async (orderId, itemId, item, product, order, date) => {
  const payload = {
    partnerid: process.env.MG_PARTNERID,
    product_id: item.mgproductid,
    server_id: order.input2,
    player_id: order.input1,
    order_id: orderId,
  };
  
  // Generate signature
  const sign = generateMoogoldSignature(payload, process.env.MG_SECRET_KEY);
  payload.sign = sign;
  
  const response = await axios.post('https://api.moogold.com/process', payload);
  return response.data.status === 'success';
};
```

---

## 🔐 Security Best Practices

### 1. Authentication & Authorization

```javascript
// Middleware: backend/middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};
```

### 2. Password Hashing

```javascript
import bcrypt from 'bcrypt';

// During registration
const hashedPassword = await bcrypt.hash(password, 10);

// During login
const isValid = await bcrypt.compare(password, user.password);
```

### 3. Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Input Validation

```javascript
import validator from 'validator';

export const validateOrder = (req, res, next) => {
  const { amount, email, mobile } = req.body;
  
  if (!amount || amount < 1) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  if (!validator.isMobilePhone(mobile, 'en-IN')) {
    return res.status(400).json({ error: 'Invalid mobile number' });
  }
  
  next();
};
```

---

## 📊 Database Schema Design

### User Schema

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
```

### Order Schema

```javascript
const orderSchema = new mongoose.Schema({
  transactionid: { type: String, required: true, unique: true },
  userid: { type: String, required: true },
  useremail: { type: String, required: true },
  product_name: { type: String },
  itemname: { type: String },
  input1: { type: String },  // Game user ID
  input2: { type: String },  // Server ID
  value: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Created', 'Queued', 'Processing', 'Completed', 'Failed', 'Refunded'],
    default: 'Created' 
  },
  payment_txn_id: { type: String },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});
```

### Wallet Schema

```javascript
const walletSchema = new mongoose.Schema({
  dbuserid: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [{
    type: { type: String, enum: ['credit', 'debit'] },
    amount: { type: Number },
    description: { type: String },
    date: { type: Date, default: Date.now }
  }]
});
```

### Transaction Schema (for wallet top-ups)

```javascript
const transactionSchema = new mongoose.Schema({
  txnid: { type: String, required: true, unique: true },
  userid: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Created' },
  payment_txn_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});
```

---

## 🚀 Production Deployment Guide

### 1. Server Setup (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (or use MongoDB Atlas)
sudo apt install -y mongodb-org

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Application Setup

```bash
# Clone repository
git clone <your-repo>
cd WoexStore_V2

# Backend setup
cd backend
npm install
# Create .env with production values

# Frontend build
cd ../frontend
npm install
npm run build
```

### 3. Nginx Configuration

```nginx
# /etc/nginx/sites-available/neostore
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend - serve React build
    location / {
        root /var/www/neostore/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Webhook endpoints (no /api prefix)
    location /order/expay/webhook {
        proxy_pass http://localhost:8080/order/expay/webhook;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /wallet/expay/webhook {
        proxy_pass http://localhost:8080/wallet/expay/webhook;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/neostore /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 5. PM2 Process Management

```bash
cd backend

# Start backend
pm2 start index.js --name neostore-backend

# Save PM2 configuration
pm2 save

# Setup auto-start on boot
pm2 startup
# Run the command it outputs

# Monitor logs
pm2 logs neostore-backend
pm2 monit
```

### 6. Environment Variables for Production

**Backend `.env`:**
```env
NODE_MODE=production
PORT=8080
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
REDIRECT_DOMAIN=https://yourdomain.com
# ... other variables
```

**Frontend `VariableContext.jsx`:**
```javascript
// Use relative path for API calls (proxied by Nginx)
const host = "/api";
```

---

## 📧 Email Service Setup (Gmail)

### 1. Enable 2FA on Google Account

### 2. Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other" → "NeoStore Backend"
4. Copy the generated password

### 3. Configure Nodemailer

```javascript
// backend/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // App password, not regular password
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email send failed:', error);
  }
};
```

---

## 🔄 Webhook Flow Diagram

```
User                Frontend              Backend              ExPay3        Game API
  |                    |                     |                    |              |
  |-- Click Pay ------>|                     |                    |              |
  |                    |-- POST /createOrder>|                    |              |
  |                    |                     |-- Create Order --->|              |
  |                    |                     |<-- Payment URL ----|              |
  |                    |<-- Redirect URL ----|                    |              |
  |<-- Redirect to ExPay3 Page ------------- |                    |              |
  |                                           |                    |              |
  |-- Complete Payment on ExPay3 --------------------------->|    |              |
  |                                           |                    |              |
  |                                           |<-- Webhook Callback|              |
  |                                           |    (POST /webhook) |              |
  |                                           |                    |              |
  |                                           |-- Verify Signature>|              |
  |                                           |-- Update DB -------|              |
  |                                           |-- Fulfill Order ----------------->|
  |                                           |                    |              |
  |<-- Redirect to Confirmation -------------|                    |              |
  |-- GET /orderstatus ---------------------->|                    |              |
  |<-- Order Details with Status: Completed --|                    |              |
```

---

## 🧪 Testing Guide

### 1. Local Testing with Ngrok

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start ngrok
ngrok http 8080

# Update ExPay3 webhook URL to ngrok URL
# https://abc123.ngrok.io/order/expay/webhook
```

### 2. Test Payment Flow
1. Create test user account
2. Add product to cart
3. Proceed to checkout
4. Complete payment on ExPay3 test environment
5. Verify webhook is received
6. Check order status updates
7. Confirm game credit is delivered

### 3. Test Webhook Signature
```javascript
// Test script
const crypto = require('crypto');

const payload = { order_id: '123', status: 'SUCCESS' };
const timestamp = Date.now().toString();
const secret = 'your-webhook-secret';

const signature = crypto
  .createHmac('sha256', secret)
  .update(timestamp + JSON.stringify(payload))
  .digest('hex');

console.log('Generated signature:', signature);
```

---

## 📱 SMS OTP Integration

### Fast2SMS Setup

```javascript
import axios from 'axios';

export const sendOTP = async (mobile, otp) => {
  try {
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: otp,
        route: 'otp',
        numbers: mobile,
      },
    });
    return response.data.return;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
};
```

---