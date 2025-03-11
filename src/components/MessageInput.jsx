import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center justify-between gap-2">
      {/* Input on the left */}
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 py-2 text-white bg-[#121212] rounded-full outline-none border border-gray-700 focus:border-[#59FFA7]"
      />
      {/* Button on the right */}
      <button
        type="submit"
        className="px-4 py-2 bg-[#59FFA7] text-black font-semibold rounded-full hover:bg-[#2BFFF8] transition duration-300"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;