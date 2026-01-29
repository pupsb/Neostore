import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { sendEmail } from "../../mailer.js";
import Wallet from "../../models/Wallet.js";
import Point from "../../models/Points.js";
import TempUser from "../../models/TempUser.js";
import { sendOtp, sendOneApiOtp } from "../../sendOtp.js";

// export const register = async (req, res) => {
//   try {
//     const { name, mobilenumber, email, password } = req.body;

//     const salt = await bcrypt.genSalt();
//     const passwordHash = await bcrypt.hash(password, salt);

//     async function generateUserId() {
//       // Find the user with the highest `userid`
//       const lastUser = await User.findOne().sort({ userid: -1 }).limit(1); // Sort by `userid` in descending order
//       // Get the highest `userid` and increment it, default to "1000" if no users exist
//       const nextUserId = lastUser ? Number(lastUser.userid) + 1 : 1000;
//       return nextUserId.toString();
//     }

//     const newUser = new User({
//       name,
//       mobilenumber,
//       email,
//       password: passwordHash,
//       userid: await generateUserId(), // Generate the next unique `userid`
//       authType: 'regular',
//     });
//     const savedUser = await newUser.save();

//     const point = new Point({
//       dbuserid: savedUser._id,
//       userid: savedUser.userid,
//       useremail: savedUser.email,
//     })

//     const wallet = new Wallet({
//       dbuserid: savedUser._id,
//       userid: savedUser.userid,
//       useremail: savedUser.email,
//     })

//     const savedPoint = await point.save();
//     const savedWallet = await wallet.save();

//     const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

//     const userData = {
//       email: savedUser.email,
//       isAdmin: savedUser.isAdmin,
//       mobilenumber: savedUser.mobilenumber,
//       name: savedUser.name,
//       role: savedUser.role,
//       userid: savedUser.userid,
//       _id: savedUser._id,
//       picturePath: savedUser.picturePath,
//     }

//     // sendEmail(email,`Please verify you account!`,
//     //   `Dear user,\n
//     //   Thank you for registering on Gammerce\n
//     //   Please click below to verify your email address.\n\n
//     //   ${process.env.REDIRECT_DOMAIN}/verification/${savedUser._id}/${token}\n\n

//     //   If you did not request this, please ignore this email.\n\n
//     //   Best Regards,\n
//     //   Gammerce\n`)

//     res.status(201).json(userData);
//   } catch (err) {
//     // res.json(res.body)
//     res.status(500).json({ error: err.message });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Please fill in all fields. " });
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });


    // if (user.verified === "false"){
    //   const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})

    //   sendEmail(email,"Please verify you account!",
    //     `
    //     Dear user,\n
    //     Thank you for registering on Gammerce\n
    //     Please click below to verify your email address.\n\n
    //     ${process.env.REDIRECT_DOMAIN}/verification/${user._id}/${token}\n\n
    //     If you did not request this, please ignore this email.\n\n
    //     Best Regards,\n
    //     Gammerce\n`)

    //   return res.status(400).json({ msg: "Please verify your email address. A verification email has been sent to your inbox. If you don’t see it, kindly check your spam or junk folder." }
    // );
    // } 


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Login Details. Please try again or reset your password. " });

    if (user.isBlocked === "true") {
      return res.status(400).json({ msg: "Your account has been blocked. Please contact the admin through whatsapp." });
    }

    user.authType = 'regular';
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '6h' });
    delete user.password;

    // Only include necessary fields in the response
    const userData = {
      email: user.email,
      isAdmin: user.isAdmin,
      mobilenumber: user.mobilenumber,
      name: user.name,
      role: user.role,
      userid: user.userid,
      _id: user._id,
      picturePath: user.picturePath,
    };

    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const verifyMail = async (req, res) => {
  try {
    const { id, token } = req.params

    const verified = jwt.verify(token, process.env.JWT_SECRET)

    const userId = verified.id;
    if (userId != id) {
      return res.status(400).json({ msg: `The link is corrupted.`, code: "1" })
    }
    const newUser = await User.findByIdAndUpdate({ _id: id }, { verified: true })

    res.status(200).json({ msg: "Email Verified", code: "0" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

export const createTempUser = async (req, res) => {
  try {
    const { name, mobileNumber, email, password } = req.body;

    if (!name || !mobileNumber || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ mobileNumber }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Mobile number or email already exists" });
    }

    // Check if a temp user exists
    let existingTempUser = await TempUser.findOne({ $or: [{ mobileNumber }, { email }] });

    // Prevent OTP spam - check if last OTP was sent within 2 minutes
    if (existingTempUser && existingTempUser.otpLastSent) {
      const now = new Date();
      const timeDiff = now - existingTempUser.otpLastSent;
      if (timeDiff < 2 * 60 * 1000) { // 2 minutes
        return res.status(429).json({ msg: "Please wait 2 minutes before requesting a new OTP." });
      }
    }

    // Generate OTP
    const smsOTP = Math.floor(100000 + Math.random() * 900000);

    // Send OTP to mobile number
    try {
      // await sendOtp(String(smsOTP), mobileNumber);
      await sendOneApiOtp(String(smsOTP), mobileNumber, name);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage === "Invalid Numbers") {
        return res.status(400).json({ msg: "Invalid mobile number." });
      }

      return res.status(500).json({ msg: "Failed to send OTP. Try again later.", error: errorMessage });
    }

    // Hash the password before saving (Even if temporary)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingTempUser) {
      // Update the existing temp user
      existingTempUser.name = name;
      existingTempUser.mobileNumber = mobileNumber;
      existingTempUser.email = email;
      existingTempUser.password = hashedPassword;
      existingTempUser.otp = smsOTP;
      existingTempUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
      existingTempUser.otpLastSent = new Date();
      await existingTempUser.save();
    } else {
      // Create a new temp user
      const tempUser = new TempUser({
        name,
        mobileNumber,
        email,
        password: hashedPassword,
        otp: smsOTP,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
        otpLastSent: new Date(),
      });

      await tempUser.save();
    }

    res.status(201).json({ msg: "OTP sent successfully, please verify your account.", mobileNumber });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyAndRegister = async (req, res) => {
  try {
    // const { name, mobilenumber, email, password } = req.body;
    const { name, mobileNumber, otp, email, password } = req.body;

    if (!name || !mobileNumber || !otp || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields." });
    }

    // Find the temp user by mobile number
    const tempUser = await TempUser.findOne({ mobileNumber });

    if (!tempUser) {
      return res.status(400).json({ msg: "User not found. Please register again." });
    }

    // Check if the OTP has expired
    if (new Date() > tempUser.otpExpiresAt) {
      return res.status(400).json({ msg: "OTP has expired. Please request a new OTP." });
    }

    // Check if the OTP is correct
    if (tempUser.otp != otp) {
      return res.status(400).json({ msg: "Invalid OTP. Please try again." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ mobileNumber }, { email }] });

    if (existingUser) {
      return res.status(400).json({ msg: "Mobile number or email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    async function generateUserId() {
      // Find the user with the highest `userid`
      const lastUser = await User.findOne().sort({ userid: -1 }).limit(1); // Sort by `userid` in descending order
      // Get the highest `userid` and increment it, default to "1000" if no users exist
      const nextUserId = lastUser ? Number(lastUser.userid) + 1 : 1000;
      return nextUserId.toString();
    }

    const newUser = new User({
      name,
      mobilenumber: mobileNumber,
      email,
      password: passwordHash,
      userid: await generateUserId(), // Generate the next unique `userid`
      authType: 'regular',
      verified: "true",
    });
    const savedUser = await newUser.save();

    const point = new Point({
      dbuserid: savedUser._id,
      userid: savedUser.userid,
      useremail: savedUser.email,
    })

    const wallet = new Wallet({
      dbuserid: savedUser._id,
      userid: savedUser.userid,
      useremail: savedUser.email,
    })

    const savedPoint = await point.save();
    const savedWallet = await wallet.save();

    //delete tempIser
    await TempUser.findOneAndDelete({ mobileNumber: mobileNumber });

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    const userData = {
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
      mobilenumber: savedUser.mobilenumber,
      name: savedUser.name,
      role: savedUser.role,
      userid: savedUser.userid,
      _id: savedUser._id,
      picturePath: savedUser.picturePath,
    }

    // sendEmail(email,`Please verify you account!`,
    //   `Dear user,\n
    //   Thank you for registering on Gammerce\n
    //   Please click below to verify your email address.\n\n
    //   ${process.env.REDIRECT_DOMAIN}/verification/${savedUser._id}/${token}\n\n

    //   If you did not request this, please ignore this email.\n\n
    //   Best Regards,\n
    //   Gammerce\n`)

    res.status(201).json(userData);
  } catch (err) {
    // res.json(res.body)
    res.status(500).json({ error: err.message });
  }
};