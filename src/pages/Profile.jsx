import React, { useEffect, useState,useRef , useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import axios from "axios";
import Alert from './Alert';
const Profile = ({ User, onClose }) => {
  const {  user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const userId = user?._id;
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [contacts, setContacts] = useState([]);
  const instaRef = useRef(null);
  const fbRef = useRef(null);
  const [alert, setAlert] = useState(null);
  console.log(user?._id);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_API}/api/collection/users/${user?._id}`);
      const data = await response.json();

      if (data.collections && data.collections.length > 0) {
        setContacts(data.collections);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchContacts();
    }
  }, [user?._id, fetchContacts]);

  const handleAddToList = (User) => {
    return new Promise((resolve, reject) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);
  
      if (!user?._id || !User?._id) {
        console.error("Both User ID and Target User ID are required");
        isLoadingRef.current = false;
        setIsLoading(false);
        return;
      }
  
      const isAlreadyInContacts = contacts.some(contact => contact.user._id === User?._id);
      if (isAlreadyInContacts) {
        setAlert(null); // Reset alert first
        setTimeout(() => {
          setAlert({ type: 'info', message: 'This user is already in your list.' });
        }, 100); // Add a short delay
        isLoadingRef.current = false;
        setIsLoading(false);
        return;
      }
  
      if (user.linkCoins < 1) {
        setAlert(null); // Reset alert first
        setTimeout(() => {
          setAlert({ type: 'error', message: 'Insufficient LinkCoins. Please purchase more.' });
        }, 100); // Add a short delay
        isLoadingRef.current = false;
        setIsLoading(false);
        console.log(isLoading)
        return;
      }
  
      setAlert({
        type: 'info',
        message: 'Spend 1 LinkCoin to add this user to your list. Are you sure?',
        onConfirm: async () => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_SERVER_API}/api/collection/users/add`,
              {
                userId: user?._id,
                targetUserId: User?._id,
              }
            );
  
            setAlert(null);
            setTimeout(() => {
              setAlert({ type: 'success', message: 'User added to collection successfully!' });
            }, 100);
  
            resolve(response.data);
          } catch (error) {
            console.error("Error adding to collection:", error.response?.status);
            setAlert(null);
            setTimeout(() => {
              if (error.response && error.response.status === 400) {
                setAlert({ type: 'error', message: 'Insufficient LinkCoins. Please purchase more.' });
              } else {
                setAlert({ type: 'error', message: 'Failed to add user. Please try again.' });
              }
            }, 100);
            reject(error);
          } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
          }
        },
        onCancel: () => {
          setAlert(null);
          isLoadingRef.current = false;
          setIsLoading(false);
          reject(new Error("User canceled the action"));
        },
      });
    });
  };
  
  

const handleChatNow = async (User) => {
  try {
    console.log("Starting handleChatNow...");
    const isAlreadyInContacts = contacts.some(contact => contact._id === User._id);
    if (isAlreadyInContacts) {
      navigate(`/MessagingApp/${user?._id}`);
    }
    const response = await handleAddToList(User);
    console.log("Response from handleAddToList:", response);

    if (response && response.message === "Target User ID added successfully") {
      console.log("User added successfully. Navigating to chat...");
      navigate(`/MessagingApp/${user?._id}`);
    } else {
      console.log("Failed to add user. Response:", response);
    }
  } catch (error) {
    console.error("Error in handleChatNow:", error);

    if (error.message === "User canceled the action") {
      console.log("User canceled the action. No further action required.");
    } else {
      setAlert({ type: 'error', message: 'Failed to start chat. Please try again.' });
      setAlert(null);
    }
  } finally {
    setIsLoading(false); // Ensure isLoading is reset
  }
};
  

 
  
  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 200, behavior: "smooth" });
    }
  };
  // State for filtering posts
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedPlatform, setSelectedPlatform] = useState("Platform");
  if (!User) return null;
  // Flatten past posts safely
  const allPastPosts = User.pastPosts || [];

  // Extract unique categories and platforms for dropdowns
  const categories = ["Category", ...new Set(allPastPosts.map((post) => post.category))];
  const platforms = ["Platform", ...new Set(allPastPosts.map((post) => post.platform))];

  // Filter posts based on selected category and platform
  const filteredPosts = allPastPosts.filter(
    (post) =>
      (selectedCategory === "Category" || post.category === selectedCategory) &&
      (selectedPlatform === "Platform" || post.platform === selectedPlatform)
  );
  const isFormatted = (followers) => {
    return typeof followers === "string" && (followers.includes("k") || followers.includes("M"));
  };
  
  // Function to format followers count
  const formatFollowers = (count) => {
    if (typeof count === "number") {
      if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + "M"; // Converts 1,200,000 to "1.2M"
      } else if (count >= 1000) {
        return (count / 1000).toFixed(0) + "K"; // Converts 10,500 to "10k"
      }
    }
    return count; // Return the original value if it's already formatted or not a number
  };
  return (
<div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm top-0 flex items-center justify-center z-20 p-4" 
style={{marginTop: "0px"}}>
  {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={alert.onClose}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
        />
      )}
  <div
  className="bg-[#151515] p-4 border-[10px] border-[#151515] md:p-6 rounded-2xl min-h-[80vh] shadow-xl w-full max-w-7xl overflow-y-auto custom-scrollbar flex flex-col relative"
  style={{ borderRadius: "10px" }}
>
    {/* Close Button (Fixed) */}
    <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={onClose}>
      &#10005;
    </button>

    {/* Content Section */}
    <div className="flex flex-col space-y-6">
      {/* Profile & Accounts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Info */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <img
            src={User.profilePicUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-60 h-50 md:w-50 md:h-50 rounded-xl object-cover border border-gray-500 shadow-md"
          />
          <h2 className="text-lg md:text-2xl font-sans text-[#ADADAD]">{User.ownerName}</h2>

          {/* Followers */}
          {User.profileDetails.length > 0 ? (
            User.profileDetails.map((profile, index) => (
              <div key={index} className="text-sm md:text-lg">
                {profile.platform.toLowerCase() === "instagram" && profile.followers && (
                  <p className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-transparent bg-clip-text font-sans">
                    {isFormatted(profile.followers) ? profile.followers : formatFollowers(profile.followers)} Followers
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm">No profile details available.</p>
          )}
        </div>

        {/* Categories & Price Section */}
        <div className="flex flex-col space-y-4">
        <div>
  <div className=" p-2 rounded-md flex flex-wrap gap-2">
    {categories
      .filter((category) => category !== "Category") // Exclude "ALL"
      .map((category, index) => (
        <span
          key={index}
          className="text-xs md:text-sm rounded-3xl px-2 py-1  bg-[#3a3a3a] text-[#ADADAD]"
        >
          {category}
        </span>
      ))}
  </div>
</div>


          <div>
          <div className="w-[250px] h-[150px] border border-gray-500 p-2 rounded-md flex items-center justify-center">
  <p className="text-xs md:text-sm text-[#ADADAD]">{userId}  $100 - $500</p>

</div>

{/* Buttons */}
      <div className="flex space-x-4 mt-5">
      <button
              onClick={(e) => {
                e.stopPropagation(); // Stop event propagation
                handleAddToList(User);
              }}
              disabled={isLoadingRef.current}
              className="px-4 py-2 rounded-md transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black"
            >
              {isLoadingRef.current ? "Adding..." : "Add to List"}
            </button>
            {/* Display the alert */}
            
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop event propagation
                handleChatNow(User);
              }}
              disabled={isLoadingRef.current}
              className="px-4 py-2 rounded-md transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black"
            >
              {isLoadingRef.current ? "Loading..." : "Chat Now"}
            </button>
        
      </div>
          </div>
        </div>
       

        {/* Accounts Section */}
        <div className="w-full">
  <h3 className="text-sm md:text-lg font-semibold">Accounts</h3>
  <div className="max-h-40 md:max-h-60 space-y-2">
    {User.profileDetails.map((profile, index) => (
      <div
        key={index}
        className="flex items-center h-14 justify-between bg-[#2a2a2a] p-3 rounded-md relative group"
      >
        {/* Platform Logo */}
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
              : "https://via.placeholder.com/40" // Default placeholder
          }
          alt={profile.platform}
          className="w-10 h-10 rounded-full border border-gray-500"
        />

        {/* Profile Details & Visit Profile in a Flex Container */}
        <div className="flex-1 flex flex-col px-3">
          <div className=" flex items-center space-x-2">
            {/* Truncated Name */}
            <span
              className="font-semibold text-sm md:text-base truncate overflow-hidden max-w-[70px] md:max-w-[120px]"
              style={{ whiteSpace: "nowrap" }}
            >
              {profile.profileName}
            </span>

            {/* Full Name on Hover */}
            <div className="absolute left-0 bg-[#333] text-white text-sm px-2 top-10 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              {profile.profileName}
            </div>
          </div>
        </div>

        <span className="text-gray-400 text-4xl pb-2 pr-3">|</span>

        {/* Followers Section */}
        <div className="flex flex-col items-center pr-1 min-w-[50px]">
          <span className="text-sm font-medium bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-transparent bg-clip-text text-right">
            {isFormatted(profile.followers) ? profile.followers : formatFollowers(profile.followers)}
          </span>
          <p className="text-xs text-gray-400 text-center">Followers</p>
        </div>

        {/* Visit Profile Button */}
        <a
          href={profile.profilePicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-500 items-end justify-end min-w-[80px] pr-5 md:min-w-[100px] hover:underline text-xs text-right md:text-sm"
        >
          Visit Profile
        </a>
      </div>
    ))}
  </div>
</div>


      </div>

      {/* Posts Section */}
      <div className="mt-4">
      
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-8">
        <label className="text-xl md:text-sm text-[#E6E6E6]  whitespace-nowrap">Poppular Posts  </label>
        <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="text-xs md:text-sm p-2 pl-5 border-r-[10px] border-[#000000] bg-[#000000] rounded-3xl"
          >
            {platforms.map((platform, index) => (
              <option key={index} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs md:text-sm p-2 pl-5 border-r-[10px] border-[#000000] bg-[#000000] rounded-3xl"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Display Filtered Posts */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {/* Instagram Posts */}
            {filteredPosts.some((post) => post.platform === "Instagram") && (
              <div>
                <h2 className="text-sm md:text-xl font-bold mb-2">Instagram Posts</h2>
                <div className="relative">
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-14 bg-[#151515] shadow-md shadow-black p-1 md:p-2 rounded-2xl z-10 hover:shadow-2xl hover:shadow-black transition-shadow duration-300"
                  onClick={() => scroll(instaRef, -1)}
                >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#59FFA7" />
                        <stop offset="100%" stopColor="#2BFFF8" />
                      </linearGradient>
                    </defs>
                    <ChevronLeft size={20} stroke="url(#grad)" strokeWidth="2" />
                  </svg>
                </button>

                  <div ref={instaRef} className="flex space-x-4 ml-5 mr-5 overflow-x-auto hide-scrollbar">
                    {filteredPosts
                      .filter((post) => post.platform === "Instagram")
                      .map((post, index) => (
                        <div key={index} className="relative w-[180px] md:w-[200px] shrink-0">
                          <img src={post.postLink} alt="Uploaded preview" className="w-50 h-64  object-cover mt-2" />
                        </div>
                      ))}
                  </div>
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 h-14 bg-[#151515] shadow-md shadow-black p-1 md:p-2 rounded-2xl z-10 hover:shadow-2xl hover:shadow-black transition-shadow duration-300" onClick={() => scroll(instaRef, 1)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#59FFA7" />
                        <stop offset="100%" stopColor="#2BFFF8" />
                      </linearGradient>
                    </defs>
                    <ChevronRight size={20} stroke="url(#grad)" strokeWidth="2" />
                  </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Facebook Posts */}
            {filteredPosts.some((post) => post.platform === "Facebook") && (
              <div>
                <h2 className="text-sm md:text-xl font-bold mb-2">Facebook Posts</h2>
                <div className="relative">
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-14 bg-[#151515] shadow-md shadow-black p-1 md:p-2 rounded-2xl z-10 hover:shadow-2xl hover:shadow-black transition-shadow duration-300"
                  onClick={() => scroll(fbRef, -1)}
                >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#59FFA7" />
                        <stop offset="100%" stopColor="#2BFFF8" />
                      </linearGradient>
                    </defs>
                    <ChevronLeft size={20} stroke="url(#grad)" strokeWidth="2" />
                  </svg>
                </button>

                  <div ref={fbRef} className="flex space-x-4 ml-5 mr-5 overflow-x-auto hide-scrollbar">
                    {filteredPosts
                      .filter((post) => post.platform === "Facebook")
                      .map((post, index) => (
                        <div key={index} className="relative w-[180px] md:w-[200px] shrink-0">
                          <img src={post.postLink} alt="Uploaded preview" className="w-50 h-64  object-cover mt-2" />
                        </div>
                      ))}
                  </div>
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 h-14 bg-[#151515] shadow-md shadow-black p-1 md:p-2 rounded-2xl z-10 hover:shadow-2xl hover:shadow-black transition-shadow duration-300" onClick={() => scroll(fbRef, 1)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#59FFA7" />
                        <stop offset="100%" stopColor="#2BFFF8" />
                      </linearGradient>
                    </defs>
                    <ChevronRight size={20} stroke="url(#grad)" strokeWidth="2" />
                  </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm">No posts available.</p>
        )}
      </div>
    </div>
  </div>
</div>


  );
};

export default Profile;