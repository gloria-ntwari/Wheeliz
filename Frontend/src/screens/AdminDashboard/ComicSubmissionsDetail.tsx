import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ROOT } from "../../config/api";
import { 
  ArrowLeft, 
  CheckCircle2,
  Image as ImageIcon,
  FileText,
  X
} from "lucide-react";
import { AdminHeader } from "../../components/AdminHeader";

interface Kid {
  id: string;
  name: string;
  avatar: string;
  marks?: number;
  status: 'verified' | 'not_verified' | 'not_received';
  submission?: any;
}

export const ComicSubmissionsDetail = (): JSX.Element => {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  const [comic, setComic] = useState<any>(null);
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [gradeValue, setGradeValue] = useState("");
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      
      // Fetch Comic Detail
      const comicRes = await fetch(`${API_BASE_URL}/admin/comics/${comicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const comicData = await comicRes.json();
      
      // Fetch All Kids and Submissions for this comic
      const kidsRes = await fetch(`${API_BASE_URL}/admin/kids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const kidsData = await kidsRes.json();

      const subRes = await fetch(`${API_BASE_URL}/admin/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subData = await subRes.json();

      if (comicData.status === "success") setComic(comicData.data);
      
      if (kidsData.status === "success" && subData.status === "success") {
        const comicSubs = subData.data.filter((s: any) => s.comicId === comicId);
        
        const processedKids = kidsData.data.map((k: any) => {
          const sub = comicSubs.find((s: any) => s.kidId === k.id);
          let subData = sub;
          
          if (sub && typeof sub.files === 'string') {
            try {
              subData = { ...sub, files: JSON.parse(sub.files) };
            } catch (e) {
              console.error("Error parsing files JSON:", e);
              subData = { ...sub, files: [] };
            }
          }

          return {
            id: k.id,
            name: k.name,
            avatar: k.avatar,
            marks: sub?.marks,
            status: sub ? (sub.status === 'graded' ? 'verified' : 'not_verified') : 'not_received',
            submission: subData
          };
        });

        // Sort by marks desc, then by status
        const sortedKids = processedKids.sort((a: any, b: any) => {
           if (a.marks !== undefined && b.marks !== undefined) return b.marks - a.marks;
           if (a.marks !== undefined) return -1;
           if (b.marks !== undefined) return 1;
           return 0;
        });

        setKids(sortedKids);
        if (sortedKids.length > 0) setSelectedKid(sortedKids[0]);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [comicId]);

  const getFullImageUrl = (path: string | null) => {
    if (!path) return "/clip-path-group-16.png";
    if (path.startsWith("http")) return path;
    const baseUrl = API_ROOT;
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const getDownloadUrl = (path: string | null) => {
    let url = getFullImageUrl(path);
    if (url.includes("cloudinary.com") && url.toLowerCase().endsWith(".pdf")) {
      // Correctly insert fl_attachment to bypass raw pdf viewing restriction and force a download format instead
      if (url.includes("/upload/") && !url.includes("/upload/fl_attachment/")) {
        url = url.replace("/upload/", "/upload/fl_attachment/");
      }
    }
    return url;
  };

  const handleOpenFile = async (url: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      let fetchUrl = url;

      // If it's a Cloudinary link, route through our backend proxy which extracts the raw PDF
      if (url.includes("cloudinary.com")) {
        fetchUrl = `${API_BASE_URL}/admin/submissions/download?url=${encodeURIComponent(url)}`;
      }
      
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        console.error("Failed to fetch file stream", response.statusText);
        window.open(url, "_blank");
        return;
      }
      
      // Convert to blob and download the PDF
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;

      // Extract original file name
      const urlParts = url.split('/');
      let baseName = urlParts[urlParts.length - 1] || 'submission_document';
      // Remove extension
      if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
      
      // Since it's a PDF proxy, the backend already gives us the raw PDF.
      a.download = fetchUrl.includes('/download?') ? `${baseName}.pdf` : baseName;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      console.error("Error opening file:", error);
      window.open(url, "_blank");
    }
  };

  const handleVerifySubmission = async () => {
    if (!selectedKid?.submission || !gradeValue) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/submissions/${selectedKid.submission.id}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ marks: parseInt(gradeValue) }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setShowVerifyModal(false);
        setGradeValue("");
        setActivePreviewUrl(null);
        fetchData(); // Refresh
      }
    } catch (error) {
      console.error("Error grading submission:", error);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const verifiedCount = kids.filter(k => k.status === 'verified').length;
  const notVerifiedCount = kids.filter(k => k.status === 'not_verified').length;
  const waitingCount = kids.filter(k => k.status === 'not_received').length;

  return (
    <div className="flex w-full min-h-screen bg-[#1f1f1f] font-poppins">
      {/* Sidebar (AdminDashboard Navbar style) */}
      <aside className={`bg-[#181817] flex flex-col fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0`}>
        <div className="flex items-center justify-center p-8">
          <img src="/clip-path-group-16.png" alt="Wheeliez" className="object-contain w-auto h-20" />
        </div>
        <nav className="flex-1 px-8 mt-16 space-y-8">
          <button onClick={() => navigate("/admin/dashboard")} className="w-full flex items-center gap-3 px-10 py-5 rounded-full text-white hover:bg-[#2a2a2a] transition-colors font-medium text-[15px]">
            <CheckCircle2 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button onClick={() => navigate("/admin/kids")} className="w-full flex items-center gap-3 px-10 py-5 rounded-full text-white hover:bg-[#2a2a2a] transition-colors font-medium text-[15px]">
            <ImageIcon className="w-5 h-5" />
            <span>Kids</span>
          </button>
          <button onClick={() => navigate("/admin/comics")} className="w-full flex items-center gap-3 px-10 py-5 rounded-full text-white hover:bg-[#2a2a2a] transition-colors font-medium text-[15px]">
            <ImageIcon className="w-5 h-5" />
            <span>Comics</span>
          </button>
          <button onClick={() => navigate("/admin/submissions")} className="w-full flex items-center gap-3 px-10 py-5 rounded-full bg-[#68161c] text-white transition-colors font-medium text-[15px]">
            <CheckCircle2 className="w-5 h-5" />
            <span>Submissions</span>
          </button>
        </nav>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white rounded-tl-3xl">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 overflow-y-auto md:p-8 lg:p-12">
          {/* Back Link */}
          <button 
            onClick={() => navigate("/admin/submissions")}
            className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 text-[15px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to submissions</span>
          </button>

          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Left Content */}
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-[17px] font-bold text-black mb-1">{comic?.title || "Comics Challenge"}</h1>
                <p className="text-[14px] text-gray-400">
                  Active until {comic?.submissionDeadline ? new Date(comic.submissionDeadline).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : "Thursday June 15 2022"} at 7:00M
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-[#2ecc71] text-white p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                  <span className="mb-1 text-3xl font-bold">{verifiedCount}</span>
                  <span className="text-[15px] font-medium opacity-90">Verified</span>
                </div>
                <div className="bg-[#ff4757] text-white p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                  <span className="mb-1 text-3xl font-bold">{notVerifiedCount}</span>
                  <span className="text-[15px] font-medium opacity-90">Not Verified</span>
                </div>
                <div className="bg-[#cbd5e0] text-[#718096] p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                  <span className="mb-1 text-3xl font-bold">{waitingCount}</span>
                  <span className="text-[15px] font-medium opacity-90">Waiting</span>
                </div>
              </div>

              {/* Kid List */}
              <div className="space-y-3">
                {kids.map((kid) => (
                  <div 
                    key={kid.id}
                    onClick={() => setSelectedKid(kid)}
                    className={`flex items-center justify-between p-4  cursor-pointer transition-all ${selectedKid?.id === kid.id }`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={getFullImageUrl(kid.avatar)} alt={kid.name} className="object-cover w-12 h-12 rounded-xl" />
                      <span className="text-[15px] font-bold text-black">{kid.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {kid.marks !== undefined && (
                        <div className="flex items-center justify-center w-24 bg-white border border-gray-100 rounded-lg h-11">
                          <span className="text-emerald-500 font-bold text-[15px]">{kid.marks} / {comic?.totalMarks || 20}</span>
                        </div>
                      )}
                      
                      <div className={`py-3 rounded-md text-[15px] font-semibold w-[140px] text-center ${
                        kid.status === 'verified' ? 'bg-[#2ecc71]/20 text-[#2ecc71]' : 
                        kid.status === 'not_verified' ? 'bg-[#ff4757]/20 text-[#ff4081]' : 
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {kid.status === 'verified' ? 'Verified' : 
                         kid.status === 'not_verified' ? 'Not Verified' : 
                         'Not Received'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar Details */}
            <div className="w-full lg:w-[400px]">
              {selectedKid ? (
                <div className="space-y-8">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-[15px] font-bold text-black">{selectedKid.name}</h2>
                    <div className="flex items-center gap-4">
                      <img 
                        src={getFullImageUrl(selectedKid.submission?.files?.[0]) || getFullImageUrl(selectedKid.avatar)} 
                        className="object-cover w-20 h-20 border border-gray-100 shadow-sm rounded-xl"
                        alt="Submission thumbnail"
                      />
                      <div className="flex flex-col gap-2">
                        <p className="text-[15px] text-gray-400">
                          Received on {selectedKid.submission ? new Date(selectedKid.submission.createdAt).toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : "N/A"}
                        </p>
                        <span className={`py-3 rounded-lg text-[15px] font-semibold w-[140px] text-center ${
                          selectedKid.status === 'verified' ? 'bg-[#2ecc71]/20 text-[#2ecc71]' : 
                          selectedKid.status === 'not_verified' ? 'bg-[#ff4757]/20 text-[#ff4081]' : 
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {selectedKid.status === 'verified' ? 'Verified' : 
                           selectedKid.status === 'not_verified' ? 'Not Verified' : 
                           'Not Received'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="space-y-4">
                    <h3 className="text-[15px] font-bold text-black">Submission Description</h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                      {selectedKid.submission?.description || "No description provided."}
                    </p>
                  </div>

                  {selectedKid.submission?.files?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-[15px] font-bold text-black">Uploads</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedKid.submission.files.map((file: string, idx: number) => (
                          <button 
                            key={idx} 
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenFile(getDownloadUrl(file));
                            }}
                            className="w-full cursor-pointer aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 hover:border-[#005a5a] transition-colors"
                          >
                            {file.toLowerCase().endsWith('.pdf') ? (
                              <FileText className="w-6 h-6 text-red-400" />
                            ) : (
                              <img src={getFullImageUrl(file)} className="object-cover w-full h-full" alt="upload" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedKid.status === 'not_verified' && (
                    <button 
                      onClick={() => {
                        setShowVerifyModal(true);
                        if (selectedKid.submission?.files?.length > 0) {
                          setActivePreviewUrl(selectedKid.submission.files[0]);
                        }
                      }}
                      className="px-8 py-3 bg-[#005a5a] text-white rounded-lg font-bold text-[14px] hover:bg-[#004a4a] transition-all"
                    >
                      Verify Submission
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center p-20 text-sm italic text-gray-400">
                  Select a kid to view details
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[1000px] rounded-[20px] overflow-hidden shadow-2xl animate-in zoom-in duration-200 flex flex-col h-[85vh]">
            <div className="flex items-center justify-between px-8 py-6">
              <h2 className="text-[17px] font-bold text-black font-[Poppins]">Verify Submission</h2>
              <button 
                onClick={() => {
                  setShowVerifyModal(false);
                  setActivePreviewUrl(null);
                }} 
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
               {/* Sidebar Thumbnails */}
               <div className="w-[120px] bg-[#f8fafc] border-r border-gray-100 overflow-y-auto p-4 flex flex-col gap-4">
                  {selectedKid?.submission?.files?.map((file: string, idx: number) => (
                     <div 
                        key={idx} 
                        onClick={() => setActivePreviewUrl(file)}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all shrink-0 aspect-square ${activePreviewUrl === file ? 'border-[#005a5a]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                     >
                        {file.toLowerCase().endsWith('.pdf') ? (
                           <div className="flex items-center justify-center w-full h-full bg-white">
                              <FileText className="w-8 h-8 text-red-400" />
                           </div>
                        ) : (
                           <img src={getFullImageUrl(file)} className="object-cover w-full h-full" alt="thumb" />
                        )}
                     </div>
                  ))}
               </div>

               {/* Main Preview Area */}
               <div className="flex-1 bg-[#f1f5f9] p-8 flex items-center justify-center overflow-hidden">
                  {activePreviewUrl ? (
                    activePreviewUrl.toLowerCase().endsWith('.pdf') ? (
                      <div className="flex flex-col items-center justify-center w-full h-full gap-4 bg-white shadow-inner rounded-xl">
                        <FileText className="w-20 h-20 text-red-400" />
                        <span className="font-medium text-gray-500">PDF Document</span>
                        <button 
                          onClick={() => handleOpenFile(getDownloadUrl(activePreviewUrl))}
                          className="px-6 py-2 text-sm font-bold transition-colors bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
                        >
                          Download PDF
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img 
                          src={getFullImageUrl(activePreviewUrl)} 
                          className="object-contain w-full h-full rounded-xl"
                          alt="Full preview" 
                        />
                      </div>
                    )
                  ) : (
                    <div className="italic font-medium text-gray-400">No file selected for preview</div>
                  )}
               </div>

               {/* Grading Area */}
               <div className="w-[350px] p-8 border-l border-gray-100 bg-[#f8fafc] flex flex-col overflow-y-auto">
                  <div className="flex-1 space-y-8">
                     <div className="text-center">
                        <label className="text-[13px] font-bold text-gray-500 mb-6 block uppercase tracking-wider">Assign Marks (Out of {comic?.totalMarks || 20})</label>
                        <div className="relative group">
                          <input 
                            type="number" 
                            placeholder="Enter marks"
                            value={gradeValue}
                            onChange={(e) => setGradeValue(e.target.value)}
                            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-[#005a5a]/5 outline-none font-bold text-center text-[22px] text-gray-700 transition-all placeholder:text-gray-200"
                          />
                        </div>
                        <p className="text-[14px] text-gray-400 mt-4 leading-relaxed px-4">
                          Total percentage will be calculated automatically based on the score provided
                        </p>
                     </div>

                     <div className="flex flex-col gap-4 pt-4">
                        <button 
                          onClick={handleVerifySubmission}
                          className="w-52 py-4 bg-[#005a5a] text-white rounded-xl font-bold text-[16px] hover:bg-[#004a4a] transition-all shadow-xl shadow-[#005a5a]/10 active:scale-[0.98]"
                        >
                          Confirm & Verify
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
