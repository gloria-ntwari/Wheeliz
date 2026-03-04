import React, { useState, useRef } from "react";
import { X, CloudUpload, Camera } from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import { toast } from "sonner";

interface AddKidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddKidModal: React.FC<AddKidModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    fatherName: "",
    motherName: "",
    parentPhone: "",
    dateOfBirth: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (avatarFile) data.append('avatar', avatarFile);

      const response = await fetch(`${API_BASE_URL}/admin/kids`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success(`Kid added! A password setup email has been sent to ${formData.email}.`);
        onSuccess();
        setTimeout(() => {
          onClose();
          setFormData({ name: "", email: "", gender: "", fatherName: "", motherName: "", parentPhone: "", dateOfBirth: "" });
          setAvatarFile(null);
          setAvatarPreview(null);
        }, 2000);
      } else {
        toast.error(result.message || "Failed to add kid");
      }
    } catch (err) {
      console.error("Add kid error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-white shadow-2xl rounded-3xl">
        <div className="flex items-center justify-between px-8 py-6 bg-[#181817] rounded-t-3xl border-b border-gray-800">
          <h2 className="text-[17px] font-semibold text-white font-[Poppins]">Add New Kid</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto font-[Poppins]">

          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-28 h-28 overflow-hidden bg-gray-100 rounded-full border-4 border-[#FFA500] shadow-md transition-transform group-hover:scale-105">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <CloudUpload className="w-8 h-8 mb-1" />
                    <span className="text-[10px] uppercase font-bold">Upload Photo</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-[#681618] text-white rounded-full shadow-lg hover:bg-[#8a1322] transition-colors"
                aria-label="Upload photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Full Name*</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleInputChange} required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#681618] outline-none transition-colors text-[15px]"
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email Address* <span className="text-xs font-normal text-gray-400">(setup link will be sent here)</span></label>
              <input
                type="email" name="email" value={formData.email} onChange={handleInputChange} required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#681618] outline-none transition-colors text-[15px]"
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#681618] outline-none transition-colors appearance-none bg-white text-[15px]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Parent Phone*</label>
              <input
                type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#681618] outline-none transition-colors text-[15px]"
                placeholder="Enter parent phone"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Father's Name</label>
              <input
                type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#681618] outline-none transition-colors text-[15px]"
                placeholder="Enter father's name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Mother's Name</label>
              <input
                type="text" name="motherName" value={formData.motherName} onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#681618] outline-none transition-colors text-[15px]"
                placeholder="Enter mother's name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Date of Birth</label>
              <input
                type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#681618] outline-none transition-colors text-[15px]"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 font-[Poppins]">
            A password setup link will be automatically sent to the email address after account creation.
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-6 py-2.5 font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 flex-1 sm:flex-none text-[14px]"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-8 py-2.5 font-semibold text-white bg-[#681618] rounded-xl hover:bg-[#8a1322] disabled:opacity-50 flex-1 sm:flex-none text-[14px]"
            >
              {loading ? "Creating..." : "Add Kid & Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
