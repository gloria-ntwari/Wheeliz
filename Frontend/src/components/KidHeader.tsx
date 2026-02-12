import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  LogOut 
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

interface KidHeaderProps {
  kidData: {
    kidName: string;
    avatar: string | null;
    email?: string;
    username?: string;
  };
}

export const KidHeader: React.FC<KidHeaderProps> = ({ kidData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getAvatarUrl = (avatar: string | null) => {
    if (!avatar) return "/clip-path-group-16.png";
    if (avatar.startsWith('http')) return avatar;
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    const cleanPath = avatar.startsWith('/') ? avatar : `/${avatar}`;
    return `${baseUrl}${cleanPath}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("kidToken");
    localStorage.removeItem("kidData");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="flex items-center justify-between px-6 py-6 bg-white shadow-md md:px-12">
      {/* Logo Section */}
      <div className="flex gap-16">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/kid/dashboard")}>
        <img src="/clip-path-group-16.png" alt="Wheeliez" className="h-10 md:h-12" />
      </div>

      {/* Nav Links - Centered */}
      <nav className="hidden gap-8 lg:flex">
        <button 
          className={`text-[16px] transition-all [font-family:'Poppins'] ${isActive("/kid/dashboard") ? "font-bold text-black" : "font-medium text-gray-500 hover:text-black"}`} 
          onClick={() => navigate("/kid/dashboard")}
        >
          Home
        </button>
        <button 
          className={`text-sm transition-all [font-family:'Poppins'] ${isActive("/kid/comics") ? "font-bold text-black" : "font-medium text-gray-500 hover:text-black"}`} 
          onClick={() => navigate("/kid/comics")}
        >
          Comics
        </button>
        <button 
          className={`text-sm transition-all [font-family:'Poppins'] ${isActive("/kid/submission") ? "font-bold text-black" : "font-medium text-gray-500 hover:text-black"}`} 
          onClick={() => navigate("/kid/submission")}
        >
          Submission
        </button>
      </nav>
      </div>

      {/* Action Section - Right */}
      <div className="flex items-center gap-4">
        {/* Search Bar - Imitating Admin Style */}
        <div className="flex">
        <div className="hidden sm:flex items-center h-[45px] px-4 bg-[#f4f6fb] rounded-full gap-3 w-[200px] md:w-[300px] lg:w-[500px]">
          <Search className="w-4 h-4 text-[#0f2a5f] shrink-0" />
          <input
            type="text"
            placeholder="Search for something"
            className="flex-1 bg-transparent text-[12px] text-[#0f2a5f] placeholder:text-[#0f2a5f] outline-none [font-family:'Poppins']"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative flex items-center justify-center bg-white rounded-full w-9 h-9">
          <Bell className="w-5 h-5 text-[#111827]" />
          <span className="absolute w-1.5 h-1.5 bg-red-500 rounded-full top-1.5 right-2.5"></span>
        </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 p-1 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-8 h-8 overflow-hidden bg-gray-200 border rounded-lg shrink-0 border-gray-50">
              <img
                src={getAvatarUrl(kidData.avatar)}
                alt="Profile"
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "/clip-path-group-16.png";
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
            <span className="hidden text-xs font-bold text-gray-900 md:block [font-family:'Poppins']">
              {kidData.kidName}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 z-50 w-56 mt-2 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <p className="text-xs font-bold text-gray-900 truncate [font-family:'Poppins']">{kidData.kidName}</p>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">{kidData.email || 'Kid Member'}</p>
              </div>
              <div className="py-1">
                <button 
                  className="flex items-center w-full gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors [font-family:'Poppins']"
                  onClick={() => {
                    setIsProfileOpen(false);
                    // navigate("/kid/profile");
                  }}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <button 
                  className="flex items-center w-full gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors [font-family:'Poppins']"
                  onClick={handleLogout}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
