import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser,checkAuth } from "../store/auth-slice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import objectsImage from "../assets/OBJECTS.png";
import logoImage from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        dispatch(checkAuth());
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google credential response:', credentialResponse);
    
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Decoded JWT:', decoded);
    } catch (decodeError) {
      console.error('JWT decode error:', decodeError);
    }
  
    dispatch(loginUser({ 
      credential: credentialResponse.credential, 
      isGoogleAuth: true 
    }))
    .unwrap()
    .then(() => navigate("/"))
    .catch(error => {
      console.error('Google login dispatch error:', error);
    });
  };
  
  const handleGoogleFailure = () => {
    console.error("Google Login Failed");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col p-0 md:p-10 md:flex-row min-h-screen w-full">
      {/* Right Side - Image (Hidden on Mobile) */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${objectsImage})` }}></div>
      
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-black">
        <div className="w-full p-8 h-screen md:h-full bg-[#181818] lg:px-36 shadow-md">
          {/* Logo/Title */}
          <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
    
    <span className="relative z-10 flex items-center gap-0">
      <img 
        src="/text_logo.png"  // Ensure this path is correct for your project structure
        alt="Logo" 
        className="h-8 object-contain" 
        
      />
    </span>
  </div>
          </div>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 from-1% via-blue-400 via-20% to-blue-500 to-90% text-3xl">
  Welcome Back
</p>

          {/* Error Message */}
          {error && error !== "No token found" && (
  <div className="mb-0 p-1 text-red-400 text-start">
    {error} - Please try again
  </div>
)}
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    Logging in...
                  </span>
                ) : "Login"}
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

          {/* Don't have account link */}
          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{' '}
            <a href="/Register" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;