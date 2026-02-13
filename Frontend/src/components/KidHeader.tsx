import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  LogOut,
  X,
  Camera 
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

interface KidHeaderProps {
  kidData: {
    kidName: string;
    avatar: string | null;
    email?: string;
    parentPhone?: string;
    dateOfBirth?: string;
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

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: kidData.kidName,
    email: kidData.email || "",
    parentPhone: kidData.parentPhone || "",
    dateOfBirth: kidData.dateOfBirth ? new Date(kidData.dateOfBirth).toISOString().split('T')[0] : "",
    oldPassword: "",
    newPassword: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Update form data when props change
  React.useEffect(() => {
    setEditFormData(prev => ({
        ...prev,
        name: kidData.kidName,
        email: kidData.email || "",
        parentPhone: kidData.parentPhone || "",
        dateOfBirth: kidData.dateOfBirth ? new Date(kidData.dateOfBirth).toISOString().split('T')[0] : "",
    }));
  }, [kidData]);


  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("kidToken");
      const formData = new FormData();
      formData.append('name', editFormData.name);
      formData.append('email', editFormData.email);
      formData.append('parentPhone', editFormData.parentPhone);
      formData.append('dateOfBirth', editFormData.dateOfBirth);
      if (editFormData.oldPassword) formData.append('oldPassword', editFormData.oldPassword);
      if (editFormData.newPassword) formData.append('newPassword', editFormData.newPassword);
      if (avatarFile) formData.append('avatar', avatarFile);

      const response = await fetch(`${API_BASE_URL}/kid/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        const updatedKid = result.data;
        // Ideally prompt parent to update state or refresh, but for now just close and alert
        alert("Profile updated successfully. Please refresh to see changes.");
        setIsEditProfileOpen(false);
        setEditFormData({ ...editFormData, oldPassword: "", newPassword: "" });
        setAvatarFile(null);
        setAvatarPreview(null);
        // Reload page to reflect changes easily
        window.location.reload(); 
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("An error occurred");
    }
  };


  const isActive = (path: string) => location.pathname === path;

  return (
    <>
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
            defaultValue={new URLSearchParams(location.search).get("search") || ""}
            onChange={(e) => {
              const search = e.target.value;
              const params = new URLSearchParams(location.search);
              if (search) {
                params.set("search", search);
              } else {
                params.delete("search");
              }
              navigate(`?${params.toString()}`, { replace: true });
            }}
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
            <div className="w-8 h-8 overflow-hidden bg-gray-200 border rounded-full shrink-0 border-gray-50">
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
                    setIsEditProfileOpen(true);
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-[Poppins]">Edit Profile</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <div className="w-24 h-24 overflow-hidden bg-gray-100 rounded-full border-4 border-[#FFA500] shadow-md">
                        <img 
                          src={avatarPreview || getAvatarUrl(kidData.avatar)} 
                          alt="Profile Preview" 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = "/clip-path-group-16.png"; 
                            e.currentTarget.onerror = null; 
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-[#681618] text-white rounded-full shadow-lg hover:bg-[#8a1322] transition-all"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            setAvatarFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => setAvatarPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-[Poppins]">Click icon to change photo</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-[Poppins]">Full Name</label>
                    <input 
                      type="text" 
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all font-[Poppins]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-[Poppins]">Email</label>
                    <input 
                      type="email" 
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all font-[Poppins]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-[Poppins]">Parent's Phone</label>
                    <input 
                      type="tel" 
                      value={editFormData.parentPhone}
                      onChange={(e) => setEditFormData({...editFormData, parentPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all font-[Poppins]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-[Poppins]">Date of Birth</label>
                    <input 
                      type="date" 
                      value={editFormData.dateOfBirth}
                      onChange={(e) => setEditFormData({...editFormData, dateOfBirth: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all font-[Poppins]"
                      required
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 mb-4 font-[Poppins]">Change Password (optional)</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-[Poppins]">Old Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter old password"
                          value={editFormData.oldPassword}
                          onChange={(e) => setEditFormData({...editFormData, oldPassword: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all font-[Poppins]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-[Poppins]">New Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter new password"
                          value={editFormData.newPassword}
                          onChange={(e) => setEditFormData({...editFormData, newPassword: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all font-[Poppins]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-3 bg-[#681618] text-white font-semibold rounded-lg hover:bg-[#8a1322] transition-colors font-[Poppins]"
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
