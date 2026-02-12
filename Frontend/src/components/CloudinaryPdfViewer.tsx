import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

// CSS to hide scrollbar but keep scroll functionality
const hideScrollbarStyle: React.CSSProperties = {
  scrollbarWidth: 'none', /* Firefox */
  msOverflowStyle: 'none', /* IE/Edge */
};

// We also need a small style tag for WebKit browsers
const HideScrollbarCSS = () => (
  <style>{`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `}</style>
);

// Component to render a Cloudinary PDF with sidebar thumbnails + main page view
export const CloudinaryPdfViewer = ({ url }: { url: string }) => {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [totalPagesFound, setTotalPagesFound] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const mainViewRef = useRef<HTMLDivElement>(null);

  // Convert a Cloudinary URL to a page-image URL
  const getPageImageUrl = (originalUrl: string, pageNum: number): string => {
    const uploadMatch = originalUrl.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/)([^/]+)\/(upload\/)(v\d+\/)?(.+)/);

    if (uploadMatch) {
      const [, base, resourceType, upload, version, path] = uploadMatch;
      const cleanPath = path.replace(/\.(pdf)$/i, '.png');
      return `${base}image/${upload}pg_${pageNum},w_1200,q_auto/${version || ''}${cleanPath}`;
    }

    return originalUrl;
  };

  // Generate a smaller thumbnail URL for sidebar
  const getThumbnailUrl = (originalUrl: string, pageNum: number): string => {
    const uploadMatch = originalUrl.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/)([^/]+)\/(upload\/)(v\d+\/)?(.+)/);

    if (uploadMatch) {
      const [, base, resourceType, upload, version, path] = uploadMatch;
      const cleanPath = path.replace(/\.(pdf)$/i, '.png');
      return `${base}image/${upload}pg_${pageNum},w_200,q_auto/${version || ''}${cleanPath}`;
    }

    return originalUrl;
  };

  useEffect(() => {
    const loadPages = async () => {
      setLoadingPages(true);
      const pages: string[] = [];
      let page = 1;
      const MAX_PAGES = 50;

      while (page <= MAX_PAGES) {
        const pageUrl = getPageImageUrl(url, page);

        try {
          const exists = await new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = pageUrl;
          });

          if (exists) {
            pages.push(pageUrl);
            page++;
          } else {
            break;
          }
        } catch {
          break;
        }
      }

      setPageImages(pages);
      setTotalPagesFound(pages.length);
      setLoadingPages(false);
    };

    loadPages();
  }, [url]);

  const handlePageClick = (index: number) => {
    setCurrentPage(index);
    // Scroll main view to top when switching pages
    if (mainViewRef.current) {
      mainViewRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loadingPages) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        <p className="text-sm text-gray-500">Loading document pages...</p>
      </div>
    );
  }

  if (pageImages.length === 0) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
          className="w-full border-0"
          style={{ height: '95vh', minHeight: '800px' }}
          title="Comic Document"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <HideScrollbarCSS />
      <p className="text-xs text-gray-400 font-medium">
        {totalPagesFound} page{totalPagesFound !== 1 ? 's' : ''} — Viewing page {currentPage + 1}
      </p>

      <div
        className="flex gap-0 rounded-2xl overflow-hidden"
        style={{ height: '85vh', minHeight: '700px' }}
      >
        {/* Main view: current page (LEFT) */}
        <div
          ref={mainViewRef}
          className="flex-1 overflow-auto p-4 flex items-start justify-center hide-scrollbar"
          style={hideScrollbarStyle}
        >
          <div className="w-full max-w-[1100px] rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white">
            <img
              src={pageImages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Sidebar: page thumbnails (RIGHT) */}
        <div
          className="w-[140px] md:w-[260px] flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-3 flex flex-col gap-3 hide-scrollbar"
          style={hideScrollbarStyle}
        >
          {pageImages.map((_pageUrl, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={`relative w-full rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                currentPage === index
                  ? 'border-[#7C1F2D] shadow-md ring-2 ring-[#7C1F2D]/30'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={getThumbnailUrl(url, index + 1)}
                alt={`Page ${index + 1}`}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              {/* Page number badge */}
              <span
                className={`absolute bottom-1 right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  currentPage === index
                    ? 'bg-[#7C1F2D] text-white'
                    : 'bg-black/50 text-white'
                }`}
              >
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
