import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { KidHeader } from "../../components/KidHeader";
import { CloudinaryPdfViewer } from "../../components/CloudinaryPdfViewer";
import { ArrowLeft } from "lucide-react";
import { SubmissionDrawer } from "../../components/SubmissionDrawer";

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

  const getImageUrl = (path?: string | null) => {
    if (!path) return "/clip-path-group-16.png";
    if (path.startsWith("http")) return path;
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    const cleanPath = (path.startsWith("/") ? path : `/${path}`).replace(/\\/g, "/");
    return `${baseUrl}${cleanPath}`;
  };

  const isCloudinaryUrl = (url: string) => url.includes("res.cloudinary.com");

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
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

        // Fetch Comic Detail
        const comicRes = await fetch(`${API_BASE_URL}/admin/comics/${comicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const comicData = await comicRes.json();

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
      } catch (error) {
        console.error("Error fetching comic detail:", error);
      } finally {
        setLoading(false);
      }
    };

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
            className="px-6 py-2.5 bg-[#7C1F2D] text-white text-sm font-semibold rounded-lg hover:bg-[#6a1a26] transition-colors"
          >
            Submit Assignment
          </button>
        </div>

        {/* Cover Image */}
        <div className="w-full h-[250px] md:h-[300px] rounded-t-2xl overflow-hidden mb-8">
          <img
            src={getImageUrl(comic.image)}
            alt={comic.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h1 className="text-[18px] font-bold text-gray-900 mb-4">
          {comic.title}
        </h1>

        {/* Description */}
        <div className="text-sm text-gray-600 leading-relaxed mb-10 max-w-[900px]">
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
                    // Direct image rendering
                    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                      <img
                        src={url}
                        alt={`Comic Document ${index + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ) : isCloudinaryUrl(url) ? (
                    // Cloudinary PDF — render pages as images
                    <CloudinaryPdfViewer url={url} />
                  ) : (
                    // Non-Cloudinary PDF — use Google Docs viewer
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
            // Ideally refresh submission status or show success
            alert('Assignment submitted successfully!');
          }}
        />
      )}
    </div>
  );
};
