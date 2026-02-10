import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import {
  Home,
  Smile,
  Puzzle,
  Grid3X3,
  Search,
  Bell,
  ChevronDown,
  Menu,
  MessageCircleMore,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { AdminHeader } from "../../components/AdminHeader";


// Mock Data
const submissionCards = [
  {
    id: 1,
    title: "Find Joy in School and Home",
    subtitle: "Find Joy in School and Home",
    image: "/marvel2.jpg",
    time: "23",
    progress: 34,
    progressColor: "bg-[#F9DE90]", // Yellow
  },
  {
    id: 2,
    title: "Find Joy in School and Home",
    subtitle: "Find Joy in School and Home",
    image: "/marvel1.jpg",
    time: "23",
    progress: 34,
    progressColor: "bg-[#2f3542]", // Dark blue/grey
  },
  {
    id: 3,
    title: "Find Joy in School and Home",
    subtitle: "Find Joy in School and Home",
    image: "/marvel2.jpg",
    time: "23",
    progress: 34,
    progressColor: "bg-[#D94528]", // Red
  },
];

const submissionsTable = [
  {
    id: 1,
    name: "Ange Nadette BATETE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    date: "Mon 29-01-2028 01:00",
    status: "Not Verified",
    statusColor: "text-red-500",
    comicTitle: "Art of forgiveness Through love",
    comicImage: "/marvel2.jpg",
  },
  {
    id: 2,
    name: "Ange Nadette BATETE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    date: "Mon 29-01-2028 01:00",
    status: "Verified",
    statusColor: "text-green-500",
    comicTitle: "Art of forgiveness Through love",
    comicImage: "/marvel1.jpg",
  },
  {
    id: 3,
    name: "Ange Nadette BATETE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    date: "Mon 29-01-2028 01:00",
    status: "Verified",
    statusColor: "text-green-500",
    comicTitle: "Art of forgiveness Through love",
    comicImage: "/marvel2.jpg",
  },
];

const recentComics = [
  {
    id: 1,
    title: "Learn forgiving though art",
    description: "At the end of this week's challenge the kid will be able to understand the art of forgiveness cause everyone deserves to be forgiven",
    progress: 99,
    progressColor: "bg-[#D94528]", // Red
    date: "23 Jan 2027",
  },
  {
    id: 2,
    title: "Learn forgiving though art",
    description: "At the end of this week's challenge the kid will be able to understand the art of forgiveness cause everyone deserves to be forgiven",
    progress: 99,
    progressColor: "bg-[#2D9CDB]", // Blue
    date: "23 Jan 2027",
  },
];

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
  { icon: Smile, label: "Kids", path: "/admin/kids", active: false },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: false },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: true },
];

export const Submissions = (): JSX.Element => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_BASE_URL}/admin/submissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const getFullImageUrl = (path: string | null) => {
    if (!path) return "/clip-path-group-16.png";
    if (path.startsWith("http")) return path;
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden bg-white rounded-tl-3xl">
        {/* Header */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content Body */}
        <main className="flex-1 w-full px-4 pt-6 pb-10 bg-white sm:px-6 lg:px-14 font-[Poppins]">
          <div className="mb-8">
            <h1 className="text-[17px] font-bold text-black">Submissions</h1>
            <p className="text-sm text-gray-500">You have {submissions.length} in total submissions.</p>
          </div>

          {/* Cards Section */}
          <section className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
                <div className="py-10 text-center col-span-full">Loading submissions...</div>
            ) : submissions.slice(0, 3).map((sub) => (
              <div key={sub.id} className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                   <img src={getFullImageUrl(sub.comic?.image)} alt={sub.comic?.title} className="object-cover w-full h-full" />
                </div>
                <div className="p-5">
                   <h3 className="text-[15px] font-bold text-black mb-1">{sub.comic?.title}</h3>
                   <p className="mb-4 text-xs text-gray-500">{sub.comic?.subtitle}</p>
                   
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 px-2.5 py-2 bg-[#c0c0c0] rounded-full">
                         <div className="flex items-center justify-center  ">
                           <MessageCircleMore className="w-4 h-4 text-gray-600" />
                         </div>
                         <span className="text-xs font-medium text-gray-600">{sub.marks || 0}</span>
                      </div>
                      <div className="flex -space-x-2">
                         <div className="w-10 h-10 border-2 border-white rounded-full bg-gray-300 overflow-hidden">
                            <img src={getFullImageUrl(sub.kid?.avatar)} className="w-full h-full object-cover" alt={sub.kid?.name} />
                         </div>
                      </div>
                   </div>

                   <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2">
                      <div className={`h-full rounded-full ${sub.status === 'graded' ? 'bg-[#4CAF7A]' : 'bg-[#D94528]'}`} style={{ width: `${sub.marks || 0}%` }}></div>
                   </div>
                   <div className="flex justify-between text-xs text-gray-500">
                      <span>Score</span>
                      <span>{sub.marks || 0}%</span>
                   </div>
                </div>
              </div>
            ))}
          </section>

          {/* Recent Submissions Table */}
          <section className="mb-12">
             <h2 className="mb-6 text-base font-bold text-black">Recent Submissions from kids.</h2>
             <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                   <thead>
                      <tr className="text-left border-b border-gray-100">
                         <th className="pb-4 text-sm font-medium text-gray-500">Kid Name</th>
                         <th className="pb-4 text-sm font-medium text-gray-500">Date of submission</th>
                         <th className="pb-4 text-sm font-medium text-gray-500 text-center">Status</th>
                         <th className="pb-4 text-sm font-medium text-gray-500">Comics Submitted</th>
                      </tr>
                   </thead>
                   <tbody>
                      {submissions.map((sub) => (
                         <tr key={sub.id}>
                            <td className="py-4">
                               <div className="flex items-center gap-3">
                                  <img src={getFullImageUrl(sub.kid?.avatar)} alt={sub.kid?.name} className="object-cover w-10 h-10 rounded-lg" />
                                  <span className="text-sm font-bold text-black">{sub.kid?.name}</span>
                               </div>
                            </td>
                            <td className="py-4 text-sm font-medium text-black">{new Date(sub.createdAt).toLocaleString()}</td>
                            <td className={`py-4 text-sm font-bold text-center ${sub.status === 'graded' ? 'text-green-500' : 'text-red-500'}`}>
                                {sub.status === 'graded' ? 'Verified' : 'Not Verified'}
                            </td>
                            <td className="py-4">
                               <div className="flex items-center gap-3">
                                  <img src={getFullImageUrl(sub.comic?.image)} alt="Comic" className="object-cover w-10 h-10 rounded-full" />
                                  <span className="text-sm font-medium text-black">{sub.comic?.title}</span>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </section>

          {/* Recent Comics List */}
          <section className="mb-12">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-black">Recent Comics</h2>
                <a href="#" className="text-sm font-bold text-[#8B1A1A] hover:underline">See all</a>
             </div>
             
             <div className="space-y-6">
                {recentComics.map((item) => (
                   <div key={item.id} className="flex items-start gap-4">
                      <div className="pt-1">
                         <input type="checkbox" className="w-5 h-5 rounded focus:ring-[#8B1A1A] text-[#8B1A1A]" />
                      </div>
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
                         <div>
                            <h3 className="mb-2 text-sm font-bold text-black">{item.title}</h3>
                            <p className="mb-4 text-xs leading-relaxed text-gray-500 max-w-xl">{item.description}</p>
                            
                            <div className="flex items-center gap-4 max-w-md">
                               <div className="relative flex-1 h-2 bg-gray-100 rounded-full">
                                  <div className={`absolute left-0 top-0 h-full rounded-full ${item.progressColor}`} style={{ width: `${item.progress}%` }}></div>
                               </div>
                               <span className="text-xs font-medium text-gray-500">{item.progress}%</span>
                            </div>
                         </div>
                         
                         <div className="flex flex-col items-end justify-center gap-2">
                             <span className="text-xs font-bold text-black">{item.date}</span>
                             <div className="flex -space-x-2">
                                <div className="w-6 h-6 border-2 border-white rounded-full bg-gray-300 overflow-hidden">
                                    <img src="/profile1.jpg" className="w-full h-full object-cover" alt="Profile 1" />
                                </div>
                                <div className="w-6 h-6 border-2 border-white rounded-full bg-gray-300 overflow-hidden">
                                    <img src="/profile2.jpg" className="w-full h-full object-cover" alt="Profile 2" />
                                </div>
                                <div className="w-6 h-6 border-2 border-white rounded-full bg-gray-300 overflow-hidden">
                                    <img src="/profile1.jpg" className="w-full h-full object-cover" alt="Profile 3" />
                                </div>
                                <div className="flex items-center justify-center w-6 h-6 text-[9px] font-bold text-gray-600 bg-white border-2 border-gray-100 rounded-full shadow-sm">
                                    +7
                                </div>
                             </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </section>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
             <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors border border-gray-200 rounded-full hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
             </button>
             
             <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0f172a] text-white text-xs font-medium">1</button>
                <button className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-50">2</button>
                <button className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-50">3</button>
                <span className="flex items-center justify-center w-8 h-8 text-xs text-gray-400">...</span>
                <button className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-50">8</button>
                <button className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-50">9</button>
                <button className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-50">10</button>
             </div>
             
             <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors border border-gray-200 rounded-full hover:bg-gray-50">
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
             </button>
          </div>

        </main>
      </div>
    </div>
  );
};
