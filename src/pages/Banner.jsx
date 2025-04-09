import React from "react";

const Banner = () => {
  return (
    <div className="h-64 md:h-80 bg-[#131313] my-1 mx-1 md:mx-4 p-1 md:p-1 rounded-lg flex flex-col items-start justify-center">
      <div className="relative h-full w-full rounded-xl overflow-hidden group transition-all duration-300">
      <img 
        src="/web_baner_1.jpg"  // Ensure this path is correct for your project structure
        alt="Logo" 
        className=" object-contain items-center justify-center" 
        
      />
  {/* Interactive elements */}
  {/* Interactive elements - hidden on mobile, visible on md and up */}
<div className="absolute bottom-8 right-8 hidden md:block">
  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black font-medium hover:shadow-lg hover:shadow-[#59FFA7]/30 transition-all duration-300 transform hover:scale-105">
    Get Started
  </button>
</div>

  {/* Shimmer effect */}
  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-[shimmer_3s_infinite]"></div>
</div>
    </div>
  );
};

export default Banner;
