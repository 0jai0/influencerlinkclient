import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react"; // Import icons for menu toggle
import Payment from "./Payment";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const menuRef = useRef(null);

  // Close navbar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="flex justify-between items-center p-4 bg-[#151515] text-white relative">
      {/* Logo Section */}
      <div className="text-2xl font-bold flex items-center">
        <span className="text-[#59FFA7]">AD</span>VERTIZER
      </div>

      {/* Buttons Section - Desktop & Mobile */}
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
          >
            {item}
          </button>
        ))}
      </div>

      {/* User Section - Keep at End */}
      <div className="ml-auto flex items-center bg-black rounded-3xl h-10 w-24 pl-2">
        {user && (
          <div className="flex items-center">
            <button
              onClick={() => setShowPayment(true)}
              className="text-[#59FFA7] text-sm font-semibold"
            >
              LinkCoins: {user?.linkCoins}
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <>
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white shadow-lg p-8 z-[1000] flex flex-col justify-center items-center rounded-lg"
          >
            <Payment onClose={() => setShowPayment(false)} />
          </div>
          <div
            onClick={() => setShowPayment(false)}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[999]"
          ></div>
        </>
      )}

      {/* Hamburger Menu - Mobile View */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
