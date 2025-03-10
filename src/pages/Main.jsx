import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import Navbar from "./Navbar";
import Banner from "./Banner";

const Main = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [adCategories, setAdCategories] = useState([]);
  //const [pageContentCategories, setPageContentCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdCategories, setSelectedAdCategories] = useState([]);
  const [selectedContentCategories, setSelectedContentCategories] = useState(
    []
  );
  const [showAdDropdown, setShowAdDropdown] = useState(false);
  //const [showContentDropdown, setShowContentDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subscription, setSubscription] = useState(false);

  useEffect(() => {
    // Fetch data from API
    fetch("http://localhost:5000/api/pageowners/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        setFilteredUsers(Array.isArray(data.data) ? data.data : []);

        // Extract unique adCategories and pageContentCategories
        const uniqueAdCategories = [
          ...new Set(data.data.flatMap((user) => user.adCategories || [])),
        ];
        
        setAdCategories(uniqueAdCategories);
        //setPageContentCategories(uniqueContentCategories);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Filter Logic
  const filterUsers = (search, adCats, contentCats) => {
    let filtered = users.filter((user) =>
      user.ownerName.toLowerCase().includes(search.toLowerCase())
    );

    if (adCats.length > 0) {
      filtered = filtered.filter((user) =>
        user.adCategories?.some((cat) => adCats.includes(cat))
      );
    }

    if (contentCats.length > 0) {
      filtered = filtered.filter((user) =>
        user.pageContentCategory?.some((cat) => contentCats.includes(cat))
      );
    }

    setFilteredUsers(filtered);
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

  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white">
      {/* Navbar */}
      <Navbar />
      <Banner />

      {/* Filters and Search */}
      <div className="p-6 bg-[#151515] rounded shadow space-y-6">
  {/* Header Section */}
  <div className="flex flex-col items-start bg-[#151515] p-4 border border-gray-800 rounded-t-md relative w-full">
  {/* Header Section */}
  <div className="absolute -top-5 -left-6 bg-[#151515] px-4">
  <span className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-transparent bg-clip-text font-sans text-2xl">
  Influencers
</span>

  </div>



  {/* Search and Filter Section */}
  <div className="flex items-center space-x-4 w-full mt-4">
    {/* Search Input */}
    <div className="flex items-center flex-1 bg-black rounded-full px-4 border border-gray-700">
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

    {/* Category Dropdown */}
    <div className="relative">
      <button
        className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-700 transition border border-gray-700"
        onClick={() => setShowAdDropdown(!showAdDropdown)}
      >
        Category
        <span className="ml-1">
          <i className="fas fa-chevron-down"></i>
        </span>
      </button>
      {showAdDropdown && (
        <div className="absolute mt-2 bg-black border border-gray-700 rounded shadow-md p-3 max-h-40 overflow-y-auto z-10">
          {adCategories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAdCategories.includes(category)}
                onChange={() =>
                  handleCheckboxChange(category, "adCategory")
                }
                className="accent-red-500"
              />
              <span className="text-white">{category}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Followers Filter */}
    <button
      className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-700 transition border border-gray-700"
    >
      Followers
      <span className="ml-1">
        <i className="fas fa-chevron-down"></i>
      </span>
    </button>

    {/* Price Filter */}
    <button
      className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-700 transition border border-gray-700"
    >
      Price
      <span className="ml-1">
        <i className="fas fa-chevron-down"></i>
      </span>
    </button>

    {/* My List Button */}
    <div className="relative">
      <button
        className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-700 flex items-center space-x-2 border border-gray-700"
        onClick={() => alert("My List clicked!")}
      >
        <i className="fas fa-bars"></i>
        <span>My List</span>
      </button>
      {/* Notification Badge */}
      <span className="absolute top-[5px] right-[5px] px-[6px] py-[2px] text-xs bg-red-500 text-white rounded-full">
        3
      </span>
    </div>
  </div>
</div>
  {/* Influencer List Section */}
  <div className={`p-6 bg-[#151515] border border-gray-800 relative top-[-25px] rounded-b-md h-[500px] transition-all duration-300 ${
        subscription ? "overflow-y-auto custom-scrollbar" : "overflow-hidden"
      }`}>
    {filteredUsers.length === 0 ? (
      <div className="text-center text-gray-400">No influencers found</div>
    ) : (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-[20px] gap-y-[20px] mt-[20px]">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
            onClick={() => setSelectedUser(user)}
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))}
         {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))} {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="relative p-[15px] border border-gray-800 rounded-lg shadow-md bg-[#202020] hover:shadow-lg transition-shadow duration-[300ms] cursor-pointer"
          >
            {/* Profile Picture */}
            <div className="w-full h-[100px] mb-[10px] relative overflow-hidden rounded-lg">
              <img
                src={
                  user.profilePicUrl || "https://via.placeholder.com/100"
                }
                alt={`${user.ownerName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <h3 className="font-bold text-lg text-white truncate mb-[5px]">
              {user.ownerName}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-[10px]">
              {user.followers || "N/A"} Followers
            </p>

            {/* Action Buttons */}
            <button
              className="absolute top-[10px] right-[10px] px-[10px] py-[5px] bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
              onClick={() => alert("Chat Now")}
            >
              Chat Now
            </button>
            <button
              className="mt-[10px] w-full px-[15px] py-[10px] bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition"
              onClick={() => alert("Added to My List")}
            >
              Add to List
            </button>
          </div>
        ))}
      </div>
      
    )}
    {!subscription && (
        <div className="absolute bottom-0 left-0 w-full h-[90%] bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent pointer-events-none"></div>
      )}
    {/* Unlock Button */}
    
  </div>
  <div className="absolute -bottom-52 left-1/2 transform -translate-x-1/2 p-[15px] flex justify-center">
    <button 
    onClick={() => setSubscription(true)}
    className="w-full max-w-[300px] px-[15px] py-[10px] bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition">
      🔒 Unlock Now
    </button>
    </div>
  {/* Profile Modal */}
  {selectedUser && (
    <Profile User={selectedUser} onClose={() => setSelectedUser(null)} />
  )}
</div>


      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">FOOTER</footer>
    </div>
  );
};

export default Main;
