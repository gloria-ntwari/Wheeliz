import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, Grid3X3, Search, Bell, ChevronDown, ChevronRight, Menu, FolderOpen, Puzzle } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface DocumentItem {
    id: string;
    title: string;
    type: string;
    date: string;
}

const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Kids", path: "/admin/kids" },
    { icon: Grid3X3, label: "Submissions", path: "/admin/submissions" },
];

export const Comics: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [comicsExpanded, setComicsExpanded] = useState(true);
    const [showChallengePage, setShowChallengePage] = useState(false);
    const [showAddDocument, setShowAddDocument] = useState(false);

    const adminData = JSON.parse(localStorage.getItem("adminData") || '{"name": "Ange Nadette"}');

    const documents: DocumentItem[] = [
        { id: '1', title: 'week7.png', type: 'word', date: '02-09' },
        { id: '2', title: 'week7.png', type: 'pdf', date: '02-09' },
        { id: '3', title: 'week7.png', type: 'pdf', date: '02-09' },
        { id: '4', title: 'week7.png', type: 'pdf', date: '02-09' },
        { id: '5', title: 'week7.png', type: 'word', date: '02-09' },
        { id: '6', title: 'week7.png', type: 'pdf', date: '02-09' },
        { id: '7', title: 'week7.png', type: 'pdf', date: '02-09' },
        { id: '8', title: 'week7.png', type: 'pdf', date: '02-09' },
    ];

    const getFileIcon = (type: string) => {
        if (type === 'word') return '📘';
        if (type === 'pdf') return '📕';
        return '📄';
    };

    return (
        <div className="flex w-full min-h-screen bg-[#1f1f1f] font-barlow">
            <aside className={`${sidebarOpen ? "w-72" : "w-0"} transition-all duration-300 bg-[#1f1f1f] flex flex-col overflow-hidden shrink-0`}>
                <div className="flex items-center justify-center p-8">
                    <img src="/clip-path-group-16.png" alt="Wheeliez" className="object-contain w-auto h-20" />
                </div>

                <nav className="flex-1 px-5 mt-4 space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-white hover:bg-[#2a2a2a]"
                        >
                            <item.icon className="w-5 h-5 text-white" />
                            <span>{item.label}</span>
                        </button>
                    ))}

                    <div>
                        <button
                            onClick={() => setComicsExpanded(!comicsExpanded)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-white hover:bg-[#2a2a2a]"
                        >
                            <div className="flex items-center gap-3">
                                <Puzzle className="w-5 h-5 text-white" />
                                <span>Comics</span>
                            </div>
                            {comicsExpanded ? (
                                <ChevronDown className="w-5 h-5 text-white" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-white" />
                            )}
                        </button>

                        {comicsExpanded && (
                            <div className="ml-8 mt-2">
                                <button
                                    onClick={() => setShowChallengePage(true)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${showChallengePage ? "bg-white text-black" : "text-white hover:bg-[#2a2a2a]"
                                        }`}
                                >
                                    <FolderOpen className={`w-5 h-5 ${showChallengePage ? "text-black" : "text-white"}`} />
                                    <span>Challenge</span>
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            <div className="flex flex-col flex-1 min-w-0 bg-white rounded-tl-3xl">
                <header className="flex items-center px-8 py-4 border-b bg-white border-border rounded-tl-3xl border-[#1f2937] mt-7">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 transition-colors rounded-lg hover:bg-[#1f2937]">
                            <Menu className="w-5 h-5 text-foreground" />
                        </button>
                        <h1 className="text-xl font-semibold text-black text-foreground">
                            {showAddDocument ? 'Dashboard' : showChallengePage ? 'Challenge' : 'Comics'}
                        </h1>
                    </div>

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
                        <button className="relative p-2 transition-colors rounded-full hover:bg-[#1f2937]">
                            <Bell className="w-5 h-5 text-black" />
                            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
                        </button>

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

                <main className="flex-1 p-8 bg-white overflow-y-auto">
                    {showAddDocument ? (
                        <AddDocumentForm onBack={() => setShowAddDocument(false)} />
                    ) : showChallengePage ? (
                        <div>
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
                                    <Button
                                        onClick={() => setShowAddDocument(true)}
                                        className="bg-[#8B1A1A] hover:bg-[#6B1515] text-white px-6 py-2 rounded-full"
                                    >
                                        + Add Document
                                    </Button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {documents.slice(0, 4).map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="text-4xl mb-2">{getFileIcon(doc.type)}</div>
                                                <p className="text-sm font-medium text-center text-gray-900">{doc.title}</p>
                                                <p className="text-xs text-gray-500">{doc.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-4 text-gray-900">Files</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="text-4xl mb-2">{getFileIcon(doc.type)}</div>
                                                <p className="text-sm font-medium text-center text-gray-900">{doc.title}</p>
                                                <p className="text-xs text-gray-500">{doc.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Select Challenge from the sidebar to view documents</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

interface AddDocumentFormProps {
    onBack: () => void;
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ onBack }) => {
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [document, setDocument] = useState('');
    const [description, setDescription] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handlePublish = () => {
        console.log({ title, document, description, coverImage });
        onBack();
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2">
                <span>←</span> Back
            </button>

            <div className="max-w-2xl">
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-900">Cover Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="cover-upload"
                        />
                        <label htmlFor="cover-upload" className="cursor-pointer">
                            <div className="text-gray-400 mb-2">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">
                                {coverImage ? coverImage.name : 'upload your image'}
                            </p>
                        </label>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">Title</label>
                        <input
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">Document</label>
                        <input
                            type="text"
                            placeholder="Enter title"
                            value={document}
                            onChange={(e) => setDocument(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-900">Description</label>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none bg-white text-gray-900"
                    />
                </div>

                <Button
                    onClick={handlePublish}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-3 rounded-lg text-lg font-medium"
                >
                    Publish
                </Button>
            </div>
        </div>
    );
};

export default Comics;
