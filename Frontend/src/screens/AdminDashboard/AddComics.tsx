import React from "react";
import { ArrowLeft, Menu, Search, Bell, ChevronDown } from "lucide-react";

interface AddComicsProps {
  onBack: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  adminData: any;
}

export const AddComics = ({
  onBack,
  sidebarOpen,
  setSidebarOpen,
  adminData,
}: AddComicsProps): JSX.Element => {
  return (
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
            onClick={onBack}
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
                    <span className="text-xl">☁️</span>
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
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-[#ef4444]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
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
  );
};
