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
    <form 
      onSubmit={handleSubmit} 
      className="absolute bottom-0 right-0  flex items-center w-3/4 border-l-[5px] border-black p-3 bg-[#121212] shadow-2xl shadow-black drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 py-2 text-white  bg-black rounded-3xl "
      />
      <button
        type="submit"
        className="ml-3 px-4 py-2 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black font-semibold rounded-full  transition duration-300"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
