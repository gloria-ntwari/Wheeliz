import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { KidHeader } from "../../components/KidHeader";

export const KidDashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [kidData, setKidData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch kid dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("kidToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/kid/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        if (data.status === "success") {
          setKidData(data.data);
        } else {
             // If error (e.g. 401), maybe redirect or show error
             if(response.status === 401) navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!kidData) {
      return <div className="flex items-center justify-center min-h-screen">Unable to load data.</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white font-poppins">
      {/* Header / Navbar */}
      <KidHeader kidData={kidData} />

      <main className="flex-1 px-6 py-6 overflow-y-auto md:px-12 lg:px-20">
        
        {/* Welcome Banner */}
        <div className="relative w-full overflow-hidden text-white rounded-[20px] bg-gradient-to-r from-[#68161C] to-[#CD535C]  md:p-12 mb-10 mt-8">
            {/* Member Badge */}
            <div className="inline-block px-6 py-2 mb-4 text-xs font-medium text-black bg-white rounded-sm backdrop-blur-sm">
                Member since 2024
            </div>

            {/* Welcome Text */}
            <h1 className="mb-6 text-[24px] font-bold">
                Welcome {kidData.kidName} 👋
            </h1>

            {/* White Card with Progress - Full Width */}
            <div className="relative z-10 mr-8 bg-white rounded-lg p-7">
                <p className="mb-3 text-sm font-medium text-black md:text-base">
                    Your current standing is {kidData.standing}
                </p>
                
                {/* Progress Bar */}
                <div className="relative w-full h-3 overflow-hidden bg-gray-100 rounded-full">
                    <div 
                        className="h-full bg-[#68161C] rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(kidData.overallPercentage || 0, 100)}%` }}
                    ></div>
                    {/* Progress Label */}
                    <div 
                        className="absolute top-0 flex items-center h-full transition-all duration-300"
                        style={{ left: `${Math.min(kidData.overallPercentage || 0, 100)}%` }}
                    >
                        <span className="text-xs font-bold text-white bg-[#68161C] px-2 py-0.5 rounded-full -ml-8">
                            {(kidData.overallPercentage || 0).toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Boy Image Illustration */}
            <div className="absolute bottom-0 z-10 flex items-end -translate-y-1/2 right-6 md:right-12 lg:mr-32 top-1/4">
                <img src="/Frame.png" alt="Boy studying" className="object-contain h-32 md:h-40" />
            </div>
        </div>


        {/* Recent Comics Progress */}
        <h2 className="mb-6 text-[17px] font-bold text-black">Recent Marks From Submissions</h2>

        <div className="grid gap-4">
            {kidData.recentProgress.map((comic: any) => (
                <div key={comic.id} className="flex flex-col items-center gap-4 p-4 bg-white border border-gray-100 shadow-sm md:flex-row rounded-xl">
                    <div className="w-16 h-16 overflow-hidden bg-gray-200 rounded-lg shrink-0">
                         {/* Comic Cover */}
                         <img 
                             src={comic.cover ? (comic.cover.startsWith('http') ? comic.cover : `${API_ROOT}${comic.cover.startsWith('/') ? '' : '/'}${comic.cover}`) : "/group.png"} 
                            alt={comic.title} 
                            className="object-cover w-full h-full" 
                         />
                    </div>
                    
                    <div className="flex-1 w-full ml-4">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-900">{comic.title}</h3>
                            <div className="flex items-center gap-2">
                                {comic.status === 'graded' ? (
                                    <>
                                        <span className="text-sm font-bold text-gray-700">{comic.progress}%</span>
                                        <div className="w-5 h-5 rounded-full bg-[#00C58D] flex items-center justify-center text-white text-[10px]">✓</div>
                                    </>
                                ) : (
                                    <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                                        Pending
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* <p className="mb-2 text-sm text-gray-500">Change of work</p> */} {/* Subtitle placeholder - removed as causing clutter/confusion with wrong data */}
                        
                        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                             <div 
                                className="h-full bg-[#00C58D] rounded-full transition-all duration-300" 
                                style={{ width: comic.status === 'graded' ? `${comic.progress}%` : '0%' }}
                             ></div>
                        </div>
                    </div>
                </div>
            ))}

            {kidData.recentProgress.length === 0 && (
                <p className="text-gray-500">No comics started yet.</p>
            )}
        </div>

      </main>
    </div>
  );
};
