import React, { useState, useEffect } from "react";

const ContactList = ({ 
  contacts, 
  onSelectContact, 
  onRemoveContact, 
  activeContactId 
}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);

  // Generate consistent color based on contact ID
  const getContactColor = (id) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500'
    ];
    const hash = id ? id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  useEffect(() => {
    setUsers(contacts);
    setFilteredUsers(contacts);
  }, [contacts]);

  const filterUsers = (search) => {
    const filtered = users.filter((user) =>
      user.ownerName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterUsers(value);
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

  const handleRemoveClick = (e, contactId) => {
    e.stopPropagation();
    setShowRemoveConfirm(contactId);
  };

  const confirmRemove = (e, contactId) => {
    e.stopPropagation();
    onRemoveContact(contactId);
    setShowRemoveConfirm(null);
  };

  const cancelRemove = (e) => {
    e.stopPropagation();
    setShowRemoveConfirm(null);
  };

  return (
    <div className="w-full border-r border-gray-800 bg-[#121212] h-full overflow-y-auto">
      {/* Title */}
      <div className="px-5 pt-5 pb-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] bg-clip-text text-transparent">
          Messages
        </h2>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full px-4 py-2.5 text-sm text-white bg-[#1a1a1a] rounded-xl border border-gray-700 focus:border-[#59FFA7] focus:outline-none focus:ring-1 focus:ring-[#59FFA7]/30"
            value={searchTerm}
            onChange={handleSearch}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Contact List */}
      {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
        filteredUsers.map((contact) => {
          const colorClass = getContactColor(contact._id);
          const initials = contact.ownerName 
            ? contact.ownerName.split(' ').map(n => n[0]).join('').toUpperCase()
            : '?';
            
          return (
            <div
              key={contact._id}
              className={`px-4 py-3  cursor-pointer custom-scrollbar transition-colors duration-200 hover:bg-[#1a1a1a] ${
                activeContactId === contact._id ? "bg-[#1a1a1a] border-l-4 border-[#59FFA7]" : ""
              }`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  {/* Profile Picture with Fallback */}
                  <div className="relative">
                    {contact.profilePicUrl ? (
                      <img
                        src={contact.profilePicUrl}
                        alt={`${contact.ownerName}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${colorClass}`}>
                        {initials}
                      </div>
                    )}
                    {/* Online status indicator */}
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-white font-medium truncate max-w-[150px]">
                        {contact.ownerName}
                      </strong>
                      {contact.lastMessageTimestamp && (
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {formatDate(contact.lastMessageTimestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {contact.lastMessage || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  {/* Unread message indicator */}
                  {contact.unreadCount > 0 && (
                    <div className="ml-2 w-5 h-5 flex items-center justify-center bg-[#59FFA7] text-black text-xs font-bold rounded-full">
                      {contact.unreadCount}
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button 
                    onClick={(e) => handleRemoveClick(e, contact.user._id)}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
             
              


              {/* Remove confirmation */}
              {showRemoveConfirm === contact.user._id && (
                <div 
                  className="absolute right-4 mt-2 bg-[#1a1a1a] p-3 rounded-lg shadow-lg border border-gray-700 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-sm text-white mb-2">Remove this contact?</p>
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={(e) => cancelRemove(e)}
                      className="px-3 py-1 text-sm text-gray-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={(e) => confirmRemove(e, contact.user._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-gray-400">No contacts found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm ? "Try a different search" : "Your contacts will appear here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactList;