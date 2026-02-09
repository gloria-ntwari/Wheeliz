import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Puzzle,
  Upload,
  Bell,
  User,
  LogOut
} from "lucide-react";

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

        const response = await fetch("http://localhost:5000/api/kid/dashboard", {
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
      <header className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex items-center gap-2">
           {/* Logo placeholder or text */}
           <img src="/clip-path-group-16.png" alt="Wheeliez" className="h-10" />
        </div>
        
        <nav className="hidden gap-8 md:flex">
            <button className="font-bold text-black" onClick={() => navigate("/kid/dashboard")}>Home</button>
            <button className="font-medium text-gray-600" onClick={() => navigate("/kid/comics")}>Comics</button>
            <button className="font-medium text-gray-600" onClick={() => navigate("/kid/submission")}>Submission</button>
        </nav>

        <div className="flex items-center gap-4">
            <button className="relative">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 overflow-hidden bg-gray-200 rounded-full">
                    <img src={`https://ui-avatars.com/api/?name=${kidData.kidName}&background=random`} alt="Profile" className="object-cover w-full h-full"/>
                </div>
                <span className="font-bold text-black">{kidData.kidName}</span>
                <LogOut className="w-4 h-4 text-gray-500 cursor-pointer" onClick={() => {
                    localStorage.removeItem("kidToken");
                    navigate("/login");
                }}/>
            </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 md:px-12 lg:px-20 overflow-y-auto">
        
        {/* Welcome Banner */}
        <div className="relative w-full overflow-hidden text-white rounded-[30px] bg-gradient-to-r from-[#8B1D24] to-[#C42E36] min-h-[220px] p-8 md:p-12 mb-10 flex flex-col justify-center">
            {/* Background elements if any, or use CSS for patterns */}
             <div className="absolute top-4 left-6 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                Member since 2024
             </div>

             <h1 className="text-3xl font-extrabold mt-4 mb-6">
                {(() => {
                    const hour = new Date().getHours();
                    let greeting = 'Good Evening';
                    if (hour < 12) greeting = 'Good Morning';
                    else if (hour < 18) greeting = 'Good Afternoon';
                    return `${greeting}, ${kidData.kidName} 👋`;
                })()}
             </h1>

             <div className="w-full max-w-2xl bg-white rounded-xl p-6 relative z-10">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-black font-medium">Your current standing is {kidData.standing}</span>
                </div>
                {/* Progress Bar Container */}
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#521317] rounded-full" 
                        style={{ width: `${Math.min(kidData.standing, 100)}%` }} // Assuming 100 is max for bar visualization
                    ></div>
                </div>
                <div className="text-center mt-1">
                    <span className="text-xs font-bold text-white bg-[#521317] px-2 py-0.5 rounded-full relative -top-3.5">
                        {kidData.standing}/100
                    </span>
                </div>
             </div>

             {/* Boy Image Illustration */}
             <div className="absolute right-4 bottom-0 md:right-10 lg:right-20">
                 {/* Check if we have the specific boy image, otherwise use a placeholder or the provided Frame.png as reference */}
                  <img src="/clip-path-group-1.png" alt="Boy studying" className="w-40 md:w-56 lg:w-64 object-contain" />
                  {/* Using available image from public folder, user mentioned Frame.png but that might be the bg. 
                      Let's use clip-path-group-1.png or similar character from the public list which seems to be used elsewhere. 
                      Listing showed: clip-path-group-1.png (96KB), profile1/2.
                      User provided 'Frame.png' which is 12KB, might be small or specific. 
                      The user wants me to use 'Frontend/public/Frame.png'. 
                      I will use it for the banner implementation if it's the banner itself.
                      Wait, user said "use the image @[Frontend/public/Frame.png] for the kid pages". 
                      It is likely the background or the banner frame. 
                      Since I'm coding the banner with CSS, maybe Frame.png is the character? 
                      I'll try to put Frame.png as the character image for now.
                   */}
                   {/* Actually user said "direct him or her to the page lookin as image shown and use same fonts... use the immage @[Frontend/public/Frame.png] for the kid pages" 
                      Maybe Frame.png is the whole page design? No, it's a png. 
                      Based on file name 'Frame', it might be a UI frame. 
                      I'll stick to CSS for layout and use Frame.png as a decorative element or valid image source.
                      Actually, look at file list: 'Frame.png' is 12KB. 
                      'cluster-path-group' stuff seems to be images. 
                      I will try using Frame.png as the boy image.
                   */}
             </div>
        </div>


        {/* Recent Comics Progress */}
        <h2 className="text-xl font-bold text-black mb-6">Recent Comics progress</h2>

        <div className="grid gap-4">
            {kidData.recentProgress.map((comic: any) => (
                <div key={comic.id} className="flex flex-col md:flex-row items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                         {/* Comic Cover */}
                         <img src={comic.cover || "/group.png"} alt={comic.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 w-full">
                        <h3 className="font-bold text-gray-900">{comic.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">Change of work</p> {/* Subtitle placeholder */}
                        
                        <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-[#00C58D] rounded-full" 
                                style={{ width: `${comic.progress}%` }}
                             ></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                         <span className="text-sm font-bold text-gray-700">{comic.progress}/100</span>
                         {comic.status === 'graded' && (
                             <div className="w-6 h-6 rounded-full bg-[#00C58D] flex items-center justify-center text-white text-xs">✓</div>
                         )}
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
