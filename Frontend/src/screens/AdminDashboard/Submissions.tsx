import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ROOT } from "../../config/api";
import {
  Grid3X3,
  MessageCircleMore,
  X,
  Trophy
} from "lucide-react";
import { AdminHeader } from "../../components/AdminHeader";
import { Smile } from "lucide-react";
import { Home } from "lucide-react";
import { Puzzle } from "lucide-react";



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
  const [comics, setComics] = useState<any[]>([]);
  const [kids, setKids] = useState<any[]>([]);
  const [totalKids, setTotalKids] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showRankings, setShowRankings] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      
      // Fetch Submissions
      const subResponse = await fetch(`${API_BASE_URL}/admin/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subData = await subResponse.json();
      
      // Fetch Comics
      const comicsResponse = await fetch(`${API_BASE_URL}/admin/comics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const comicsData = await comicsResponse.json();

      // Fetch Stats for total kids
      const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsResponse.json();

      // Fetch All Kids for rankings
      const kidsResponse = await fetch(`${API_BASE_URL}/admin/kids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const kidsData = await kidsResponse.json();

      if (subData.status === "success") setSubmissions(subData.data);
      if (comicsData.status === "success") setComics(comicsData.data);
      if (statsData.status === "success") setTotalKids(statsData.data.totalKids);
      if (kidsData.status === "success") setKids(kidsData.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getFullImageUrl = (path: string | null) => {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    const baseUrl = API_ROOT;
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const getRankings = () => {
    const totalPossibleMarks = comics.reduce((acc, c) => acc + (c.totalMarks || 0), 0);
    
    const rankings = kids.map(kid => {
      const kidSubs = submissions.filter(s => s.kidId === kid.id);
      let obtainedMarks = 0;
      let bonusMarks = 0;

      kidSubs.forEach(sub => {
        obtainedMarks += (sub.marks || 0);
        
        // Find the comic to check deadline and bonus
        const comic = comics.find(c => c.id === sub.comicId);
        if (comic && comic.bonus && comic.submissionDeadline) {
          if (new Date(sub.createdAt) <= new Date(comic.submissionDeadline)) {
            bonusMarks += comic.bonus;
          }
        }
      });

      const totalValue = obtainedMarks + bonusMarks;
      const percentageRaw = totalPossibleMarks > 0 
        ? (totalValue / totalPossibleMarks) * 100 
        : 0;
      const percentage = percentageRaw.toFixed(2);

      return {
        ...kid,
        totalValue,
        percentage
      };
    });

    return rankings.sort((a, b) => b.totalValue - a.totalValue);
  };

  const rankings = getRankings();


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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-[17px] font-bold text-black">Submissions</h1>
              <p className="text-sm text-gray-500">
                You have {submissions.length} in total submissions.
              </p>
            </div>
            <button 
              className="text-[12px] bg-[#68161c]/10 text-[#68161c] px-7 py-2 rounded-lg font-bold hover:bg-[#68161c]/20 transition-colors"
              onClick={() => setShowRankings(true)}
            >
              Rankings
            </button>
          </div>

          {/* Cards Section */}
          <section className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
                <div className="py-10 text-center col-span-full">Loading submissions...</div>
            ) : comics.filter(c => (c.submissionCount || 0) > 0).slice(0, 3).map((comic, idx) => {
              const submissionPercentage = totalKids > 0 
                ? Math.round((comic.submissionCount || 0) / totalKids * 100) 
                : 0;
              
              const colors = ["bg-[#F9DE90]", "bg-[#2f3542]", "bg-[#D94528]"];
              const progressColor = colors[idx % colors.length];

              return (
                <div 
                  key={comic.id} 
                  className="overflow-hidden transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
                  onClick={() => navigate(`/admin/submissions/${comic.id}`)}
                >
                  <div className="h-40 overflow-hidden">
                     <img src={getFullImageUrl(comic.image)} alt={comic.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-[15px] font-bold text-black mb-1">{comic.title}</h3>
                    <p className="mb-4 text-xs text-gray-500 line-clamp-1">{comic.subtitle}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                           <MessageCircleMore className="w-3 h-3 text-gray-500" />
                           <span className="text-xs font-bold text-gray-700">{comic.submissionCount || 0}</span>
                        </div>
                        <div className="flex -space-x-2">
                           {/* Show top 3 submitters if available, else placeholders */}
                           {submissions.filter(s => s.comicId === comic.id).slice(0, 3).map((s, i) => (
                             <div key={i} className="w-7 h-7 overflow-hidden border-2 border-white rounded-full">
                               <img 
                                 src={getFullImageUrl(s.kid?.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.kid?.name || 'User')}&background=random`} 
                                 className="object-cover w-full h-full" 
                                 alt="kid" 
                                 onError={(e) => {
                                   e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.kid?.name || 'User')}&background=random`;
                                   e.currentTarget.onerror = null;
                                 }}
                               />
                             </div>
                           ))}
                        </div>
                    </div>

                    <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2">
                       <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${submissionPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                       <span>Progress</span>
                       <span>{submissionPercentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
                         <th className="pb-4 text-sm font-medium text-center text-gray-500">Status</th>
                         <th className="pb-4 text-sm font-medium text-gray-500">Comics Submitted</th>
                      </tr>
                   </thead>
                   <tbody>
                       {submissions.slice(0, 2).map((sub) => (
                          <tr key={sub.id}>
                             <td className="py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                      <img 
                                        src={getFullImageUrl(sub.kid?.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.kid?.name || 'Unknown')}&background=random`} 
                                        alt={sub.kid?.name} 
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.kid?.name || 'Unknown')}&background=random`;
                                          e.currentTarget.onerror = null;
                                        }}
                                      />
                                   </div>
                                   <span className="text-sm font-bold text-black">{sub.kid?.name}</span>
                                </div>
                             </td>
                             <td className="py-4 text-sm font-medium text-black">{new Date(sub.createdAt).toLocaleString()}</td>
                             <td className={`py-6 text-sm font-bold text-center ${sub.status === 'graded' ? 'text-green-500' : 'text-red-500'}`}>
                                 {sub.status === 'graded' ? 'Verified' : 'Not Verified'}
                             </td>
                             <td className="py-4">
                                <div className="flex items-center gap-3">
                                   {/* Comic Image fallback */}                                   
                                   <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100">
                                      <img 
                                        src={getFullImageUrl(sub.comic?.image) || "/clip-path-group-16.png"} 
                                        alt="Comic" 
                                        className="object-cover w-full h-full" 
                                        onError={(e) => {
                                           e.currentTarget.src = "/clip-path-group-16.png";
                                           e.currentTarget.onerror = null;
                                        }}
                                      />
                                   </div>
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
                {/* <a href="#" className="text-sm font-bold text-[#8B1A1A] hover:underline">See all</a> */}
             </div>
             
             <div className="space-y-6">
                {comics.slice(0, 2).map((comic, idx) => {
                   const submissionPercentage = totalKids > 0 
                     ? Math.round((comic.submissionCount || 0) / totalKids * 100) 
                     : 0;
                   
                   const colors = ["bg-[#D94528]", "bg-[#2D9CDB]"];
                   const progressColor = colors[idx % colors.length];
                   
                   const comicSubmissions = submissions.filter(s => s.comicId === comic.id);
                   const extraSubmissions = Math.max(0, (comic.submissionCount || 0) - 3);

                   return (
                    <div key={comic.id} className="flex items-start gap-4">
                       <div className="pt-1">
                          <input type="checkbox" className="w-5 h-5 rounded focus:ring-[#8B1A1A] text-[#8B1A1A]" />
                       </div>
                       <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
                          <div>
                             <h3 className="mb-2 text-sm font-bold text-black">{comic.title}</h3>
                             <p className="max-w-xl mb-4 text-xs leading-relaxed text-gray-500 line-clamp-2">{comic.subtitle}</p>
                             
                             <div className="flex items-center max-w-md gap-4">
                                <div className="relative flex-1 h-2 bg-gray-100 rounded-full">
                                   <div className={`absolute left-0 top-0 h-full rounded-full ${progressColor}`} style={{ width: `${submissionPercentage}%` }}></div>
                                </div>
                                <span className="text-xs font-medium text-gray-500">{submissionPercentage}%</span>
                             </div>
                          </div>
                          
                          <div className="flex flex-col items-end justify-center gap-2">
                               <span className="text-xs font-bold text-black">
                                 {new Date(comic.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                               </span>
                              <div className="flex -space-x-1.5">
                                 {comicSubmissions.slice(0, 3).map((s, i) => (
                                   <div key={i} className="overflow-hidden border-2 border-white rounded-full w-7 h-7">
                                     <img 
                                       src={getFullImageUrl(s.kid?.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.kid?.name || 'User')}&background=random`} 
                                       className="object-cover w-full h-full" 
                                       alt="kid" 
                                       onError={(e) => {
                                         e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.kid?.name || 'User')}&background=random`;
                                         e.currentTarget.onerror = null;
                                       }}
                                     />
                                   </div>
                                 ))}
                                 {extraSubmissions > 0 && (
                                   <div className="flex items-center justify-center w-7 h-7 text-[10px] font-bold text-gray-600 bg-gray-50 border-2 border-white rounded-full">
                                     +{extraSubmissions}
                                   </div>
                                 )}
                              </div>
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </section>
        </main>
      </div>

      {/* Rankings Modal */}
      {showRankings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-[20px] overflow-hidden shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-[#fcfcfc]">
              <div className="flex items-center gap-4">
                <div>
                   <h2 className="text-[17px] font-bold text-black font-[Poppins]">Overall Rankings</h2>
                   <p className="text-[14px] text-gray-500 font-[Poppins]">Based on all comics and bonus points</p>
                </div>
              </div>
              <button onClick={() => setShowRankings(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10">
               <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                       <th className="pb-6 px-4 text-sm font-bold text-gray-400 uppercase tracking-widest w-24">Rank</th>
                       <th className="pb-6 px-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Kid</th>
                       <th className="pb-6 px-4 text-sm font-bold text-gray-400 uppercase tracking-widest text-right w-32">Grade (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rankings.map((kid, idx) => (
                      <tr key={kid.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-6 px-4">
                           <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm ${
                             idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                             idx === 1 ? 'bg-gray-100 text-gray-600' :
                             idx === 2 ? 'bg-orange-100 text-orange-700' :
                             'bg-gray-50 text-gray-400'
                           }`}>
                             {idx + 1}
                           </div>
                        </td>
                        <td className="py-5 px-4">
                           <div className="flex items-center gap-4">
                             <img 
                               src={getFullImageUrl(kid.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name || 'User')}&background=random`} 
                               className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" 
                               alt={kid.name}
                               onError={(e) => {
                                 e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(kid.name || 'User')}&background=random`;
                                 e.currentTarget.onerror = null;
                               }}
                             />
                             <span className="font-bold text-black text-sm">{kid.name}</span>
                           </div>
                        </td>
                        <td className="py-5 px-4 text-right">
                           <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full inline-block font-bold text-xs border border-emerald-100">
                             {kid.percentage}%
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
