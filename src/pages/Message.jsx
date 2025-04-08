import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import axios from "axios";
import ContactList from "../components/ContactList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import Navbar from "./Navbar";
import { ArrowRight, X } from "lucide-react";
import { FiMessageSquare } from 'react-icons/fi'; 
import Alert from './Alert';
import { useNavigate } from "react-router-dom";


const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const userId = user?._id;
  const socketRef = useRef(null);
  const [alert, setAlert] = useState(null);
  const isLoadingRef = useRef(false);
  const navigate = useNavigate();
  //console.log(user.ownerName, "khg");

  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  if (!socketRef.current) {
    socketRef.current = socketIOClient(process.env.REACT_APP_SERVER_API);
  }

  const socket = socketRef.current;

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_API}/api/collection/users/${userId}`);
      const data = await response.json();

      if (data.collections) {
        // Filter out any null user references and format data
        const validContacts = data.collections.filter(
          item => item.user && typeof item.user === 'object'
        ).map(item => ({
          ...item,
          id: item.user._id,
          ownerName: item.user?.ownerName,
          profilePicUrl: item.user?.profilePicUrl,
          isOnline: item.user?.isOnline
        }));
        //console.log(validContacts);
        setContacts(validContacts);
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
        (message.sender === activeContact?.user._id && message.receiver === userId) ||
        (message.sender === userId && message.receiver === activeContact?.user._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [userId, fetchContacts, activeContact, socket]);

  //console.log(contacts,"ok");
  const isOlderThan7Days = (addedAt) => {
    if (!addedAt) return false;
    const addedDate = new Date(addedAt);
    const now = new Date();
    const diffTime = addedDate - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    //console.log(diffDays);
    return diffDays > 7;

  };
  const loadConversation = async (contact) => {
    const isExpired = isOlderThan7Days(contact.addedAt);
    setActiveContact({ ...contact, isExpired });
    //console.log(contact,"fine");
    //setActiveContact(contact);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_API}/api/messages/conversation/${userId}/${contact.user._id}`
      );
      const data = await response.json();
      //console.log(data);
      setMessages(data.conversation || []);
      // Mark messages as read
    await fetch(`${process.env.REACT_APP_SERVER_API}/api/messages/mark-read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: contact.user._id,  // Ensure this matches backend
        receiver: userId,
      }),
    });

    // Notify sender that messages have been read
    socket.emit("mark_as_read", {
      sender: contact.user._id,
      receiver: userId,
    });
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };
  

  const handleSendMessage = async (messageContent) => {
    if (!userId || !activeContact) return;

    const newMessage = {
      sender: userId,
      receiver: activeContact.user._id,
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage, async (ack) => {
      if (ack.status === "ok") {
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, status: "sent" }]);
        
        // Send notification
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_API}/api/notifications/send-message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender: user.ownerName,
              receiver: activeContact.user._id,
              message: messageContent,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to send notification");
          }

          console.log("Notification sent successfully");
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      } else {
        console.error("Failed to send message:", ack.error);
      }
    });
  };

  const handleRemoveFromList = async (contactId) => {
    console.log(contactId,"ll");
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_API}/api/collection/users/remove`, {
        userId: user?._id,
        targetUserId: contactId,
      });
      console.log("Successfully removed target user from collection");
      // Refresh contacts list
      fetchContacts();
      // If the removed contact is the active one, clear the chat
      if (activeContact?.user._id === contactId) {
        setActiveContact(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error removing from collection:", error);
    }
  };

  const handleUpgrade = async (e) => {
    e.stopPropagation();
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

  
    if (!activeContact || !user?._id) {
      console.error("Active contact and User ID are required");
      isLoadingRef.current = false;
      return;
    }
  
    if (user.linkCoins < 1) {
      setAlert({
        type: 'error',
        message: 'Insufficient LinkCoins. Please purchase more.'
      });
      isLoadingRef.current = false;
      return;
    }
  
    setAlert({
      type: 'info',
      message: 'Spend 1 LinkCoin to renew this conversation for 7 more days. Are you sure?',
      onConfirm: async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_API}/api/collection/users/update`,
            {
              userId: user._id,
              targetUserId: activeContact.user._id
            }
          );
          //console.log(response.data);
          if (response.data.message === "Connection dates updated successfully") {
            setAlert({
              type: 'success',
              message: 'Conversation renewed successfully!'
            });
            // Refresh the conversation with the updated date
            const updatedContact = {
              ...activeContact,
              addedAt: response.data.newDate,
              isExpired: false
            };
            await loadConversation(updatedContact);
          } else {
            setAlert({
              type: 'error',
              message: response.data.message || 'Failed to renew conversation.'
            });
          }
        } catch (error) {
          console.error("Upgrade failed:", error);
          setAlert({
            type: 'error',
            message: error.response?.data?.message || 'Failed to renew conversation. Please try again.'
          });
        } finally {
          isLoadingRef.current = false;
        }
      },
      onCancel: () => {
        setAlert(null);
        isLoadingRef.current = false;
      },
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#121212]">

      <Navbar />
      {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={alert.onClose}
                onConfirm={alert.onConfirm}
                onCancel={alert.onCancel}
              />
            )}
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
          ref={menuRef}
          className={`fixed inset-y-0 left-0 bg-black bg-opacity-75 z-40 sm:static sm:bg-transparent sm:bg-[#151515]
            ${isSidebarOpen ? "w-[80%] sm:w-[300px]" : "hidden sm:block sm:w-[300px]"} border-r-[5px] border-r-black
            transition-all duration-300 ease-in-out`}
        >
          <div className="bg-[#151515] h-full top-12 sm:top-0  p-4 relative">
            {/* Close Button (Mobile) */}
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="sm:hidden absolute top-10 right-3 text-white"
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
              onRemoveContact={handleRemoveFromList}
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
          src={activeContact.profilePicUrl || 
               `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(activeContact.ownerName)}&radius=50&backgroundColor=1a1a1a`}
          alt={`${activeContact.ownerName}'s profile`}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
          onError={(e) => {
            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeContact.ownerName)}&radius=50`;
          }}
        />
              </div>
              <span className="bg-gradient-to-r from-[#1FFFE0] to-[#249BCA] bg-clip-text text-transparent">
                {activeContact.ownerName}
              </span>
              
            </div>

            {/* Chat Messages */}
            <div className="flex-1 h-screen flex flex-col">
              <ChatWindow messages={messages} currentUser={user} isExpired={activeContact?.isExpired} onUpgrade={handleUpgrade} />
            </div>

            {/* Message Input */}
            <div className="sticky bottom-0 p-2 bg-[#151515] border-t border-gray-800">
              <MessageInput onSend={handleSendMessage} isExpired={activeContact?.isExpired} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 bg-[#121212]">
        <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-[#59FFA7]/10 to-[#2BFFF8]/10 flex items-center justify-center">
          <FiMessageSquare className="text-[#1FFFE0]" size={40} />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No conversation selected</h3>
        <p className="text-gray-400 max-w-md">
          Choose a contact from the sidebar to start chatting or create a new conversation
        </p>
        <button
          onClick={()=>navigate("/")}
         className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-[#1FFFE0] to-[#249BCA] text-black font-medium hover:shadow-lg hover:shadow-[#59FFA7]/30 transition-all">
          New Message
        </button>
      </div>
        )}
      </div>
    </div>
  );
};

export default Chat;