import React, { useState, useEffect } from "react";// Install date-fns for date formatting

const ContactList = ({ contacts, onSelectContact, activeContactId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdCategories, setSelectedAdCategories] = useState([]);
  const [selectedContentCategories, setSelectedContentCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all"); // Tracks the active filter

  // Populate users state with contacts data
  useEffect(() => {
    setUsers(contacts);
    setFilteredUsers(contacts);
  }, [contacts]);

  // Filter Logic
  const filterUsers = (search, adCats, contentCats, filterType) => {
    let filtered = users.filter((user) =>
      user.ownerName.toLowerCase().includes(search.toLowerCase())
    );

    // Apply ad category filter
    if (adCats.length > 0) {
      filtered = filtered.filter((user) =>
        user.adCategories?.some((cat) => adCats.includes(cat))
      );
    }

    // Apply content category filter
    if (contentCats.length > 0) {
      filtered = filtered.filter((user) =>
        user.pageContentCategory?.some((cat) => contentCats.includes(cat))
      );
    }

    // Apply additional filters based on the active filter type
    switch (filterType) {
      case "category":
        // Filter by content categories (example logic)
        filtered = filtered.filter((user) => user.pageContentCategory?.length > 0);
        break;
      case "followers":
        // Filter by followers (example logic)
        filtered = filtered.filter((user) => user.followers >= 1000); // Example: users with 1000+ followers
        break;
      case "price":
        // Filter by price (example logic)
        filtered = filtered.filter((user) => user.subscriptionPrice <= 50); // Example: users with subscription price <= $50
        break;
      default:
        // No additional filtering for "all"
        break;
    }

    setFilteredUsers(filtered);
  };

  // Handle Search Input Change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterUsers(value, selectedAdCategories, selectedContentCategories, activeFilter);
  };


 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    
    yesterday.setDate(today.getDate() - 1);
  
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
    }
  };

  return (
    <div className="w-1/4 border-spacing-4 border-r border-[#121212] bg-[#121212] overflow-y-auto">
      {/* Search Bar */}
      <div className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] ml-5 mt-3 bg-clip-text text-transparent  text-xl">
  Chats
</div>

      <div className="p-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 py-2 text-sm text-white bg-black rounded-2xl "
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      
      {/* Contact List */}
      {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
        filteredUsers.map((contact) => (
          <div
            key={contact._id}
            className={`p-4 cursor-pointer border-b border-t border-gray-700 ${
              activeContactId === contact._id ? "bg-[#040404]" : "bg-[#121212]"
            }`}
            onClick={() => onSelectContact(contact)}
          >
            {/* Contact Name */}
            <div className="flex items-center justify-between w-full">
  {/* Profile Picture & Name */}
  <div className="flex items-center space-x-3">
    <div className="w-[40px] h-[40px] relative overflow-hidden rounded-full">
      <img
        src={contact.profilePicUrl || "https://via.placeholder.com/100"}
        alt={`${contact.ownerName}'s profile`}
        className="w-full h-full object-cover"
      />
    </div>
    <strong className="text-white">{contact.ownerName}</strong>
  </div>

  {/* Last Message Timestamp */}
  {contact.lastMessageTimestamp && (
    <span className="text-xs text-gray-500">
      {formatDate(contact.lastMessageTimestamp)}
    </span>
  )}
</div>


            {/* Last Message */}
            <p className="mt-1 text-sm text-gray-400 truncate">
              {contact.lastMessage || "No messages yet"}
            </p>
          </div>
        ))
      ) : (
        <div className="p-4 text-sm text-gray-400">No contacts available</div>
      )}
    </div>
  );
};

export default ContactList;