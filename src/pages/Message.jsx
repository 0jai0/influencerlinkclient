import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import ContactList from "../components/ContactList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import Navbar from "./Navbar";

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const userId = user?.id;
  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = socketIOClient(process.env.REACT_APP_SERVER_API);
  }

  const socket = socketRef.current;

  // ✅ Wrap fetchContacts in useCallback to prevent unnecessary re-creation
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
  }, [userId]); // ✅ Only re-create if userId changes

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
  }, [userId, fetchContacts, activeContact, socket]); // ✅ Now includes dependencies

  const loadConversation = async (contact) => {
    setActiveContact(contact);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_API}/api/messages/conversation/${userId}/${contact._id}`
      );
      const data = await response.json();
      console.log(data, "11");
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

      <div className="flex flex-1 border-t-[5px] border-t-black overflow-hidden">
        <ContactList contacts={contacts} onSelectContact={loadConversation} activeContactId={activeContact?._id} />

        {activeContact ? (
          <div className="flex-1 border-l-[5px] border-l-black flex flex-col">
            <div className="flex items-center text-left bg-[#121212] py-2.5 font-bold px-4 shadow-2xl shadow-black drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">
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

            <div className="flex-1 h-[500px] flex flex-col">
              <ChatWindow messages={messages} currentUser={user} />
            </div>

            <div className="flex-1 flex flex-col">
              <MessageInput onSend={handleSendMessage} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center text-gray-500">
            <h3>Select a contact to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
