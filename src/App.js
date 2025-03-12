
import './App.css';
import { useDispatch } from "react-redux";
import React, {  useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UpdateProfile from "./pages/UpdateProfile";
import Main from "./pages/Main";
import Chat from './pages/Message';
import Payment from './pages/Payment';
import PaymentFailure from './pages/PaymentFailure';
import PaymentSuccess from "./pages/PaymentSuccess";
import { checkAuth } from "./store/auth-slice";

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
          <Route path="/UpdateProfile" element={<UpdateProfile />} />
          <Route path="/Main" element={<Main />} />
          <Route path="payment" element={<Payment/>} />
          <Route path="/payment-success" element={<PaymentSuccess/>} />
          <Route path="/payment-failure" element={<PaymentFailure/>} />
          <Route path="/MessagingApp/:userId" element={<Chat />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
