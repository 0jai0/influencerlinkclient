import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/auth-slice"; // Assuming you have a registerUser action
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // For decoding the JWT token

const Register = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    role: "influencer",
    mobile: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

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
        navigate("/Main");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    // Decode the JWT token to get user info
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded Google JWT:", decoded);

    const { email, name: ownerName, sub } = decoded;

    // Merge Google login with formData
    const googleFormData = {
      ...formData, // Preserve existing form data
      ownerName: ownerName || formData.ownerName, // Fallback to existing if Google name is missing
      email,
      password: sub, // Use Google ID as a pseudo-password
    };

    // Dispatch a Redux action to handle Google registration
    dispatch(registerUser(googleFormData));
    navigate("/Main");
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
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

        {/* Display error message if any */}
        {error && (
          <div className="p-3 text-red-600 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

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
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Google Login for Registration */}
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

export default Register;