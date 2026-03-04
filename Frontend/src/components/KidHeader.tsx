import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  LogOut,
  X,
  Camera,
  Eye,
  EyeOff
} from "lucide-react";
import { API_BASE_URL,API_ROOT } from "../config/api";
import { toast } from "sonner";

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [newComics, setNewComics] = useState<{ id: string; title: string }[]>([]);

  const getAvatarUrl = (avatar: string | null) => {
    if (!avatar) return "/clip-path-group-16.png";
    if (avatar.startsWith('http')) return avatar;
    const baseUrl = API_ROOT;
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

  // Fetch kid notifications (comics with no submission)
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("kidToken");
        if (!token) return;
        const response = await fetch(`${API_BASE_URL}/kid/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setNewComics(data.data.comics);
        }
      } catch (error) {
        console.error("Error fetching kid notifications:", error);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
    setIsUpdating(true);
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
        toast.success("Profile updated successfully. Refreshing...");
        setEditFormData({ ...editFormData, oldPassword: "", newPassword: "" });
        setAvatarFile(null);
        setAvatarPreview(null);
        
        // Delay reload to show success message
        setTimeout(() => {
          setIsEditProfileOpen(false);
          window.location.reload();
        }, 2000);
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
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
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex items-center justify-center transition-colors bg-white rounded-full w-9 h-9 hover:bg-gray-50"
          >
            <Bell className="w-5 h-5 text-[#111827]" />
            {newComics.length > 0 && (
              <span className="absolute flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full -top-0.5 -right-0.5 border border-white">
                {newComics.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 z-50 w-72 mt-2 overflow-hidden bg-white border border-gray-100 rounded-xl shadow-lg font-[Poppins]">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <p className="text-sm font-bold text-gray-900">Notifications</p>
              </div>
              <div className="py-2 overflow-y-auto max-h-64">
                {newComics.length > 0 ? (
                  newComics.map(comic => (
                    <button
                      key={comic.id}
                      onClick={() => {
                        navigate('/kid/comics');
                        setIsNotificationsOpen(false);
                      }}
                      className="flex items-center w-full gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">New Comic Available</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{comic.title} — Submit your work!</p>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-center text-gray-500">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 p-1 transition-colors rounded-lg cursor-pointer hover:bg-gray-20"
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
            <div className="absolute right-0 z-50 w-64 mt-2 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <p className="text-[14px] font-bold text-gray-900 truncate [font-family:'Poppins']">{kidData.kidName}</p>
                <p className="text-[12px] text-gray-500 truncate mt-0.5">{kidData.email || 'Kid Member'}</p>
              </div>
              <div className="py-1">
                <button 
                  className="flex items-center w-full gap-3 px-4 py-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors [font-family:'Poppins']"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsEditProfileOpen(true);
                  }}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button 
                  className="flex items-center w-full gap-2 px-4 py-4 text-sm text-red-500 hover:bg-red-50 transition-colors [font-family:'Poppins']"
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
            <div 
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm "
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsEditProfileOpen(false);
              }}
            >
              <style>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              <div className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
                <button 
                  onClick={() => setIsEditProfileOpen(false)}
                  className="absolute z-10 p-2 text-gray-400 transition-colors top-4 right-4 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-[Poppins]">Edit Profile</h3>
                
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
                        <div className="relative">
                          <input 
                            type={showOldPassword ? "text" : "password"} 
                            placeholder="Enter old password"
                            value={editFormData.oldPassword}
                            onChange={(e) => setEditFormData({...editFormData, oldPassword: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all font-[Poppins] pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
                          >
                            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-[Poppins]">New Password</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? "text" : "password"} 
                            placeholder="Enter new password"
                            value={editFormData.newPassword}
                            onChange={(e) => setEditFormData({...editFormData, newPassword: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all font-[Poppins] pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
 
                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isUpdating}
                      className="w-full py-3 bg-[#681618] text-white font-semibold rounded-lg hover:bg-[#8a1322] transition-colors font-[Poppins] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    </>
  );
};
