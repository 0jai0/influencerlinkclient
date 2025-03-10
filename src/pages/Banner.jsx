import React from "react";

const Banner = () => {
  return (
    <div className="h-48 bg-[#131313] my-4 m-1 p-10 rounded-lg flex flex-col items-start justify-center">
      <p className="text-sm font-light bg-gradient-to-r pl-10 from-[#59FFA7] to-[#2BFFF8] text-transparent bg-clip-text" style={{ fontFamily: "League Spartan, sans-serif" }}>
        MAKE YOUR CONTENT
      </p>
      <p className="text-8xl font-semibold" style={{ fontFamily: "Jaro, sans-serif", color: "#2E2E2E" }}>
        GROW
      </p>
    </div>
  );
};

export default Banner;
