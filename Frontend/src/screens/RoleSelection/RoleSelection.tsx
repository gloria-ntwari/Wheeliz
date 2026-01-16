import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

const descriptions = [
  "From quick snacks on the go to full party packs, our irresistible flavors bring joy and adventure to every moment.",
  "We craft great tasting natural snacks that inspire people to go beyond.",
  "Every bite is a burst of flavor that makes snacking feel like an adventure.",
  "From our kitchen to yours, we're all about spreading joy and flavor, one crunchy bite at a time!",
];

export const RoleSelection = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = React.useState(0);
  const [fadeClass, setFadeClass] = React.useState("opacity-100");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass("opacity-0");
      setTimeout(() => {
        setCurrentDescriptionIndex((prev) => (prev + 1) % descriptions.length);
        setFadeClass("opacity-100");
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex w-full min-h-screen">
      {/* Full Screen Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url(/wheeliz.jpeg)",
          backgroundSize: "100% 100%",
          backgroundPosition: "top center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex w-full min-h-screen">
        {/* Left Panel - Content */}
        <div className="relative hidden lg:flex lg:w-2/3">
          <div className="flex flex-col justify-between w-full p-8 lg:p-12">
            {/* Top - Logo and Back Link */}
            <div className="flex flex-col gap-6">
              <a
                href="/"
                className="text-sm text-white w-fit hover:text-gray-100 [font-family:'Barlow',Helvetica] font-normal sm:text-lg md:text-xl"
              >
                ← Back to Website
              </a>
            </div>

            {/* Bottom - Headline and Description */}
            <div className="flex flex-col max-w-lg gap-4">
              <h1 className="text-4xl leading-normal text-white font-semibold sm:text-3xl md:text-4xl lg:text-[43px] tracking-[-0.10px] max-w-screen-2xl">
                Snack Smarter. Explore Anywhere.
              </h1>
              <p className={`text-lg leading-relaxed text-white transition-opacity duration-500 ${fadeClass} [font-family:'Barlow',Helvetica]`}>
                {descriptions[currentDescriptionIndex]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start w-full px-6 lg:w-1/2 xl:w-5/12">
          <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl lg:rounded-lg lg:py-24 lg:px-14">
            <div className="flex flex-col gap-2 mb-8">
              <h2 className="[font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px]">Welcome!</h2>
              <p className="text-base text-black/70 [font-family:'Barlow',Helvetica] font-normal text-black sm:text-lg md:text-xl tracking-[0] leading-relaxed lg:text-[18px]">
                Please select your role to continue.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Admin Button */}
              <Button
                onClick={() => navigate("/login/admin")}
                className="w-full h-14 font-medium text-white bg-black rounded-lg hover:bg-black/90 [font-family:'Barlow',Helvetica] text-lg"
              >
                Admin Login
              </Button>

              {/* Kid Button */}
              <Button
                onClick={() => navigate("/login/kid")}
                className="w-full h-14 font-medium text-white bg-black rounded-lg hover:bg-black/90 [font-family:'Barlow',Helvetica] text-lg"
              >
                Kid Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
