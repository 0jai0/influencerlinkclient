import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/auth-slice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {jwtDecode}  from "jwt-decode"; // For decoding the JWT token

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get loading, error, and authentication state from Redux
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/Main"); // Redirect on successful login
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Handle Google login success
  // Update the handleGoogleSuccess function
  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google credential response:', credentialResponse);
    
    // Decode the JWT to see its contents (for debugging only)
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
    .then(() => navigate("/Main"))
    .catch(error => {
      console.error('Google login dispatch error:', error);
      // Show user-friendly error message
    });
  };
  
  // Handle Google login failure
  const handleGoogleFailure = () => {
    console.error("Google Login Failed");
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Main");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {/* Display error message if any */}
        {error && (
          <div className="p-3 text-red-600 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white rounded-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Google Login */}
        <div className="text-center">
          <p className="text-gray-600">Or</p>
          <GoogleOAuthProvider clientId="264166008170-nnjc496qlj2bvlhkgqg5v5qbd1fmdc33.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap // Optional: Enable one-tap sign-in
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default Login;