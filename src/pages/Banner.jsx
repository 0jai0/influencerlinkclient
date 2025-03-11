import React from "react";

const Banner = () => {
  return (
    <div className="h-40 md:h-48 bg-[#131313] my-4 mx-2 md:mx-4 p-6 md:p-10 rounded-lg flex flex-col items-start justify-center">
      <p
        className="text-xl md:text-xl font-light bg-gradient-to-r pl-4 md:pl-10 from-[#59FFA7] to-[#2BFFF8] text-transparent bg-clip-text"
        style={{ fontFamily: "League Spartan, sans-serif" }}
      >
        MAKE YOUR CONTENT
      </p>
      <p
        className="text-6xl md:text-8xl font-semibold pl-4 md:pl-10"
        style={{ fontFamily: "Jaro, sans-serif", color: "#2E2E2E" }}
      >
        GROW
      </p>
    </div>
  );
};

export default Banner;
