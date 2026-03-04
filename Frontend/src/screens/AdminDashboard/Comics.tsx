import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL, API_ROOT } from "../../config/api";
import {
  Home,
  Smile,
  Puzzle,
  Grid3X3,
  Plus,
  List,
  LayoutGrid,
  FileText,
  MoreVertical,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import React from "react";
import { EditComicModal } from "./EditComicModal";
import { AdminHeader } from "../../components/AdminHeader";
import { toast } from "sonner";

export const getComicImageUrl = (path?: string | null) => {
  if (!path) return "/clip-path-group-16.png";
  if (path.startsWith("http")) return path;
  
  // Clean base URL: remove trailing /api and trailing slashes
    const baseUrl = API_ROOT;
  
  // Clean path: ensure it has leading slash but no double slashes, and fix Windows backslashes
  const cleanPath = (path.startsWith("/") ? path : `/${path}`).replace(/\\/g, "/");
  
  return `${baseUrl}${cleanPath}`;
};

export interface Comic {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description?: string;
  maxUploads?: number;
  submissionDeadline?: string;
  bonus?: number;
  totalMarks?: number;
  category?: string;
  createdAt: string;
  document?: string;
  submissionCount?: number;
  totalKids?: number;
  // Add other fields as needed based on API response
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
  { icon: Smile, label: "Kids", path: "/admin/kids", active: false },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: true },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

export const Comics = (): JSX.Element => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Edit/Delete State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchComics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/comics?t=${new Date().getTime()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setComics(data.data);
      }
    } catch (error) {
      console.error("Error fetching comics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
      // Simple confirm
      if (!window.confirm("Are you sure you want to delete this comic?")) return;

      try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch(`${API_BASE_URL}/admin/comics/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
          });
          const result = await response.json();
          if (result.status === 'success') {
              fetchComics(); // Refresh list
          } else {
              toast.error(result.message || "Failed to delete");
          }
      } catch (error) {
          console.error("Error deleting comic:", error);
      }
  };

  const handleEdit = (comic: Comic) => {
      setSelectedComic(comic);
      setEditModalOpen(true);
      setActiveMenuId(null);
  };



  useEffect(() => {
    fetchComics();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

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

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden bg-white rounded-tl-3xl">
        {/* Header */}
        {/* Header */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 pt-6 pb-10 bg-white sm:px-6 lg:px-10">

          <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-[17px] font-bold font-[Poppins] text-black">
                   Comics 
                </h1>
                <p className="text-sm text-gray-500 font-[Poppins]">
                   You have {comics.length} Comics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                   <div className="flex bg-[#F4F6FB] p-1 rounded-lg">
                      <button 
                        onClick={() => setLayoutMode("grid")}
                        className={`p-2 rounded-md transition-colors ${layoutMode === "grid" ? "bg-white shadow-sm text-[#8B1A1A]" : "text-gray-400"}`}
                      >
                        <LayoutGrid className="w-5 h-5 fill-current" />
                      </button>
                      <button 
                        onClick={() => setLayoutMode("list")}
                        className={`p-2 rounded-md transition-colors ${layoutMode === "list" ? "bg-white shadow-sm text-[#8B1A1A]" : "text-gray-400"}`}
                      >
                         <List className="w-5 h-5" />
                      </button>
                   </div>
                   
                   <button 
                    onClick={() => navigate("/admin/add-comics")}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#681618] rounded-full hover:bg-[#8a1322] transition-colors"
                   >
                     <Plus className="w-4 h-4" />
                     Add Comic
                   </button>
                </div>
            </div>
          </div>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading comics...</p>
                </div>
            ) : (
                <>
                <section className={`grid gap-6 ${layoutMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {comics
                .filter(comic => comic.title.toLowerCase().includes(searchQuery) || comic.subtitle.toLowerCase().includes(searchQuery))
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((comic) => (
                    <div 
                    key={comic.id} 
                    onClick={() => navigate(`/admin/comics/view/${comic.id}`)}
                    className="relative flex flex-col overflow-hidden transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
                    >
                        {/* Image Header */}
                        {comic.image ? (
                             <div className={`w-full overflow-hidden ${layoutMode === 'grid' ? 'h-48' : 'h-36'}`}>
                                 <img 
                                    src={getComicImageUrl(comic.image)} 
                                    alt={comic.title} 
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      e.currentTarget.src = "/clip-path-group-16.png"; 
                                      e.currentTarget.onerror = null; // Prevent infinite loop
                                    }}
                                 />
                             </div>
                        ) : (
                            <div className={`w-full bg-gray-200 flex items-center justify-center ${layoutMode === 'grid' ? 'h-48' : 'h-36'}`}>
                                <Puzzle className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                        
                        <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-[15px] font-bold font-[Poppins] text-black leading-tight">
                                {comic.title}
                            </h3>
                            <div className="relative">
                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(activeMenuId === comic.id ? null : comic.id);
                                    }}
                                    className="p-1 text-gray-400 transition-colors hover:text-black"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                    {activeMenuId === comic.id && (
                                    <div className="absolute right-0 z-20 w-32 py-1 mt-2 overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(comic);
                                            }}
                                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(comic.id);
                                            }}
                                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-red-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 font-[Poppins] mb-4">
                            <span>{comic.subtitle}</span>
                            <span className="mx-2">•</span>
                            <span>
                                {comic.submissionDeadline 
                                    ? new Date(comic.submissionDeadline).toLocaleDateString() 
                                    : "No Deadline"}
                            </span>
                        </div>
                        
                        {/* Progress - Submission Count */}
                        <div className="mb-4">
                            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-1">
                                <div 
                                    className={`h-full rounded-full bg-[#D94528]`} 
                                    style={{ width: `${Math.min(((comic.submissionCount || 0) / (comic.totalKids || 1)) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-500 font-[Poppins]">Progress</span>
                                <span className="text-xs font-medium text-gray-500">
                                    {comic.submissionCount || 0}/{comic.totalKids || 0} ({Math.round(((comic.submissionCount || 0) / (comic.totalKids || 1)) * 100)}%)
                                </span>
                            </div>
                        </div>

                        {/* File Attachment */}
                        {comic.document ? (() => {
                            let docUrl = "";
                            try {
                                if (comic.document.startsWith('[') && comic.document.endsWith(']')) {
                                    const pages = JSON.parse(comic.document);
                                    docUrl = getComicImageUrl(pages[0]);
                                } else {
                                    docUrl = getComicImageUrl(comic.document);
                                }
                            } catch (e) {
                                docUrl = getComicImageUrl(comic.document);
                            }

                            return (
                                <a 
                                    href={docUrl} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-3 p-2 mt-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 shrink-0">
                                        <FileText className="w-5 h-5 text-[#D94528]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-semibold text-black truncate">Comic Document</p>
                                        <p className="text-[11px] text-gray-400">PDF/Page 1</p>
                                    </div>
                                </a>
                            );
                        })() : (
                            <div className="flex items-center gap-3 mt-2 opacity-50">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg shrink-0">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-500 truncate">No Document</p>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                ))}
                </section>

                {/* Pagination UI */}
                {comics.filter(comic => comic.title.toLowerCase().includes(searchQuery) || comic.subtitle.toLowerCase().includes(searchQuery)).length > itemsPerPage && (
                    <div className="flex flex-col items-center w-full gap-4 mt-12 sm:flex-row sm:justify-between sm:gap-0">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors border border-gray-200 rounded-full hover:bg-gray-50"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Previous
                        </button>

                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                            {Array.from({ length: Math.ceil(comics.filter(comic => comic.title.toLowerCase().includes(searchQuery) || comic.subtitle.toLowerCase().includes(searchQuery)).length / itemsPerPage) }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setCurrentPage(num)}
                                    className={`transition-colors w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium ${currentPage === num
                                        ? "bg-gray-900 text-white"
                                        : "bg-[#f0f0f0] text-gray-700 hover:bg-[#e5e5e5]"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(comics.filter(comic => comic.title.toLowerCase().includes(searchQuery) || comic.subtitle.toLowerCase().includes(searchQuery)).length / itemsPerPage), p + 1))}
                            disabled={currentPage === Math.ceil(comics.filter(comic => comic.title.toLowerCase().includes(searchQuery) || comic.subtitle.toLowerCase().includes(searchQuery)).length / itemsPerPage)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors border border-gray-200 rounded-full hover:bg-gray-50"
                        >
                            Next
                            <ArrowRight className="w-4 h-3" />
                        </button>
                    </div>
                )}
                </>
            )}

        </main>
        
        <EditComicModal 
            isOpen={editModalOpen} 
            onClose={() => setEditModalOpen(false)} 
            comic={selectedComic} 
            onUpdate={fetchComics} 
        />
      </div>
    </div>
  );
};
