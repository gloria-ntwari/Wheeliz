import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Smile,
  Puzzle,
  Grid3X3,
  Search,
  Bell,
  ChevronDown,
  Menu,
  Plus,
  List,
  LayoutGrid,
  FileText,
} from "lucide-react";

interface Comic {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  createdAt: string;
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
  
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  const adminData = JSON.parse(
    localStorage.getItem("adminData") || '{"name": "Ange Nadette"}'
  );

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/comics');
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

    fetchComics();
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
        <header className="flex flex-col items-stretch gap-4 px-4 py-4 mt-6 bg-white rounded-tl-3xl sm:px-6 lg:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center w-full gap-3 lg:w-auto">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-center text-gray-700 border border-gray-300 rounded-full w-9 h-9 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center  max-w-[515px] h-[45px] px-5 bg-[#f4f6fb] rounded-full gap-3 lg:w-[800px] sm:w-full">
              <Search className="w-4 h-4 text-[#0f2a5f] shrink-0 ml-2 sm:ml-4" />
              <input
                type="text"
                placeholder="Search for something"
                className="flex-1 w-full bg-transparent text-[13px] leading-none text-[#0f2a5f] placeholder:text-[#0f2a5f] outline-none text-left [font-family:'Poppins']"
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-4 lg:w-auto shrink-0">
            <button className="relative flex items-center justify-center transition-colors bg-white rounded-full w-9 h-9 ">
              <Bell className="w-5 h-5 text-[#111827]" />
              <span className="absolute w-1.5 h-1.5 bg-red-500 rounded-full top-1.5 right-2.5"></span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-full shrink-0">
                <img
                  src="/profile1.jpg"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="hidden text-sm font-medium text-gray-900 sm:block">
                {adminData.name || "Admin"}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
            </div>
          </div>
        </header>

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
                <div className="flex  items-center gap-3">
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
                <section className={`grid gap-6 ${layoutMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {comics.map((comic) => (
                    <div 
                    key={comic.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                    >
                        {/* Image Header */}
                        {comic.image ? (
                             <div className={`w-full overflow-hidden ${layoutMode === 'grid' ? 'h-48' : 'h-36'}`}>
                                 <img 
                                    src={comic.image.startsWith('http') ? comic.image : `http://localhost:5000${comic.image}`} 
                                    alt={comic.title} 
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/marvel1.jpg'; // Fallback image
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
                            {layoutMode === "list" && (
                                <button className="text-gray-400 hover:text-black">•••</button>
                            )}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 font-[Poppins] mb-4">
                            <span>{comic.subtitle}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(comic.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Progress - Placeholder for now as it depends on kids progress */}
                        <div className="mb-4">
                            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-1">
                                <div className={`h-full rounded-full bg-[#D94528]`} style={{ width: `0%` }}></div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-500 font-[Poppins]">Progress</span>
                                <span className="text-xs font-medium text-gray-500">0%</span>
                            </div>
                        </div>
    
                        {/* File Attachment - Placeholder or from documents if available */}
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-lg shrink-0">
                                <FileText className="w-5 h-5 text-[#D94528]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-black truncate">Comic Document</p>
                                <p className="text-[11px] text-gray-400">PDF</p>
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
                </section>
            )}

        </main>
      </div>
    </div>
  );
};
