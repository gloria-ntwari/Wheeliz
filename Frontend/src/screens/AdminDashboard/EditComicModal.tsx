import { useState, useRef, useEffect, ChangeEvent } from "react";
import { X, CloudUpload } from "lucide-react";

import { Comic } from "./Comics";
import { API_BASE_URL, API_ROOT } from "../../config/api";
import { toast } from "sonner";

interface EditComicModalProps {
  isOpen: boolean;
  onClose: () => void;
  comic: Comic | null;
  onUpdate: () => void;
}

export const EditComicModal = ({ isOpen, onClose, comic, onUpdate }: EditComicModalProps): JSX.Element | null => {
  if (!isOpen || !comic) return null;

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    maxUploads: 1,
    submissionDeadline: "",
    bonus: 0,
    totalMarks: 0,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (comic) {
      setFormData({
        title: comic.title || "",
        subtitle: comic.subtitle || "",
        description: comic.description || "",
        maxUploads: comic.maxUploads || 1,
        submissionDeadline: comic.submissionDeadline ? new Date(comic.submissionDeadline).toISOString().split('T')[0] : "",
        bonus: comic.bonus || 0,
        totalMarks: comic.totalMarks || 0,
      });

        if (comic.image) {
             const baseUrl = API_ROOT;
             const cleanPath = comic.image.startsWith("/") ? comic.image : `/${comic.image}`;
             const fullUrl = comic.image.startsWith('http') ? comic.image : `${baseUrl}${cleanPath}`;
             setCoverImagePreview(fullUrl);
        } else {
             setCoverImagePreview(null);
        }
        setCoverImage(null); // Reset new image on open
        setDocumentFile(null); // Reset new document on open
    }
  }, [comic]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title || !formData.subtitle || !formData.description) {
        toast.error("Please fill in all required fields (Title, Subtitle, Description)");
        return;
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('description', formData.description);
      data.append('maxUploads', formData.maxUploads.toString());
      if (formData.submissionDeadline) {
          data.append('submissionDeadline', formData.submissionDeadline);
      }
      data.append('bonus', formData.bonus.toString());
      data.append('totalMarks', formData.totalMarks.toString());
      
      if (coverImage) {
        data.append('coverImage', coverImage);
      }

      if (documentFile) {
        data.append('documents', documentFile);
      }

      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/comics/${comic.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        toast.success("Comic updated successfully");
        onUpdate();
        onClose();
      } else {
        toast.error(result.message || 'Failed to update comic');
      }

    } catch (err) {
      console.error("Error updating comic:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6 bg-[#181817] sticky top-0 z-10">
          <h2 className="text-lg font-bold text-white font-[Poppins]">Edit Comic</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-black font-[Poppins]">Title*</label>
                <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors font-[Poppins]"
                placeholder="Title"
                />
            </div>
            {/* Sub-Title */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-black font-[Poppins]">Sub-Title*</label>
                <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors font-[Poppins]"
                placeholder="Subtitle"
                />
            </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-black font-[Poppins]">Cover Image</label>
                <div className="flex flex-col gap-8 md:flex-row items-end">
                <div 
                    onClick={() => coverInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full md:w-[340px] h-[180px] gap-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                >
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                        <CloudUpload className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-sm text-center text-gray-500 font-[Poppins]">
                        <span className="font-bold text-[#8B1A1A]">Click to upgrade</span>
                        </p>
                        <input 
                        type="file" 
                        ref={coverInputRef} 
                        onChange={handleCoverImageChange} 
                        accept="image/*" 
                        className="hidden" 
                        />
                </div>
                
                {coverImagePreview && (
                    <div className="flex flex-col gap-2">
                            <div className="w-[180px] h-[140px] overflow-hidden rounded-xl bg-gray-100 border border-gray-200 relative group">
                                <img 
                                src={coverImagePreview} 
                                alt="Comics Cover" 
                                className="object-cover w-full h-full"
                                />
                            </div>
                    </div>
                )}
                </div>
            </div>

            {/* Document Upload */}
             <div className="space-y-3">
                <label className="text-sm font-bold text-black font-[Poppins]">Comic Document (PDF)</label>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                             setDocumentFile(e.target.files[0]);
                        }
                    }}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors font-[Poppins]"
                />
                 {documentFile && <p className="text-xs text-green-600">Selected: {documentFile.name}</p>}
                 {!documentFile && comic?.document && <p className="text-xs text-gray-500">Current: {comic.document.split('/').pop()}</p>}
            </div>

            {/* Description */}
            <div className="space-y-3">
            <label className="text-sm font-bold text-black font-[Poppins]">Description*</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full h-32 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors resize-none font-[Poppins]"
                placeholder="Description"
            />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Max Uploads */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-black font-[Poppins]">Max Uploads</label>
                    <input
                    type="number"
                    name="maxUploads"
                    value={formData.maxUploads}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors font-[Poppins]"
                    />
                </div>
                {/* Submission Deadline */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-black font-[Poppins]">Submission Deadline</label>
                    <input
                    type="date"
                    name="submissionDeadline"
                    value={formData.submissionDeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors font-[Poppins]"
                    />
                </div>
            </div>

             <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black font-[Poppins]">Bonus</label>
                  <input
                    type="number"
                    name="bonus"
                    value={formData.bonus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors font-[Poppins]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black font-[Poppins]">Total Marks</label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors font-[Poppins]"
                  />
                </div>
              </div>


            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button 
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-[Poppins]"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-2.5 text-sm font-medium text-white bg-[#681618] rounded-xl hover:bg-[#8a1322] transition-colors disabled:opacity-50 font-[Poppins]"
                >
                    {loading ? "Updating..." : "Update Comic"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
