
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EditPage from "./pages/EditPage";
import UpdateProfile from "./pages/UpdateProfile";
import Dashboard from "./pages/Dashboard";
import Main from "./pages/Main";
import Text from "./pages/text";
import Chat from './pages/Message';
import { checkAuth } from "./store/auth-slice";

function App() {

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen flex justify-center items-center bg-black">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/EditPage" element={<EditPage />} />
          <Route path="/UpdateProfile" element={<UpdateProfile />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/text" element={<Text />} />
          <Route path="/MessagingApp/:userId" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
