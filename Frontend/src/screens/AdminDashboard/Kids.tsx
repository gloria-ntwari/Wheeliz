import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import {
  Home,
  Clock,
  Puzzle,
  Grid3X3,
  Search,
  Bell,
  ChevronDown,
  Menu,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Download,
  Printer,
  Share2,
} from "lucide-react";

const kidsData = [
  {
    id: 1,
    name: "Ange Nadette",
    email: "bateteangenadette@gmail.com",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    comicsRead: 23,
    rank: 1,
    submissions: 18,
  },
  {
    id: 2,
    name: "Ange Nadette",
    email: "bateteangenadette@gmail.com",
    status: "Not active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    comicsRead: 23,
    rank: 1,
    submissions: 18,
  },
  {
    id: 3,
    name: "Ange Nadette",
    email: "bateteangenadette@gmail.com",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    comicsRead: 23,
    rank: 1,
    submissions: 18,
  },
  {
    id: 4,
    name: "Ange Nadette",
    email: "bateteangenadette@gmail.com",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    comicsRead: 23,
    rank: 1,
    submissions: 18,
  },
  {
    id: 5,
    name: "Ange Nadette",
    email: "bateteangenadette@gmail.com",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    comicsRead: 23,
    rank: 1,
    submissions: 18,
  },
  {
    id: 6,
    name: "Ange Nadette",
    email: "bateteangenadette@gmail.com",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    comicsRead: 23,
    rank: 1,
    submissions: 18,
  },
  {
    id: 7,
    name: "Ange Nadette",
    email: "bateteangenadette@gmail.com",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    comicsRead: 23,
    rank: 1,
    submissions: 18,
  },
  {
    id: 8,
    name: "Ange Nadette",
    email: "bateteangenadette@gmail.com",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    comicsRead: 23,
    rank: 1,
    submissions: 18,
  },
];

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
  { icon: Clock, label: "Kids", path: "/admin/kids", active: true },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: false },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

const TOTAL_PAGES = 10;
const PAGE_NUMBERS = [1, 2, 3, 8, 9, 10];

export const Kids = (): JSX.Element => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [filterActive, setFilterActive] = useState<"active" | "not-active">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKid, setSelectedKid] = useState<(typeof kidsData)[0] | null>(null);

  const adminData = JSON.parse(localStorage.getItem("adminData") || '{"name": "Ange Nadette"}');

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
          {/* Top row: title, filters, Add Kid */}
          <section className="flex flex-col items-stretch gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
            <h2 className="font-semibold text-black sm:text-2xl [font-family:'Poppins'] lg:text-[20px]">
              Kids <span className="font-semibold text-black ">(28)</span>
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
                className={`px-5 py-1.5 text-xs font-medium  transition-colors sm:text-sm ${filterActive === "not-active"
                  ? "bg-[#f4f6fa] text-black"
                  : "bg-transparent text-black"
                  }`}
              >
                Not Active
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 ">


              <button
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
              {kidsData.map((kid) => {
                const isActive =
                  kid.status.toLowerCase().includes("active") &&
                  !kid.status.toLowerCase().includes("not");

                return (
                  <button
                    key={kid.id}
                    onClick={() => setSelectedKid(kid)}
                    className="flex flex-col h-full p-2 text-left transition-all bg-white border rounded-[30px] shadow-sm hover:shadow-md font-poppins"
                  >
                    {/* INNER PROFILE CARD */}
                    <div
                      className={`flex flex-col items-center px-6 pt-6 pb-5 rounded-2xl
              ${isActive ? "bg-[#f4f6fa]" : "bg-[#fdf6f7]"}
            `}
                    >
                      <div className="relative w-16 h-16 mb-4">
                        <img
                          src={kid.avatar}
                          alt={kid.name}
                          className="object-cover w-full h-full rounded-full border-[3px] border-[#FFA500]"
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
                  </button>
                );
              })}
            </div>
          </section>



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

        {selectedKid && (
          <div className="absolute top-0 left-0 z-[60] flex items-start justify-center w-full min-h-screen">
            <button
              type="button"
              aria-label="Close kid modal"
              onClick={() => setSelectedKid(null)}
              className="fixed inset-0 z-0 bg-black/40"
            />

            <div className="relative z-10 flex flex-col items-center justify-center p-4 mt-16 mb-20">

              <div className="w-full max-w-lg px-28 py-16 bg-white rounded-2xl shadow-2xl min-h-[740px] flex flex-col items-center">
                <div className="flex flex-col items-center mt-2 mb-8 text-center">
                  <div className="w-20 h-20 mb-4 overflow-hidden rounded-full border-4 border-[#FFA500]">
                    <img
                      src={selectedKid.avatar}
                      alt={selectedKid.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-black [font-family:'Poppins']">
                    {selectedKid.name}
                  </h3>
                  <p className="text-sm text-gray-500 [font-family:'Poppins']">{selectedKid.email}</p>
                  <span className="inline-block px-4 py-1 mt-3 text-xs font-semibold tracking-wide text-gray-700 uppercase bg-gray-200">
                    {selectedKid.status}
                  </span>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      <Pencil className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      <Download className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      <Printer className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      <Share2 className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                <div className="w-full max-w-[280px] mx-auto space-y-6 text-sm text-gray-800 [font-family:'Poppins']">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Gender</span>
                    <span>Ange Nadette</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Father's Name</span>
                    <span>Ange Nadette</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Mother's Names</span>
                    <span>Ange Nadette</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Date of Birth</span>
                    <span>Ange Nadette</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Email</span>
                    <span>Ange Nadette</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Submission Date</span>
                    <span>Ange Nadette</span>
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
          </div>

          
        )}
      </div>
    </div>
  );
};

export default Kids;