import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Smile, 
  Puzzle, 
  Grid3X3,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Maximize2
} from "lucide-react";
import { AdminHeader } from "../../components/AdminHeader";
import { CloudinaryPdfViewer } from "../../components/CloudinaryPdfViewer";
import { Comic, getComicImageUrl } from "./Comics";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
  { icon: Smile, label: "Kids", path: "/admin/kids", active: false },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: true },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

export const ComicView = (): JSX.Element => {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  const [comics, setComics] = useState<Comic[]>([]);
  const [currentComic, setCurrentComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<string[]>([]);

  // Fetch all comics for the left sidebar
  useEffect(() => {
    const fetchComics = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/admin/comics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === 'success') {
          setComics(data.data);
          // Set current comic from params or first one
          const selected = data.data.find((c: Comic) => c.id === comicId);
          if (selected) {
            handleComicSelect(selected);
          } else if (data.data.length > 0 && !comicId) {
            handleComicSelect(data.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [comicId]);

  const handleComicSelect = (comic: Comic) => {
    setCurrentComic(comic);
    setCurrentPage(1);
    
    // Parse pages from document field
    if (comic.document) {
      try {
        // Check if it's a JSON array of paths
        if (comic.document.startsWith('[') && comic.document.endsWith(']')) {
          setPages(JSON.parse(comic.document));
        } else {
          // It's a single path string
          setPages([comic.document]);
        }
      } catch (e) {
        console.error("Error parsing document pages:", e);
        setPages([comic.document]);
      }
    } else {
      setPages([]);
    }
    
    navigate(`/admin/comics/view/${comic.id}`);
  };

  const nextPage = () => {
    if (currentPage < pages.length) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-[#1f1f1f] text-white">Loading...</div>;
  }

  return (
    <div className="flex w-full min-h-screen bg-[#1f1f1f] font-barlow">
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

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white rounded-tl-3xl">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex flex-col flex-1 pb-10 overflow-hidden">
          {/* Top Title Bar */}
          <div className="flex flex-col gap-4 px-6 pt-6 mb-4 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/admin/comics")}
                className="p-2 transition-colors border border-gray-100 rounded-full hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-[17px] font-bold text-black font-[Poppins]">Documents</h1>
                <p className="text-sm text-gray-500 font-[Poppins]">You have {comics.length} documents</p>
              </div>
            </div>
            

          </div>

          <div className="flex flex-1 gap-6 px-6 overflow-hidden lg:px-10">
            {/* Left Pane: All Comics List */}
            <div className="flex-col hidden w-72 lg:flex shrink-0">
              <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {comics.map((comic) => (
                  <div 
                    key={comic.id}
                    onClick={() => handleComicSelect(comic)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      currentComic?.id === comic.id 
                        ? "bg-white border-[#681618] shadow-md border-l-[3px]" 
                        : "bg-gray-50 border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <h3 className={`text-sm font-bold truncate ${currentComic?.id === comic.id ? "text-black" : "text-gray-900"}`}>
                      {comic.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 flex justify-between">
                      <span>{comic.subtitle}</span>
                      <span>2d ago</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Area (Middle + Right) */}
            <div className="flex flex-1 gap-6 overflow-hidden">
               {/* Logic to choose viewer type */}
               {(() => {
                 if (pages.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center flex-1 w-full h-full p-12 text-center bg-[#F4F6FB] rounded-2xl">
                        <img 
                          src={getComicImageUrl(currentComic?.image)} 
                          alt={currentComic?.title} 
                          className="object-contain w-full h-full max-h-[80%] rounded-lg opacity-30 mb-4"
                        />
                        <p className="text-gray-400">No document available.</p>
                      </div>
                    );
                 }

                 const firstPage = pages[0];
                 const firstPageUrl = getComicImageUrl(firstPage);
                 const isPdf = firstPageUrl.toLowerCase().includes('.pdf');
                 const isCloudinary = firstPageUrl.includes('res.cloudinary.com');

                 // Case 1: Cloudinary PDF - Use the specialized viewer
                 if (isPdf && isCloudinary) {
                    return (
                        <div className="flex-1 h-full overflow-hidden bg-[#F4F6FB] rounded-2xl p-4">
                            <CloudinaryPdfViewer url={firstPageUrl} />
                        </div>
                    );
                 }

                 // Case 2: Standard Image Viewer (or non-Cloudinary PDF fallback)
                 return (
                    <>
                        {/* Middle Pane: Main Viewer */}
                        <div className="relative flex flex-col items-center flex-1 min-w-0 bg-[#F4F6FB] rounded-2xl overflow-hidden shadow-inner p-4">
                        <div className="relative flex flex-col items-center justify-center w-full h-full bg-white shadow-2xl rounded-xl overflow-hidden group">
                            {/* Document Viewer */}
                            {(() => {
                            const currentDocPath = pages[currentPage - 1];
                            const docUrl = getComicImageUrl(currentDocPath);
                            const isImage = /\.(jpg|jpeg|png|webp|gif)/i.test(docUrl.split('?')[0]);
                            
                            if (isImage) {
                                return (
                                <div className="flex items-center justify-center w-full h-full p-4">
                                    <img 
                                    src={docUrl} 
                                    alt={`Page ${currentPage}`} 
                                    className="object-contain w-full h-full rounded-lg"
                                    />
                                </div>
                                );
                            }

                            // Fallback for non-Cloudinary PDFs or other types
                            const isLocal = docUrl.includes('localhost');
                            const viewerSrc = (docUrl.toLowerCase().includes('.pdf') && isLocal) 
                                ? `${docUrl}#toolbar=0&navpanes=0&scrollbar=0`
                                : `https://docs.google.com/viewer?url=${encodeURIComponent(docUrl)}&embedded=true`;

                            return (
                                <iframe 
                                src={viewerSrc}
                                className="w-full h-full border-0"
                                key={`${currentComic?.id}-${currentPage}-${currentDocPath}`}
                                title={currentComic?.title}
                                />
                            );
                            })()}

                            {/* Navigation Overlay */}
                            <button 
                            onClick={prevPage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 hover:bg-[#681618] hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                            disabled={currentPage === 1}
                            >
                            <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                            onClick={nextPage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 hover:bg-[#681618] hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                            disabled={currentPage === pages.length}
                            >
                            <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Page Counter Bottom */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-xl border border-white/20">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-red-500">❤️ Thank you!</span>
                                </div>
                                <div className="w-[1px] h-4 bg-gray-200 mx-2"></div>
                                <span className="text-sm font-bold text-gray-700">{currentPage} of {pages.length || 0}</span>
                            </div>
                            {pages[currentPage - 1] && (
                                <a 
                                    href={getComicImageUrl(pages[currentPage - 1])} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-gray-400 hover:text-[#681618] underline"
                                >
                                    Download this page
                                </a>
                            )}
                            </div>
                        </div>
                        </div>

                        {/* Right Pane: Page Thumbnails */}
                        <div className="flex-col hidden w-40 lg:flex shrink-0">
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            {pages.map((path, i) => (
                                <div 
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`relative aspect-[3/4] rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${
                                    currentPage === i + 1 
                                    ? "border-[#681618] ring-2 ring-[#681618]/20" 
                                    : "border-transparent hover:border-gray-200"
                                }`}
                                >
                                <div className="w-full h-full bg-gray-100 p-2 flex items-center justify-center">
                                    {/\.(jpg|jpeg|png|webp|gif)/i.test(path.split('?')[0]) ? (
                                        <img 
                                        src={getComicImageUrl(path)} 
                                        className="object-cover w-full h-full"
                                        alt={`Page ${i + 1}`}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <Puzzle className="w-8 h-8 opacity-20" />
                                        <span className="text-[10px] uppercase font-bold">{path.split('.').pop()}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-1.5 text-[10px] font-bold text-center bg-white/90 text-gray-800 backdrop-blur-sm border-t border-gray-100">
                                    Page {i + 1}
                                </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Next Page Button beneath thumbnails */}
                        <div className="flex justify-center mt-6">
                            <button 
                                onClick={nextPage}
                                className="p-4 bg-white border border-gray-100 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all text-gray-500 hover:text-[#681618] disabled:opacity-20"
                                disabled={currentPage === pages.length}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                        </div>
                    </>
                 );
               })()}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};
