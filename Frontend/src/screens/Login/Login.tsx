import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import { MOTION_VIDEO_SRC } from "../../config/assets";


export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Store token and user data
        const { token, user } = data.data;
        
        // Clear all possible previous tokens to avoid confusion
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        localStorage.removeItem("kidToken");
        localStorage.removeItem("kidData");

        // Redirect and store based on role
        if (user.role === "admin") {
          localStorage.setItem("adminToken", token);
          localStorage.setItem("adminData", JSON.stringify(user));
          navigate("/admin/dashboard");
        } else if (user.role === "kid") {
          localStorage.setItem("kidToken", token);
          localStorage.setItem("kidData", JSON.stringify(user));
          navigate("/kid/dashboard");
        } else {
          setError("Authorized but unknown role. Contact support.");
        }
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
    <section className="relative w-full min-h-screen overflow-hidden bg-[#f57e14]">
      {/* Video background - full on mobile, left panel on desktop */}
      <div className="absolute inset-0 w-full h-full lg:w-[60%]">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={MOTION_VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
      </div>

      <img
        className="absolute w-[180px] sm:w-[220px] lg:w-[260px] h-auto top-[66px] left-[6%] z-10"
        src="/clip-path-group-16.png"
        alt="Wheeliez Logo"
      />

      {/* Content Container */}
      <div className="relative z-10 flex w-full min-h-screen">
        {/* Left Panel - Illustration (takes ~60% on large screens) */}
        <div className="relative hidden lg:flex lg:w-[60%]">
          <div className="flex flex-col justify-between w-full p-8 lg:p-12">
            {/* Top - Back to Website Link */}
            <div className="flex flex-col items-start gap-6 mt-10 ml-[500px]">
              <a
                href="/"
                className="text-sm text-[#68161c] w-fit hover:text-[#4d1216] [font-family:'Barlow',Helvetica] sm:text-lg md:text-xl lg:text-[17px] font-semibold "
              >
                ← Back to Website
              </a>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Card (takes ~40% on large screens, full height) */}
        <div className="flex items-stretch justify-center w-full px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:py-0 lg:w-[45%] lg:px-0">
          <div className="flex items-center justify-start w-full h-full bg-white lg:bg-white lg:shadow-none rounded-2xl lg:rounded-none">
            <div className="w-full max-w-xl px-6 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-16">

              <div className="flex flex-col gap-2 mb-8">
                <h2 className="font-semibold text-black text-2xl sm:text-3xl lg:text-[28px] [font-family:'Barlow',Helvetica]">Welcome Back!</h2>
                <p className="text-base text-black/70 [font-family:'Barlow',Helvetica] font-medium sm:text-lg lg:text-[16px]">
                  Log in with your email and password to access the admin dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 ml-3">
                {/* Email Field */}
                <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                  <Label htmlFor="email" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 border-gray-300 rounded-lg"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                  <Label htmlFor="password" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">
                    Password
                  </Label>
                  <div className="relative w-full">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pr-10 border-gray-300 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
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
                  <div className="py-3 px-4 ml-0 lg:ml-3 w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg [font-family:'Barlow',Helvetica]">
                    {error}
                  </div>
                )}

                {/* Forgot Password */}
                <div className="flex items-center justify-end">
                  <a
                    href="/forgot-password"
                    className="text-sm text-black hover:underline [font-family:'Barlow',Helvetica] mr-0 lg:mr-2"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 font-medium text-white bg-[#68161c] rounded-2xl hover:bg-[#4d1216] disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Barlow',Helvetica] ml-0 lg:ml-3"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                {/* Don't have an account */}
                {/* <div className="mt-4 text-center">
                  <span className="text-sm text-gray-600 [font-family:'Barlow',Helvetica]">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className="text-[#68161c] hover:underline font-medium"
                    >
                      Sign up here
                    </button>
                  </span>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

