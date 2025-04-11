import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import objectsImage from "../assets/OBJECTS.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await axios.post(`${process.env.REACT_APP_SERVER_API}/api/otp/send-otpFP`, { 
        userId: email.toLowerCase() 
      });

      setStep(2);
      setSuccess("OTP sent to your email address");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 404) {
        setError("No user found with this email address");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get(`${process.env.REACT_APP_SERVER_API}/api/otp/userId`, {
        params: {
          userId: email.toLowerCase(),
        },
      });
      
      if (otp === response.data.otpDetails.otp) {
        setStep(3);
        setSuccess("OTP verified successfully");
      } else {
        setError("Invalid OTP. Please try again.");
      }
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("OTP verification failed. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await axios.post(`${process.env.REACT_APP_SERVER_API}/api/pageowners/forget-password`, {
        email: email.toLowerCase(),
        newPassword
      });

      setSuccess("Password has been reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col p-0 md:p-10 md:flex-row min-h-screen w-full">
      {/* Right Side - Image (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${objectsImage})` }}></div>
      
      {/* Left Side - Forgot Password Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-black">
        <div className="w-full p-8 h-screen md:h-full bg-[#181818] lg:px-36 shadow-md">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="relative z-10 flex items-center gap-0">
                <img 
                  src="/text_logo.png"
                  alt="Logo" 
                  className="h-8 object-contain" 
                />
              </span>
            </div>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-2xl mt-4">
              Reset Your Password
            </h2>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 text-green-400 rounded-lg">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                            border border-gray-700 
                            placeholder-gray-500 transition-all"
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSendOtp}
                  disabled={loading || !email}
                  className={`w-[200px] items-center px-4 py-2 rounded-xl transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black
                            ${loading ? "bg-gray-600 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </span>
                  ) : "Send OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                            border border-gray-700 
                            placeholder-gray-500 transition-all"
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || !otp}
                  className={`w-[200px] items-center px-4 py-2 rounded-xl transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black
                            ${loading ? "bg-gray-600 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : "Verify OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                            border border-gray-700 
                            placeholder-gray-500 transition-all"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                            border border-gray-700 
                            placeholder-gray-500 transition-all"
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleResetPassword}
                  disabled={loading || !newPassword || !confirmPassword}
                  className={`w-[200px] items-center px-4 py-2 rounded-xl transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black
                            ${loading ? "bg-gray-600 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : "Reset Password"}
                </button>
              </div>
            </div>
          )}

          {/* Back to Login Link */}
          <p className="text-center mt-6 text-gray-400">
            Remember your password?{' '}
            <a href="/login" className="text-blue-500 hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;