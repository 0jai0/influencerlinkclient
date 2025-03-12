import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react"; // Import icons for menu toggle

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  console.log(user);

  return (
    <nav className="flex justify-between items-center p-4 bg-[#151515] text-white">
      {/* Logo Section */}
      <div className="text-2xl font-bold flex items-center">
        <span className="text-[#59FFA7]">AD</span>VERTIZER
      </div>
      
      

      {/* Buttons Section - Desktop & Mobile */}
      <div className={`z-50 md:flex items-center space-x-4 ${isOpen ? "absolute top-16 w-[97%] left-0  bg-[#151515] p-2 flex flex-col items-center shadow-lg" : "hidden md:flex"}`}>
        {["HOME", "ABOUT US", "INFLUENCER", "PUBLISH AD"].map((item) => (
          <button key={item} className="px-4 py-2 border-2 rounded-md font-semibold bg-transparent 
            text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] 
            hover:text-white hover:bg-gradient-to-r hover:from-[#59FFA7] hover:to-[#2BFFF8] 
            active:bg-gradient-to-r active:from-[#59FFA7] active:to-[#ED6F39] active:text-black 
            border-transparent w-full md:w-auto">
            {item}
          </button>
        ))}
      </div>
      {/* User Section - Keep at End */}
      <div className="ml-auto flex  items-center bg-black rounded-3xl h-10 w-24 pl-2 ">
        {user && (
          <div className="flex items-center ">
            <span className="text-[#59FFA7] text-sm font-semibold">
              LinkCoins: {user?.linkCoins}
            </span>
          </div>
        )}
      </div>
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
