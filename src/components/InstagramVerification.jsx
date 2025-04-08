import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const InstagramVerification = ({ profile, setProfile, userId }) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [userExists, setUserExists] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const checkUserExists = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/api/pageowners/get-by-userid?userId=${userId}`
      );
      const userFound = response.data.success;
      setUserExists(userFound);
      setMessage(
        userFound 
          ? "✅ User verified! Check your Instagram DMs - you'll receive an OTP shortly." 
          : "❌ User not found. Please double-check your profile name and try again."
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Error checking user");
    }
  }, [userId]);

  useEffect(() => {
    checkUserExists();
  }, [checkUserExists]);

  const sendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_API}/api/pageowners/store`, 
        { 
          userId, 
          profileName: profile.profileName,
          profileUrl: profile.profilePicUrl
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response);
      setMessage("✅ OTP sent successfully. Check your Instagram DMs - you'll receive an OTP shortly");
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Get the stored OTP from the server
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/api/pageowners/get-by-userid?userId=${userId}`
      );

      if (!response.data.success || !response.data.otp) {
        setMessage("No OTP found for this user");
        return;
      }

      // Compare the stored OTP with user input
      if (response.data.otp === otp) {
        // Update status to 'verified' in backend
        await axios.put(
          `${process.env.REACT_APP_SERVER_API}/api/pageowners/send-status`,
          { userId, status:"verified" }
        );

        setVerified(true);
        setMessage("✅ Verification successful! Save and Submit for Updated your profile");
        
        // Update parent component state
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileDetails: prevProfile.profileDetails.map((p) =>
            p.platform === "Instagram" && p.profileName === profile.profileName
              ? { ...p, verified: true }
              : p
          ),
        }));
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[80%] shadow-[0px_10px_20px_rgba(0,0,0,0.2),0px_-10px_20px_rgba(0,0,0,0.2),10px_0px_20px_rgba(0,0,0,0.2),-10px_0px_20px_rgba(0,0,0,0.2)] rounded-xl p-4 bg-[#151515]">
      <h3 className="text-lg font-bold mb-2">Instagram Verification</h3>

      {verified || profile.verified ? (
        <p className="text-green-400 font-semibold">✅ Your Instagram is verified!</p>
      ) : (
        <>
          <p className="text-gray-400">
            <span className="text-[#2BFFF8] font-bold">STEP 1</span>: Click the below link to follow our Instagram profile with the same account 
            (you can unfollow after verification).
          </p>
          <button 
  onClick={() => window.open('https://www.instagram.com/promoterlink_official/?igsh=ejJpbHc0NTJ2endm', '_blank')}
  className="bg-gradient-to-r from-[#405DE6] via-[#833AB4] to-[#FD1D1D] text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
>
  Follow @promoterlink_official
</button>
          <p className="text-gray-400">
            <span className="text-[#2BFFF8] font-bold">STEP 2</span>: Click "Send OTP" to receive the verification code in your Instagram DM.
          </p>
          <p className="text-gray-400">
            <span className="text-[#2BFFF8] font-bold">STEP 3</span>: Enter the code to complete verification.
          </p>

          <p className="text-gray-400">Verify Instagram for your @{profile.profileName}</p>
          {message && <p className={`mt-2 text-sm ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>{message}</p>}
          
          <div className="w-full mt-3 border border-[#4D4D4D] p-3 rounded-xl mx-auto">
            {/* First Row: Redirect & Send OTP Buttons */}
            <div className="flex flex-col md:flex-row w-full pr-[30%] gap-3">
              <button
                className="flex-1 bg-black text-[#2BFFF8] py-2 rounded hover:bg-[#2BFFF8] hover:text-black transition-colors"
                onClick={() => window.open("https://instagram.com", "_blank")}
              >
                Click to Redirect ➜
              </button>

              <button
                onClick={sendOtp}
                disabled={otpSent || isLoading}
                className={`flex-1 h-10 border text-zinc-500 border-[#4D4D4D] rounded ${
                  otpSent || isLoading
                    ? "bg-gray-600"
                    : "bg-black hover:bg-[linear-gradient(180deg,#2BFFF8_0%,#1A9995_100%)] hover:text-black"
                }`}
              >
                {isLoading ? "Sending..." : (userExists || otpSent ? "Resend OTP" : "Send OTP")}
              </button>
            </div>

            {/* Second Row: OTP Input & Verify Button */}
            <div className="flex flex-col md:flex-row w-full pr-[30%] gap-3 mt-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 p-2 bg-black rounded text-white"
                disabled={!userExists || otpSent}
              />

              <button
                onClick={verifyOtp}
                disabled={!userExists|| isLoading}
                className={`flex-1 p-2 text-black rounded ${
                  verified
                    ? "bg-green-500"
                    : "bg-[linear-gradient(180deg,#2BFFF8_0%,#1A9995_100%)] hover:opacity-90"
                }`}
              >
                {isLoading ? "Verifying..." : (verified ? "Verified" : "Verify OTP")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InstagramVerification;