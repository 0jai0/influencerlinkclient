import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/auth-slice";
import logoImage from "../assets/logo.png";
import Navbar from './Navbar';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [adminError, setAdminError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminError("");
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        if (resultAction.payload.user.role === "admin") {
          navigate("/dashboard");
        } else {
          setAdminError("Access restricted to administrators only");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/dashboard");
    } else if (isAuthenticated && user?.role !== "admin") {
      setAdminError("Access restricted to administrators only");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 md:p-8">
        <Navbar />
      {/* Main Container */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">
        {/* Left Side - Image (Hidden on mobile) */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#59FFA7] to-[#2BFFF8] items-center justify-center p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img 
                src={logoImage} 
                alt="Admin Logo" 
                className="h-14 w-14 object-contain"
              />
              <h2 className="text-4xl font-bold text-black">Admin Portal</h2>
            </div>
            <p className="text-gray-800 text-lg">
              Secure access to the administration dashboard
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 bg-[#181818] p-6 md:p-10 border border-gray-700">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-8">
            <img 
              src={logoImage} 
              alt="Admin Logo" 
              className="h-10 w-10 object-contain"
            />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8]">
              Admin Portal
            </h2>
          </div>

          <div className="max-w-md mx-auto">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-xl mb-2">
              Administrator Sign In
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Enter your credentials to access the dashboard
            </p>

            {/* Error Messages */}
            {error && (
              <div className="mb-6 p-3 text-red-400 text-sm bg-red-900/30 rounded-lg border border-red-800">
                {error}
              </div>
            )}
            {adminError && (
              <div className="mb-6 p-3 text-yellow-400 text-sm bg-yellow-900/30 rounded-lg border border-yellow-800">
                {adminError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    required
                    className="w-full px-4 py-3 bg-black text-white rounded-lg 
                              border border-gray-700 focus:border-[#59FFA7]
                              focus:ring-1 focus:ring-[#59FFA7] placeholder-gray-500
                              transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-black text-white rounded-lg 
                              border border-gray-700 focus:border-[#59FFA7]
                              focus:ring-1 focus:ring-[#59FFA7] placeholder-gray-500
                              transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-700 bg-black text-[#59FFA7] 
                              focus:ring-[#59FFA7] focus:ring-offset-gray-800"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a 
                    href="/forgot-password" 
                    className="font-medium text-[#59FFA7] hover:text-[#2BFFF8]"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center px-6 py-3 rounded-lg 
                          border border-[#59FFA7] text-white font-medium
                          bg-gradient-to-r from-[#59FFA7]/10 to-[#2BFFF8]/10
                          hover:from-[#59FFA7] hover:to-[#2BFFF8] hover:text-black
                          transition-all duration-300 ${isLoading ? "opacity-75" : ""}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : "Sign In"}
              </button>
            </form>

            {/* Security Footer */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} Admin Portal. All rights reserved.
                <br />
                Unauthorized access is strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;