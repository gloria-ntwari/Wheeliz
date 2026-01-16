import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Puzzle, Grid3X3, Search, Bell, ChevronDown, Menu, Download, Plus, Edit, Trash2 } from "lucide-react";

const kidsData = [
    {
        id: 1,
        name: "Olivia Rhye",
        username: "@olivia",
        phone: "+250 783 213 443",
        email: "olivia@untitledui.com",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 2,
        name: "Phoenix Baker",
        username: "@phoenix",
        phone: "+250 783 213 443",
        email: "phoenix@untitledui.com",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 3,
        name: "Lana Steiner",
        username: "@lana",
        phone: "+250 783 213 443",
        email: "lana@untitledui.com",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 4,
        name: "Demi Wilkinson",
        username: "@demi",
        phone: "+250 783 213 443",
        email: "demi@untitledui.com",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 5,
        name: "Candice Wu",
        username: "@candice",
        phone: "+250 783 213 443",
        email: "candice@untitledui.com",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 6,
        name: "Natali Craig",
        username: "@natali",
        phone: "+250 783 213 443",
        email: "natali@untitledui.com",
        status: "Not active",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 7,
        name: "Drew Cano",
        username: "@drew",
        phone: "+250 783 213 443",
        email: "drew@untitledui.com",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
    },
    {
        id: 8,
        name: "Orlando Diggs",
        username: "@orlando",
        phone: "+250 783 213 443",
        email: "orlando@untitledui.com",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
];

const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard", active: false },
    { icon: Users, label: "Kids", path: "/admin/kids", active: true },
    { icon: Puzzle, label: "Comics", path: "/admin/comics", active: false },
    { icon: Grid3X3, label: "Submissions", path: "/admin/submissions", active: false },
];

export const Kids = (): JSX.Element => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const adminData = JSON.parse(localStorage.getItem("adminData") || '{"name": "Ange Nadette"}');

    return (
        <div className="flex w-full min-h-screen bg-[#1f1f1f] font-barlow">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-72" : "w-0"
                    } transition-all duration-300 bg-[#1f1f1f] flex flex-col overflow-hidden shrink-0`}
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
                        <h1 className="text-xl font-semibold text-black text-foreground">Kids</h1>
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
                <main className="flex-1 p-6 bg-white">
                    {/* Kids Table Container */}
                    <div className="overflow-hidden bg-white border border-gray-200 rounded-[40px]">
                        {/* Kids Header - Inside Table */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-semibold text-black">Kids</h2>
                                <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-[#FAFAFA] shadow-[inset_0.3px_5.48px_21.4px_rgba(0,0,0,0.05)] rounded-full">
                                    239
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-[#FAFAFA] shadow-[inset_1.37px_5.48px_21.4px_rgba(0,0,0,0.08)] border-gray-300 rounded-3xl hover:bg-gray-50">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                                <button className="flex items-center gap-1 px-5 py-2 text-sm  text-white bg-[#68161C] rounded-3xl">
                                    <Plus className="w-4 h-4" />
                                    Add Kid
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="w-8 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        {/* Checkbox column */}
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Phone Number
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Email address
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {kidsData.map((kid) => (
                                    <tr
                                        key={kid.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/admin/kids/${kid.id}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <img
                                                        className="object-cover w-10 h-10 rounded-full"
                                                        src={kid.avatar}
                                                        alt={kid.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{kid.name}</div>
                                                    <div className="text-sm text-gray-500">{kid.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            {kid.phone}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                            {kid.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium border
      ${kid.status === "Active"
                                                        ? "bg-white border-gray-400 text-black-500"
                                                        : "bg-white border-gray-400 text-black-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-1 h-1 rounded-full
        ${kid.status === "Active" ? "bg-green-500" : "bg-red-500"}
      `}
                                                />
                                                {kid.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination - Inside Table */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-3xl hover:bg-gray-50">
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

                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-3xl hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Kids;