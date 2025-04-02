import React, { useState } from "react";

const MessageInput = ({ onSend, isExpired }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isExpired) {  // Only send if not expired
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center justify-between gap-2">
      {/* Input field - disabled when expired */}
      <input
        type="text"
        placeholder={isExpired ? "Chat expired - upgrade to continue" : "Type a message..."}
        value={message}
        onChange={(e) => !isExpired && setMessage(e.target.value)}  // Only allow changes when not expired
        className={`flex-1 px-4 py-2 text-white bg-[#121212] rounded-full outline-none border ${
          isExpired ? "border-gray-600 cursor-not-allowed" : "border-gray-700 focus:border-[#59FFA7]"
        }`}
        disabled={isExpired}  // Disable input when expired
      />
      
      {/* Send button - disabled when expired */}
      <button
        type="submit"
        disabled={isExpired}  // Disable button when expired
        className={`px-4 py-2 font-semibold rounded-full transition duration-300 ${
          isExpired 
            ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
            : "bg-[#59FFA7] text-black hover:bg-[#2BFFF8]"
        }`}
      >
        {isExpired ? "Expired" : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;