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
  status?: string; // from submission: pending, graded
  progress?: number;
  submissionCount?: number;
  totalKids?: number;
  lastSubmissionDate?: string | null;
  hasSubmission: boolean;
}

export const KidSubmissions = (): JSX.Element => {
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
          headers: { Authorization: `Bearer ${token}` },
        });
        const comicsData = await comicsRes.json();

        if (dashboardData.status === "success" && comicsData.status === "success") {
          setKidData(dashboardData.data);
          
          // Categorize comics based on submissions
          const submissions = dashboardData.data.recentProgress || [];
          const processedComics = comicsData.data.map((comic: any) => {
            const submission = submissions.find((s: any) => s.id === comic.id);
            
            return {
              ...comic,
              hasSubmission: !!submission,
              status: submission ? submission.status : null,
              progress: submission ? submission.progress : 0,
              lastSubmissionDate: submission ? submission.submissionDate : null,
            };
          });

          setAllComics(processedComics);
        }
      } catch (error) {
        console.error("Error fetching submissions data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen font-poppins text-gray-400 italic">Reading submissions...</div>;
  }

  // Column Filtering
  const pendingComics = allComics
    .filter(c => !c.hasSubmission)
    .filter(c => c.title.toLowerCase().includes(searchQuery) || c.subtitle.toLowerCase().includes(searchQuery))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const notVerifiedComics = allComics
    .filter(c => c.hasSubmission && c.status !== 'graded')
    .filter(c => c.title.toLowerCase().includes(searchQuery) || c.subtitle.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      const dateA = a.lastSubmissionDate ? new Date(a.lastSubmissionDate).getTime() : 0;
      const dateB = b.lastSubmissionDate ? new Date(b.lastSubmissionDate).getTime() : 0;
      return dateB - dateA;
    });

  const verifiedComics = allComics
    .filter(c => c.hasSubmission && c.status === 'graded')
    .filter(c => c.title.toLowerCase().includes(searchQuery) || c.subtitle.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      const dateA = a.lastSubmissionDate ? new Date(a.lastSubmissionDate).getTime() : 0;
      const dateB = b.lastSubmissionDate ? new Date(b.lastSubmissionDate).getTime() : 0;
      return dateB - dateA;
    });

  const totalPages = Math.ceil(Math.max(pendingComics.length, notVerifiedComics.length, verifiedComics.length) / 3) || 1;
  const startIndex = (currentPage - 1) * 3;
  const endIndex = startIndex + 3;

  const currentPending = pendingComics.slice(startIndex, endIndex);
  const currentNotVerified = notVerifiedComics.slice(startIndex, endIndex);
  const currentVerified = verifiedComics.slice(startIndex, endIndex);

  const ComicCard = ({ comic }: { comic: Comic }) => {
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
          <h1 className="text-[17px] font-bold text-gray-900 mb-1">Submissions</h1>
          <p className="text-sm text-gray-500">Track and manage your comic submissions</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Pending Column */}
          <div className="bg-[#F4F4F4] p-5 rounded-[12px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 ml-1">
              <div className="w-0.5 h-7 bg-[#F59E0B]" />
              <h2 className="text-[14px] font-bold text-gray-900">Pending</h2>
            </div>
            {currentPending.length > 0 ? (
               currentPending.map(c => <ComicCard key={c.id} comic={c} />)
            ) : (
                <div className="flex items-center justify-center flex-1 py-20">
                    <p className="text-sm italic text-gray-400 text-center">No pending comics to work on</p>
                </div>
            )}
          </div>

          {/* Not Verified Column */}
          <div className="bg-[#F4F4F4] p-5 rounded-[12px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 ml-1">
              <div className="w-0.5 h-7 bg-[#EF4444]" />
              <h2 className="text-[14px] font-bold text-gray-900">Not Verified</h2>
            </div>
            {currentNotVerified.length > 0 ? (
               currentNotVerified.map(c => <ComicCard key={c.id} comic={c} />)
            ) : (
                <div className="flex items-center justify-center flex-1 py-20">
                    <p className="text-sm italic text-gray-400 text-center">No submissions awaiting verification</p>
                </div>
            )}
          </div>

          {/* Verified Column */}
          <div className="bg-[#F4F4F4] p-5 rounded-[12px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 ml-1">
              <div className="w-0.5 h-7 bg-[#10B981]" />
              <h2 className="text-[14px] font-bold text-gray-900">Verified</h2>
            </div>
            {currentVerified.length > 0 ? (
               currentVerified.map(c => <ComicCard key={c.id} comic={c} />)
            ) : (
                <div className="flex items-center justify-center flex-1 py-20">
                    <p className="text-sm italic text-gray-400 text-center">No verified submissions yet</p>
                </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 mt-12 mb-10 sm:flex-row">
          <button 
            className="flex items-center gap-2 px-6 py-2 text-sm text-gray-600 transition-colors border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage ? 'bg-[#0F172A] text-white' : 'bg-[#F4F6FB] text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            className="flex items-center gap-2 px-6 py-2 text-sm text-gray-600 transition-colors border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
