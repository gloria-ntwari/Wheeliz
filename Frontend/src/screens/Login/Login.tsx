import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

const descriptions = [
  "From quick snacks on the go to full party packs, our irresistible flavors bring joy and adventure to every moment.",
  "We craft great tasting natural snacks that inspire people to go beyond.",
  "Every bite is a burst of flavor that makes snacking feel like an adventure.",
  "From our kitchen to yours, we're all about spreading joy and flavor, one crunchy bite at a time!",
];

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Store token in localStorage
        localStorage.setItem("adminToken", data.data.token);
        localStorage.setItem("adminData", JSON.stringify(data.data.admin));
        // Redirect to admin dashboard
        navigate("/admin/dashboard");
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

  return (
    <div className="flex relative w-full min-h-screen">
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
      <div className="flex relative z-10 w-full min-h-screen">
        {/* Left Panel - Content */}
        <div className="hidden relative lg:flex lg:w-2/3">
          <div className="flex flex-col justify-between p-8 w-full lg:p-12">
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
            <div className="flex flex-col gap-4 max-w-lg">
              <h1 className="text-4xl leading-normal text-white  font-semibold sm:text-3xl md:text-4xl lg:text-[43px] tracking-[-0.10px] max-w-screen-2xl">
                Snack Smarter. Explore Anywhere.
              </h1>
              <p className={`text-lg leading-relaxed text-white transition-opacity duration-500 ${fadeClass} [font-family:'Barlow',Helvetica]`}>
                {descriptions[currentDescriptionIndex]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-start items-center px-6 w-full lg:w-1/2 xl:w-5/12">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl lg:rounded-lg lg:py-24 lg:px-14">

            <div className="flex flex-col gap-2 mb-8">
              <h2 className="[font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px]">Admin Login</h2>
              <p className="text-base text-black/70 [font-family:'Barlow',Helvetica] font-normal text-black sm:text-lg md:text-xl tracking-[0] leading-relaxed  lg:text-[18px]">
                Log in with your email and password to access the admin dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="font-medium text-black [font-family:'Barlow',Helvetica] sm:text-lg md:text-xl lg:text-[18px]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Input your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-lg border-gray-300"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="font-medium text-black [font-family:'Barlow',Helvetica] sm:text-lg md:text-xl lg:text-[18px]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Input your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 h-12 rounded-lg border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 text-gray-500 -translate-y-1/2 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg [font-family:'Barlow',Helvetica]">
                  {error}
                </div>
              )}

              {/* Remember Me and Forgot Password */}
              <div className="flex justify-between items-center">
                <a
                  href="/forgot-password"
                  className="text-sm text-black hover:underline [font-family:'Barlow',Helvetica]"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 font-medium text-white bg-black rounded-lg hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Barlow',Helvetica]"
              >
                {isLoading ? "Logging in..." : "Login"}
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

