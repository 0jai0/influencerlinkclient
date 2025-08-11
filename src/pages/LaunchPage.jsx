import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const LaunchPage = () => {
  const [role, setRole] = useState("influencer");
  const navigate = useNavigate();

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className="min-h-screen mt-[2500px] md:mt-[1600px] bg-black text-white">
        {/* Navigation Bar */}
        <nav className="bg-black border-b border-gray-800 py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="/text_logo.png"
                alt="Logo"
                className="h-8 mr-2"
                onClick={() => navigate("/")}
              />
            </div>
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => navigate("/AboutUs")}
                className="text-gray-300 hover:text-white"
              >
                About
              </button>
              <button
                onClick={() => navigate("/features")}
                className="text-gray-300 hover:text-white"
              >
                Features
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-gray-300 hover:text-white"
              >
                Contact
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-300 hover:text-white"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black font-medium rounded-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] bg-clip-text text-transparent">
              The Future of Brand-Creator Collaboration
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              A direct connection platform where brands find authentic voices
              and creators discover meaningful partnerships.
            </p>

            {/* Role Selection */}
            <div className="flex justify-center gap-4 mb-10">
              <button
                type="button"
                onClick={() => setRole("influencer")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-lg ${
                  role === "influencer"
                    ? "bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black"
                    : "bg-gray-800 text-white border border-gray-700 hover:border-[#59FFA7]"
                }`}
              >
                For Creators
              </button>
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-lg ${
                  role === "user"
                    ? "bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black"
                    : "bg-gray-800 text-white border border-gray-700 hover:border-[#59FFA7]"
                }`}
              >
                For Brands
              </button>
            </div>

            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black font-bold rounded-lg text-lg hover:opacity-90 transition-opacity mb-20"
            >
              Get Early Access Now
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8]">
              How Our Platform Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="text-[#59FFA7] text-2xl mb-4 font-bold">1</div>
                <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
                <p className="text-gray-300">
                  {role === "influencer"
                    ? "Showcase your audience, content style, and collaboration preferences."
                    : "Define your brand identity, campaign goals, and creator requirements."}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="text-[#59FFA7] text-2xl mb-4 font-bold">2</div>
                <h3 className="text-xl font-bold mb-3">
                  {role === "influencer"
                    ? "Get Discovered"
                    : "Find Perfect Matches"}
                </h3>
                <p className="text-gray-300">
                  {role === "influencer"
                    ? "Our algorithm highlights your profile to brands that fit your niche."
                    : "We surface creators whose audience and content align with your brand."}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="text-[#59FFA7] text-2xl mb-4 font-bold">3</div>
                <h3 className="text-xl font-bold mb-3">
                  Collaborate Seamlessly
                </h3>
                <p className="text-gray-300">
                  {role === "influencer"
                    ? "Negotiate terms, create content, and get paid—all in one place."
                    : "Manage campaigns, track performance, and build lasting relationships."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Early Access Benefits */}
        <div className="py-20 container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8]">
            Boost Your Visibility As A Creator
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Profile Quality Benefits */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-[#59FFA7] transition-all">
              <div className="text-[#59FFA7] text-2xl mb-3">🌟</div>
              <h3 className="text-xl font-bold mb-3">
                Complete Profile = More Visibility
              </h3>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "Detailed profiles get 3x more brand views"
                </li>
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "Featured in 'Top Creators' section"
                </li>
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "Algorithm priority for complete profiles"
                </li>
              </ul>
            </div>

            {/* Early Adopter Benefits */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-[#59FFA7] transition-all">
              <div className="text-[#59FFA7] text-2xl mb-3">🚀</div>
              <h3 className="text-xl font-bold mb-3">
                Early Creator Advantages
              </h3>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "Permanent 'Early Adopter' badge"
                </li>
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "First access to premium brand campaigns"
                </li>
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "Profile boosted for first 30 days"
                </li>
              </ul>
            </div>

            {/* Future Opportunities */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-[#59FFA7] transition-all">
              <div className="text-[#59FFA7] text-2xl mb-3">💎</div>
              <h3 className="text-xl font-bold mb-3">Growth Tools</h3>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "Free analytics dashboard"
                </li>
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "Exclusive creator workshops"
                </li>
                <li className="flex items-start">
                  <span className="text-[#2BFFF8] mr-2">✓</span>
                  "First dibs on monetization features"
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg border border-gray-700 mb-8">
              <h3 className="text-xl font-bold mb-3 text-[#59FFA7]">
                How Profile Completeness Affects Visibility
              </h3>
              <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] h-3 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <p className="text-gray-300 text-sm">
                Basic profile: 40% visibility • Complete profile: 100%
                visibility • Verified: 150% visibility
              </p>
            </div>

            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black font-bold rounded-lg text-lg hover:opacity-90 transition-opacity mb-2"
            >
              Build Your Profile Now - It's Free
            </button>
            <p className="text-gray-400">
              Complete your profile to unlock maximum visibility
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} PromoterLink. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LaunchPage;
