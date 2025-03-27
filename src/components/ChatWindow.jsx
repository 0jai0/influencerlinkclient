import React, { useEffect, useRef } from "react";

const ChatWindow = ({ messages }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to format the date in a WhatsApp-like style
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.valueOf())) return "Invalid Date";

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    }
  };

  // Function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!groupedMessages[dateKey]) {
        groupedMessages[dateKey] = [];
      }
      groupedMessages[dateKey].push(msg);
    });
    return groupedMessages;
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);
  const getTickMark = (status) => {
    if (status === "unread") return "✔";
    if (status === "delivered") return "✔✔";
    if (status === "read") return "✔✔";
    return "✔";
  };

  return (
    <div className="flex-1 p-5 min-h-full custom-scrollbar border-b-[5px] border-[#151515] bg-[#121212] overflow-y-auto">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages yet.</p>
      ) : (
        Object.entries(groupedMessages).map(([dateKey, messagesForDate]) => (
          <div key={dateKey}>
            {/* Date Separator */}
            <div className="flex justify-center my-4">
              <div className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                {formatDate(new Date(dateKey))}
              </div>
            </div>

            {/* Messages for this date */}
            {messagesForDate.map((msg, index) => {
              const isSender = msg.status === "sent";
              const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={index}
                  className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`pt-2 pb-1 px-2 w-fit max-w-[80%] md:max-w-[70%] lg:max-w-[60%] break-words rounded-lg text-sm shadow-md flex flex-col
                      ${isSender ? "bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black" : "bg-gray-800 text-white"}`}
                  >
                    {/* Message Content */}
                    <div className="pb-1 whitespace-pre-wrap break-all word-break">
                      {msg.content || "(No content)"}
                    </div>

                    {/* Timestamp and status */}
                    <div className={`flex justify-end items-center gap-1 ${isSender ? "text-black" : "text-gray-400"}`}>
                      <span className="text-[10px] whitespace-nowrap">
                        {formattedTime}
                      </span>
                      {isSender && (
                        <span className={`text-xs ${msg.messageStatus === "read" ? "text-blue-500" : "text-gray-400"}`}>
                          {getTickMark(msg.messageStatus)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;