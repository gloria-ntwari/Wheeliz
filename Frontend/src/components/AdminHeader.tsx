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
  X,
  Camera,
  Eye,
  EyeOff
} from "lucide-react";
import { API_BASE_URL, API_ROOT } from "../config/api";
import { toast } from "sonner";

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch notifications count
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;
        
        const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setPendingCount(data.data.pendingCount);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);
  
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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getAvatarUrl = (avatar: string | null) => {
    if (!avatar) return "/clip-path-group-16.png";
    if (avatar.startsWith('http')) return avatar;
    const baseUrl = API_ROOT;
    const cleanPath = avatar.startsWith('/') ? avatar : `/${avatar}`;
    return `${baseUrl}${cleanPath}`;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append('name', editFormData.name);
      formData.append('email', editFormData.email);
      if (editFormData.oldPassword) formData.append('oldPassword', editFormData.oldPassword);
      if (editFormData.newPassword) formData.append('newPassword', editFormData.newPassword);
      if (avatarFile) formData.append('avatar', avatarFile);

      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        const updatedAdmin = result.data;
        const newAdminData = {
          ...adminProfileData,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          avatar: updatedAdmin.avatar
        };
        setAdminProfileData(newAdminData);
        localStorage.setItem("adminData", JSON.stringify(newAdminData));
        toast.success("Profile updated successfully");
        setEditFormData({ ...editFormData, oldPassword: "", newPassword: "" });
        setAvatarFile(null);
        setAvatarPreview(null);
        // Close modal after delay
        setTimeout(() => setIsEditProfileOpen(false), 2000);
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
              className="flex-1 w-full bg-transparent text-[13px] leading-none text-[#0f2a5f] placeholder:text-[#0f2a5f] outline-none text-left [font-family:'Poppins']"
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-4 lg:w-auto shrink-0">
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex items-center justify-center transition-colors bg-white rounded-full w-9 h-9 hover:bg-gray-50"
          >
            <Bell className="w-5 h-5 text-[#111827]" />
            {pendingCount > 0 && (
              <span className="absolute flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full -top-0.5 -right-0.5 border border-white">
                {pendingCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 z-50 w-64 mt-2 overflow-hidden bg-white border border-gray-100 rounded-xl shadow-lg font-[Poppins]">
              <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <p className="text-sm font-bold text-gray-900">Notifications</p>
              </div>
              <div className="py-2">
                {pendingCount > 0 ? (
                  <button 
                    onClick={() => {
                      navigate('/admin/submissions');
                      setIsNotificationsOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">New Submissions</p>
                      <p className="text-xs text-gray-500 mt-0.5">You have {pendingCount} submission{pendingCount !== 1 ? 's' : ''} to review</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </button>
                ) : (
                  <div className="px-4 py-3 text-sm text-center text-gray-500">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-10 h-10 overflow-hidden bg-gray-200 border border-gray-100 rounded-full shadow-sm shrink-0">
                <img
                  src={getAvatarUrl(adminProfileData.avatar)}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";
                    e.currentTarget.onerror = null;
                  }}
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
                  <p className="mt-1 text-sm text-gray-400">{adminProfileData.username }</p>
                </div>
                <div className="py-2">
                  <button 
                    onClick={() => {
                      setIsEditProfileOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full gap-3 px-6 py-3 text-sm text-white transition-colors hover:bg-white/10"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full gap-3 px-6 py-3 text-sm text-red-500 transition-colors hover:bg-white/10"
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
          <div className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
            <button 
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute p-2 text-gray-400 transition-colors top-4 right-4 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="mb-6 text-xl font-bold text-gray-900">Edit Profile</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 overflow-hidden bg-gray-100 rounded-full border-4 border-[#FFA500] shadow-md">
                    <img 
                      src={avatarPreview || getAvatarUrl(adminProfileData.avatar)} 
                      alt="Profile Preview" 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";
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
                <p className="mt-2 text-xs text-gray-500">Click icon to change photo</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="mb-4 text-sm font-semibold text-gray-900">Change Password (optional)</p>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Old Password</label>
                    <div className="relative">
                      <input 
                        type={showOldPassword ? "text" : "password"} 
                        placeholder="Enter old password"
                        value={editFormData.oldPassword}
                        onChange={(e) => setEditFormData({...editFormData, oldPassword: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all pr-12"
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
                    <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="Enter new password"
                        value={editFormData.newPassword}
                        onChange={(e) => setEditFormData({...editFormData, newPassword: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#681618] focus:border-transparent outline-none transition-all pr-12"
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
                  className="w-full py-3 bg-[#681618] text-white font-semibold rounded-lg hover:bg-[#8a1322] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
