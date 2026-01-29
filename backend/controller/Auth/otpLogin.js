import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { sendOtp, sendOneApiOtp } from "../../sendOtp.js";
import jwt from "jsonwebtoken";

export const checkMobileNumber = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobilenumber: mobile });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "Mobile Number not registered with us. Please try other login methods or register.",
      });
    }

    if (user.otpLastSent && user.otpLastSent > Date.now() - 120000) {
      return res.status(201).send({
        success: false,
        message: "Otp Already Sent...Please Wait for 2 minutes",
      });
    }

    const smsOTP = Math.floor(100000 + Math.random() * 900000); // Generate OTP
    const hashedOtp = await bcrypt.hash(String(smsOTP), 10); // Hash the OTP

    try {
      // await sendOtp(String(smsOTP), mobile); // Send plain OTP to the user
      sendOneApiOtp(smsOTP, mobile, user.name);
    } catch (error) {
      return res.status(201).send({
        success: false,
        error: error.message,
      });
    }

    const savedOtpUser = await User.findOneAndUpdate(
      { mobilenumber: mobile },
      {
        $set: {
          mobileOtp: hashedOtp, // Save the hashed OTP
          otpExpiresAt: Date.now() + 300000,
          otpLastSent: Date.now(),
        },
      },
      { new: true }
    );
    if (!savedOtpUser) {
      return res
        .status(201)
        .send({ success: false, message: "Error In saving Otp" });
    }
    return res.status(200).send({
      success: true,
      message: "Otp Sent Successfully...Please Verify",

    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Check Mobile Number Ctrl ${error.message}`,
    });
  }
};


export const verifyMobileController = async (req, res) => {

  try {
    const { mobile, otp } = req.body;
    const userExist = await User.findOne({ mobilenumber: mobile });
    if (!userExist) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    }

    const isOtpValid = await bcrypt.compare(String(otp), userExist.mobileOtp); // Compare OTP
    if (!isOtpValid) {
      return res.status(200).send({ success: false, message: "Incorrect OTP" });
    } else {
      const updateUser = await User.findOneAndUpdate(
        { mobilenumber: mobile },
        { $set: { verified: "true" }, mobileOtp: "", otpExpiresAt: null, otpLastSent: null },
        { new: true }
      );
      const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: '6h' });

      if (!updateUser) {
        return res
          .status(200)
          .send({ success: false, message: "Failed to Verify" });
      }
      return res.status(202).send({
        success: true,
        message: "Verified Successfully",
        token: token,
        user: updateUser

      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: `Verify Mobile Ctrl ${error.message}` });
  }
};


export const timer = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobilenumber: mobile });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "Mobile Number not registered with us",
      });
    }


    // console.log(Date.now())
    return res.status(201).send({
      success: true,
      timer: new Date(user.otpLastSent).getTime() - Date.now() + 120000,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Timer Ctrl ${error.message}`,
    });
  }
}

