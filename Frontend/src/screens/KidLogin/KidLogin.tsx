import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { API_BASE_URL } from "../../config/api";


export const KidLogin = (): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsRegistration, setNeedsRegistration] = useState(false);



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
        // Clear all previous tokens
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        localStorage.removeItem("kidToken");
        localStorage.removeItem("kidData");

        // Kid exists and credentials are correct
        localStorage.setItem("kidToken", data.data.token);
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
        // Clear all previous tokens
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        localStorage.removeItem("kidToken");
        localStorage.removeItem("kidData");

        // Kid created successfully
        if (data.data.token) localStorage.setItem("kidToken", data.data.token);
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
    <section className="relative w-full min-h-screen overflow-hidden bg-[#f57e14]">
      {/* Hero-style Illustrated Background (same as Admin Login) */}
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

        {/* Decorative elements - clouds, coins, wheels, etc. */}
        {/* Logo over the top clouds */}
        <img
          className="absolute w-[180px] sm:w-[220px] lg:w-[260px] h-auto top-[66px] left-[6%] z-10"
          src="/clip-path-group-16.png"
          alt="Wheeliez Logo"
        />

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
        {/* Left Panel - Content */}
        <div className="relative hidden lg:flex lg:w-2/3">
          <div className="flex flex-col justify-between w-full p-8 lg:p-12">
            {/* Top - Logo and Back Link */}
            <div className="flex flex-col items-center gap-6 mt-10 ml-96">
              <a
                href="/"
                className="text-sm text-[#68161c] w-fit hover:text-[#4d1216] [font-family:'Barlow',Helvetica] font-normal sm:text-lg md:text-xl text-bold"
              >
                ← Back to Website
              </a>
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
                className="w-full h-12 font-medium text-white bg-[#68161c] rounded-2xl hover:bg-[#4d1216] disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Barlow',Helvetica]"
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
    </section>
  );
};
