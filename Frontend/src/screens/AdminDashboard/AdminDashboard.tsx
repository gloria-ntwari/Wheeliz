import { useMemo, useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/api";
import { Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Home, Puzzle, Grid3X3, Search, Bell, ChevronDown, Menu, Download } from "lucide-react";
import { AdminHeader } from "../../components/AdminHeader";

const summaryCards = [
  { colorClass: "bg-[#F5D27B]", underlineClass: "bg-[#F5D27B]" },
  { colorClass: "bg-[#D8431E]", underlineClass: "bg-[#D8431E]" },
  { colorClass: "bg-[#4CAF7A]", underlineClass: "bg-[#4CAF7A]" },
  { colorClass: "bg-[#1E73BE]", underlineClass: "bg-[#1E73BE]" },
];






type ChartPoint = { label?: string; month?: string; active: number; offline: number };

type ChartData = {
    monthly: ChartPoint[];
    weekly: ChartPoint[];
    daily: ChartPoint[];
};


const navItems = [
  { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: true },
  { icon: Smile, label: "Kids", path: "/admin/kids", active: false },
  { icon: Puzzle, label: "Comics", path: "/admin/comics", active: false },
  { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

export const AdminDashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("12 month");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024; // open on lg+, drawer on mobile
  });

  const [stats, setStats] = useState({
    totalKids: 0,
    totalComics: 0,
    totalSubmissions: 0,
    totalAdmins: 0,
    greeting: "Morning",
    chartData: { monthly: [], weekly: [], daily: [] } as ChartData
  });

  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, data: ChartPoint } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.status === 'success') {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const cardData = [
    { label: "Total kids in the system", value: stats.totalKids, ...summaryCards[0] },
    { label: "Total Comics", value: stats.totalComics, ...summaryCards[1] },
    { label: "Total Submissions", value: stats.totalSubmissions, ...summaryCards[2] },
    { label: "Total Admins", value: stats.totalAdmins, ...summaryCards[3] },
  ];

  const adminData = JSON.parse(localStorage.getItem("adminData") || '{"name": "Ange Nadette"}');

  
  const viewData = useMemo(() => {
      const { monthly, weekly, daily } = stats.chartData || { monthly: [], weekly: [], daily: [] };
      
      if (selectedPeriod === "1 month") { // Weekly view
          return weekly || [];
      }
      if (selectedPeriod === "7 days") { // Daily view
          return daily || [];
      }
      if (selectedPeriod === "6 month") {
          // Filter monthly to last 6? Or just show filtered view of 'monthly'
          // Backend sends full year (12 months), we can slice.
          // Assuming 'monthly' is array of 12 items.
          if (monthly && monthly.length > 0) {
             const currentMonth = new Date().getMonth();
             const start = currentMonth <= 5 ? 0 : 6;
             return monthly.slice(start, start + 6);
          }
           return monthly || [];
      }
      
      // Default 12 month
      return monthly || [];
  }, [stats.chartData, selectedPeriod]);

  const labels = viewData.map(d => d.month || d.label);
  
  // Dynamic Y-Axis Max
  const maxVal = Math.max(...viewData.map(d => Math.max(d.active, d.offline)), 10);
  const yAxisStep = Math.ceil(maxVal / 5);
  const yAxisValues = [0, 1, 2, 3, 4].map(i => Math.round(i * yAxisStep * 1.25)).reverse(); // Create 5 steps


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
              className={`w-full flex items-center gap-3 px-10 py-5 rounded-full font-medium transition-colors [font-family:'Poppins'] text-[15px] ${item.active
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
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 pt-6 pb-10 overflow-x-hidden overflow-y-auto bg-white sm:px-6 lg:px-10">
          {/* Greeting Hero Card */}
          <section className="w-full mb-8">
            <div className="flex flex-col items-start justify-between w-full gap-4 px-6 py-6 text-white rounded-3xl bg-gradient-to-l from-[#CD535C] to-[#68161C] sm:px-8 sm:py-7 md:flex-row md:items-center md:px-10 lg:px-16">
              <div className="space-y-2">
                <h2 className="lg:text-[25px] font-semibold ">{stats.greeting || 'Hello'} Admin 👋</h2>
                <p className="text-sm sm:text-base  [font-family:'Poppins'] font-normal lg:text-[16px]">Wishing you a {stats.greeting} and happy day</p>
              </div>

              <button 
              onClick={() => navigate("/admin/add-comics")}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#68161c] rounded-full shadow-md hover:bg-[#4d1216] transition-colors whitespace-nowrap mt-2 md:mt-0 [font-family:'Poppins']">
                Add New Comics
              </button>
            </div>
          </section>

          {/* Top Stats Row */}
<section className="w-full mt-16 mb-10 ml-2">
  <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
    {cardData.map((card, index) => (
      <div key={index} className="flex flex-col space-y-3">
        
        {/* Top row: square + text */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${card.colorClass}`}>
            <div className="w-3.5 h-3.5 bg-white rounded" />
          </div>

          <p className="text-[15px] text-gray-500 [font-family:'Poppins',sans-serif] font-normal">
            {card.label}
          </p>
        </div>

        <div className="">
          <p className="text-[25px] font-extrabold text-black [font-family:'Poppins',sans-serif] ">
            {card.value}
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
              <div className="ml-0 sm:ml-9">
                <div className="flex flex-col gap-4 mb-2 sm:flex-row sm:items-center">
                  <h2 className="font-semibold text-black [font-family:'Poppins',Helvetica] lg:text-[16px]">
                    Total Participant
                  </h2>
                  {/* Time Period Filters */}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {["12 month", "6 month", "1 month", "7 days"].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-4 py-2.5 rounded-md text-[12px] transition-colors [font-family:'Poppins',sans-serif] ${selectedPeriod === period
                          ? "bg-white text-background text-black border-white shadow-lg hover:shadow-lg "
                          : "bg-[#f2f1f1] text-muted-foreground "
                          }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-baseline gap-8 mt-6">
                  <span className="lg:text-[14px] text-muted-foreground [font-family:'Poppins',Helvetica]">
                    Average per month
                  </span>
                  <span className="text-black  [font-family:'Poppins',Helvetica] lg:text-[14px]">
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
            <div className="w-full max-w-[95%] lg:max-w-[1000px] ml-0 sm:ml-9">

              {/* CHART BODY */}
              <div className="relative flex h-52">

                {/* Y AXIS */}
                <div className="flex flex-col justify-between pr-1 sm:pr-3 text-[10px] sm:text-xs text-muted-foreground [font-family:'Poppins']">
                  {yAxisValues.map((val) => (
                    <span key={val}>{val}</span>
                  ))}
                </div>

                {/* GRID + BARS */}
                <div className="relative flex-1 border-l border-r border-b border-dashed border-[#F2A528]/70 rounded-xl overflow-hidden">

                  {/* GRID */}
                  <div
                    className="absolute inset-0 grid pointer-events-none"
                    style={{
                      gridTemplateColumns: `repeat(${labels.length}, 1fr)`,
                      gridTemplateRows: "repeat(8, 1fr)",
                    }}
                  >
                    {/* vertical - separating months */}
                    {labels.slice(1).map((_, i) => (
                      <div
                        key={i}
                        className="border-l border-dashed border-[#F2A528]/40 h-full absolute"
                        style={{
                          left: `${((i + 1) / labels.length) * 100}%`,
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
                    style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {viewData.map((data, index) => (
                      <div
                        key={index}
                        className="relative flex items-end justify-center h-full gap-1 sm:gap-2 lg:gap-4 group"
                        onMouseEnter={(e) => {
                             const rect = e.currentTarget.getBoundingClientRect();
                             // Position relative to the chart container would be better, but fixed for now
                             // Actually, let's use the mouse event to set a localized tooltip
                             // or just simple title.
                             // Implementing custom tooltip logic:
                             const chartArea = e.currentTarget.closest('.relative.flex.h-52');
                             if(chartArea) {
                                 const chartRect = chartArea.getBoundingClientRect();
                                 setHoveredPoint({
                                     x: rect.left - chartRect.left + (rect.width / 2),
                                     y: rect.top - chartRect.top,
                                     data: data
                                 });
                             }
                        }}
                      > 
                        <div
                          className="w-2 lg:w-[15px] rounded-t-lg bg-[#CB3E21]" // Use rounded-t-lg for smoothness
                          style={{ height: `${(data.active / (yAxisValues[0] || 1)) * 100}%` }}
                        />
                        <div
                          className="w-2 lg:w-[15px] rounded-t-lg bg-[#F2A528]"
                          style={{ height: `${(data.offline / (yAxisValues[0] || 1)) * 100}%` }}
                        />
                      </div>
                    ))}
                    
                    {/* Floating Tooltip */}
                    {hoveredPoint && (
                        <div 
                            className="absolute z-50 px-3 py-2 text-xs text-white bg-black/80 rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-[110%]"
                            style={{ left: hoveredPoint.x, top: hoveredPoint.y }}
                        >
                            <p className="mb-1 font-bold">{hoveredPoint.data.month || hoveredPoint.data.label}</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#CB3E21]"></div>
                                <span>Active: {hoveredPoint.data.active}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#F2A528]"></div>
                                <span>Offline: {hoveredPoint.data.offline}</span>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* MONTHS (ALIGNED TO BARS) */}
              <div
                className="grid ml-[2.75rem] sm:ml-[3.5rem] mt-2 text-[10px] sm:text-xs text-muted-foreground [font-family:'Poppins']"
                style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}
              >
                {labels.map((label) => (
                  <span key={label} className="text-center">
                    {label}
                  </span>
                ))}
              </div>
            </div>


            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#CB3E21]"></div>
                <span className="text-sm text-muted-foreground [font-family:'Poppins']">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F2A528]"></div>
                <span className="text-sm text-muted-foreground [font-family:'Poppins']">Offline</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
