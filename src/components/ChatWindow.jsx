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

  // Get appropriate status icon for messages
  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return "✅"; // Sent
      case "recevied":
        return "✅✅"; // Delivered
      case "read":
        return "🔵✅✅"; // Read
      default:
        return "";
    }
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 p-5 min-h-full custom-scrollbar border-b-[5px] border-[#151515] bg-[#121212]">
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
    className={`p-3 max-w-[60%] break-words rounded-lg text-sm shadow-md flex items-end gap-2 
      ${isSender ? "bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black" : "bg-gray-800 text-white"}`}
  >
    {/* Message Content */}
    <span>{msg.content || "(No content)"}</span>

    {/* Timestamp and Status */}
    <span className={`text-xs whitespace-nowrap flex items-center ${isSender ? "text-black" : "text-gray-400"}`}>
                      {formattedTime}{" "}
                      {isSender && <span className="ml-1">{getStatusIcon(msg.status)}</span>}
                    </span>
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