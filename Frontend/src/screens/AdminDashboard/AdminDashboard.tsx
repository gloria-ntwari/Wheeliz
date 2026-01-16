import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Puzzle, Grid3X3, Search, Bell, ChevronDown, Menu, Download } from "lucide-react";

const summaryCards = [
  { title: "Total Kids", value: "23,000", change: "+13%", colorClass: "bg-gradient-to-br from-[#89C349] to-[#415D23]" },
  { title: "Total Kids", value: "23,000", change: "+13%", colorClass: "bg-gradient-to-br from-[#FB4246] to-[#F71B1B]" },
  { title: "Total Kids", value: "23,000", change: "+13%", colorClass: "bg-gradient-to-br from-[#1E9EE5] to-[#1E89E5]" },
  { title: "Total Kids", value: "23,000", change: "+13%", colorClass: "bg-gradient-to-br from-[#F2A528] to-[#DB982B]" },
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
        className={`${sidebarOpen ? "w-72" : "w-0"
          } transition-all duration-300 bg-[#1f1f1f] flex flex-col overflow-hidden shrink-0 `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-8">
          <img src="/clip-path-group-16.png" alt="Wheeliez" className="object-contain w-auto h-20" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 mt-4 space-y-12">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${item.active
                ? "bg-white text-black"
                : "text-white hover:bg-[#2a2a2a]"
                }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-black" : "text-white"}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 bg-white rounded-tl-3xl">
        {/* Header */}
        <header className="flex items-center px-8 py-4 bg-white border-b-[1.7px] border-gray-500 rounded-tl-3xl mt-7">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 transition-colors rounded-lg hover:bg-[#1f2937]"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-semibold text-black text-foreground">Dashboard</h1>
          </div>

          {/* Centered Search Bar */}
          <div className="flex justify-center flex-1 px-8">
            <div className="hidden md:flex items-center bg-[#8fb1e116] rounded-full px-5 py-2.5 gap-3 min-w-[400px] max-w-[400px]">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for something"
                className="flex-1 text-sm text-white bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 transition-colors rounded-full hover:bg-[#1f2937]">
              <Bell className="w-5 h-5 text-black" />
              <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-1 cursor-pointer">
              <div className="w-10 h-10 overflow-hidden rounded-full bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="hidden font-medium text-foreground sm:block">
                {adminData.name || "Admin"}
              </span>
              <ChevronDown className="h-5 w-7 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-10 overflow-y-auto bg-white">
          {/* Summary Cards */}
          <div className="grid max-w-6xl grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className={`${card.colorClass} p-5 text-white shadow-lg`}
              >
                <h3 className="mb-1 text-sm opacity-90">
                  {card.title}
                </h3>
                <p className="mb-3 text-lg text-right">
                  {card.value}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">
                    Since last month
                  </span>
                  <span className="px-3 py-0.5 text-xs text-blue-400 bg-white">
                    {card.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

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
