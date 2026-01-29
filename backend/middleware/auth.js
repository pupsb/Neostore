import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";



export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Verify the token and check expiry
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is blocked
    const user = await User.find({ _id: verified.id });
    
    if (user[0].isBlocked === "true") {
      return res.status(403).send("Access Denied or Blocked. Please contact admin.");
    }

    req.params.userId = verified.id;
    next();
  } catch (err) {
    // Handle expired token error
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired. Please login again." });
    }
    res.status(500).json({ error: err.message });
  }
};


export const isAdmin = async(req,res,next) => {
  try{
   
    const userId  = req.params.userId;
    // console.log("ADmin: ", userId);
    
    const user = await User.find({_id:userId})
    
    if(user[0].role === "admin"){
      next();
    }
    else{
      res.status(403).send("You are not an admin")
    }
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

export const checkApiKey = async(req, res, next)=> {

  
  // const {apiKey} = req.body
  // const isMatch = await bcrypt.compare(process.env.API_KEY,apiKey);
  // console.log(isMatch)
  // if (!isMatch) {
  //   return res.status(401).json({status: 'error'});
    
  // }
  
  next();
};

export const validateUser = async(req, res, next) => {
  try {
    let token = req.header("Authorization");
    const { requiredRoles } = req.body; // Now it's an array of roles
    
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Verify the token and check expiry
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is blocked
    const user = await User.find({ _id: verified.id });
    
    if (user[0].isBlocked === "true") {
      return res.status(403).send("Access Denied or Blocked. Please contact admin.");
    }

    // Check if the user's role is in the requiredRoles array
    if (requiredRoles.includes(user[0].role)) {
      return res.status(200).json({ role: user[0].role });
    } else {
      return res.status(403).send("Access Denied");
    }

  } catch (err) {
    // Handle expired token error
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token has expired. Please login again." });
    }
    res.status(500).json({ error: err.message });
  }
}
