import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/auth/useRegister";
import {
  FaUserAlt,
  FaEnvelope,
  FaMobileAlt,
  FaLock,
  FaGoogle
} from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { VariableContext } from "../../context/VariableContext";

const Register = () => {
  const { host } = useContext(VariableContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { register, verifyAccount, message, loading } = useRegister();

  useEffect(() => {
    if (message === "OTP sent successfully. Please verify your account.") {
      setIsOtpSent(true);
    } else if (message === "Mobile number verified successfully.") {
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [message, navigate]);

  const handleRegister = async () => {
    await register(name, mobileNumber, email, password);
  };

  const handleVerify = async () => {
    await verifyAccount(name, mobileNumber, otp, email, password, setIsOtpSent);
  };

  const googleAuth = () => {
    window.open(`${host}/auth/google/callback`, "_self");
  };

  return (
    <div className="sm:mt-4 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md dark:bg-[#0077B6] rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isOtpSent ? "Verify Your Account" : "Create Your Account"}
          </h1>
          <p className="text-[#03045E] text-sm">
            {isOtpSent ? "Enter the OTP sent to your mobile number" : "Join NeoStore and start your gaming journey"}
          </p>
        </div>

        {/* Google Sign Up */}
        {/* <button
          onClick={googleAuth}
          disabled={loading} // Disable when loading
          className={`w-full flex items-center justify-center bg-white text-gray-800 py-3 rounded-lg mb-4 hover:bg-gray-100 transition-colors space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          <FaGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button> */}

        {/* Divider */}
        {/* <div className="relative text-center my-6">
          <span className=" px-4 text-gray-400 relative z-10">
            OR
          </span>
          <div className="absolute top-1/2 left-0 right-0 border-t border-gray-900 transform -translate-y-1/2"></div>
        </div> */}

        {/* Registration Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {!isOtpSent && (
            <>
              {/* Name Input */}
              <div className="relative">
                <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1D495C] text-black rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-[#FF962D]"
                  required
                  disabled={loading}
                />
              </div>

              {/* Mobile Number Input */}
              <div className="relative">
                <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1D495C] text-black rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-[#FF962D]"
                  pattern="[0-9]{10}"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1D495C] text-black rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-[#FF962D]"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#1D495C] text-black rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-[#FF962D]"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
            </>
          )}

          {/* OTP Input - Visible only after OTP is sent */}
          {isOtpSent && (
            <div className="relative">
              <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1D495C] text-black rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-[#FF962D]"
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Display Message */}
          {message && (
            <p className={`text-center text-sm font-medium mt-2 ${message.includes("successfully") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            onClick={isOtpSent ? handleVerify : handleRegister}
            disabled={loading}
            className={`w-full bg-[#E02424] text-white py-3 rounded-lg hover:bg-[#E02440] transition-colors flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading && (
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading
              ? isOtpSent
                ? "Verifying..."
                : "Creating..."
              : isOtpSent
                ? "Verify"
                : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 text-[#03045E]">
          Already have an account?{" "}
          <NavLink to="/login" className="text-white hover:underline">
            Login here
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;