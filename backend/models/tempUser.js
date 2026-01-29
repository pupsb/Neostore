import mongoose from "mongoose";

const TempUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate mobile numbers
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate emails
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: Number, // OTP as a number
        required: true,
    },
    otpExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
        index: { expires: '10m' } // Auto-delete after expiry
    },
    otpLastSent: {
        type: Date,
        default: Date.now,
    },
    otpAttempts: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export default mongoose.model("TempUser", TempUserSchema);
