import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const API_KEYS = {
  youtube: process.env.REACT_APP_YOUTUBE_API,
};

const YouTubeVerification = ({ profile, setProfile }) => {
  const [youtubeStatus, setYoutubeStatus] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [targetChannelId, setTargetChannelId] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
          params: { 
            part: "id,statistics", 
            forHandle: `@${profile.profileName}`, 
            key: API_KEYS.youtube 
          },
        });

        if (response.data.items.length > 0) {
          setTargetChannelId(response.data.items[0].id);
          setSubscriberCount(response.data.items[0].statistics.subscriberCount);
        } else {
          console.error("No YouTube channel found for username:", profile.profileName);
        }
      } catch (error) {
        console.error("Error fetching YouTube Channel data:", error);
      }
    };

    fetchChannelData();
  }, [profile.profileName]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      try {
        const youtubeResponse = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          params: { part: "snippet,statistics", mine: true },
        });

        if (youtubeResponse.data.items.length > 0) {
          const channelId = youtubeResponse.data.items[0].id;
          const channelName = youtubeResponse.data.items[0].snippet.title;
          const subs = youtubeResponse.data.items[0].statistics.subscriberCount;

          if (channelId === targetChannelId) {
            setYoutubeStatus(`✅ Verified: ${channelName} (${formatNumber(subs)} subscribers)`);
            setSubscriberCount(subs);

            setProfile((prevProfile) => ({
              ...prevProfile,
              profileDetails: prevProfile.profileDetails.map((p) =>
                p.platform === "YouTube" && p.profileName === profile.profileName
                  ? { 
                      ...p, 
                      verified: true,
                      followers: subs // Store subscriber count in profile
                    }
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

  // Helper function to format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="w-full md:w-[80%] shadow-[0px_10px_20px_rgba(0,0,0,0.2),0px_-10px_20px_rgba(0,0,0,0.2),10px_0px_20px_rgba(0,0,0,0.2),-10px_0px_20px_rgba(0,0,0,0.2)] rounded-xl p-4 bg-[#151515]">
      <h3>YouTube Verification</h3>
      {profile.verified ? (
        <div>
          <p>✅ Your YouTube account @{profile.profileName} is verified.</p>
          {subscriberCount && (
            <p>Subscribers: {formatNumber(subscriberCount)}</p>
          )}
        </div>
      ) : !accessToken ? (
        <div>
          <button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-3" 
            onClick={() => login()}
          >
            Sign in with Google @{profile.profileName}
          </button>
          {subscriberCount && (
            <p>Public subscriber count: {formatNumber(subscriberCount)}</p>
          )}
        </div>
      ) : (
        <p>{youtubeStatus}</p>
      )}
    </div>
  );
};

export default YouTubeVerification;