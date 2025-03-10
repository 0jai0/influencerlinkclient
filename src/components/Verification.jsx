import React from "react";
import YouTubeVerification from "./YouTubeVerification";
import InstagramVerification from "./InstagramVerification";

const Verification = ({ profileDetails = [], setProfile ,userId}) => {
  return (
    <div className="w-full h-full bg-[#151515] text-[#FFFFFF] p-5 shadow-md flex flex-col items-start space-y-6">
  <h2 className="relative top-0 left-0">Verification</h2>
  {profileDetails.length === 0 ? (
    <p>No social media accounts to verify.</p>
  ) : (
    profileDetails.map((profile, index) => {
      switch (profile.platform) {
        case "YouTube":
          return (
            <div key={index} className="w-full flex flex-col items-start">
  {/* Image and Name Side by Side */}
  <div className="flex items-center gap-2 ml-[10%] mb-3">
    <img 
      src={
        profile.platform === "Instagram"
          ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          : profile.platform === "Facebook"
          ? "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
          : profile.platform === "Twitter"
          ? "https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg"
          : profile.platform === "YouTube"
          ? "https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_full-color_icon_%282024%29.svg"
          : profile.platform === "WhatsApp"
          ? "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          : "https://via.placeholder.com/40"
      } 
      alt={profile.platform} 
      className="w-6 h-6"
    />
    <h1 className="text-lg font-semibold">{profile.platform}</h1>
  </div>

  {/* Centered YouTubeVerification */}
  <div className="w-full flex justify-center">
    <YouTubeVerification profile={profile} setProfile={setProfile} />
  </div>
</div>

          );
        case "Instagram":
          return (
            
            <div key={index} className="w-full flex flex-col items-start">
  {/* Image and Name Side by Side */}
  <div className="flex items-center gap-2 ml-[10%] mb-3">
    <img 
      src={
        profile.platform === "Instagram"
          ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          : profile.platform === "Facebook"
          ? "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
          : profile.platform === "Twitter"
          ? "https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg"
          : profile.platform === "YouTube"
          ? "https://upload.wikimedia.org/wikipedia/commons/f/fd/YouTube_full-color_icon_%282024%29.svg"
          : profile.platform === "WhatsApp"
          ? "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          : "https://via.placeholder.com/40"
      } 
      alt={profile.platform} 
      className="w-6 h-6"
    />
    <h1 className="text-lg font-semibold">{profile.platform}</h1>
  </div>

  {/* Centered InstagramVerification */}
  <div className="w-full flex justify-center">
    <InstagramVerification profile={profile} setProfile={setProfile} userId={userId} />
  </div>
</div>

          );
        default:
          return null;
      }
    })
  )}
</div>

  );
};

export default Verification;
