import { useEffect, useState } from "react";
import { API_BASE_URL, API_ROOT } from "../../config/api";
import { useNavigate, useLocation } from "react-router-dom";
import { KidHeader } from "../../components/KidHeader";
import { 
  FileText, 
  Download, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";

interface Comic {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  document?: string;
  submissionDeadline?: string;
  createdAt: string;
  status?: 'recent' | 'submitted' | 'not_submitted';
  progress?: number;
  submissionCount?: number;
  totalKids?: number;
  lastSubmissionDate?: string | null;
}

export const KidComics = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  
  const [kidData, setKidData] = useState<any>(null);
  const [allComics, setAllComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const getImageUrl = (path?: string | null) => {
    if (!path) return "/clip-path-group-16.png";
    if (path.startsWith("http")) return path;
    // Use API_ROOT for relative paths
    const cleanPath = (path.startsWith("/") ? path : `/${path}`).replace(/\\/g, "/");
    return `${API_ROOT}${cleanPath}`;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("kidToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch Kid Profile Data
        const dashboardRes = await fetch(`${API_BASE_URL}/kid/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dashboardData = await dashboardRes.json();
        
        // Fetch All Comics
        const comicsRes = await fetch(`${API_BASE_URL}/admin/comics`, {
          headers: { Authorization: `Bearer ${token}` }, // Uses verifyAuth in backend
        });
        const comicsData = await comicsRes.json();

        if (dashboardData.status === "success" && comicsData.status === "success") {
          setKidData(dashboardData.data);
          
          // Categorize comics based on submissions
          const submissions = dashboardData.data.recentProgress || [];
          const processedComics = comicsData.data.map((comic: any) => {
            const submission = submissions.find((s: any) => s.id === comic.id);
            let status: 'recent' | 'submitted' | 'not_submitted' = 'not_submitted';
            let progress = 0;

            if (submission) {
              // Any comic with a submission is marked as 'submitted'
              status = 'submitted';
              progress = submission.progress || 0;
            }

            return {
              ...comic,
              status,
              progress,
              lastSubmissionDate: submission ? submission.submissionDate : null,
            };
          });

          setAllComics(processedComics);
        }
      } catch (error) {
        console.error("Error fetching comics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // location.search removed from dep array to avoid re-fetching, filtering happens on render

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

    const submittedComics = allComics
    .filter(c => c.status === 'submitted')
    .filter(c => c.title.toLowerCase().includes(searchQuery) || c.subtitle.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      const dateA = a.lastSubmissionDate ? new Date(a.lastSubmissionDate).getTime() : 0;
      const dateB = b.lastSubmissionDate ? new Date(b.lastSubmissionDate).getTime() : 0;
      return dateB - dateA;
    });

  const recentComics = [...allComics]
    .filter(c => c.title.toLowerCase().includes(searchQuery) || c.subtitle.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);
  const notSubmittedComics = allComics
    .filter(c => c.status === 'not_submitted')
    .filter(c => c.title.toLowerCase().includes(searchQuery) || c.subtitle.toLowerCase().includes(searchQuery));

  const startIndex = (currentPage - 1) * 3;
  const endIndex = startIndex + 3;

  const currentRecent = recentComics.slice(startIndex, endIndex);
  const currentSubmitted = submittedComics.slice(startIndex, endIndex);
  const currentNotSubmitted = notSubmittedComics.slice(startIndex, endIndex);

  // Calculate total pages based on the largest category
  const totalPages = Math.ceil(Math.max(recentComics.length, submittedComics.length, notSubmittedComics.length) / 3) || 1;

  const ComicCard = ({ comic}: { comic: Comic, borderColor: string }) => {
    const submissionPercentage = comic.totalKids && comic.totalKids > 0 
      ? Math.round((comic.submissionCount || 0) / comic.totalKids * 100) 
      : 0;

    return (
      <div 
        className="flex flex-col mb-6 overflow-hidden transition-shadow bg-white border shadow-sm cursor-pointer rounded-2xl border-gray-100/50 hover:shadow-md"
        onClick={() => navigate(`/kid/comics/${comic.id}`)}
      >
          <div className="w-full h-[175px] overflow-hidden">
            <img 
              src={getImageUrl(comic.image)} 
              alt={comic.title} 
              className="object-cover w-full h-full"
            />
          </div>
          
        <div className="p-5">
          <h3 className="text-[15px] font-bold text-gray-900 mb-1 leading-tight">{comic.title}</h3>
          <p className="text-[12px] text-gray-500 mb-4 flex items-center gap-1">
            {comic.subtitle} • <span className="shrink-0">{getTimeAgo(comic.createdAt)}</span>
          </p>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
            <div 
              className="h-full bg-[#FFD66B] rounded-full transition-all duration-300" 
              style={{ width: `${submissionPercentage}%` }} 
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] text-gray-500 font-medium">Number of kids who submitted</span>
            <span className="text-[12px] font-bold text-gray-900">{comic.submissionCount || 0}</span>
          </div>

          {/* File Section */}
          <div className="flex items-center justify-between p-2 bg-white border rounded-xl border-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-red-50">
                <FileText className="w-4 h-4 text-[#EF4444]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-900 truncate max-w-[120px]">
                   Comic Document
                </span>
                <span className="text-[9px] text-gray-400">PDF/Page 1</span>
              </div>
            </div>
            <button className="p-2 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
              <Download className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white font-poppins">
      <KidHeader kidData={kidData} />

      <main className="flex-1 px-4 py-8 md:px-12 lg:px-20">
        <div className="mb-8">
          <h1 className="text-[17px] font-bold text-gray-900 mb-1">Comics</h1>
          <p className="text-sm text-gray-500">You have {allComics.length} comics in total</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Recent Column */}
          <div className="bg-[#F4F4F4] p-5 rounded-[12px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 ml-1">
              <div className="w-0.5 h-7 bg-[#F59E0B]" />
              <h2 className="text-[14px] font-bold text-gray-900">Recent</h2>
            </div>
            {currentRecent.length > 0 ? (
               currentRecent.map(c => <ComicCard key={c.id} comic={c} borderColor="bg-[#F59E0B]" />)
            ) : (
                <div className="flex items-center justify-center flex-1 py-20">
                    <p className="text-sm italic text-gray-400">No recent comics</p>
                </div>
            )}
          </div>

          {/* Submitted Column */}
          <div className="bg-[#F4F4F4] p-5 rounded-[12px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 ml-1">
              <div className="w-0.5 h-7 bg-[#EF4444]" />
              <h2 className="text-[14px] font-bold text-gray-900">Submitted</h2>
            </div>
            {currentSubmitted.length > 0 ? (
               currentSubmitted.map(c => <ComicCard key={c.id} comic={c} borderColor="bg-[#EF4444]" />)
            ) : (
                <div className="flex items-center justify-center flex-1 py-20">
                    <p className="text-sm italic text-gray-400">No submitted comics</p>
                </div>
            )}
          </div>

          {/* Not Submitted Column */}
          <div className="bg-[#F4F4F4] p-5 rounded-[12px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 ml-1">
              <div className="w-0.5 h-7 bg-[#10B981]" />
              <h2 className="text-[14px] font-bold text-gray-900">Not Submitted</h2>
            </div>
            {currentNotSubmitted.length > 0 ? (
               currentNotSubmitted.map(c => <ComicCard key={c.id} comic={c} borderColor="bg-[#10B981]" />)
            ) : (
                <div className="flex items-center justify-center flex-1 py-20">
                    <p className="text-sm italic text-gray-400">No pending comics</p>
                </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 mt-12 mb-10 sm:flex-row">
          <button 
            className="flex items-center gap-2 px-6 py-2 text-sm text-gray-600 transition-colors border border-gray-200 rounded-full hover:bg-gray-50"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page, i) => {
               // Logic to show limited page numbers with ellipsis if needed
               // For now just show all if small, or simplified range
               return (
                <button
                  key={i}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage ? 'bg-[#0F172A] text-white' : 'bg-[#F4F6FB] text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
               );
            })}
          </div>

          <button 
            className="flex items-center gap-2 px-6 py-2 text-sm text-gray-600 transition-colors border border-gray-200 rounded-full hover:bg-gray-50"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
