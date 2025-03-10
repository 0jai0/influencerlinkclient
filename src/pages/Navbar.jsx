import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-[#151515] text-white">
      {/* Logo Section */}
      <div className="text-2xl font-bold flex items-center">
        <span className="text-[#59FFA7]">AD</span>VERTIZER
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <a
          href="#"
          className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] bg-clip-text text-transparent hover:from-[#59FFA7] hover:to-[#2BFFF8]"
        >
          HOME
        </a>
        <a
          href="#"
          className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] bg-clip-text text-transparent hover:from-[#59FFA7] hover:to-[#2BFFF8]"
        >
          ABOUT US
        </a>
      </div>

      {/* Buttons Section */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 border-2 rounded-md font-semibold bg-transparent 
          text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] 
          hover:text-white hover:bg-gradient-to-r hover:from-[#59FFA7] hover:to-[#2BFFF8] 
          active:bg-gradient-to-r active:from-[#59FFA7] active:to-[#ED6F39] active:text-black 
          border-transparent"
        >
          INFLUENCER
        </button>

        <button className="px-4 py-2 border-2 border-transparent bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] 
          text-black font-semibold rounded-md 
          hover:from-[#59FFA7] hover:to-[#2BFFF8] 
          active:from-[#59FFA7] active:to-[#2BFFF8] active:text-black"
        >
          PUBLISH AD
        </button>
      </div>

      {/* User Icon */}
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
    </nav>
  );
};

export default Navbar;
