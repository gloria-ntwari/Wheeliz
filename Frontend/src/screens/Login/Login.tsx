import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../../config/api";


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
      {/* Hero-style Illustrated Background (copied from FeaturedProductsSection) */}
      <div className="absolute inset-0 w-full h-full">
        {/* Base orange vectors */}
        <img
          className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%]"
          alt="Vector"
          src="/vector-1.svg"
        />

        <img
          className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%]"
          alt="Vector overlay"
          src="/vector-1.svg"
        />

        {/* Main illustration scene */}
        <img
          className="absolute top-0 left-0 w-full h-full"
          alt="Group"
          src="/group.png"
        />

        {/* Ground / hill at the bottom */}
        <img
          className="absolute w-full h-[37.13%] top-[62.86%] left-0"
          alt="Clip path group"
          src="/clip-path-group-1.png"
        />

        {/* Animated car entering the scene on large screens */}
        <img
          className="absolute h-[35.13%] top-[65%] left-[calc(50%-864px)] w-[562px] hidden lg:block animate-car-entrance img-hq"
          alt="Moving Car"
          src="/car_group1.svg"
          loading="eager"
          decoding="sync"
        />
        <img
          className="absolute w-[180px] sm:w-[220px] lg:w-[260px] h-auto top-[66px] left-[6%] z-10"
          src="/clip-path-group-16.png"
          alt="Wheeliez Logo"
        />

        {/* Decorative elements - clouds, coins, wheels, etc. */}
        <img
          className="absolute w-[6.60%] h-[2.05%] top-[30px] left-[10.76%] -rotate-12"
          alt="Clip path group"
          src="/clip-path-group-3.png"
        />

        <img
          className="absolute w-[4.86%] h-0 top-0 left-[14.24%]"
          alt="Clip path group"
        />

        <img
          className="absolute w-0 h-0 top-[calc(7.51%+30px)] left-[13.22%]"
          alt="Vector"
          src="/vector-5.svg"
        />

        <img
          className="absolute w-0 h-0 top-[calc(8.87%+30px)] left-[10.58%]"
          alt="Vector"
          src="/vector-2.svg"
        />

        <img
          className="absolute w-0 h-0 top-[calc(10.18%+30px)] left-[12.84%]"
          alt="Vector"
          src="/vector-4.svg"
        />

        <img
          className="absolute w-[9.80%] h-[6.21%] top-[calc(8.97%+30px)] left-[2.04%]"
          alt="Vector"
          src="/vector-11.svg"
        />

        <img
          className="absolute w-[9.8%] h-[6.4%] top-[calc(9.53%+25px)] left-8"
          alt="Clip path group"
          src="/clip-path-group-4.png"
        />

        <img
          className="absolute w-0 h-0 top-[calc(9.67%+30px)] left-[6.13%]"
          alt="Vector"
          src="/vector-10.svg"
        />

        <img
          className="absolute w-0 h-0 top-[calc(11.95%+30px)] left-[10.09%]"
          alt="Vector"
          src="/vector-12.svg"
        />

        <img
          className="absolute w-0 h-0 top-[calc(13.66%+30px)] left-[9.42%]"
          alt="Vector"
          src="/vector-13.svg"
        />

        <img
          className="absolute w-0 h-0 top-[calc(14.08%+30px)] left-[5.85%]"
          alt="Vector"
          src="/vector-13.svg"
        />

        <img
          className="absolute w-0 h-0 top-[calc(12.83%+30px)] left-[2.98%]"
          alt="Vector"
          src="/vector-8.svg"
        />

        {/* Wheels near logo area */}
        <img
          className="absolute w-[7.15%] h-[1.80%] top-[18.85%] left-[12.15%] -rotate-3"
          alt="Clip path group"
          src="/clip-path-group-5.png"
        />

        <img
          className="absolute w-[7.22%] h-[1.2%] top-[16.95%] left-[16.68%] -rotate-14"
          alt="Clip path group"
          src="/clip-path-group-6.png"
        />

        <img
          className="absolute w-[10.21%] h-[6.56%] top-0 left-0"
          alt="Vector"
          src="/vector-6.svg"
        />

        <img
          className="absolute w-[10.32%] h-[6.8%] top-0 left-0"
          alt="Clip path group"
          src="/clip-path-group-7.png"
        />

        <img
          className="absolute w-0 h-[2.81%] top-0 left-[3.75%]"
          alt="Clip path group"
          src="/clip-path-group-8.png"
        />

        <img
          className="absolute w-0 h-0 top-[3.92%] left-[6.99%]"
          alt="Vector"
          src="/vector-7.svg"
        />

        <img
          className="absolute w-0 h-0 top-[4.99%] left-[9.68%]"
          alt="Vector"
          src="/vector-15.svg"
        />

        <img
          className="absolute w-0 h-0 top-[6.38%] left-[7.37%]"
          alt="Vector"
          src="/vector-9.svg"
        />

        <img
          className="absolute w-0 h-0 top-[6.91%] left-[4.19%]"
          alt="Vector"
          src="/vector.svg"
        />

        <img
          className="absolute w-[13.44%] h-[28.30%] top-[15.56%] left-[13.64%]"
          alt="Clip path group"
          src="/clip-path-group-9.png"
        />

        {/* Floating wheels */}
        <img
          className="absolute w-[6.46%] h-[13.43%] top-[28.73%] left-[71.90%]"
          alt="Clip path group"
          src="/clip-path-group-10.png"
        />

        <img
          className="absolute w-[6.46%] h-[13.43%] top-[67.78%] left-[16.41%]"
          alt="Clip path group"
          src="/clip-path-group-11.png"
        />

        <img
          className="absolute w-[6.46%] h-[13.43%] top-[26.94%] left-[2.41%]"
          alt="Clip path group"
          src="/clip-path-group-12.png"
        />

        <img
          className="absolute w-[6.09%] h-[12.78%] top-[64.20%] left-[82.34%]"
          alt="Clip path group"
          src="/clip-path-group-13.png"
        />

        <img
          className="absolute w-[6.09%] h-[12.72%] top-[61.73%] left-[3.27%]"
          alt="Clip path group"
          src="/clip-path-group-14.png"
        />
      </div>

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

