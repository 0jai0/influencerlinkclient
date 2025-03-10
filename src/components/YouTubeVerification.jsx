import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
const API_KEYS = {
    youtube: "AIzaSyB5fdI0TNi42RdSILBaVCNr0dNoNW3DAVA", // Replace with your YouTube API key
  };


  const YouTubeVerification = ({ profile, setProfile }) => {
    const [youtubeStatus, setYoutubeStatus] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [targetChannelId, setTargetChannelId] = useState(null);
  
    useEffect(() => {
      const fetchChannelId = async () => {
        try {
          const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
            params: { part: "id", forHandle: `@${profile.profileName}`, key: API_KEYS.youtube },
          });
  
          if (response.data.items.length > 0) {
            setTargetChannelId(response.data.items[0].id);
          } else {
            console.error("No YouTube channel found for username:", profile.profileName);
          }
        } catch (error) {
          console.error("Error fetching YouTube Channel ID:", error);
        }
      };
  
      fetchChannelId();
    }, [profile.profileName]);
  
    const login = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        setAccessToken(tokenResponse.access_token);
        try {
          const youtubeResponse = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            params: { part: "snippet", mine: true },
          });
  
          if (youtubeResponse.data.items.length > 0) {
            const channelId = youtubeResponse.data.items[0].id;
            const channelName = youtubeResponse.data.items[0].snippet.title;
  
            if (channelId === targetChannelId) {
              setYoutubeStatus(`✅ Verified: ${channelName}`);
  
              // Update profile verification status
              setProfile((prevProfile) => ({
                ...prevProfile,
                profileDetails: prevProfile.profileDetails.map((p) =>
                  p.platform === "YouTube" && p.profileName === profile.profileName
                    ? { ...p, verified: true } // Update the verified status
                    : p
                ),
              }));
              
              
              
            } else {
              setYoutubeStatus("❌ Verification failed");
            }
          }
        } catch (error) {
          setYoutubeStatus("❌ Verification failed");
        }
      },
      scope: "https://www.googleapis.com/auth/youtube.readonly",
    });
  
    return (
      <div className="w-full md:w-[80%] shadow-[0px_10px_20px_rgba(0,0,0,0.2),0px_-10px_20px_rgba(0,0,0,0.2),10px_0px_20px_rgba(0,0,0,0.2),-10px_0px_20px_rgba(0,0,0,0.2)] rounded-xl p-4 bg-[#151515]">
        <h3>YouTube Verification</h3>
        {profile.verified ? (
          <p>✅ Your YouTube account @{profile.profileName} is already verified.</p>
        ) : !accessToken ? (
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-3" onClick={() => login()}>Sign in with Google @{profile.profileName} </button>
        ) : (
          <p>{youtubeStatus}</p>
        )}
      </div>
    );
  };
  
  export default YouTubeVerification;
  