import React, { useState } from "react";
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
  Clock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Mock Data
const submissionCards = [
  {
    id: 1,
    title: "Find Joy in School and Home",
    subtitle: "Find Joy in School and Home",
    image: "https://placehold.co/600x400/png",
    time: "23",
    progress: 34,
    progressColor: "bg-[#F9DE90]", // Yellow
  },
  {
    id: 2,
    title: "Find Joy in School and Home",
    subtitle: "Find Joy in School and Home",
    image: "https://placehold.co/600x400/png",
    time: "23",
    progress: 34,
    progressColor: "bg-[#2f3542]", // Dark blue/grey
  },
  {
    id: 3,
    title: "Find Joy in School and Home",
    subtitle: "Find Joy in School and Home",
    image: "https://placehold.co/600x400/png",
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
    comicImage: "https://images.unsplash.com/photo-1612036782180-6f0b6e87f16f?w=800&q=80",
  },
  {
    id: 2,
    name: "Ange Nadette BATETE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    date: "Mon 29-01-2028 01:00",
    status: "Verified",
    statusColor: "text-green-500",
    comicTitle: "Art of forgiveness Through love",
    comicImage: "https://images.unsplash.com/photo-1612036782180-6f0b6e87f16f?w=800&q=80",
  },
  {
    id: 3,
    name: "Ange Nadette BATETE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    date: "Mon 29-01-2028 01:00",
    status: "Verified",
    statusColor: "text-green-500",
    comicTitle: "Art of forgiveness Through love",
    comicImage: "https://images.unsplash.com/photo-1612036782180-6f0b6e87f16f?w=800&q=80",
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

  const adminData = JSON.parse(
    localStorage.getItem("adminData") || '{"name": "Ange Nadette"}'
  );

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
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
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

        {/* Content Body */}
        <main className="flex-1 w-full px-4 pt-6 pb-10 bg-white sm:px-6 lg:px-14 font-[Poppins]">
          <div className="mb-8">
            <h1 className="text-[17px] font-bold text-black">Submissions</h1>
            <p className="text-sm text-gray-500">You have 3.2K in total submissions.</p>
          </div>

          {/* Cards Section */}
          <section className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
            {submissionCards.map((card) => (
              <div key={card.id} className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                   <img src={card.image} alt={card.title} className="object-cover w-full h-full" />
                </div>
                <div className="p-5">
                   <h3 className="text-[15px] font-bold text-black mb-1">{card.title}</h3>
                   <p className="mb-4 text-xs text-gray-500">{card.subtitle}</p>
                   
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 rounded-full">
                         <div className="flex items-center justify-center w-4 h-4 border border-gray-500 rounded-full">
                           <Clock className="w-3 h-3 text-gray-600" />
                         </div>
                         <span className="text-xs font-medium text-gray-600">{card.time}</span>
                      </div>
                      <div className="flex -space-x-2">
                         {[1,2,3].map((i) => (
                             <div key={i} className="w-6 h-6 border-2 border-white rounded-full bg-gray-300 overflow-hidden">
                                <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=50&h=50&fit=crop`} className="w-full h-full object-cover" />
                             </div>
                         ))}
                         <div className="flex items-center justify-center w-6 h-6 text-[10px] font-bold text-gray-600 bg-white border-2 border-gray-100 rounded-full">
                            +7
                         </div>
                      </div>
                   </div>

                   <div className="w-full h-1.5 bg-gray-100 rounded-full mb-2">
                      <div className={`h-full rounded-full ${card.progressColor}`} style={{ width: `${card.progress}%` }}></div>
                   </div>
                   <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{card.progress}%</span>
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
                      {submissionsTable.map((row) => (
                         <tr key={row.id}>
                            <td className="py-4">
                               <div className="flex items-center gap-3">
                                  <img src={row.avatar} alt={row.name} className="object-cover w-10 h-10 rounded-lg" />
                                  <span className="text-sm font-bold text-black">{row.name}</span>
                               </div>
                            </td>
                            <td className="py-4 text-sm font-medium text-black">{row.date}</td>
                            <td className={`py-4 text-sm font-bold text-center ${row.statusColor}`}>{row.status}</td>
                            <td className="py-4">
                               <div className="flex items-center gap-3">
                                  <img src={row.comicImage} alt="Comic" className="object-cover w-10 h-10 rounded-full" />
                                  <span className="text-sm font-medium text-black">{row.comicTitle}</span>
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
                         <input type="checkbox" className="w-5 h-5 border-gray-300 rounded focus:ring-[#8B1A1A] text-[#8B1A1A]" />
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
                                {[1,2,3].map((i) => (
                                    <div key={i} className="w-6 h-6 border-2 border-white rounded-full bg-gray-300 overflow-hidden">
                                        <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=50&h=50&fit=crop`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
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
