import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { API_BASE_URL } from "../../config/api";

const descriptions = [
  "From quick snacks on the go to full party packs, our irresistible flavors bring joy and adventure to every moment.",
  "We craft great tasting natural snacks that inspire people to go beyond.",
  "Every bite is a burst of flavor that makes snacking feel like an adventure.",
  "From our kitchen to yours, we're all about spreading joy and flavor, one crunchy bite at a time!",
];

export const KidLogin = (): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass("opacity-0");
      setTimeout(() => {
        setCurrentDescriptionIndex((prev) => (prev + 1) % descriptions.length);
        setFadeClass("opacity-100");
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!parentPhone || !dateOfBirth) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/kid/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parentPhone, dateOfBirth }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Kid exists and credentials are correct
        localStorage.setItem("kidData", JSON.stringify(data.data.kid));
        // Redirect to kid dashboard (you can create this later)
        navigate("/kid/dashboard");
      } else if (data.message === "This phone number is not registered") {
        // Kid doesn't exist, need to register
        setNeedsRegistration(true);
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name || !parentPhone || !dateOfBirth) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/kid/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, parentPhone, dateOfBirth, confirm: true }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Kid created successfully
        localStorage.setItem("kidData", JSON.stringify(data.data.kid));
        // Redirect to kid dashboard
        navigate("/kid/dashboard");
      } else {
        setError(data.message || "Failed to create profile. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
              <h2 className="[font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px]">
                {needsRegistration ? "Create Your Profile" : "Welcome Back!"}
              </h2>
              <p className="text-base text-black/70 [font-family:'Barlow',Helvetica] font-normal text-black sm:text-lg md:text-xl tracking-[0] leading-relaxed lg:text-[18px]">
                {needsRegistration
                  ? "Let's get you started! Fill in your details below."
                  : "Log in with your phone number and date of birth."}
              </p>
            </div>

            <form onSubmit={needsRegistration ? handleCreate : handleCheck} className="flex flex-col gap-6">
              {/* Name Field - Only shown when registering */}
              {needsRegistration && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="font-medium text-black [font-family:'Barlow',Helvetica] sm:text-lg md:text-xl lg:text-[18px]">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Input your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 border-gray-300 rounded-lg"
                    required={needsRegistration}
                  />
                </div>
              )}

              {/* Phone Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="font-medium text-black [font-family:'Barlow',Helvetica] sm:text-lg md:text-xl lg:text-[18px]">
                  Parent Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Input parent phone number"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="h-12 border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Date of Birth Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="dob" className="font-medium text-black [font-family:'Barlow',Helvetica] sm:text-lg md:text-xl lg:text-[18px]">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-12 border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg [font-family:'Barlow',Helvetica]">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 font-medium text-white bg-black rounded-lg hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Barlow',Helvetica]"
              >
                {isLoading
                  ? needsRegistration
                    ? "Creating..."
                    : "Checking..."
                  : needsRegistration
                  ? "Create Profile"
                  : "Login"}
              </Button>

              {/* Back to Role Selection */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-gray-600 hover:underline [font-family:'Barlow',Helvetica]"
                >
                  ← Back to Role Selection
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
