import React, { useEffect, useState,useRef , useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Profile from "./Profile";
import Navbar from "./Navbar";
import Banner from "./Banner";
import Alert from './Alert';

const Main = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  // Filter states
  const [contacts, setContacts] = useState([]);
  const [selectedAdCategories, setSelectedAdCategories] = useState([]);
  const [selectedContentCategories, setSelectedContentCategories] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedAudienceTypes, setSelectedAudienceTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // UI states
  const [showAdDropdown, setShowAdDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subscription, setSubscription] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Available options
  const [adCategories, setAdCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [audienceTypes, setAudienceTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showPlatformsDropdown, setShowPlatformsDropdown] = useState(false);
  const [showAudienceTypesDropdown, setShowAudienceTypesDropdown] = useState(false);
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_API}/api/pageowners/users`);
        const data = await response.json();
        setUsers(data.data || []);

        // Extract unique values for filters
        setAdCategories([...new Set(data.data.flatMap(user => user.adCategories || []))]);
        setPlatforms([...new Set(data.data.flatMap(user => user.socialMediaPlatforms || []))]);
        setAudienceTypes([...new Set(data.data.flatMap(user => user.averageAudienceType || []))]);
        setLocations([...new Set(data.data.flatMap(user => user.averageLocationOfAudience || []))]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users.filter(user =>
      user.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    if (selectedAdCategories.length > 0) {
      filtered = filtered.filter(user =>
        user.adCategories?.some(cat => selectedAdCategories.includes(cat)))
    }

    if (selectedContentCategories.length > 0) {
      filtered = filtered.filter(user =>
        user.pageContentCategory?.some(cat => selectedContentCategories.includes(cat)))
    }

    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(user =>
        user.socialMediaPlatforms?.some(platform => selectedPlatforms.includes(platform)))
    }

    if (selectedAudienceTypes.length > 0) {
      filtered = filtered.filter(user =>
        user.averageAudienceType?.some(type => selectedAudienceTypes.includes(type)))
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter(user =>
        user.averageLocationOfAudience?.some(loc => selectedLocations.includes(loc)))
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

   

    if (minPrice || maxPrice) {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      filtered = filtered.filter(user => {
        const prices = Object.values(user.pricing || {}).filter(Number.isFinite);
        return prices.some(price => price >= min && price <= max);
      });
    }

    setFilteredUsers(filtered);
  }, [
    users, searchTerm, selectedAdCategories, selectedContentCategories,
    selectedPlatforms, selectedAudienceTypes, selectedLocations,
    minFollowers, maxFollowers, minPrice, maxPrice
  ]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  
    // Fetch contacts
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

  const handleAddToList = (targetUser) => {
    return new Promise((resolve, reject) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);
  
      if (!user?._id || !targetUser?._id) {
        console.error("Both User ID and Target User ID are required");
        isLoadingRef.current = false;
        setIsLoading(false);
        console.log(isLoading)
        return;
      }
  
      const isAlreadyInContacts = contacts.some(contact => contact._id === targetUser._id);
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
                targetUserId: targetUser?._id,
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
          //reject(new Error("User canceled the action"));
        },
      });
    });
  };
  
  

const handleChatNow = async (targetUser) => {
  try {
    console.log("Starting handleChatNow...");
    const isAlreadyInContacts = contacts.some(contact => contact._id === targetUser._id);
    if (isAlreadyInContacts) {
      navigate(`/MessagingApp/${user?._id}`);
    }
    const response = await handleAddToList(targetUser);
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

 

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleCheckboxChange = (category, type) => {
    if (type === "adCategory") {
      const updated = selectedAdCategories.includes(category)
        ? selectedAdCategories.filter((c) => c !== category)
        : [...selectedAdCategories, category];
      setSelectedAdCategories(updated);
    } else if (type === "contentCategory") {
      const updated = selectedContentCategories.includes(category)
        ? selectedContentCategories.filter((c) => c !== category)
        : [...selectedContentCategories, category];
      setSelectedContentCategories(updated);
    } else if (type === "platform") {
      const updated = selectedPlatforms.includes(category)
        ? selectedPlatforms.filter((c) => c !== category)
        : [...selectedPlatforms, category];
      setSelectedPlatforms(updated);
    } else if (type === "audienceType") {
      const updated = selectedAudienceTypes.includes(category)
        ? selectedAudienceTypes.filter((c) => c !== category)
        : [...selectedAudienceTypes, category];
      setSelectedAudienceTypes(updated);
    } else if (type === "location") {
      const updated = selectedLocations.includes(category)
        ? selectedLocations.filter((c) => c !== category)
        : [...selectedLocations, category];
      setSelectedLocations(updated);
    }
  };

  const isFormatted = (followers) => {
    return typeof followers === "string" && (followers.includes("k") || followers.includes("M"));
  };

  const formatFollowers = (count) => {
    if (typeof count === "number") {
      if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + "M";
      } else if (count >= 1000) {
        return (count / 1000).toFixed(0) + "K";
      }
    }
    return count;
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={alert.onClose}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
        />
      )}
      <Navbar />
      <Banner />

      <div className="p-6 bg-[#151515] rounded shadow space-y-6">
        {/* Header Section */}
        <div className="flex flex-col items-start bg-[#151515] p-4 border border-gray-800 rounded-t-md relative w-full">
          <div className="absolute -top-5 -left-6 bg-[#151515] px-4">
            <span className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-transparent bg-clip-text font-sans text-2xl">
              Influencers
            </span>
          </div>
          {/* Search and Main Filters */}
          <div className="flex flex-col md:flex-row items-center gap-4">
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
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  className="px-1 py-2 bg-black rounded-full border border-gray-700"
                  onClick={() => setShowAdDropdown(!showAdDropdown)}
                >
                  Category
                  <span className="ml-1">
                    <i className="fas fa-chevron-down"></i>
                  </span>
                </button>
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

              <button
                className="px-2 py-2 bg-black rounded-full border border-gray-700"
                onClick={() => setShowMoreFilters(!showMoreFilters)}
              >
                {showMoreFilters ? 'Hide Filters' : 'More Filters'}
              </button>
              <button
              
              className="px-4 py-2 rounded-md transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black"
              onClick={() => navigate(`/MessagingApp/${user?._id}`)}
            >
              Chat
            </button>
            </div>
            
            
            
          </div>

          {showMoreFilters && (
  <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 rounded-lg">
    {/* Platforms Dropdown */}
    <div className="relative text-center">
      <button
       className="px-4 py-2 bg-black rounded-full border border-gray-700 w-full text-center flex justify-between items-center"
        onClick={() => setShowPlatformsDropdown(!showPlatformsDropdown)}
      >
         <span className="flex-1 text-center">Platforms</span>
        <span className="ml-1">
          <i className={`fas fa-chevron-${showPlatformsDropdown ? "up" : "down"}`}></i>
        </span>
      </button>
      
      {showPlatformsDropdown && (
        <div className="mt-2 bg-black border border-gray-700 rounded shadow-md p-3 max-h-40 overflow-y-auto">
          {platforms.map(platform => (
            <label key={platform} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform)}
                onChange={() => handleCheckboxChange(platform, 'platform')}
                className="accent-red-500"
              />
              <span className="text-white">{platform}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Audience Type Dropdown */}
    <div className="relative">
      <button
        className="px-4 py-2 bg-black rounded-full border border-gray-700 w-full text-left flex justify-between items-center"
        onClick={() => setShowAudienceTypesDropdown(!showAudienceTypesDropdown)}
      >
         <span className="flex-1 text-center">Audience Type</span>
        
        <span className="ml-1">
          <i className={`fas fa-chevron-${showAudienceTypesDropdown ? "up" : "down"}`}></i>
        </span>
      </button>
      {showAudienceTypesDropdown && (
        <div className="mt-2 bg-black border border-gray-700 rounded shadow-md p-3 max-h-40 overflow-y-auto">
          {audienceTypes.map(type => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAudienceTypes.includes(type)}
                onChange={() => handleCheckboxChange(type, 'audienceType')}
                className="accent-red-500"
              />
              <span className="text-white">{type}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Audience Location Dropdown */}
    <div className="relative">
      <button
        className="px-4 py-2 bg-black rounded-full border border-gray-700 w-full text-left flex justify-between items-center"
        onClick={() => setShowLocationsDropdown(!showLocationsDropdown)}
      >
        <span className="flex-1 text-center">Audience Location</span>
        
        <span className="ml-1">
          <i className={`fas fa-chevron-${showLocationsDropdown ? "up" : "down"}`}></i>
        </span>
      </button>
      {showLocationsDropdown && (
        <div className="mt-2 bg-black border border-gray-700 rounded shadow-md p-3 max-h-40 overflow-y-auto">
          {locations.map(location => (
            <label key={location} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => handleCheckboxChange(location, 'location')}
                className="accent-red-500"
              />
              <span className="text-white">{location}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Followers Range Section */}
    <div>
      <h4 className="font-bold text-white mb-2">Followers Range</h4>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={minFollowers}
          onChange={(e) => setMinFollowers(e.target.value)}
          className="bg-black border border-gray-700 text-white px-2 py-1 rounded w-20"
        />
        <input
          type="number"
          placeholder="Max"
          value={maxFollowers}
          onChange={(e) => setMaxFollowers(e.target.value)}
          className="bg-black border border-gray-700 text-white px-2 py-1 rounded w-20"
        />
      </div>
    </div>

    {/* Price Range Section */}
    <div>
      <h4 className="font-bold text-white mb-2">Price Range</h4>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="bg-black border border-gray-700 text-white px-2 py-1 rounded w-20"
        />
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="bg-black border border-gray-700 text-white px-2 py-1 rounded w-20"
        />
      </div>
    </div>

    {/* Verified Only Section */}
    
  </div>
)}
          <div className={`bg-[#151515] w-full border-t border-gray-800 relative top-[10px] rounded-b-md h-[550px] transition-all duration-300 ${
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
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#59FFA7]">
              <img
                src={user.profilePicUrl || "https://via.placeholder.com/100"}
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
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
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop event propagation
                handleAddToList(user);
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
                handleChatNow(user);
              }}
              disabled={isLoadingRef.current}
              className="px-4 py-2 rounded-md transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black"
            >
              {isLoadingRef.current ? "Loading..." : "Chat Now"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
  {!subscription && (
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent pointer-events-none"></div>
  )}
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
    </div>
  );
};

export default Main;