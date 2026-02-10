import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  Copy, 
  User, 
  LogOut, 
  X 
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen,
  title 
}) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  const [adminProfileData, setAdminProfileData] = useState(() => {
    const saved = localStorage.getItem("adminData");
    return saved ? JSON.parse(saved) : {
      name: "Ange Nadette",
      email: "gloriantwari@gmail.com",
      username: "@ntwarigloria"
    };
  });

  const [editFormData, setEditFormData] = useState({
    name: adminProfileData.name,
    email: adminProfileData.email,
    username: adminProfileData.username || "@ntwarigloria",
    oldPassword: "",
    newPassword: ""
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        const updatedAdmin = result.data;
        setAdminProfileData({
          ...adminProfileData,
          name: updatedAdmin.name,
          email: updatedAdmin.email
        });
        localStorage.setItem("adminData", JSON.stringify({
          ...JSON.parse(localStorage.getItem("adminData") || '{}'),
          name: updatedAdmin.name,
          email: updatedAdmin.email
        }));
        setIsEditProfileOpen(false);
        setEditFormData({ ...editFormData, oldPassword: "", newPassword: "" });
        alert("Profile updated successfully");
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("An error occurred");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("kidToken");
    localStorage.removeItem("kidData");
    navigate("/login");
  };

  return (
    <>
      <header className="flex flex-col items-stretch gap-4 px-4 py-4 mt-6 bg-white rounded-tl-3xl sm:px-6 lg:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center w-full gap-3 lg:w-auto">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center text-gray-700 border border-gray-300 rounded-full w-9 h-9 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center max-w-[515px] h-[45px] px-5 bg-[#f4f6fb] rounded-full gap-3 lg:w-[800px] sm:w-full">
            <Search className="w-4 h-4 text-[#0f2a5f] shrink-0 ml-2 sm:ml-4" />
            <input
              type="text"
              placeholder="Search for something"
              className="flex-1 w-full bg-transparent text-[13px] leading-none text-[#0f2a5f] placeholder:text-[#0f2a5f] outline-none text-left [font-family:'Poppins']"
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-4 lg:w-auto shrink-0">
          <button className="relative flex items-center justify-center transition-colors bg-white rounded-full w-9 h-9">
            <Bell className="w-5 h-5 text-[#111827]" />
            <span className="absolute w-1.5 h-1.5 bg-red-500 rounded-full top-1.5 right-2.5"></span>
          </button>

          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-full shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="hidden text-sm font-medium text-gray-900 sm:block">
                {adminProfileData.name}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 z-50 w-64 mt-2 overflow-hidden bg-[#1f1f1f] border border-gray-700 rounded-2xl shadow-xl">
                <div className="px-6 py-6 border-b border-gray-700">
                  <div className="flex items-center justify-between gap-2 text-white">
                    <span className="text-[14px] font-medium truncate">{adminProfileData.email}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(adminProfileData.email)}
                      className="text-[#FFA500] hover:text-[#FF8C00]"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{adminProfileData.username || "@ntwarigloria"}</p>
                </div>
                <div className="py-2">
                  <button 
                    onClick={() => {
                      setIsEditProfileOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full gap-3 px-6 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full gap-3 px-6 py-3 text-sm text-red-500 hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Edit Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
            <button 
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-4">Change Password (optional)</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter old password"
                      value={editFormData.oldPassword}
                      onChange={(e) => setEditFormData({...editFormData, oldPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password"
                      value={editFormData.newPassword}
                      onChange={(e) => setEditFormData({...editFormData, newPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#681618] text-white font-semibold rounded-lg hover:bg-[#8a1322] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
