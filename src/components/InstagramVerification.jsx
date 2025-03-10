import { useState, useEffect } from "react";
import axios from "axios";

const InstagramVerification = ({ profile, setProfile, userId }) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [userExists, setUserExists] = useState(null);

  useEffect(() => {
    checkUserExists();
  }, []);

  const checkUserExists = async () => {
    try {
    const response = await axios.get(`http://localhost:5000/api/otp/userId?userId=${userId}`); // Pass userId as a query parameter

    const userExists = response.data.success && response.data.otpDetails;
    setUserExists(userExists);
      setMessage(userExists ? "User found. You can request an OTP." : "User not found. Please check your details.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error checking user");
    }
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/otp/send-otp", { userId });
      setMessage(response.data.message);
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/otp/verify-otp", { userId, otp });
      setMessage(response.data.message);
      setVerified(true);
      setProfile((prevProfile) => ({
        ...prevProfile,
        profileDetails: prevProfile.profileDetails.map((p) =>
          p.platform === "Instagram" && p.profileName === profile.profileName
            ? { ...p, verified: true } // Update the verified status
            : p
        ),
      }));
      
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="w-full md:w-[80%] shadow-[0px_10px_20px_rgba(0,0,0,0.2),0px_-10px_20px_rgba(0,0,0,0.2),10px_0px_20px_rgba(0,0,0,0.2),-10px_0px_20px_rgba(0,0,0,0.2)] rounded-xl p-4 bg-[#151515]">
  <h3 className="text-lg font-bold mb-2">Instagram Verification</h3>

  {profile.verified ? (
    <p className="text-green-400 font-semibold">✅ Your Instagram is verified!</p>
  ) : (
    <>
    <p className="text-gray-400">
  <span className="text-[#2BFFF8] font-bold">STEP 1</span> : Click the below link to Follow our Instagram profile with the same account 
  (you can unfollow after verification).
</p>
<p className="text-gray-400">
  <span className="text-[#2BFFF8] font-bold">STEP 2</span> : Click "Send Otp" to receive the verification code in your Instagram DM.
</p>
<p className="text-gray-400">
  <span className="text-[#2BFFF8] font-bold">STEP 3</span> : Enter the code to complete verification.
</p>

      <p className="text-gray-400">Verify Instagram for your @{profile.profileName}</p>
      {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
      <div className="w-full mt-3 border border-[#4D4D4D] p-3 rounded-xl mx-auto">
  {/* First Row: Redirect & Send OTP Buttons */}
  <div className="flex flex-col md:flex-row w-full pr-[30%] gap-3">
    <button
      className="flex-1 bg-black text-[#2BFFF8] py-2 rounded"
      onClick={() => window.open("https://instagram.com", "_blank")}
    >
      Click to Redirect ➜
    </button>

    <button
      onClick={sendOtp}
      disabled={otpSent}
      className={`flex-1 h-10 border text-zinc-500 border-[#4D4D4D] rounded ${
        otpSent
          ? "bg-gray-600"
          : "bg-black hover:bg-[linear-gradient(180deg,#2BFFF8_0%,#1A9995_100%)]"
      }`}
    >
      {userExists || otpSent ? "Resend OTP" : "Send OTP"}
    </button>
  </div>

  {/* Second Row: OTP Input & Verify Button */}
  <div className="flex flex-col md:flex-row w-full pr-[30%] gap-3 mt-3">
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      className="flex-1 p-2 bg-black rounded"
      disabled={!userExists}
    />

    <button
      onClick={verifyOtp}
      disabled={!userExists}
      className={`flex-1 p-2 text-black rounded ${
        verified
          ? "bg-green-500"
          : "bg-[linear-gradient(180deg,#2BFFF8_0%,#1A9995_100%)] hover:bg-[linear-gradient(180deg,#2BFFF8_50%,#1A9995_100%)]"
      }`}
    >
      {verified ? "Verified" : "Verify OTP"}
    </button>
  </div>
</div>


    </>
  )}
</div>

  );
};

export default InstagramVerification;