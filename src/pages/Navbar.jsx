import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Import icons for menu toggle

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-[#151515] text-white">
      {/* Logo Section */}
      <div className="text-2xl font-bold flex items-center">
        <span className="text-[#59FFA7]">AD</span>VERTIZER
      </div>

      {/* Hamburger Menu - Mobile View */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Buttons Section - Desktop & Mobile */}
      <div className={`z-50 md:flex items-center space-x-4 ${isOpen ? " absolute top-16 left-0 w-full bg-[#151515] p-2 flex flex-col items-center" : "hidden md:flex"}`}>
        <button className="px-4 py-2 border-2 rounded-md font-semibold bg-transparent 
          text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] 
          hover:text-white hover:bg-gradient-to-r hover:from-[#59FFA7] hover:to-[#2BFFF8] 
          active:bg-gradient-to-r active:from-[#59FFA7] active:to-[#ED6F39] active:text-black 
          border-transparent w-full md:w-auto"
        >
          HOME
        </button>
        <button className="px-4 py-2 border-2 rounded-md font-semibold bg-transparent 
          text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] 
          hover:text-white hover:bg-gradient-to-r hover:from-[#59FFA7] hover:to-[#2BFFF8] 
          active:bg-gradient-to-r active:from-[#59FFA7] active:to-[#ED6F39] active:text-black 
          border-transparent w-full md:w-auto"
        >
          ABOUT US
        </button>
        <button className="px-4 py-2 border-2 rounded-md font-semibold bg-transparent 
          text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] 
          hover:text-white hover:bg-gradient-to-r hover:from-[#59FFA7] hover:to-[#2BFFF8] 
          active:bg-gradient-to-r active:from-[#59FFA7] active:to-[#ED6F39] active:text-black 
          border-transparent w-full md:w-auto"
        >
          INFLUENCER
        </button>
        <button className="px-4 py-2 border-2 rounded-md font-semibold bg-transparent 
          text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] 
          hover:text-white hover:bg-gradient-to-r hover:from-[#59FFA7] hover:to-[#2BFFF8] 
          active:bg-gradient-to-r active:from-[#59FFA7] active:to-[#ED6F39] active:text-black 
          border-transparent w-full md:w-auto"
        >
          PUBLISH AD
        </button>
      </div>

      {/* User Icon */}
      <div className="hidden md:block w-8 h-8 bg-gray-300 rounded-full"></div>
    </nav>
  );
};

export default Navbar;