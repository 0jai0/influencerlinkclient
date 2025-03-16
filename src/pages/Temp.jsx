import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Profile from "./Profile";
import Navbar from "./Navbar";
import Banner from "./Banner";

const Main = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [selectedAdCategories, setSelectedAdCategories] = useState([]);
  const [selectedContentCategories, setSelectedContentCategories] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedAudienceTypes, setSelectedAudienceTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // UI states
  const [showAdDropdown, setShowAdDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subscription, setSubscription] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Available options
  const [adCategories, setAdCategories] = useState([]);
  const [contentCategories, setContentCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [audienceTypes, setAudienceTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_API}/api/pageowners/users`);
        const data = await response.json();
        setUsers(data.data || []);
        
        // Extract unique values for filters
        setAdCategories([...new Set(data.data.flatMap(user => user.adCategories || []))]);
        setContentCategories([...new Set(data.data.flatMap(user => user.pageContentCategory || []))]);
        setPlatforms([...new Set(data.data.flatMap(user => user.socialMediaPlatforms || []))]);
        setAudienceTypes([...new Set(data.data.flatMap(user => user.averageAudienceType || []))]);
        setLocations([...new Set(data.data.flatMap(user => user.averageLocationOfAudience || []))]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      let filtered = users.filter(user => 
        user.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Apply filters
      if (selectedAdCategories.length > 0) {
        filtered = filtered.filter(user =>
          user.adCategories?.some(cat => selectedAdCategories.includes(cat))
      }

      if (selectedContentCategories.length > 0) {
        filtered = filtered.filter(user =>
          user.pageContentCategory?.some(cat => selectedContentCategories.includes(cat))
      }

      if (selectedPlatforms.length > 0) {
        filtered = filtered.filter(user =>
          user.socialMediaPlatforms?.some(platform => selectedPlatforms.includes(platform))
      }

      if (selectedAudienceTypes.length > 0) {
        filtered = filtered.filter(user =>
          user.averageAudienceType?.some(type => selectedAudienceTypes.includes(type))
      }

      if (selectedLocations.length > 0) {
        filtered = filtered.filter(user =>
          user.averageLocationOfAudience?.some(loc => selectedLocations.includes(loc))
      }

      if (minFollowers || maxFollowers) {
        const min = parseInt(minFollowers) || 0;
        const max = parseInt(maxFollowers) || Infinity;
        filtered = filtered.filter(user => {
          const instagramProfile = user.profileDetails?.find(p => 
            p.platform?.toLowerCase() === "instagram"
          );
          return instagramProfile?.followers >= min && instagramProfile?.followers <= max;
        });
      }

      if (isVerified) {
        filtered = filtered.filter(user => {
          const instagramProfile = user.profileDetails?.find(p => 
            p.platform?.toLowerCase() === "instagram"
          );
          return instagramProfile?.verified;
        });
      }

      if (minPrice || maxPrice) {
        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || Infinity;
        filtered = filtered.filter(user => {
          const prices = Object.values(user.pricing || {}).filter(Number.isFinite);
          return prices.some(price => price >= min && price <= max);
        });
      }

      setFilteredUsers(filtered);
    };

    filterUsers();
  }, [
    users, searchTerm, selectedAdCategories, selectedContentCategories,
    selectedPlatforms, selectedAudienceTypes, selectedLocations,
    minFollowers, maxFollowers, isVerified, minPrice, maxPrice
  ]);

  const handleChatNow = async () => {
    await handleAddToList(); // Add user._id first if not present
  navigate(`/MessagingApp/${userId}`); // Navigate to chat page
};
const handleAddToList = async (User) => {
  if (!user?._id || !User?._id) {
    console.error("Both User ID and Target User ID are required");
    return;
  }

  try {
    console.log("Making API call with User ID:", user?._id, "and Target User ID:", User?._id);
    await axios.post(`${process.env.REACT_APP_SERVER_API}/api/collection/users/add`, {
      userId: user?._id,
      targetUserId: User?._id,
    });
    console.log("Successfully added target user to collection");
  } catch (error) {
    console.error("Error adding to collection:", error);
  }
};
  // Handle Search Input Change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterUsers(value, selectedAdCategories, selectedContentCategories);
  };

  // Handle Checkbox Selection for Filters
  const handleCheckboxChange = (category, type) => {
    if (type === "adCategory") {
      const updated = selectedAdCategories.includes(category)
        ? selectedAdCategories.filter((c) => c !== category)
        : [...selectedAdCategories, category];
      setSelectedAdCategories(updated);
      filterUsers(searchTerm, updated, selectedContentCategories);
    } else {
      const updated = selectedContentCategories.includes(category)
        ? selectedContentCategories.filter((c) => c !== category)
        : [...selectedContentCategories, category];
      setSelectedContentCategories(updated);
      filterUsers(searchTerm, selectedAdCategories, updated);
    }
  };
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
  // Existing helper functions and handlers remain the same...

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white">
      <Navbar />
      <Banner />

      <div className="p-6 bg-[#151515] rounded shadow space-y-6">
        {/* Search and Main Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 bg-black rounded-full px-4 border border-gray-700">
            {/* Search Input */}
            <div className="flex items-center flex-1 bg-black rounded-full px-4 border border-gray-700 w-full md:w-auto">
            <span className="text-red-500 text-lg mr-2">
              <i className="fas fa-search"></i>
            </span>
            <input
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none py-2"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          </div>
          
          {/* Category Dropdown */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-black rounded-full border border-gray-700"
              onClick={() => setShowAdDropdown(!showAdDropdown)}
            >
            Category
            <span className="ml-1">
              <i className="fas fa-chevron-down"></i>
            </span>
            </button>
            {/* Category dropdown content */}
            {showAdDropdown && (
                <div className="absolute mt-2 bg-black border border-gray-700 rounded shadow-md p-3 max-h-40 overflow-y-auto z-10 w-full md:w-48">
                  {adCategories.map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedAdCategories.includes(category)}
                        onChange={() => handleCheckboxChange(category, "adCategory")}
                        className="accent-red-500"
                      />
                      <span className="text-white">{category}</span>
                    </label>
                  ))}
                </div>
              )}
          </div>

          {/* More Filters Button */}
          <button
            className="px-4 py-2 bg-black rounded-full border border-gray-700"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            {showMoreFilters ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>

        {/* Extended Filters Section */}
        {showMoreFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-900 rounded-lg">
            {/* Platform Filter */}
            <div className="space-y-2">
              <h4 className="font-bold">Platforms</h4>
              {platforms.map(platform => (
                <label key={platform} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => handleCheckboxChange(platform, 'platform')}
                    className="accent-red-500"
                  />
                  {platform}
                </label>
              ))}
            </div>

            {/* Audience Type Filter */}
            <div className="space-y-2">
              <h4 className="font-bold">Audience Type</h4>
              {audienceTypes.map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAudienceTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type, 'audienceType')}
                    className="accent-red-500"
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <h4 className="font-bold">Audience Location</h4>
              {locations.map(location => (
                <label key={location} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location)}
                    onChange={() => handleCheckboxChange(location, 'location')}
                    className="accent-red-500"
                  />
                  {location}
                </label>
              ))}
            </div>

            {/* Followers Filter */}
            <div className="space-y-2">
              <h4 className="font-bold">Followers Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(e.target.value)}
                  className="bg-gray-800 text-white px-2 py-1 rounded w-20"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxFollowers}
                  onChange={(e) => setMaxFollowers(e.target.value)}
                  className="bg-gray-800 text-white px-2 py-1 rounded w-20"
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <h4 className="font-bold">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-gray-800 text-white px-2 py-1 rounded w-20"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-gray-800 text-white px-2 py-1 rounded w-20"
                />
              </div>
            </div>

            {/* Verified Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="accent-red-500"
                />
                Verified Only
              </label>
            </div>
          </div>
        )}

        {/* Influencer List */}
        <div className={`p-6 bg-[#151515] border border-gray-800 relative top-[-25px] rounded-b-md h-[550px] transition-all duration-300 ${
            subscription ? "overflow-y-auto custom-scrollbar" : "overflow-hidden"
          }`}>
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-400">No influencers found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="relative p-4 border border-gray-800 rounded-3xl shadow-md bg-[#202020] hover:shadow-lg transition-all duration-300 cursor-pointer group h-[100px] hover:h-[160px] overflow-hidden"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Profile Picture */}
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#59FFA7]">
                        <img
                          src={user.profilePicUrl || "https://via.placeholder.com/100"}
                          alt={`${user.ownerName}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      </div>
          
                      {/* User Details */}
                      <div>
                        <h3 className="font-bold text-lg text-white truncate">
                          {user.ownerName}
                        </h3>
                        {user.profileDetails.length > 0 ? (
                      user.profileDetails.map((profile, index) => (
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
                    </div>
          
                    {/* Action Buttons (Visible on Hover) */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
            onClick={() => handleAddToList(user)}  // Wrap in arrow function
            className="px-4 py-2 rounded-md transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black"
          >
            Add to List
          </button>
          
          <button
            onClick={() => handleChatNow(user)}  // Wrap in arrow function and pass user
            className="px-4 py-2 rounded-md transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black"
          >
            Chat Now
          </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          
            {!subscription && (
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent pointer-events-none"></div>
            )}
          
            {/* Unlock Button */}
            <div className="bottom-0 transform p-4 flex justify-center">
            <button
            onClick={() => setSubscription(true)}
            className="w-full max-w-[150px] border border-[#59FFA7] py-2 bg-black text-white font-bold rounded 
                       hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black hover:border-transparent transition 
                       flex items-center justify-center gap-2"
          >
            <span className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-transparent bg-clip-text transition-all duration-300 hover:text-black">
              🔒
            </span>
            Unlock Now
          </button>
          
            </div>
          </div>
          
      </div>

      {selectedUser && (
        <Profile User={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default Main;