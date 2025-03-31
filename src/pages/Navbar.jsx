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
    <nav className="flex justify-between items-center p-4 bg-[#151515] text-white relative">
      {/* Logo Section */}
      <div 
      onClick={() => navigate("/main")}
      className="text-l font-bold flex items-center">
        <span className="text-[#59FFA7]">PROMOTER</span>LINK
      </div>

      {/* Navigation Buttons */}
      <div
        ref={menuRef}
        className={`z-50 md:flex items-center space-x-4 ${
          isOpen
            ? "absolute top-16 w-[97%] left-0 bg-[#151515] p-2 flex flex-col items-center shadow-lg"
            : "hidden md:flex"
        }`}
      >
        {["HOME", "ABOUT US", "INFLUENCER", "PUBLISH AD"].map((item) => (
          <button
            key={item}
            className="px-4 py-2 border-2 rounded-md font-semibold bg-transparent 
            text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] 
            hover:text-white hover:bg-gradient-to-r hover:from-[#59FFA7] hover:to-[#2BFFF8] 
            active:bg-gradient-to-r active:from-[#59FFA7] active:to-[#ED6F39] active:text-black 
            border-transparent w-full md:w-auto"
            onClick={() => navigate(routes[item])}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right-Aligned Buttons */}
      <div className="flex items-center gap-3 relative" ref={userCardRef}>
        {/* LinkCoins Button */}
        {user && (
          <button
            onClick={() => setShowPayment(true)}
            className="bg-black rounded-3xl h-10 px-4 text-[#59FFA7] text-sm font-semibold flex items-center"
          >
            LinkCoins: {user?.linkCoins}
          </button>
        )}

        {/* Profile Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors relative"
            aria-label="User menu"
          >
            <User className="text-[#59FFA7]" size={24} />
            {showUserDropdown && (
              <UserDropdown onClose={() => setShowUserDropdown(false)} />
            )}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px]  shadow-lg p-8 z-[1000] flex flex-col justify-center items-center rounded-lg">
            <Payment onClose={() => setShowPayment(false)} />
          </div>
          <div
            onClick={() => setShowPayment(false)}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[999]"
          ></div>
        </>
      )}

      {/* Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;