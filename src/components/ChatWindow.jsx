import React, { useEffect, useRef } from "react";

const ChatWindow = ({ messages }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return !isNaN(date.valueOf()) ? date.toLocaleString() : "Invalid Date";
  };

  return (
    <div className="flex-1 p-5 min-h-full custom-scrollbar border-b-[56px] border-[#151515] bg-[#121212]">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages yet.</p>
      ) : (
        messages.map((msg, index) => {
          const isSender = msg.status === "sent";
          const formattedDate = formatDate(msg.timestamp);

          return (
            <div
              key={index}
              className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 max-w-[60%] break-words rounded-lg text-sm shadow-md 
                ${isSender ? "bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black" : "bg-gray-800 text-white"}`}
              >
                {msg.content || "(No content)"}
                <div
                  className={`text-xs mt-1 ${isSender ? "text-black text-right" : "text-gray-400 text-left"}`}
                >
                  {formattedDate}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;