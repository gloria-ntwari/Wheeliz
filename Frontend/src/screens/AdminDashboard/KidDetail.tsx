import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home, Smile, Puzzle, Grid3X3, ArrowLeft, Edit, Download, Share } from "lucide-react";
import { AdminHeader } from "../../components/AdminHeader";

const summaryCards = [
    { title: "Total Points", value: "50", colorClass: "bg-gradient-to-br from-[#89C349] to-[#415D23]" },
    { title: "Total Points", value: "50", colorClass: "bg-gradient-to-br from-[#FB4246] to-[#F71B1B]" },
    { title: "Total Points", value: "50", colorClass: "bg-gradient-to-br from-[#1E9EE5] to-[#1E89E5]" },
];

const noticeBoard = [
    {
        id: 1,
        date: "18 May, 2026",
        author: "Ange Nadette",
        time: "5min ago",
        message: "Opened the new year's comics and downloaded it"
    },
    {
        id: 2,
        date: "18 May, 2026 10:00 AM",
        author: "Ange Nadette",
        time: "5min ago",
        message: "Opened the new year's comics and downloaded it"
    },
    {
        id: 3,
        date: "18 May, 2026 10:00 AM",
        author: "Ange Nadette",
        time: "5min ago",
        message: "Opened the new year's comics and downloaded it"
    }
];

const submissions = [
    { id: 1, name: "Kids for Joy", date: "08 March 30389", marks: "28", rank: "1" },
    { id: 2, name: "Kids for Joy", date: "08 March 30389", marks: "89", rank: "3" },
    { id: 3, name: "Kids for Joy", date: "08 March 30389", marks: "12", rank: "NA" },
    { id: 4, name: "Kids for Joy", date: "08 March 30389", marks: "12", rank: "NA" },
    { id: 5, name: "Kids for Joy", date: "08 March 30389", marks: "12", rank: "3" },
];

const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
    { icon: Smile, label: "Kids", path: "/admin/kids", active: true },
    { icon: Puzzle, label: "Comics", path: "/admin/comics", active: false },
    { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

export const KidDetail = (): JSX.Element => {
    const navigate = useNavigate();
    const { kidId } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
            <div className="flex flex-col flex-1 min-w-0 bg-white rounded-tl-3xl">
                {/* Header */}
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 p-10 bg-white">
                    {/* Summary Cards */}
<div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-3">
  {summaryCards.map((card, index) => (
    <div
      key={index}
      className={`${card.colorClass} p-8 text-white shadow-lg flex items-center justify-center`}
    >
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center text-center">
          <Edit className="w-6 h-6 mb-2" />
          <p className="text-sm opacity-90">{card.title}</p>
        </div>
        <div className="w-px h-12 bg-white/40" />
        <div className="text-3xl font-smeibold">
          {card.value}
        </div>

      </div>
    </div>
  ))}
</div>


                    {/* Content Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* My Information */}
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl">
                            <h3 className="mb-6 text-lg font-semibold text-gray-900">My Information</h3>

                            <div className="flex items-start gap-6 mb-6">
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
                                        alt="Profile"
                                        className="object-cover w-32 h-32 rounded-lg"
                                    />
                                    <div className="absolute flex gap-1 bottom-2 right-2">
                                        <button className="p-1 bg-white rounded shadow-sm">
                                            <Edit className="w-3 h-3 text-gray-600" />
                                        </button>
                                        <button className="p-1 bg-white rounded shadow-sm">
                                            <Download className="w-3 h-3 text-gray-600" />
                                        </button>
                                        <button className="p-1 bg-white rounded shadow-sm">
                                            <Share className="w-3 h-3 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: "Names:", value: "Ange Nadette" },
                                    { label: "Gender:", value: "Ange Nadette" },
                                    { label: "Father's Name:", value: "Ange Nadette" },
                                    { label: "Mother's Names:", value: "Ange Nadette" },
                                    { label: "Date of Birth:", value: "Ange Nadette" },
                                    { label: "Email:", value: "Ange Nadette" },
                                    { label: "Submission Date:", value: "Ange Nadette" }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                        <span className="text-sm text-gray-600">{item.label}</span>
                                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notice Board */}
                        <div className="p-6 bg-white border border-gray-200 rounded-2xl">
                            <h3 className="mb-6 text-lg font-semibold text-gray-900">Notice Board</h3>

                            <div className="space-y-4">
                                {noticeBoard.map((notice) => (
                                    <div key={notice.id} className="pb-4 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-xs text-gray-500">{notice.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium text-blue-600">{notice.author}</span>
                                            <span className="text-xs text-gray-500">{notice.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{notice.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* All Submissions */}
                    <div className="mt-8 overflow-hidden bg-white border border-gray-200 rounded-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">All submissions</h3>
                            <button className="text-sm text-gray-500 hover:text-gray-700">Search Date</button>
                        </div>

                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Marks
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Rank
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                            {submission.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            {submission.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            {submission.marks}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            {submission.rank}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                Previous
                            </button>

                            <div className="flex items-center gap-2">
                                <button className="px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg">
                                    1
                                </button>
                                <button className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                                    2
                                </button>
                                <button className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                                    3
                                </button>
                                <span className="px-3 py-2 text-sm text-gray-500">...</span>
                                <button className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                                    8
                                </button>
                                <button className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                                    9
                                </button>
                                <button className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                                    10
                                </button>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default KidDetail;