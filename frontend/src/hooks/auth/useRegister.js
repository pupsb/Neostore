import { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";

export const useRegister = () => {
  const { host } = useContext(VariableContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (name, mobileNumber, email, password) => {
    if (!name || !mobileNumber || !email || !password) {
      setMessage("Please fill in all fields.");
      autoClearMessage();
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch(`${host}/auth/createaccount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobileNumber, email, password }),
      });

      const data = await response.json();
      setLoading(false); // Stop loading

      if (!response.ok) {
        setMessage(data.msg || "Registration failed. Please try again.");
        autoClearMessage();
        return;
      }

      setMessage("OTP sent successfully. Please verify your account.");

    } catch (error) {
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
      autoClearMessage();
    }
  };

  const verifyAccount = async (name, mobileNumber, otp, email, password, setIsOtpSent) => {
    if (!otp || !mobileNumber) {
      setMessage("Please enter the OTP and Mobile Number.");
      autoClearMessage();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${host}/auth/verifyandregister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobileNumber, otp, email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setMessage(data.msg || "Verification failed. Please try again.");

        if (data.msg === "OTP has expired. Please request a new OTP.") {
          setIsOtpSent(false); // Reset to registration form
        }

        autoClearMessage();
        return;
      }

      setMessage("Mobile number verified successfully.");

    } catch (error) {
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
      autoClearMessage();
    }
  };

  // Auto-hide error messages after 5 seconds
  const autoClearMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  return { register, verifyAccount, message, loading };
};
