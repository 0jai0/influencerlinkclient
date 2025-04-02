import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/auth-slice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import objectsImage from "../assets/OBJECTS.png";
import logoImage from "../assets/logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    role: "influencer", // Default role
    mobile: "",
  });

  const [activeRole, setActiveRole] = useState("influencer"); // Track active role selection

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Handle role selection
  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setFormData({ ...formData, role });
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate("/login");
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
      role: activeRole, // Use the currently selected role
    };

    dispatch(registerUser(googleFormData));
    navigate("/login");
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
              <img 
                src={logoImage} 
                alt="PromoterLink Logo" 
                className="h-10 w-10 object-contain"
              />
              <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] bg-clip-text text-transparent">
                PromoterLink
              </h2>
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
          {error && (
            <div className="mb-0 p-1 text-red-400 text-start">
              {error} - Please try again
            </div>
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
                className="w-full px-4 py-3 bg-[#000000] text-white rounded-lg 
                          border border-gray-700 
                          placeholder-gray-500 transition-all"
              />
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

            {/* Submit Button */}
            <div className="flex justify-center">
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
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Google OAuth */}
          <div className="text-center">
            <GoogleOAuthProvider clientId="264166008170-nnjc496qlj2bvlhkgqg5v5qbd1fmdc33.apps.googleusercontent.com">
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