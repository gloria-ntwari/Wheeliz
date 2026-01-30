import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Puzzle, Grid3X3, Search, Bell, ChevronDown, Menu, Download } from "lucide-react";

const summaryCards = [
  { colorClass: "bg-[#F5D27B]", underlineClass: "bg-[#F5D27B]" },
  { colorClass: "bg-[#D8431E]", underlineClass: "bg-[#D8431E]" },
  { colorClass: "bg-[#4CAF7A]", underlineClass: "bg-[#4CAF7A]" },
  { colorClass: "bg-[#1E73BE]", underlineClass: "bg-[#1E73BE]" },
];



const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartData = [
  { month: "Jan", active: 35, offline: 25 },
  { month: "Feb", active: 40, offline: 30 },
  { month: "Mar", active: 25, offline: 20 },
  { month: "Apr", active: 30, offline: 25 },
  { month: "Mai", active: 60, offline: 50 },
  { month: "Jun", active: 65, offline: 55 },
  { month: "Jul", active: 55, offline: 45 },
  { month: "Aug", active: 75, offline: 65 },
  { month: "Sep", active: 95, offline: 50 },
  { month: "Oct", active: 55, offline: 45 },
  { month: "Nov", active: 90, offline: 75 },
  { month: "Dec", active: 70, offline: 60 },
];

const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: true },
  { icon: Users, label: "Kids", path: "/admin/kids", active: false },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: false },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

export const AdminDashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("12 month");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminData = JSON.parse(localStorage.getItem("adminData") || '{"name": "Ange Nadette"}');

  return (
    <div className="flex w-full min-h-screen bg-[#1f1f1f] font-barlow">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-80" : "w-0"
          } transition-all duration-300 bg-[#1f1f1f] flex flex-col overflow-hidden shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-8">
          <img src="/clip-path-group-16.png" alt="Wheeliez" className="object-contain w-auto h-20" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-8 mt-16 space-y-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-10 py-5 rounded-full font-medium transition-colors ${item.active
                ? "bg-[#68161c] text-white"
                : "text-white hover:bg-[#2a2a2a]"
                }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-white" : "text-white"}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-x-hidden bg-white rounded-tl-3xl">
        {/* Header */}
        <header className="flex flex-col items-stretch gap-4 px-4 py-4 mt-6 bg-white rounded-tl-3xl sm:px-6 lg:px-10 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: menu + search */}
          <div className="flex items-center w-full gap-3 lg:w-auto">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-center text-gray-700 border border-gray-300 rounded-full w-9 h-9 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

<div className="flex items-center w-[515px] h-[45px] px-5 bg-[#f4f6fb] rounded-full gap-3">
  <Search className="w-5 h-5 text-[#0f2a5f] shrink-0 ml-4" />
  <input
    type="text"
    placeholder="Search for something"
    className="flex-1 bg-transparent text-[15px] leading-none text-[#0f2a5f] placeholder:text-[#0f2a5f] outline-none text-left"
  />
</div>


          </div>

          {/* Right: notifications + profile */}
          <div className="flex items-center justify-end w-full gap-4 lg:w-auto">
            <button className="relative flex items-center justify-center transition-colors bg-white rounded-full w-9 h-9 ">
              <Bell className="w-5 h-5 text-[#111827]" />
              <span className="absolute w-1.5 h-1.5 bg-red-500 rounded-full top-1.5 right-2.5"></span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="hidden text-sm font-medium text-gray-900 sm:block">
                {adminData.name || "Admin"}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 pt-6 pb-10 overflow-y-auto bg-white sm:px-6 lg:px-10">
          {/* Greeting Hero Card */}
          <section className="w-full mb-8">
            <div className="flex flex-col items-start justify-between w-full gap-4 px-6 py-6 text-white rounded-3xl bg-gradient-to-l from-[#CD535C] to-[#68161C] sm:px-8 sm:py-7 md:flex-row md:items-center md:px-10 lg:px-16">
              <div className="space-y-2">
                <h2 className="lg:text-[25px] font-semibold ">Hello Admin 👋</h2>
                <p className="text-sm sm:text-base  [font-family:'Poppins'] font-normal lg:text-[16px]">Wishing you a happy morning and happy day</p>
              </div>

              <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#68161c] rounded-full shadow-md hover:bg-[#4d1216] transition-colors whitespace-nowrap mt-2 md:mt-0">
                Add New Comics
              </button>
            </div>
          </section>

          {/* Top Stats Row */}
<section className="w-full mt-16 mb-10 ml-2">
  <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
    {summaryCards.map((card, index) => (
      <div key={index} className="flex flex-col space-y-3">
        
        {/* Top row: square + text */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${card.colorClass}`}>
            <div className="w-3.5 h-3.5 bg-white rounded" />
          </div>

          <p className="text-[15px] text-gray-500 [font-family:'Poppins',sans-serif] font-normal">
            Total kids in the system
          </p>
        </div>

        <div className="">
          <p className="text-[25px] font-extrabold text-black [font-family:'Poppins',sans-serif] ">
            118
          </p>
        </div>
        <span className={`mt-2 block h-[1px] w-10 rounded-full ${card.underlineClass}`} />

      </div>
    ))}
  </div>
</section>



          {/* Chart Section */}
          <div className="max-w-6xl p-6 mt-1 mt-20 border shadow-lg bg-card rounded-2xl border-border">
            <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-start md:justify-between">
              <div className="ml-9">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-lg font-semibold text-black">
                    Total Participant
                  </h2>
                  {/* Time Period Filters */}
                  <div className="flex gap-2">
                    {["12 month", "6 month", "30 days", "7 days"].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${selectedPeriod === period
                          ? "bg-[#1f1f1f] border-[#1f1f1f] text-background"
                          : "bg-background border-border text-muted-foreground hover:bg-accent"
                          }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-baseline gap-8 mt-6">
                  <span className="text-sm text-muted-foreground">
                    Average per month
                  </span>
                  <span className="text-black ">
                    12,000
                  </span>
                </div>
              </div>

              {/* Download Button */}
              <button className="flex items-center justify-center transition-colors border rounded-full w-9 h-9 border-border text-muted-foreground hover:bg-accent">
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Chart */}
            <div className="ml-9 lg:w-[1000px]">

              {/* CHART BODY */}
              <div className="relative flex h-52">

                {/* Y AXIS */}
                <div className="flex flex-col justify-between pr-3 text-xs text-muted-foreground">
                  {[10, 8.75, 7.5, 6.25, 5, 3.75, 2.5, 1.25, 0].map((val) => (
                    <span key={val}>{val}</span>
                  ))}
                </div>

                {/* GRID + BARS */}
                <div className="relative flex-1">

                  {/* GRID */}
                  <div
                    className="absolute inset-0 grid pointer-events-none"
                    style={{
                      gridTemplateColumns: `repeat(${months.length}, 1fr)`,
                      gridTemplateRows: "repeat(8, 1fr)",
                    }}
                  >
                    {/* vertical - separating months */}
                    {months.slice(1).map((_, i) => (
                      <div
                        key={i}
                        className="border-l border-dashed border-[#F2A528]/40 h-full absolute"
                        style={{
                          left: `${((i + 1) / months.length) * 100}%`,
                          top: 0,
                          bottom: 0
                        }}
                      />
                    ))}

                    {/* horizontal */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="col-span-full border-t border-dashed border-[#F2A528]/40"
                      />
                    ))}
                  </div>

                  {/* BARS */}
                  <div
                    className="relative z-10 grid h-full"
                    style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}
                  >
                    {chartData.map((data, index) => (
                      <div
                        key={index}
                        className="flex items-end justify-center h-full gap-2"
                      >
                        <div
                          className="w-3 rounded-t-sm bg-[#CB3E21]"
                          style={{ height: `${data.active}%` }}
                        />
                        <div
                          className="w-3 rounded-t-sm bg-[#F2A528]"
                          style={{ height: `${data.offline}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MONTHS (ALIGNED TO BARS) */}
              <div
                className="grid ml-[3.5rem] mt-2 text-xs text-muted-foreground"
                style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}
              >
                {months.map((month) => (
                  <span key={month} className="text-center">
                    {month}
                  </span>
                ))}
              </div>
            </div>


            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#CB3E21]"></div>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F2A528]"></div>
                <span className="text-sm text-muted-foreground">Offline</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
