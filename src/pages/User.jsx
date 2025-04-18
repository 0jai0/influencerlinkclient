import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // Import logout icon
import { logoutUser } from "../store/auth-slice";

const UserDropdown = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any existing notifications
    if ("Notification" in window && Notification.permission === "granted") {
      // Close all currently displayed notifications
      navigator.serviceWorker?.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.getNotifications().then(notifications => {
            notifications.forEach(notification => notification.close());
          });
        });
      });
    }
  
    // Perform logout actions
    dispatch(logoutUser());
    navigate("/login");
    onClose();
  };

  return (
    <div className="absolute right-0 top-12 bg-[#252525] border border-[#1FFFE0]/20 rounded-lg shadow-xl p-2 w-56 z-50">
  {/* User Info Section */}
  <div className="px-3 py-2 border-b border-[#1FFFE0]/10">
    <p className="text-[#1FFFE0] font-medium truncate">{user?.ownerName || "User"}</p>
    <p className="text-gray-400 text-xs truncate">{user?.email || "user@example.com"}</p>
  </div>

  {/* Menu Items */}
  <div className="flex flex-col py-1">
    <button
      onClick={() => {
        navigate(`/Profile/${user?._id}`);
      }}
      className="flex items-center px-3 py-2 text-white hover:bg-[#1FFFE0]/10 hover:text-[#1FFFE0] transition-colors text-sm"
    >
      <span>View Profile</span>
    </button>

    <button
      onClick={() => {
        navigate("/UpdateProfile");
        onClose();
      }}
      className="flex items-center px-3 py-2 text-white hover:bg-[#1FFFE0]/10 hover:text-[#1FFFE0] transition-colors text-sm"
    >
      <span>Update Profile</span>
    </button>

    <button
      onClick={() => {
        navigate("/forgot-password");
        onClose();
      }}
      className="flex items-center px-3 py-2 text-white hover:bg-[#1FFFE0]/10 hover:text-[#1FFFE0] transition-colors text-sm"
    >
      <span>Change Password</span>
    </button>

    <button
      onClick={handleLogout}
      className="flex items-center px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm mt-1 border-t border-[#1FFFE0]/10 pt-1"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Logout</span>
    </button>
  </div>
</div>
  );
};

export default UserDropdown;