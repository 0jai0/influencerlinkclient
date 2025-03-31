import React from "react";

const Banner = () => {
  return (
    <div className="h-40 md:h-48 bg-[#131313] my-4 mx-2 md:mx-4 p-1 md:p-1 rounded-lg flex flex-col items-start justify-center">
      <div className="relative h-full w-full rounded-xl overflow-hidden group transition-all duration-300">
  {/* Gradient background layer */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] to-[#1F1F1F] opacity-90"></div>
  
  {/* Animated grid pattern */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute inset-0 bg-[length:50px_50px] bg-[linear-gradient(to_right,#2BFFF8_1px,transparent_1px),linear-gradient(to_bottom,#2BFFF8_1px,transparent_1px)] animate-[gridMove_30s_linear_infinite]"></div>
  </div>

  {/* Content container */}
  <div className="relative z-10 w-full h-full flex flex-col justify-center items-start">
    <div className="mb-4 pl-6 md:pl-12 lg:pl-16">
      <p
        className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wider animate-[fadeIn_1s_ease-out]"
        style={{ 
          fontFamily: "League Spartan, sans-serif",
          background: "linear-gradient(90deg, #59FFA7 0%, #2BFFF8 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 12px rgba(89, 255, 167, 0.4)"
        }}
      >
        MAKE YOUR CONTENT
      </p>
    </div>
    
    <div className="relative pl-6 md:pl-12 lg:pl-16">
      <p
        className="text-7xl md:text-8xl lg:text-9xl font-bold leading-none animate-[scaleIn_1s_ease-out]"
        style={{ 
          fontFamily: "Jaro, sans-serif",
          color: "#2E2E2E",
          textShadow: "6px 6px 0 #000, 8px 8px 0 rgba(89, 255, 167, 0.25)",
          WebkitTextStroke: "1.5px #59FFA7",
          letterSpacing: "2px"
        }}
      >
        GROW
      </p>
      
    </div>
  </div>

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
