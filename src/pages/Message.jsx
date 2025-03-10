// Chat.js (updated)
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import ContactList from "../components/ContactList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import Navbar from "./Navbar";
const Chat = () => {
  const {  user } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const userId = user?.id;

  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = socketIOClient("http://localhost:5000");
  }

  const socket = socketRef.current;

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
  }, [activeContact, userId]);

  const fetchContacts = async () => {
    try {
      // Fetch the collection of users for the logged-in user
      const response = await fetch(`http://localhost:5000/api/collection/users/${userId}`);
      const data = await response.json();
  
      if (data.collections && data.collections.length > 0) {
        // Directly use the user objects from the response
        setContacts(data.collections);
      } else {
        setContacts([]); // No contacts found
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const loadConversation = async (contact) => {
    setActiveContact(contact);
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/conversation/${userId}/${contact._id}`
      );
      const data = await response.json();
      console.log(data,"11");
      // Use the conversation as received – each message now includes sender info.
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
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', newMessage, (ack) => {
      if (ack.status === 'ok') {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...newMessage, status: 'sent' },
        ]);
      } else {
        console.error('Failed to send message:', ack.error);
      }
    });
  };

  return (
    
    <div className="flex flex-col h-screen w-full bg-[#121212]">
    {/* Navbar at the top */}
    <Navbar />
  
    {/* Main content area */}
    <div className="flex flex-1 border-t-[5px] border-t-black overflow-hidden">
      <ContactList
        contacts={contacts}
        onSelectContact={loadConversation}
        activeContactId={activeContact?._id}
      />
      {activeContact ? (
        <div className="flex-1 border-l-[5px] border-l-black flex flex-col">

        {/* Profile Header */}
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
      
        {/* Chat Window and Input (No Gaps) */}
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
