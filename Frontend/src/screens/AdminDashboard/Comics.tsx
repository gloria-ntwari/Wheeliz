import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Clock,
  Puzzle,
  Grid3X3,
  Search,
  Bell,
  ChevronDown,
  Menu,
  Plus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Mock data for the 3 colored cards
const comicsSummary = [
  {
    id: 1,
    title: "Find Joy in School\nand Home",
    subtitle: "Find Joy in School and Home",
    progress: 34,
    count: 23,
    avatars: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    ],
    bgColor: "bg-[#F9DE90]", // Yellowish
    progressColor: "bg-[#F9DE90]",
  },
  {
    id: 2,
    title: "Find Joy in School\nand Home",
    subtitle: "Find Joy in School and Home",
    progress: 34,
    count: 23,
    avatars: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    ],
    bgColor: "bg-[#34405E]", // Dark Blue
    progressColor: "bg-[#34405E]",
  },
  {
    id: 3,
    title: "Find Joy in School\nand Home",
    subtitle: "Find Joy in School and Home",
    progress: 34,
    count: 23,
    avatars: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    ],
    bgColor: "bg-[#D94528]", // Red/Orange
    progressColor: "bg-[#D94528]",
  },
];

const recentComics = [
  {
    id: 1,
    title: "Learn forgiving though art",
    description:
      "At the end of this week's challenge the kid will be able to understand the art of forgiveness cause everyone deserves to be forgiven",
    progress: 99,
    date: "23 jan 2027",
    color: "bg-[#D94528]", // Red
    avatars: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    ],
  },
  {
    id: 2,
    title: "Learn forgiving though art",
    description:
      "At the end of this week's challenge the kid will be able to understand the art of forgiveness cause everyone deserves to be forgiven",
    progress: 99,
    date: "23 jan 2027",
    color: "bg-[#3B82F6]", // Blue
    avatars: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    ],
  },
];

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
  { icon: Clock, label: "Kids", path: "/admin/kids", active: false },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: true },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

const TOTAL_PAGES = 10;
const PAGE_NUMBERS = [1, 2, 3, 8, 9, 10];

export const Comics = (): JSX.Element => {
  const navigate = useNavigate();
  const [isAddingComics, setIsAddingComics] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [currentPage, setCurrentPage] = useState(1);

  const adminData = JSON.parse(
    localStorage.getItem("adminData") || '{"name": "Ange Nadette"}'
  );

  if (isAddingComics) {
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

          <main className="flex-1 w-full px-4 pt-6 pb-10 bg-white sm:px-6 lg:px-14 font-[Poppins]">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setIsAddingComics(false)}
                className="flex items-center gap-2 text-gray-500 hover:text-black"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Add Comics</span>
              </button>

              <div className="flex gap-4">
                <button className="px-8 py-2 text-sm font-medium text-[#681618] bg-white border border-[#681618] rounded-xl hover:bg-gray-50 transition-colors">
                  Save
                </button>
                <button className="px-8 py-2 text-sm font-medium text-white bg-[#681618] rounded-xl hover:bg-[#8a1322] transition-colors">
                  Save
                </button>
              </div>
            </div>

            <h2 className="pb-4 mb-8 text-xl font-bold text-black border-b-2 border-gray-300">Comics Details</h2>

            <div className="max-w-5xl space-y-8">
              {/* Title */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-8 border-b-2 border-gray-300 pb-8">
                <label className="text-sm font-bold text-black">Title</label>
                <input 
                  type="text" 
                  placeholder="Enter the title of your comics"
                  className="w-[90%] px-4 py-3 text-sm border-2 border-gray-300 rounded-xl outline-none focus:border-[#681618] transition-colors "
                />
              </div>

               {/* Sub-Title */}
               <div className="grid grid-cols-[180px_1fr] items-center gap-8 border-b-2 border-gray-300 pb-8">
                <label className="text-sm font-bold text-black">Sub-Title</label>
                <input 
                  type="text" 
                  placeholder="Enter the sub-title of your comics"
                  className="w-[90%] px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors text-gray-700"
                />
              </div>

               {/* Description */}
               <div className="grid grid-cols-[180px_1fr] items-start gap-8 border-b-2 border-gray-300 pb-8">
                <label className="pt-3 text-sm font-bold text-black">Description</label>
                <textarea 
                  placeholder="Enter the sub-title of your comics"
                  className="w-[90%] h-32 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors resize-none text-gray-700"
                />
              </div>

              {/* Submission Deadline */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-8 border-b-2 border-gray-300 pb-8">
                <label className="text-sm font-bold text-black">Submission Deadline</label>
                <input 
                  type="date"
                  className="w-[90%] px-4 py-3 text-sm text-gray-700 border-2 border-gray-300 rounded-xl outline-none focus:border-[#681618] transition-colors"
                />
              </div>

              {/* Upload Files */}
               <div className="grid grid-cols-[180px_1fr] items-start gap-8">
                <label className="pt-3 text-sm font-bold text-black">Upload Files</label>
                <div className="flex flex-col w-full gap-4">
                    <div className="flex flex-col items-center justify-center w-[90%] gap-2 p-8 border-2 border-gray-300 rounded-xl">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                            <span className="text-xl">☁️</span>
                        </div>
                        <p className="text-sm text-center">
                            <span className="font-semibold text-[#681618]">Click to upload</span> or drag and drop
                        </p>
                    </div>

                    {/* File List Item */}
                    <div className="flex items-center justify-between w-full"> 
                        <div className="flex items-center gap-3">
                             <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                                {/* Simple red PDF icon representation */}
                                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-black">How To Forgive Through Art</p>
                                 <p className="text-xs text-gray-500">200KB - 100% Uploaded</p>
                             </div>
                        </div>
                        <button className="text-red-800 hover:text-red-900">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-2.005-1.958L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 pt-6 pb-10 bg-white sm:px-6 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-[19px] font-bold font-[Poppins] text-black">Comics</h1>
              <p className="text-sm text-gray-500 font-[Poppins]">
                You can edit all the stuff as you wish
              </p>
            </div>
            <button 
                onClick={() => setIsAddingComics(true)}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#681618] rounded-xl hover:bg-[#8a1322] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Comics
            </button>
          </div>

          
           {/* Let's fix the above loop in a cleaner way. */}
           {/* Top Cards Section */}
           <section className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
            {comicsSummary.map((card) => (
              <div
                key={card.id}
                className="flex flex-col justify-between p-3 transition-shadow bg-white border-t-0 border-b border-l border-r border-gray-100 shadow-sm rounded-xl hover:shadow-md"
              >
                {/* Colored Card Header */}
                <div
                  className={`flex flex-col p-6 rounded-3xl text-white ${card.bgColor} h-[200px] relative mt-[-1px] gap-5`}
                >
                  <div className="flex items-center justify-center w-8 h-8 mb4 bg-white/20 rounded-xl">
                    <div className="w-4 h-4 bg-white rounded-md opacity-80" />
                  </div>
                  <h3 className="mb-1 text-[17px] font-bold font-[Poppins] leading-tight">
                    {card.title.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </h3>
                  <p className="text-sm text-white/80 font-[Poppins]">
                    {card.subtitle}
                  </p>
                </div>

                {/* Card Body (Stats & Progress) */}
                <div className="flex flex-col justify-end px-4 pb-4 mt-4">
                  <div className="flex items-center justify-between mb-6">
                    {/* Comment/Count Pill */}
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#EAEAEA] rounded-full text-gray-500">
                      <div className="w-4 h-4">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          <line x1="9" y1="10" x2="15" y2="10" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold font-[Poppins]">
                        {card.count}
                      </span>
                    </div>

                    {/* Avatars */}
                    <div className="flex items-center -space-x-3">
                      {card.avatars.slice(0, 4).map((avatar, i) => (
                        <img
                          key={i}
                          src={avatar}
                          alt="User"
                          className="w-8 h-8 bg-gray-200 border-2 border-white rounded-full"
                        />
                      ))}
                      <div className="flex items-center justify-center w-8 h-8 text-[10px] font-bold text-gray-700 bg-white border-2 border-gray-100 rounded-full shadow-sm">
                        +7
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 mb-3 overflow-hidden bg-gray-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${card.progressColor}`}
                      style={{ width: `${card.progress}%` }}
                    ></div>
                  </div>

                  {/* Progress Text */}
                  <div className="flex items-center justify-between text-sm text-gray-500 font-[Poppins]">
                    <span>Progress</span>
                    <span className="font-semibold">{card.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </section>


          {/* Recent Comics Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-black font-[Poppins]">Recent Comics</h2>
                <button className="text-sm font-medium text-[#8B1A1A] hover:underline font-[Poppins]">See all</button>
            </div>

            <div className="space-y-6">
                {recentComics.map((comic) => (
                    <div key={comic.id} className="flex items-start gap-4">
                         <div className="pt-1">
                             <div className="w-6 h-6 border-2 border-gray-200 rounded-lg"></div>
                         </div>
                         <div className="flex-1">
                             <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
                                 <div className="max-w-2xl">
                                     <h3 className="text-base font-bold text-gray-900 font-[Poppins] mb-1">{comic.title}</h3>
                                     <p className="text-sm text-gray-500 font-[Poppins] mb-4 leading-relaxed">
                                         {comic.description}
                                     </p>
                                     
                                     <div className="flex items-center gap-4">
                                         <div className="w-48 h-2 overflow-hidden bg-gray-100 rounded-full">
                                             <div className={`h-full rounded-full ${comic.color}`} style={{ width: `${comic.progress}%` }}></div>
                                         </div>
                                         <span className="text-sm font-medium text-gray-500">{comic.progress}%</span>
                                     </div>
                                 </div>

                                 <div className="flex flex-col items-end gap-2 shrink-0">
                                     <span className="text-sm font-medium text-black font-[Poppins]">{comic.date}</span>
                                     <div className="flex items-center -space-x-2">
                                        {comic.avatars.map((avatar, i) => (
                                            <img 
                                                key={i}
                                                src={avatar} 
                                                alt="User" 
                                                className="w-6 h-6 border-2 border-white rounded-full"
                                            />
                                        ))}
                                         <div className="flex items-center justify-center w-6 h-6 text-[10px] font-bold text-gray-700 bg-gray-100 border-2 border-white rounded-full">
                                            +7
                                        </div>
                                    </div>
                                 </div>
                             </div>
                         </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Pagination */}
          <section className="flex flex-col items-center w-full gap-4 pt-8 mt-12 border-t border-gray-200 sm:flex-row sm:justify-between sm:gap-0">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-normal text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors [font-family:'Poppins']"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
              {PAGE_NUMBERS.map((num, idx) => (
                <React.Fragment key={num}>
                  {idx === 3 && (
                    <span className="px-2 py-1 text-sm text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(num)}
                    className={`min-w-[32px] h-8 flex items-center justify-center text-xs font-medium rounded-lg transition-colors ${
                      currentPage === num
                        ? "bg-[#1f1f1f] text-white"
                        : "bg-transparent text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors [font-family:'Poppins']"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Comics;
