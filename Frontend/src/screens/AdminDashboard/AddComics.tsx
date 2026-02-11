import  { useState, useRef, ChangeEvent } from "react";
import { API_BASE_URL } from "../../config/api";
import { ArrowLeft, CloudUpload, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Home, Smile, Puzzle, Grid3X3 } from "lucide-react";
import { AdminHeader } from "../../components/AdminHeader";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
  { icon: Smile, label: "Kids", path: "/admin/kids", active: false },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: true },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

export const AddComics = (): JSX.Element => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  // Form State
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
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

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

  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...filesArray]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.title || !formData.subtitle || !formData.description) {
        setError("Please fill in all required fields (Title, Subtitle, Description)");
        return;
      }

      if (!coverImage) {
        setError("Please upload a cover image");
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
      
      data.append('coverImage', coverImage);
      
      documents.forEach(doc => {
        data.append('documents', doc);
      });

      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/comics`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        navigate('/admin/comics');
      } else {
        setError(result.message || 'Failed to create comic');
      }

    } catch (err) {
      console.error("Error creating comic:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#1f1f1f] font-barlow">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-[#181817] flex flex-col overflow-hidden shrink-0
                fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:static lg:translate-x-0`}
      >
        <div className="flex items-center justify-center p-8">
          <img
            src="/clip-path-group-16.png"
            alt="Wheeliez"
            className="object-contain w-auto h-20"
          />
        </div>

        <nav className="flex-1 px-8 mt-16 space-y-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-10 py-5 rounded-full font-medium transition-colors [font-family:'Poppins'] text-[15px] ${
                item.active
                  ? "bg-[#68161c] text-white"
                  : "text-white hover:bg-[#2a2a2a]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden bg-white rounded-tl-3xl">
      {/* Header */}
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


      <main className="flex-1 w-full px-4 pt-6 pb-10 bg-white sm:px-6 lg:px-14 font-[Poppins]">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Add Comics</span>
          </button>

          <div className="flex gap-4">
            <button 
                onClick={handleSubmit} 
                className="px-8 py-2 text-sm font-medium text-white bg-[#681618] rounded-xl hover:bg-[#8a1322] transition-colors disabled:opacity-50"
                disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {error && (
            <div className="p-4 mb-6 text-red-700 border-l-4 border-red-500 bg-red-50">
                <p>{error}</p>
            </div>
        )}

        <div className="max-w-6xl space-y-8">
          {/* Comics Details Section */}
          <div className="overflow-hidden shadow-md rounded-3xl ">
            <div className="px-8 py-3 bg-[#181817]">
              <h2 className="text-[16px] font-bold text-white">
                Comics Details
              </h2>
            </div>
            <div className="p-8 bg-white border-white">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Title */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
                {/* Sub-Title */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">
                    Sub-Title*
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Subtitle"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="mt-8 space-y-3">
                 <label className="text-sm font-bold text-black">Cover Image*</label>
                 <div className="flex flex-col items-end gap-8 md:flex-row">
                    {/* Upload Box */}
                    <div 
                        onClick={() => coverInputRef.current?.click()}
                        className="flex flex-col items-center justify-center w-full md:w-[340px] h-[180px] gap-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                            <CloudUpload className="w-6 h-6 text-gray-500" />
                         </div>
                         <p className="text-sm text-center text-gray-500">
                            <span className="font-bold text-[#8B1A1A]">Click to upload</span> or drag and drop
                         </p>
                         <input 
                            type="file" 
                            ref={coverInputRef} 
                            onChange={handleCoverImageChange} 
                            accept="image/*" 
                            className="hidden" 
                         />
                    </div>
                    
                    {/* Preview Image */}
                    {coverImagePreview && (
                        <div className="flex flex-col gap-2">
                             <div className="w-[180px] h-[140px] overflow-hidden rounded-xl bg-gray-100">
                                 <img 
                                    src={coverImagePreview} 
                                    alt="Comics Cover" 
                                    className="object-cover w-full h-full"
                                 />
                             </div>
                             <div className="flex items-center justify-between px-1">
                                 <span className="text-xs text-gray-500 truncate max-w-[120px]">{coverImage?.name}</span>
                                 <button 
                                    onClick={() => {
                                        setCoverImage(null);
                                        setCoverImagePreview(null);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                 >
                                     <span className="text-lg leading-none">×</span>
                                 </button>
                             </div>
                        </div>
                    )}
                 </div>
              </div>

              {/* Description */}
              <div className="mt-8 space-y-3">
                <label className="text-sm font-bold text-black">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full h-32 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Comics Documents Section */}
          <div className="overflow-hidden shadow-md rounded-3xl">
            <div className="px-8 py-3 bg-[#181817]">
              <h2 className="text-[16px] font-bold text-white">
                Comics Documents
              </h2>
            </div>
            <div className="p-8 bg-white">
              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                {/* Maz Uploads */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">
                    Max Uploads *
                  </label>
                  <input
                    type="number"
                    name="maxUploads"
                    value={formData.maxUploads}
                    onChange={handleInputChange}
                    placeholder="Number"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
                {/* Submission Deadline */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">
                    Submission Deadline*
                  </label>
                  <input
                    type="date"
                    name="submissionDeadline"
                    value={formData.submissionDeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
              </div>

              {/* New Fields: Bonus and Total Marks */}
              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">Bonus*</label>
                  <input
                    type="number"
                    name="bonus"
                    value={formData.bonus}
                    onChange={handleInputChange}
                    placeholder="Bonus marks"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">Total Marks*</label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    placeholder="Total marks"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
              </div>

              {/* Upload Files */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-black">
                  Upload Files *
                </label>
                <div 
                    onClick={() => documentInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full gap-2 p-12 transition-colors border-2 border-gray-200 cursor-pointer rounded-xl hover:bg-gray-50"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <CloudUpload className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-center text-gray-500">
                    <span className="font-semibold text-[#8B1A1A]">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <input 
                    type="file" 
                    ref={documentInputRef} 
                    onChange={handleDocumentChange} 
                    multiple 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* File List Item */}
              <div className="mt-6 space-y-4">
                {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-lg">
                            <FileText className="w-10 h-10 text-[#ef4444] fill-current" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-black">
                            {doc.name}
                            </p>
                            <p className="text-xs text-gray-500">
                            {(doc.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        </div>
                        <button 
                            onClick={() => removeDocument(index)}
                            className="text-[#8B1A1A] hover:text-red-900"
                        >
                        <X className="w-5 h-5" />
                        </button>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

