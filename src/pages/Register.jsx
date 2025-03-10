import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/auth-slice"; // Import Redux action

const Register = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get loading, error, and authentication state from Redux
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting registration data:", formData); 
    
    const resultAction = await dispatch(registerUser(formData)); // Dispatch register action
    
    if (registerUser.fulfilled.match(resultAction)) {
      // Registration successful, navigate to login
      alert("Registration successful! Please log in.");
      navigate("/login");
    } else {
      // Registration failed, show error message
      alert(resultAction.payload || "Registration failed.");
    }
  };

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate("/dashboard");
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          value={formData.ownerName} // Controlled input
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          value={formData.email} // Controlled input
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          value={formData.password} // Controlled input
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          value={formData.mobile} // Controlled input
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error message */}
      <p className="mt-2 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
