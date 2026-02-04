import React, { useState } from "react";
import { ArrowLeft, Menu, Search, Bell, ChevronDown, Home, Smile, Puzzle, Grid3X3, CloudUpload, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
  { icon: Smile, label: "Kids", path: "/admin/kids", active: false },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: true }, // Keep Comics active or maybe none? User is in Add Comics, which is sub-page of Comics.
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

export const AddComics = (): JSX.Element => {
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
            onClick={() => navigate(-1)}
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

        <div className="max-w-6xl space-y-8">
          {/* Comics Details Section */}
          <div className="overflow-hidden shadow-md rounded-3xl ">
            <div className="px-8 py-3 bg-[#181817]">
              <h2 className="text-[16px] font-bold text-white">
                Comics Details
              </h2>
            </div>
            <div className="p-8 bg-white border-white">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Title */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">Title*</label>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
                {/* Sub-Title */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">
                    Sub-Title*
                  </label>
                  <input
                    type="text"
                    placeholder="Subtitle"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="mt-8 space-y-3">
                 <label className="text-sm font-bold text-black">Cover Image*</label>
                 <div className="flex flex-col gap-8 md:flex-row items-end">
                    {/* Upload Box */}
                    <div className="flex flex-col items-center justify-center w-full md:w-[340px] h-[180px] gap-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                            <CloudUpload className="w-6 h-6 text-gray-500" />
                         </div>
                         <p className="text-sm text-center text-gray-500">
                            <span className="font-bold text-[#8B1A1A]">Click to upload</span> or drag and drop
                         </p>
                    </div>
                    
                    {/* Preview Image */}
                    <div className="flex flex-col gap-2">
                         <div className="w-[180px] h-[140px] overflow-hidden rounded-xl bg-gray-100">
                             <img 
                                src="https://placehold.co/600x400/png" 
                                alt="Comics Cover" 
                                className="object-cover w-full h-full"
                             />
                         </div>
                         <div className="flex items-center justify-between px-1">
                             <span className="text-xs text-gray-500">Comics_cover.png</span>
                             <button className="text-red-500 hover:text-red-700">
                                 <span className="text-lg leading-none">×</span>
                             </button>
                         </div>
                    </div>
                 </div>
              </div>

              {/* Description */}
              <div className="mt-8 space-y-3">
                <label className="text-sm font-bold text-black">
                  Description*
                </label>
                <textarea
                  placeholder="Description"
                  className="w-full h-32 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Comics Documents Section */}
          <div className="overflow-hidden shadow-md rounded-3xl">
            <div className="px-8 py-3 bg-[#181817]">
              <h2 className="text-[16px] font-bold text-white">
                Comics Documents
              </h2>
            </div>
            <div className="p-8 bg-white">
              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                {/* Maz Uploads */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">
                    Maz Uploads *
                  </label>
                  <input
                    type="text"
                    placeholder="Number"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
                {/* Submission Deadline */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-black">
                    Submission Deadline*
                  </label>
                  <input
                    type="text"
                    placeholder="Date format"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none focus:border-[#681618] transition-colors"
                  />
                </div>
              </div>

              {/* Upload Files */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-black">
                  Upload Files *
                </label>
                <div className="flex flex-col items-center justify-center w-full gap-2 p-12 border-2 border-gray-200 rounded-xl">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <CloudUpload className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-center text-gray-500">
                    <span className="font-semibold text-[#8B1A1A]">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                </div>
              </div>

              {/* File List Item */}
              <div className="flex items-center justify-center mt-6 gap-36">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-lg">
                    {/* Replaced generic SVG with FileText styled as red document */}
                    <FileText className="w-10 h-10 text-[#ef4444] fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">
                      How To Forgive Through Art
                    </p>
                    <p className="text-xs text-gray-500">
                      200KB - 100% Uploaded
                    </p>
                  </div>
                </div>
                <button className="text-[#8B1A1A] hover:text-red-900">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

