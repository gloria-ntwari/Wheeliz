import { useEffect, useState } from "react";
import { API_BASE_URL, API_ROOT } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { KidHeader } from "../../components/KidHeader";
import { CloudinaryPdfViewer } from "../../components/CloudinaryPdfViewer";
import { ArrowLeft } from "lucide-react";
import { SubmissionDrawer } from "../../components/SubmissionDrawer";
import { toast } from "sonner";

interface ComicDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  document?: string;
  category?: string;
  submissionDeadline?: string;
  bonus?: number;
  totalMarks?: number;
  maxUploads?: number;
  createdAt: string;
}

export const KidComicDetail = (): JSX.Element => {
  const navigate = useNavigate();
  const { comicId } = useParams<{ comicId: string }>();
  const [kidData, setKidData] = useState<any>(null);
  const [comic, setComic] = useState<ComicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [isSubmissionDrawerOpen, setIsSubmissionDrawerOpen] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);

  const getImageUrl = (path?: string | null) => {
    if (!path) return "/clip-path-group-16.png";
    if (path.startsWith("http")) return path;
    const baseUrl = API_ROOT.replace(/\/+$/, "");
    const cleanPath = (path.startsWith("/") ? path : `/${path}`).replace(/\\/g, "/");
    return `${baseUrl}${cleanPath}`;
  };

  const isCloudinaryUrl = (url: string) => url.includes("res.cloudinary.com");

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

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

      // Fetch Comic Detail
      const comicRes = await fetch(`${API_BASE_URL}/admin/comics/${comicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const comicData = await comicRes.json();

      // Fetch Submissions
      const submissionsRes = await fetch(`${API_BASE_URL}/kid/submissions/${comicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const submissionsData = await submissionsRes.json();

      if (dashboardData.status === "success") {
        setKidData(dashboardData.data);
      }

      if (comicData.status === "success") {
        setComic(comicData.data);

        // Parse document paths
        if (comicData.data.document) {
          try {
            const paths = JSON.parse(comicData.data.document);
            const urls = (Array.isArray(paths) ? paths : [paths]).map((p: string) => getImageUrl(p));
            setDocumentUrls(urls);
          } catch {
            // If not JSON, treat as single path
            setDocumentUrls([getImageUrl(comicData.data.document)]);
          }
        }
      }

      if (submissionsData.status === "success") {
        setSubmissions(submissionsData.data);
      }
    } catch (error) {
      console.error("Error fetching comic detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [comicId, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!comic) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-white font-poppins">
        {kidData && <KidHeader kidData={kidData} />}
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500">Comic not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white font-poppins">
      {kidData && <KidHeader kidData={kidData} />}

      <main className="flex-1 px-4 py-8 md:px-12 lg:px-20">
        {/* Top Bar */}
        <div className="flex items-center justify-between mt-8 mb-8">
          <button
            onClick={() => navigate("/kid/comics")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back to All Comics
          </button>
          <button
            onClick={() => setIsSubmissionDrawerOpen(true)}
            disabled={submissions.length > 0}
            className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              submissions.length > 0 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-[#7C1F2D] text-white hover:bg-[#6a1a26]"
            }`}
          >
            {submissions.length > 0 ? "Already Submitted" : "Submit Assignment"}
          </button>
        </div>

        {/* Cover Image */}
        <div className="w-full h-[250px] md:h-[300px] rounded-2xl overflow-hidden mb-8">
          <img
            src={getImageUrl(comic.image)}
            alt={comic.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content (Title, Description, Documents) */}
          <div className="flex-1">
            {/* Title */}
            <h1 className="text-[24px] font-bold text-gray-900 mb-4">
              {comic.title}
            </h1>

            {/* Description */}
            <div className="text-sm text-gray-600 leading-relaxed mb-10">
              {comic.description.split('\n').map((paragraph, index) => (
                <p key={index} className={index > 0 ? 'mt-4' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Document Section */}
            {documentUrls.length > 0 && (
              <div className="mb-12">
                <div className="flex flex-col gap-8">
                  {documentUrls.map((url, index) => (
                    <div key={index} className="w-full">
                      {isImageFile(url) ? (
                        <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                          <img
                            src={url}
                            alt={`Comic Document ${index + 1}`}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      ) : isCloudinaryUrl(url) ? (
                        <CloudinaryPdfViewer url={url} />
                      ) : (
                        <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
                          <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                            className="w-full border-0"
                            style={{ height: '80vh', minHeight: '600px' }}
                            title={`Comic Document ${index + 1}`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Recent & Submitted) */}
          <div className="w-full lg:w-[350px] space-y-8">
            {/* Recent Submissions (Top 2) */}
            <div>
              <h2 className="text-[17px] font-bold text-black mb-4">Recent</h2>
              <div className="grid gap-4">
                {submissions.slice(0, 2).map((sub: any) => (
                  <div key={sub.id} className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#7C1F2D] uppercase tracking-wider">
                        {sub.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(sub.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-gray-700">Marks: {sub.marks !== null ? `${sub.marks}/${comic?.totalMarks || 100}` : 'Pending'}</span>
                       {sub.status === 'graded' && (
                           <div className="w-5 h-5 rounded-full bg-[#00C58D] flex items-center justify-center text-white text-[10px]">✓</div>
                       )}
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <p className="text-sm text-gray-500">No submissions yet.</p>
                )}
              </div>
            </div>

            {/* Submitted (All Submissions Table/List) */}
            <div>
              <h2 className="text-[17px] font-bold text-black mb-4">Submitted</h2>
              <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {submissions.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(sub.submissionDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            sub.status === 'graded' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {sub.marks !== null ? sub.marks : '-'}
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500 lowercase first-letter:uppercase">
                          No submissions recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {comic && (
        <SubmissionDrawer
          isOpen={isSubmissionDrawerOpen}
          onClose={() => setIsSubmissionDrawerOpen(false)}
          comic={{
            id: comic.id,
            title: comic.title,
            submissionDeadline: comic.submissionDeadline,
            maxUploads: comic.maxUploads || 1
          }}
          onSuccess={() => {
            fetchData();
            toast.success('Assignment submitted successfully!');
          }}
        />
      )}
    </div>
  );
};
