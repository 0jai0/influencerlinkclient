import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import ContactList from "../components/ContactList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import Navbar from "./Navbar";
import { ArrowRight, X } from "lucide-react";

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const userId = user?.id;
  const socketRef = useRef(null);
  console.log(user, "khg");

  if (!socketRef.current) {
    socketRef.current = socketIOClient(process.env.REACT_APP_SERVER_API);
  }

  const socket = socketRef.current;

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_API}/api/collection/users/${userId}`);
      const data = await response.json();

      if (data.collections && data.collections.length > 0) {
        setContacts(data.collections);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
      fetchContacts();
    }

    const handleMessage = (message) => {
      if (
        (message.sender === activeContact?._id && message.receiver === userId) ||
        (message.sender === userId && message.receiver === activeContact?._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [userId, fetchContacts, activeContact, socket]);

  const loadConversation = async (contact) => {
    setActiveContact(contact);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_API}/api/messages/conversation/${userId}/${contact._id}`
      );
      const data = await response.json();
      setMessages(data.conversation || []);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleSendMessage = async (messageContent) => {
    if (!userId || !activeContact) return;

    const newMessage = {
      sender: userId,
      receiver: activeContact._id,
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage, (ack) => {
      if (ack.status === "ok") {
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, status: "sent" }]);
      } else {
        console.error("Failed to send message:", ack.error);
      }
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#121212]">
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-1 border-t-[5px] border-t-black overflow-hidden relative">
        {/* Mobile Sidebar Toggle Button */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="sm:hidden absolute bottom-40 left-2 bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] text-black p-2 rounded-full z-50 shadow-lg"
            aria-label="Open sidebar"
          >
            <ArrowRight size={24} />
          </button>
        )}

        {/* Contact List (Sidebar) */}
        <div
          className={`fixed inset-y-0 left-0 bg-black bg-opacity-75 z-40 sm:static sm:bg-transparent sm:bg-[#151515]
            ${isSidebarOpen ? "w-[80%] sm:w-[300px]" : "hidden sm:block sm:w-[300px]"} border-r-[5px] border-r-black
            transition-all duration-300 ease-in-out`}
        >
          <div className="bg-[#151515] h-full p-4 relative">
            {/* Close Button (Mobile) */}
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="sm:hidden absolute top-3 right-3 text-white"
              >
                <X size={24} />
              </button>
            )}

            <ContactList
              contacts={contacts}
              onSelectContact={(contact) => {
                loadConversation(contact);
                setIsSidebarOpen(false); // Close sidebar on mobile when a contact is selected
              }}
              activeContactId={activeContact?._id}
            />
          </div>
        </div>

        {/* Chat Section */}
        {activeContact ? (
          <div className="flex-1 flex flex-col border-l-black">
            {/* Chat Header */}
            <div className="flex items-center text-left bg-[#121212] py-3 px-4 font-bold shadow-lg shadow-black">
              <div className="w-[40px] h-[40px] mr-4 relative overflow-hidden rounded-full">
                <img
                  src={activeContact.profilePicUrl || "https://via.placeholder.com/100"}
                  alt={`${activeContact.ownerName}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="bg-gradient-to-r from-[#59FFA7] to-[#2BFFF8] bg-clip-text text-transparent">
                {activeContact.ownerName}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 h-screen flex flex-col">
              <ChatWindow messages={messages} currentUser={user} />
            </div>

            {/* Message Input */}
            <div className="sticky bottom-0 p-2 bg-[#151515] border-t border-gray-800">
              <MessageInput onSend={handleSendMessage} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center text-gray-500 text-center px-4">
            <h3>Select a contact to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;