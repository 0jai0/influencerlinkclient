import React, { useState, useEffect } from "react";

const ContactList = ({ contacts, onSelectContact, activeContactId }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Populate users state with contacts data
  useEffect(() => {
    setUsers(contacts);
    setFilteredUsers(contacts);
  }, [contacts]);

  // Filter Logic
  const filterUsers = (search) => {
    const filtered = users.filter((user) =>
      user.ownerName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  // Handle Search Input Change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterUsers(value);
  };

  // Format date function
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
    <div className="w-full border-spacing-4 border-r border-[#121212] bg-[#121212] overflow-y-auto">
      {/* Title */}
      <div className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] ml-5 mt-3 bg-clip-text text-transparent text-xl">
        Chats
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 py-2 text-sm text-white bg-black rounded-2xl"
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
            {/* Contact Name and Profile */}
            <div className="flex items-center justify-between w-full">
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

            {/* Last Message Preview */}
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
