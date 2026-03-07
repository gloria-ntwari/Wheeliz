import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL, API_ROOT } from "../../config/api";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ArrowLeft, UserPlus, Pencil, Download, Printer, Share2, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { AdminHeader } from "../../components/AdminHeader";
import { Home, Clock, Puzzle, Grid3X3 } from "lucide-react";
import { AddKidModal } from "./AddKidModal";
import { EditKidModal } from "./EditKidModal";
import { toast } from "sonner";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
  { icon: Clock, label: "Kids", path: "/admin/kids", active: true },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: false },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

const itemsPerPage = 6;

export const Kids = (): JSX.Element => {
  /* const kidsData = [...]; (Removed static data) */
  
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [filterActive, setFilterActive] = useState<"active" | "not-active">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKid, setSelectedKid] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const [kids, setKids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKids = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/kids`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
          setKids(data.data);
      }
    } catch (error) {
      console.error("Error fetching kids:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKids();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this kid?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/kids/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success("Kid deleted successfully!");
        fetchKids();
      } else {
        toast.error(result.message || "Failed to delete kid");
      }
    } catch (err) {
      console.error("Delete kid error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setActiveMenuId(null);
    }
  };

  const handleEdit = (kid: any) => {
    setSelectedKid(kid);
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const getFullImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl = API_ROOT;
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };


  useEffect(() => {
    if (selectedKid && modalScrollRef.current) {
      modalScrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedKid]);

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
          <img src="/clip-path-group-16.png" alt="Wheeliez" className="object-contain w-auto h-20" />
        </div>

        <nav className="flex-1 px-8 mt-16 space-y-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-10 py-5 rounded-full font-medium transition-colors [font-family:'Poppins'] text-[15px] ${item.active
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
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 pt-6 pb-10 bg-white sm:px-6 lg:px-10">
          {/* Top row: title, filters, Add Kid */}
          <section className="flex flex-col items-stretch gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
            <h2 className="font-semibold text-black sm:text-2xl [font-family:'Poppins'] lg:text-[20px]">
              Kids <span className="font-semibold text-black ">({kids.length})</span>
            </h2>

            <div className="inline-flex items-center p-1 px-2 bg-white border rounded-full border-gray-200/80">
              <button
                onClick={() => setFilterActive("active")}
                className={`px-10 py-1.5 text-xs font-medium rounded-full transition-colors sm:text-sm ${filterActive === "active"
                  ? "bg-[#f4f6fa] text-black"
                  : "bg-transparent text-black"
                  }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterActive("not-active")}
                className={`px-5 py-1.5 text-xs font-medium rounded-full transition-colors sm:text-sm ${filterActive === "not-active"
                  ? "bg-[#f4f6fa] text-black"
                  : "bg-transparent text-black"
                  }`}
              >
                Not Active
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 ">


              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#681618] rounded-full hover:bg-[#8a1322] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Kid
              </button>
            </div>
          </section>

          {/* Kids cards grid */}
          <section className="w-full mb-10">
            <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                <div className="py-10 text-center col-span-full">Loading kids...</div>
              ) : kids.filter((k: any) => {
                const isActive = k.status?.toLowerCase() === "active";
                const matchesSearch = k.name.toLowerCase().includes(searchQuery) || k.email?.toLowerCase().includes(searchQuery);
                return (filterActive === "active" ? isActive : !isActive) && matchesSearch;
              }).length === 0 ? (
                <div className="py-10 text-center col-span-full font-medium text-gray-500 [font-family:'Poppins'] uppercase tracking-wider">
                  No {filterActive === "active" ? "Active" : "Not Active"} Kids Found
                </div>
              ) : (
                kids
                  .filter((kid: any) => {
                    const isActive = kid.status?.toLowerCase() === "active";
                    const matchesSearch = kid.name.toLowerCase().includes(searchQuery) || kid.email?.toLowerCase().includes(searchQuery);
                    return (filterActive === "active" ? isActive : !isActive) && matchesSearch;
                  })
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((kid: any) => {
                    const isActive = kid.status?.toLowerCase() === "active";

                return (
                  <div
                    key={kid.id}
                    onClick={() => setSelectedKid(kid)}
                    className="relative flex flex-col h-full p-2 text-left transition-all bg-white border rounded-[30px] shadow-sm hover:shadow-md font-poppins cursor-pointer"
                  >
                    {/* Menu button */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === kid.id ? null : kid.id);
                        }}
                        className="p-1 text-gray-400 transition-colors hover:text-black"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      {activeMenuId === kid.id && (
                        <div className="absolute right-0 w-32 py-1 mt-2 overflow-hidden bg-white border border-gray-100 rounded-lg shadow-lg">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(kid);
                            }}
                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(kid.id);
                            }}
                            className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {/* INNER PROFILE CARD */}
                    <div
                      className={`flex flex-col items-center px-6 pt-6 pb-5 rounded-2xl
              ${isActive ? "bg-[#f4f6fa]" : "bg-[#fdf6f7]"}
            `}
                    >
                      <div className="relative w-16 h-16 mb-4">
                        <img
                          src={getFullImageUrl(kid.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name)}&background=random`}
                          alt={kid.name}
                          className="object-cover w-full h-full rounded-full border-[3px] border-[#FFA500]"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name)}&background=random`;
                            e.currentTarget.onerror = null;
                          }}
                        />
                      </div>

                      <p className="text-base font-bold text-black sm:text-lg">
                        {kid.name}
                      </p>

                      <p className="text-xs sm:text-sm mt-1 text-[#6B6B6B]">
                        {kid.email}
                      </p>

                      <span className="mt-4 inline-block px-5 py-2 text-[11px] font-bold tracking-wide uppercase bg-[#D1D1D1] text-[#444444]">
                        {kid.status}
                      </span>
                    </div>

                    {/* STATS SECTION */}
                    <div className="grid grid-cols-3 gap-2 px-2 mt-5 text-center">
                      <div>
                        <p className="text-lg font-bold text-black">
                          {kid.comicsRead}
                        </p>
                        <p className="mt-1 text-[#6B6B6B] text-[13px]">
                          Comics Read
                        </p>
                      </div>

                      <div>
                        <p className="text-lg font-bold text-black">
                          {kid.rank}
                        </p>
                        <p className="mt-1 text-[#6B6B6B] text-[13px]">
                          Rank
                        </p>
                      </div>

                      <div>
                        <p className="text-lg font-bold text-black">
                          {kid.submissions}
                        </p>
                        <p className="mt-1 text-[#6B6B6B] text-[13px]">
                          Submissions
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </section>



          {/* Pagination */}
          {kids.filter((k: any) => {
            const isActive = k.status?.toLowerCase() === "active";
            const matchesSearch = k.name.toLowerCase().includes(searchQuery) || k.email?.toLowerCase().includes(searchQuery);
            return (filterActive === "active" ? isActive : !isActive) && matchesSearch;
          }).length > itemsPerPage && (
          <section className="flex flex-col items-center w-full gap-4 mt-8 sm:flex-row sm:justify-between sm:gap-0">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-3 text-sm font-normal text-black bg-[#f0f0f0] rounded-full hover:bg-[#e5e5e5] transition-colors [font-family:'Poppins'] disabled:opacity-50"
            >
              <ArrowLeft className="w-3 h-3" />
              Previous
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
              {Array.from({
                length: Math.ceil(kids.filter((k: any) => {
                  const isActive = k.status?.toLowerCase() === "active";
                  const matchesSearch = k.name.toLowerCase().includes(searchQuery) || k.email?.toLowerCase().includes(searchQuery);
                  return (filterActive === "active" ? isActive : !isActive) && matchesSearch;
                }).length / itemsPerPage)
              }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === num
                      ? "bg-gray-900 text-white"
                      : "bg-[#f0f0f0] text-gray-700 hover:bg-[#e5e5e5]"
                      }`}
                  >
                    {num}
                  </button>
              ))}
            </div>

            <button
              onClick={() => {
                const totalFiltered = kids.filter((k: any) => {
                  const isActive = k.status?.toLowerCase() === "active";
                  const matchesSearch = k.name.toLowerCase().includes(searchQuery) || k.email?.toLowerCase().includes(searchQuery);
                  return (filterActive === "active" ? isActive : !isActive) && matchesSearch;
                }).length;
                setCurrentPage((p) => Math.min(Math.ceil(totalFiltered / itemsPerPage), p + 1));
              }}
              disabled={currentPage === Math.ceil(kids.filter((k: any) => {
                const isActive = k.status?.toLowerCase() === "active";
                const matchesSearch = k.name.toLowerCase().includes(searchQuery) || k.email?.toLowerCase().includes(searchQuery);
                return (filterActive === "active" ? isActive : !isActive) && matchesSearch;
              }).length / itemsPerPage)}
              className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-black bg-[#f0f0f0] rounded-full hover:bg-[#e5e5e5] transition-colors [font-family:'Poppins'] disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-3" />
            </button>
          </section>
          )}

          {/* Kid detail modal - fixed overlay centered on screen */}
          {selectedKid && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
              <button
                type="button"
                aria-label="Close kid modal"
                onClick={() => setSelectedKid(null)}
                className="absolute inset-0 w-full h-full cursor-default"
              />
              <div className="relative w-full max-w-lg px-6 sm:px-16 lg:px-28 py-16 bg-white rounded-2xl shadow-2xl min-h-[740px] flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 mb-8 text-center">
                  <div className="w-20 h-20 mb-4 overflow-hidden rounded-full border-4 border-[#FFA500]">
                    <img
                      src={getFullImageUrl(selectedKid.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedKid.name)}&background=random`}
                      alt={selectedKid.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedKid.name)}&background=random`;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-black [font-family:'Poppins']">
                    {selectedKid.name}
                  </h3>
                  <p className="text-sm text-gray-500 [font-family:'Poppins']">{selectedKid.email}</p>
                  <span className="inline-block px-4 py-1 mt-3 text-xs font-semibold tracking-wide text-gray-700 uppercase bg-gray-200">
                    {selectedKid.status}
                  </span>
                </div>

                <div className="w-full max-w-[280px] mx-auto space-y-6 text-sm text-gray-800 [font-family:'Poppins']">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-500">Gender</span>
                    <span className="font-semibold">{selectedKid.gender || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-500">Father's Name</span>
                    <span className="font-semibold">{selectedKid.fatherName || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-500">Mother's Names</span>
                    <span className="font-semibold">{selectedKid.motherName || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-500">Date of Birth</span>
                    <span className="font-semibold">{selectedKid.dateOfBirth ? new Date(selectedKid.dateOfBirth).toLocaleDateString() : "Not specified"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-500">Email</span>
                    <span className="font-semibold truncate max-w-[150px]">{selectedKid.email || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-500">Submission Date</span>
                    <span className="font-semibold">{selectedKid.createdAt ? new Date(selectedKid.createdAt).toLocaleDateString() : "Not specified"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-auto pt-10 pb-2 text-center w-full max-w-[280px] mx-auto">
                  <div>
                    <p className="text-xl font-bold text-black">{selectedKid.comicsRead}</p>
                    <p className="mt-1 text-xs tracking-wide text-gray-500 [font-family:'Poppins']">Comics</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black">{selectedKid.rank}</p>
                    <p className="mt-1 text-xs tracking-wide text-gray-500 [font-family:'Poppins']">Rank</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black">{selectedKid.submissions}</p>
                    <p className="mt-1 text-xs tracking-wide text-gray-500 [font-family:'Poppins']">Submissions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <AddKidModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={fetchKids} 
        />

        <EditKidModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          kid={selectedKid}
          onUpdate={(updatedKid) => {
            fetchKids();
            setSelectedKid(updatedKid);
          }}
        />
      </div>
    </div>
  );
};

export default Kids;