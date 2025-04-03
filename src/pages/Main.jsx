import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Profile from "./Profile";
import Navbar from "./Navbar";
import Banner from "./Banner";
import Alert from './Alert';
import Content from './Content';
import Footer from "./Footer";
import { 
  platforms as platformOptions,
  audienceTypeOptions,
  adCategoryOptions
} from '../constants';

const Main = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Filter states
  const [contacts, setContacts] = useState([]);
  const [selectedAdCategories, setSelectedAdCategories] = useState([]);
  const [selectedContentCategories, setSelectedContentCategories] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedAudienceTypes, setSelectedAudienceTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");

 

  // UI states
  const [showAdDropdown, setShowAdDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subscription, setSubscription] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Available options
  const adCategories = adCategoryOptions;
  const platforms = platformOptions;
  const audienceTypes = audienceTypeOptions;
  const [locations, setLocations] = useState([]);
  const [showPlatformsDropdown, setShowPlatformsDropdown] = useState(false);
  const [showAudienceTypesDropdown, setShowAudienceTypesDropdown] = useState(false);
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false);




  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_SERVER_API}/api/pageowners/users?page=${page}&limit=${limit}`;
      
      // Add search term if exists
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      // Add filter parameters
      if (selectedAdCategories.length > 0) {
        url += `&adCategories=${selectedAdCategories.join(',')}`;
      }
      
      if (selectedContentCategories.length > 0) {
        url += `&pageContentCategory=${selectedContentCategories.join(',')}`;
      }
      
      if (selectedPlatforms.length > 0) {
        url += `&socialMediaPlatforms=${selectedPlatforms.join(',')}`;
      }
      
      if (selectedAudienceTypes.length > 0) {
        url += `&averageAudienceType=${selectedAudienceTypes.join(',')}`;
      }
      
      if (selectedLocations.length > 0) {
        url += `&averageLocationOfAudience=${selectedLocations.join(',')}`;
      }
      
      if (minFollowers) {
        url += `&minFollowers=${minFollowers}`;
      }
      
      if (maxFollowers) {
        url += `&maxFollowers=${maxFollowers}`;
      }
      
      

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data || []);
        setTotalPages(data.totalPages);
        
        // Extract unique values for filter options from first page
        if (page === 1) {
          
          setLocations([...new Set(data.data.flatMap(user => user.averageLocationOfAudience || []))]);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setAlert({ type: 'error', message: 'Failed to fetch users' });
    } finally {
      setIsLoading(false);
    }
  }, [
    page, searchTerm, selectedAdCategories, selectedContentCategories,
    selectedPlatforms, selectedAudienceTypes, selectedLocations,
    minFollowers, maxFollowers
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_API}/api/collection/users/${user?._id}`);
      const data = await response.json();

      if (data.collections && data.collections.length > 0) {
        console.log(data.collections);
        setContacts(data.collections );
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
      //setIsLoading(true);
  
      if (!user?._id || !targetUser?._id) {
        console.error("Both User ID and Target User ID are required");
        isLoadingRef.current = false;
        //setIsLoading(false);
        return;
      }
  
      const isAlreadyInContacts = contacts.some(contact => contact.user?._id === targetUser._id);
      if (isAlreadyInContacts) {
        setAlert(null);
        setTimeout(() => {
          setAlert({ type: 'info', message: 'This user is already in your list.' });
        }, 100);
        isLoadingRef.current = false;
        //setIsLoading(false);
        return;
      }
  
      if (user.linkCoins < 1) {
        setAlert(null);
        setTimeout(() => {
          setAlert({ type: 'error', message: 'Insufficient LinkCoins. Please purchase more.' });
        }, 100);
        isLoadingRef.current = false;
        //setIsLoading(false);
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
  
            // Refresh contacts and users
            fetchContacts();
            fetchUsers();
            
            resolve(response.data);
          } catch (error) {
            isLoadingRef.current = false;
            console.error("Error adding to collection:", error.response?.status);
            setAlert(null);
            setTimeout(() => {
              if (error.response && error.response.status === 400) {
                setAlert({ type: 'error', message: 'Insufficient LinkCoins. Please purchase more.' });
              } else {
                setAlert({ type: 'error', message: 'Failed to add user. Please try again.' });
              }
            }, 100);
            //reject(error);
          } finally {
            isLoadingRef.current = false;
            //setIsLoading(false); 
          }
        },
        onCancel: () => {
          setAlert(null);
          isLoadingRef.current = false;
          //setIsLoading(false);
        },
      });
    });
  };
  
  const handleChatNow = async (targetUser) => {
    try {
      const isAlreadyInContacts = contacts.some(contact => contact.user?._id === targetUser._id);
      if (isAlreadyInContacts) {
        navigate(`/MessagingApp/${user?._id}`);
        return;
      }
      
      const response = await handleAddToList(targetUser);
      if (response && response.message === "Target User ID added successfully") {
        navigate(`/MessagingApp/${user?._id}`);
      }
    } catch (error) {
      console.error("Error in handleChatNow:", error);
      if (error.message !== "User canceled the action") {
        setAlert({ type: 'error', message: 'Failed to start chat. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCheckboxChange = (category, type) => {
    const updateState = (stateSetter, currentState) => {
      const updated = currentState.includes(category)
        ? currentState.filter(c => c !== category)
        : [...currentState, category];
      stateSetter(updated);
      setPage(1);
    };

    switch (type) {
      case "adCategory":
        updateState(setSelectedAdCategories, selectedAdCategories);
        break;
      case "contentCategory":
        updateState(setSelectedContentCategories, selectedContentCategories);
        break;
      case "platform":
        updateState(setSelectedPlatforms, selectedPlatforms);
        break;
      case "audienceType":
        updateState(setSelectedAudienceTypes, selectedAudienceTypes);
        break;
      case "location":
        updateState(setSelectedLocations, selectedLocations);
        break;
      default:
        break;
    }
  };

  const handleFollowersChange = (type, value) => {
    if (type === 'min') {
      setMinFollowers(value);
    } else {
      setMaxFollowers(value);
    }
    setPage(1);
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
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
  {/* Search Bar */}
  <div className="flex items-center flex-1 bg-black rounded-full px-4 border border-gray-700 w-full md:w-auto transition-all duration-300 hover:border-gray-600 focus-within:border-[#59FFA7]">
    <span className="text-red-500 text-lg mr-2">
      <i className="fas fa-search"></i>
    </span>
    <input
      className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none py-3 text-sm md:text-base"
      placeholder="Search influencers by name, category..."
      value={searchTerm}
      onChange={handleSearch}
    />
  </div>

  {/* Filter Buttons */}
  <div className="flex items-center gap-3">
    {/* Category Dropdown */}
    <div className="relative">
      <button
        className="px-4 py-2 bg-black rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-300 flex items-center gap-2"
        onClick={() => setShowAdDropdown(!showAdDropdown)}
      >
        <span>Category</span>
        <i className={`fas fa-chevron-${showAdDropdown ? "up" : "down"} text-xs transition-transform`}></i>
      </button>
      {showAdDropdown && (
        <div className="absolute mt-2 bg-[#202020] border border-gray-700 rounded-lg shadow-lg p-3 max-h-60 overflow-y-auto z-20 w-48">
          {adCategories.map((category) => (
            <label key={category.value} className="flex items-center space-x-3 p-2 hover:bg-[#2a2a2a] rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAdCategories.includes(category.value)}
                onChange={() => handleCheckboxChange(category.value, "adCategory")}
                className="accent-[#59FFA7] transform scale-110"
              />
              <span className="text-white text-sm">{category.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* More Filters Button */}
    <button
      className="px-4 py-2 bg-black rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-300 flex items-center gap-2"
      onClick={() => setShowMoreFilters(!showMoreFilters)}
    >
      <span>{showMoreFilters ? 'Hide' : 'More'}</span>
      <i className={`fas fa-${showMoreFilters ? "times" : "sliders-h"} text-xs`}></i>
    </button>

    {/* Chat Button */}
    <button
  className="relative p-3 rounded-full bg-[#59FFA7] text-black hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] transition-all duration-300 shadow-lg hover:shadow-[#59FFA7]/30 active:scale-95 group"
  onClick={() => navigate(`/MessagingApp/${user?._id}`)}
>
  {/* Unread message indicator (optional) */}
  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full animate-pulse">
    1
  </span>
  
  {/* Animated message symbol */}
  <div className="relative w-6 h-6">
    {/* Main bubble */}
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10h8v-2h-8c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8v1.5c0 1.93-1.57 3.5-3.5 3.5S13 15.43 13 13.5V12h-2v1.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5V12c0-3.866-3.134-7-7-7S5 8.134 5 12s3.134 7 7 7h1v2h-1C5.486 21 1 16.514 1 11S5.486 1 11 1h1V2h-1z"/>
    </svg>
    
    {/* Animated dot indicator */}
    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#2BFFF8] rounded-full group-hover:animate-ping opacity-80"></span>
    
    {/* Subtle inner glow */}
    <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
  </div>
</button>
  </div>
</div>

{/* Advanced Filters Section */}
{showMoreFilters && (
  <div className="bg-[#202020] border border-gray-800 rounded-xl p-5 mb-6 shadow-lg">
    <h3 className="text-lg font-medium text-[#59FFA7] mb-4 flex items-center gap-2">
      <i className="fas fa-filter"></i>
      Advanced Filters
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Platforms Dropdown */}
      <div className="relative">
        <div 
          className="flex items-center justify-between p-3 bg-[#151515] border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all"
          onClick={() => setShowPlatformsDropdown(!showPlatformsDropdown)}
        >
          <span className="text-gray-300">Platforms</span>
          <i className={`fas fa-chevron-${showPlatformsDropdown ? "up" : "down"} text-xs text-gray-400`}></i>
        </div>
        {showPlatformsDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-[#151515] border border-gray-700 rounded-lg shadow-lg p-3 max-h-60 overflow-y-auto">
            {platforms.map(platform => (
              <label key={platform} className="flex items-center space-x-3 p-2 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => handleCheckboxChange(platform, 'platform')}
                  className="accent-[#59FFA7] transform scale-110"
                />
                <span className="text-white text-sm">{platform}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Audience Type Dropdown */}
      <div className="relative">
        <div 
          className="flex items-center justify-between p-3 bg-[#151515] border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all"
          onClick={() => setShowAudienceTypesDropdown(!showAudienceTypesDropdown)}
        >
          <span className="text-gray-300">Audience Type</span>
          <i className={`fas fa-chevron-${showAudienceTypesDropdown ? "up" : "down"} text-xs text-gray-400`}></i>
        </div>
        {showAudienceTypesDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-[#151515] border border-gray-700 rounded-lg shadow-lg p-3 max-h-60 overflow-y-auto">
            {audienceTypes.map(type => (
              <label key={type.value} className="flex items-center space-x-3 p-2 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAudienceTypes.includes(type.value)}
                  onChange={() => handleCheckboxChange(type.value, 'audienceType')}
                  className="accent-[#59FFA7] transform scale-110"
                />
                <span className="text-white text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Audience Location Dropdown */}
      <div className="relative">
        <div 
          className="flex items-center justify-between p-3 bg-[#151515] border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all"
          onClick={() => setShowLocationsDropdown(!showLocationsDropdown)}
        >
          <span className="text-gray-300">Audience Location</span>
          <i className={`fas fa-chevron-${showLocationsDropdown ? "up" : "down"} text-xs text-gray-400`}></i>
        </div>
        {showLocationsDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-[#151515] border border-gray-700 rounded-lg shadow-lg p-3 max-h-60 overflow-y-auto">
            {locations.map(location => (
              <label key={location} className="flex items-center space-x-3 p-2 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleCheckboxChange(location, 'location')}
                  className="accent-[#59FFA7] transform scale-110"
                />
                <span className="text-white text-sm">{location}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Range Filters Container */}
      <div className="space-y-3 md:space-y-4">
  {/* Followers Range */}
  <div>
    <label className="block text-gray-300 text-xs sm:text-sm mb-1 md:mb-2">
      Followers Range
    </label>
    <div className="flex items-center gap-2 sm:gap-3">
      <input
        type="number"
        placeholder="Min"
        value={minFollowers}
        onChange={(e) => handleFollowersChange('min', e.target.value)}
        className="flex-1 bg-[#151515] w-28 border border-gray-700 text-white px-3 py-1.5 sm:py-2 rounded-lg focus:border-[#59FFA7] focus:outline-none text-sm"
      />
      <span className="text-gray-400 text-xs sm:text-sm">to</span>
      <input
        type="number"
        placeholder="Max"
        value={maxFollowers}
        onChange={(e) => handleFollowersChange('max', e.target.value)}
        className="flex-1 bg-[#151515] w-28 border border-gray-700 text-white px-3 py-1.5 sm:py-2 rounded-lg focus:border-[#59FFA7] focus:outline-none text-sm"
      />
    </div>
  </div>

 
</div>
    </div>

    {/* Apply Filters Button - Centered on mobile, right-aligned on desktop */}
    <div className="mt-3 md:mt-4 flex justify-center md:justify-end">
      <button
        className="px-5 py-1.5 md:px-6 md:py-2 rounded-full bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
        onClick={() => setShowMoreFilters(false)}
      >
        Apply Filters
      </button>
    </div>
  </div>
)}

<div className={`bg-[#151515] w-full border-t border-gray-800 relative top-[10px] rounded-b-md h-[550px] transition-all duration-300 ${
  subscription ? "overflow-y-auto custom-scrollbar" : "overflow-hidden"
}`}>
  {isLoading ? (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#59FFA7]"></div>
    </div>
  ) : users.length === 0 ? (
    <div className="text-center text-gray-400 h-full flex items-center justify-center">
      No influencers found
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {users.map((user) => (
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
                  e.stopPropagation();
                  handleAddToList(user);
                }}
                disabled={isLoadingRef.current}
                className="px-4 py-2 rounded-md transition-all duration-300 border border-[#59FFA7] bg-transparent text-white hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black"
              >
                {isLoadingRef.current ? "Adding..." : "Add to List"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
     
     
      {/* Pagination */}
      <div className="relative bottom-0 left-0 right-0 flex justify-center items-center p-4">
        <div className="flex items-center gap-2 bg-[#151515] rounded-md p-2 border border-gray-800">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md border border-gray-700 disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-300">
            Page {page} of {isAuthenticated && user ? Math.min(totalPages, Math.max(1, Math.floor((user.linkCoins - 5) / 5))) : 1}
          </span>
          <button
            onClick={() => {
              if (!isAuthenticated || !user) {
                navigate('/login');
                return;
              }
              const coinLimitedPages = Math.max(1, Math.floor((user.linkCoins - 5) / 5));
              const actualMaxPages = Math.min(totalPages, coinLimitedPages);
              if (page < actualMaxPages) {
                setPage(p => p + 1);
              }
            }}
            disabled={!isAuthenticated || !user || page >= Math.min(totalPages, Math.max(1, Math.floor((user?.linkCoins - 5) / 5)))}
            className="px-4 py-2 rounded-md border border-gray-700 disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </>
  )}
  {!subscription && (
    <>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 transform p-4 flex justify-center w-full">
        <button
          onClick={() => {
            if (!isAuthenticated || !user) {
              navigate('/login');
              return;
            }
            if (user.linkCoins >= 5) {
              setSubscription(true);
              // deductCoins(5);
            } else {
              alert("You need at least 5 LinkCoins to unlock this content");
            }
          }}
          className={`w-full max-w-[150px] border ${
            isAuthenticated && user?.linkCoins >= 5 ? 'border-[#59FFA7]' : 'border-gray-600'
          } py-2 bg-black text-white font-bold rounded 
                     hover:bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] hover:text-black hover:border-transparent transition 
                     flex items-center justify-center gap-2 ${
                       !isAuthenticated || !user || user.linkCoins < 5 ? 'opacity-70 cursor-not-allowed' : ''
                     }`}
          disabled={!isAuthenticated || !user || user.linkCoins < 5}
        >
          <span className={`${
            isAuthenticated && user?.linkCoins >= 5 
              ? 'bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8]' 
              : 'text-gray-400'
          } text-transparent bg-clip-text transition-all duration-300 hover:text-black`}>
            🔒
          </span>
          {!isAuthenticated || !user ? "Unlock Now" : (user.linkCoins >= 5 ? "Unlock Now" : "Need 5 Coins")}
        </button>
      </div>
    </>
  )}
</div>
        </div>

        {selectedUser && (
          <Profile User={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </div>

      <Content />
      <Footer />
    </div>
  );
};

export default Main;