// Update your Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import Payment from "./Payment";
import UserDropdown  from "./User"; // Import the new UserCard

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const routes = {
    "HOME": "/Main",
    "ABOUT US": "/aboutus",
    "INFLUENCER": "/login",
    "PUBLISH AD": "/login"
  };

  // Close navbar if clicked outside
  const menuRef = useRef(null);
  const userCardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-[#151515] text-white border-b border-gray-800 sticky top-0 z-50">
  {/* Hamburger Menu */}
  <div className="md:hidden">
    <button 
      onClick={() => setIsOpen(!isOpen)}
      className="p-2 rounded-full hover:bg-[#2a2a2a] transition-colors"
    >
      {isOpen ? (
        <X size={24} className="text-[#59FFA7]" />
      ) : (
        <Menu size={24} className="text-[#59FFA7]" />
      )}
    </button>
  </div>

  {/* Logo Section */}
  <div 
    onClick={() => navigate("/main")}
    className="text-xl font-bold flex items-center cursor-pointer group"
  >
    <span className="text-[#59FFA7] group-hover:text-[#2BFFF8] transition-colors">PROMOTER</span>
    <span className="group-hover:text-gray-300 transition-colors">LINK</span>
  </div>

  {/* Navigation Buttons */}
  <div
    ref={menuRef}
    className={`z-50 md:flex items-center space-x-1 ${
      isOpen
        ? "absolute top-16 left-0 right-0 mx-4 bg-[#202020] p-4 flex flex-col items-center space-y-3 rounded-xl shadow-2xl border border-gray-700"
        : "hidden md:flex"
    }`}
  >
    {["HOME", "ABOUT US", "INFLUENCER", "PUBLISH AD"].map((item) => (
      <button
        key={item}
        className={`px-4 py-2 rounded-full font-medium transition-all duration-300
          bg-transparent text-white hover:bg-gradient-to-r hover:from-[#59FFA7]/20 hover:to-[#2BFFF8]/20
          border border-transparent hover:border-[#59FFA7]/30
          relative overflow-hidden group w-full md:w-auto text-center`}
        onClick={() => navigate(routes[item])}
      >
        <span className="relative z-10">{item}</span>
        <span className="absolute inset-0 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] opacity-0 group-hover:opacity-10 transition-opacity"></span>
      </button>
    ))}
  </div>

  {/* Right-Aligned Buttons */}
  <div className="flex items-center gap-3 relative" ref={userCardRef}>
   {/* LinkCoins Button */}
   {user && (
  <button
    onClick={() => setShowPayment(true)}
    className="bg-[#202020] rounded-full h-10 px-1 pr-1 text-[#59FFA7] text-sm font-medium flex items-center gap-2
      border border-[#59FFA7]/30 hover:border-[#59FFA7]/50 transition-colors
      group relative overflow-hidden hover:shadow-[0_0_8px_rgba(89,255,167,0.3)]"
  >
    <span className="relative z-10 flex items-center gap-0">
      <img 
        src="coin.png"  // Ensure this path is correct for your project structure
        alt="LinkCoins" 
        className="w-8 h-8 object-contain" 
        
      />
      <span className="text-white font-bold">{user?.linkCoins}</span>
      <span className="hidden sm:inline">LinkCoins</span>
    </span>
    <span className="absolute inset-0 bg-[#59FFA7]/5 group-hover:bg-[#59FFA7]/10 transition-colors duration-200"></span>
  </button>
)}

    {/* Profile Button */}
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        className="p-2 rounded-full hover:bg-[#2a2a2a] transition-colors relative group"
        aria-label="User menu"
      >
        <div className="relative">
          <User className="text-[#59FFA7] group-hover:text-[#2BFFF8] transition-colors" size={24} />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#2BFFF8] rounded-full animate-pulse"></span>
        </div>
        {showUserDropdown && (
          <UserDropdown onClose={() => setShowUserDropdown(false)} />
        )}
      </button>
    </div>
  </div>

  {/* Payment Modal Backdrop */}
  {showPayment && (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[999]" onClick={() => setShowPayment(false)}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-[#202020] border border-gray-700 shadow-2xl rounded-xl p-6 z-[1000]">
        <Payment onClose={() => setShowPayment(false)} />
      </div>
    </>
  )}
</nav>
  );
};

export default Navbar;