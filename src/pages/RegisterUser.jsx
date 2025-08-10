import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/auth-slice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import objectsImage from "../assets/OBJECTS.png";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "", // Add confirm password field
    role: "user", // Default role
    mobile: "",
  });

  const [activeRole, setActiveRole] = useState("user"); // Track active role selection
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState(""); // For password validation

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Handle role selection
  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setFormData({ ...formData, role });
    // Reset OTP state when role changes
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear password error when typing
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
  };

  // Send OTP to user's email
  const handleSendOtp = async () => {
    if (!formData.email || !formData.ownerName) {
        setOtpError("Please enter both name and email");
        return;
    }

    try {
        setLoadingOtp(true);
        setOtpError("");
        
        await axios.post(
            `${process.env.REACT_APP_SERVER_API}/api/otp/send-otp`, 
            { 
                userId: formData.email
            }
        );

        // If successful
        setOtpSent(true);
        setLoadingOtp(false);
        
    } catch (err) {
        setLoadingOtp(false);
        
        // Check if the error is about existing user
        console.log(err.response);
        if (err.response && err.response.status === 404) {
          setOtpError("Email already registered. Please login instead.");
        } 
        // Check for other specific errors
        else if (err.response && err.response.data && err.response.data.message) {
            setOtpError(err.response.data.message);
        } 
        // Generic error
        else {
            setOtpError("Failed to send OTP. Please try again.");
        }
        
        //console.error("OTP send failed:", err);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    try {
      setLoadingVerify(true);
      setOtpError("");
      
      // In a real app, you would call your backend API here
      // For demo, we'll compare with our generated OTP
      //console.log("iui");
      const response = await axios.get(`${process.env.REACT_APP_SERVER_API}/api/otp/userId`, {
        params: {
          userId: formData.email,
        },
      });
      
      //console.log(response.data.otpDetails.otp, " ", otp);
      // Demo: Compare with our generated OTP
      if (otp === response.data.otpDetails.otp) {
        setOtpVerified(true);
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
      
      setLoadingVerify(false);
    } catch (err) {
      setLoadingVerify(false);
      setOtpError("OTP verification failed. Please try again.");
      console.error("OTP verification failed:", err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    // Validate password strength (optional)
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/UpdateProfile");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { email, name: ownerName, sub } = decoded;

    const googleFormData = {
      ...formData,
      ownerName: ownerName || formData.ownerName,
      email,
      password: sub,
      confirmPassword: sub, // Set confirm password same as password for Google signup
      role: activeRole, // Use the currently selected role
    };

    dispatch(registerUser(googleFormData));
    navigate("/UpdateProfile");
  };

  // Handle Google login failure
  const handleGoogleFailure = () => {
    console.error("Google Login Failed");
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col p-0 md:p-10 md:flex-row min-h-screen w-full">
      {/* Right Side - Image (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${objectsImage})` }}></div>
      
      {/* Left Side - Registration Form */}
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
          </div>
          
          {/* Role Selection Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleRoleSelect("user")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${
                activeRole === "user" 
                  ? "bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black"
                  : "bg-gray-800 text-white border border-gray-700 hover:border-[#59FFA7]"
              }`}
            >
              Register as Brand
            </button>
            <button
              onClick={() => handleRoleSelect("influencer")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${
                activeRole === "influencer" 
                  ? "bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black"
                  : "bg-gray-800 text-white border border-gray-700 hover:border-[#59FFA7]"
              }`}
            >
              Register as Creator
            </button>
          </div>

          <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-xl mt-2 text-start">
            {activeRole === "user" ? "Brand Registration" : "Creator Registration"}
          </p>

          {/* Error Message */}
          {error && error !== "No token found" && (
            <div className="mb-0 p-1 text-red-400 text-start">
              {error} - Please try again
            </div>
          )}
          {otpError && (
            <div className="text-red-400 text-sm ">{otpError}</div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Name Field */}
            <div>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                disabled={otpSent}
                className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                          border border-gray-700 
                          placeholder-gray-500 transition-all"
              />
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                disabled={otpSent}
                className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                          border border-gray-700 
                          placeholder-gray-500 transition-all"
              />
            </div>

            {/* OTP Section */}
            {!otpSent ? (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loadingOtp || !formData.email || !formData.ownerName}
                  className={`w-[200px] items-center px-4 py-2 rounded-xl transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black
                            ${loadingOtp ? "bg-gray-600 cursor-not-allowed" : ""}`}
                >
                  {loadingOtp ? (
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
            ) : !otpVerified ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                              border border-gray-700 
                              placeholder-gray-500 transition-all"
                  />
                </div>
                
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loadingVerify || !otp}
                    className={`w-[200px] items-center px-4 py-2 rounded-xl transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black
                              ${loadingVerify ? "bg-gray-600 cursor-not-allowed" : ""}`}
                  >
                    {loadingVerify ? (
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
            ) : (
              <>
                <div className="text-green-400 text-center py-2">
                  OTP verified successfully!
                </div>

                {/* Password Field */}
                <div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                              border border-gray-700 
                              placeholder-gray-500 transition-all"
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                    className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                              border border-gray-700 
                              placeholder-gray-500 transition-all"
                  />
                </div>

                {/* Password Error Message */}
                {passwordError && (
                  <div className="text-red-400 text-sm">{passwordError}</div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-[200px] items-center px-4 py-2 rounded-xl transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black
                              ${isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-[#00000] text-black hover:bg-blue-700"}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </span>
                    ) : "Register"}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Divider - Only show if OTP is not verified */}
          {!otpVerified && (
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>
          )}

          {/* Google OAuth - Only show if OTP is not verified */}
          {!otpVerified && (
            <div className="text-center">
              <GoogleOAuthProvider clientId="446936445912-fogcabgjh9t9ar2e3qap1le4qjudnocp.apps.googleusercontent.com">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={handleGoogleFailure} 
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  size="large"
                  text="signup_with"
                  width="100%"
                />
              </GoogleOAuthProvider>
            </div>
          )}

          {/* Already have account link */}
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;