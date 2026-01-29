import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from 'url';

import { authCheck, checkScopes } from "./middleware/verifyToken.js";
import Product from "./models/Products.js";
import Items from "./models/Items.js";
import User from "./models/User.js";

import galleryRoutes from "./routes/gallery.js";
import productRoutes from "./routes/products.js";
import itemRoutes from "./routes/items.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import verifyRoutes from "./routes/verify.js";
import passwordRoutes from "./routes/forgetPassword.js";
import userRoutes from "./routes/user.js";
import walletRoutes from "./routes/wallet.js";
import pointsRoutes from "./routes/points.js";
import otpRoutes from "./routes/otpLogin.js";

import Wallet from "./models/Wallet.js";
import Point from "./models/Points.js";

const app = express();

dotenv.config();

// Capture raw body for webhook signature verification (ExPay3)
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    // Store raw body for webhook signature verification
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}));
app.use(helmet());
// Relaxed CSP for development/pre-SSL deployment
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: [
        "'self'",
        process.env.REDIRECT_DOMAIN,
        "https://accounts.google.com",
        "http://localhost:*",
        "https://*"
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
      ],
    },
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(cors());

app.use(cors({
    origin: process.env.REDIRECT_DOMAIN,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Your existing routes
app.use('/gallery', galleryRoutes)
app.use("/item", itemRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/verify", verifyRoutes);
app.use("/password", passwordRoutes);
app.use("/user", userRoutes);
app.use("/wallet", walletRoutes);
app.use("/points", pointsRoutes);
app.use("/otp", otpRoutes);

// Serve static files based on environment
if (process.env.NODE_MODE === "production") {
  // Serve static files from the React app in production
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Serve a message indicating the API is running in development
  app.get("/", (req, res) => {
    res.send("API is running in development mode.");
  });
}

// Additional routes
app.get("/keep-alive", (req, res) => {
  res.send("Server is alive.");
});

app.get("/protected", authCheck, checkScopes, (req, res) => {
  res.send("Protected");
});

const PORT = process.env.PORT || 3001;

const insertData = async () => {
  let dataInserted = false;

  try {
    const productCount = await Product.countDocuments();
    const itemCount = await Items.countDocuments();
    const userCount = await User.countDocuments();
    const wallets = await Wallet.countDocuments();
    const points = await Point.countDocuments();


   
    if(wallets === 0){
      const users = await User.find();
      users.map(async(user)=>{
        const wallet = new Wallet({
          dbuserid : user._id,
          userid : user.userid,
          useremail : user.email,
        })

        await wallet.save();
      })
      dataInserted = true;
    }
    if(points === 0){
      const users = await User.find();
      users.map(async(user)=>{
        const point = new Point({
          dbuserid : user._id,
          userid : user.userid,
          useremail : user.email,
        })

        await point.save();
      })
      dataInserted = true;
    }

    if (userCount === 0) {
      const dummyUser = {
        name: "Dummy User",
        mobilenumber: "1234567890",
        userid: "2000",
        email: "dummyuser@example.com",
        password: "dummyPassword",
        verified: "false",
        role: "user",
        picturePath: "",
      };
      await User.create(dummyUser);
      dataInserted = true;
    }
    
    if (dataInserted) {
      console.log("Data inserted successfully");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    insertData().then(() => {
      app.listen(PORT, () => console.log(`Server is running at Port: ${PORT}`));
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if MongoDB connection fails
  });
