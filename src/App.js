import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UpdateProfile from "./pages/UpdateProfile";
import Main from "./pages/Main";
import Chat from "./pages/Message";
import Payment from "./pages/Payment";
import Profile from "./pages/ViewProfile";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";
import { checkAuth } from "./store/auth-slice";
import AboutUs from "./pages/AboutUs";
import RegisterUser from "./pages/RegisterUser";
import PrivateRoute from "./PrivateRoute";
import { requestNotificationPermission } from "./firebase"; // Import Firebase function
import AdminLogin from "./pages/AdminLogin";
import InstagramOTPDashboard from "./pages/InstagramOTPDashboard";


function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get user from Redux state

  useEffect(() => {
    dispatch(checkAuth());

    if (user?._id) {
      requestNotificationPermission(user?._id); // Pass userId to the function
    }
  }, [dispatch, user?._id]); // Re-run when user.id changes

  useEffect(() => {
    if (window.location.pathname === '/sitemap-dynamic.xml') {
      window.location.href = 'https://influencerlink-598325568359.us-central1.run.app/sitemap-dynamic.xml';
      return;
    }
    if (window.location.pathname === '/sitemap.xml') {
      // Let it load from public folder
      return;
    }
  }, []);
  return (
    <Router>
      <div className="min-h-screen flex justify-center items-center custom-scrollbar bg-black">
        <Routes>
          <Route path="/Register" element={<Register />} />
          <Route path="/RegisterUser" element={<RegisterUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminLogin" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route path="/UpdateProfile" element={<PrivateRoute element={<UpdateProfile />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<InstagramOTPDashboard />} />} />
          <Route path="/" element={<Main />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Profile/:userId" element={<Profile />} />
          <Route path="/payment" element={<PrivateRoute element={<Payment />} />} />
          <Route path="/payment-success" element={<PrivateRoute element={<PaymentSuccess />} />} />
          <Route path="/payment-failure" element={<PrivateRoute element={<PaymentFailure />} />} />
          <Route path="/MessagingApp/:userId" element={<PrivateRoute element={<Chat />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
