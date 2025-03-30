import "./App.css";
import { useDispatch } from "react-redux";
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
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute

function App() {
  const dispatch = useDispatch();
  

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen flex justify-center items-center custom-scrollbar bg-black">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/UpdateProfile" element={<PrivateRoute element={<UpdateProfile />} />} />
          <Route path="/Main" element={<PrivateRoute element={<Main />} />} />
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
