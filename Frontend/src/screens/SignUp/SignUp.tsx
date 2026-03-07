import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../../config/api";


export const SignUp = (): JSX.Element => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 Form Data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 Form Data
  const [verificationCode, setVerificationCode] = useState("");

  // Step 3 Form Data
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");


  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/kid/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setStep(2);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/kid/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setStep(3);
      } else {
        setError(data.message || "Verification failed. Please check your code.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/kid/complete-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          fatherName, 
          motherName, 
          gender, 
          dateOfBirth 
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        localStorage.setItem("kidToken", data.data.token);
        localStorage.setItem("kidData", JSON.stringify(data.data.kid));
        navigate("/kid/dashboard");
      } else {
        setError(data.message || "Failed to complete profile.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#f57e14]">
      {/* Hero-style Illustrated Background (copied from Login) */}
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
                className="text-sm text-[#68161c] w-fit hover:text-[#4d1216] [font-family:'Barlow',Helvetica] sm:text-lg md:text-xl lg:text-[17px] font-semibold"
              >
                ← Back to Website
              </a>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Card (takes ~45% on large screens, full height) */}
        <div className="flex items-stretch justify-center w-full px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:py-0 lg:w-[45%] lg:px-0">
          <div className="flex items-center justify-start w-full h-full bg-white lg:bg-white lg:shadow-none rounded-2xl lg:rounded-none">
            <div className="w-full max-w-xl px-6 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-16">
              
              {/* Step Indicators */}
              <div className="flex items-center w-full gap-3 mb-8 ml-0 lg:ml-3">
                  {[1, 2, 3].map((num) => (
                      <div key={num} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= num ? 'bg-[#68161c]' : 'bg-gray-200'}`} />
                  ))}
              </div>

              <div className="flex flex-col gap-2 mb-8 ml-0 lg:ml-3">
                <h2 className="font-semibold text-black text-2xl sm:text-3xl lg:text-[28px] [font-family:'Barlow',Helvetica]">
                  {step === 1 && "Start your journey!"}
                  {step === 2 && "Check your inbox"}
                  {step === 3 && "Tell us more"}
                </h2>
                <p className="text-base text-black/70 [font-family:'Barlow',Helvetica] font-medium sm:text-lg lg:text-[16px]">
                  {step === 1 && "Create your account to get started with Wheeliez."}
                  {step === 2 && `We've sent a code to ${email}`}
                  {step === 3 && "Help us personalize your experience"}
                </p>
              </div>

              {step === 1 && (
                <form onSubmit={handleStep1Submit} className="flex flex-col gap-6 ml-3">
                  <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                    <Label htmlFor="fullName" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                    <Label htmlFor="email" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">Email</Label>
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
                  <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                    <Label htmlFor="password" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">Password</Label>
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
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg [font-family:'Barlow',Helvetica]">
                      {error}
                    </div>
                  )}
                  <Button type="submit" disabled={isLoading} className="w-full h-12 font-medium text-white bg-[#68161c] rounded-2xl hover:bg-[#4d1216] disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Barlow',Helvetica] ml-0 lg:ml-3">
                    {isLoading ? "Please wait..." : "Continue"}
                  </Button>
                  <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600 [font-family:'Barlow',Helvetica]">
                      Already have an account? 
                      <button type="button" onClick={() => navigate("/login")} className="text-[#68161c] hover:underline font-medium ml-1">Login here</button>
                    </span>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleStep2Submit} className="flex flex-col gap-6 ml-3">
                  <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                    <Label htmlFor="otp" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">Verification Code</Label>
                    <Input
                      id="otp"
                      placeholder="6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="text-center text-2xl tracking-[0.5em] h-16 font-bold border-gray-300 rounded-lg"
                      maxLength={6}
                      required
                    />
                  </div>
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg [font-family:'Barlow',Helvetica]">
                      {error}
                    </div>
                  )}
                  <Button type="submit" disabled={isLoading} className="w-full h-12 font-medium text-white bg-[#68161c] rounded-2xl hover:bg-[#4d1216] disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Barlow',Helvetica] ml-0 lg:ml-3">
                     {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline [font-family:'Barlow',Helvetica] text-center">Change Email</button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleStep3Submit} className="flex flex-col gap-6 ml-3">
                  <div className="grid grid-cols-2 gap-4 ml-0 lg:ml-3">
                      <div className="flex flex-col gap-2">
                          <Label htmlFor="fatherName" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">Father's Name</Label>
                          <Input id="fatherName" placeholder="Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="w-full h-12 border-gray-300 rounded-lg" />
                      </div>
                      <div className="flex flex-col gap-2">
                          <Label htmlFor="motherName" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">Mother's Name</Label>
                          <Input id="motherName" placeholder="Name" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="w-full h-12 border-gray-300 rounded-lg" />
                      </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                      <Label htmlFor="gender" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">Gender</Label>
                      <select 
                          id="gender"
                          className="flex w-full h-12 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-background ring-offset-background [font-family:'Barlow',Helvetica]"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          required
                      >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                      </select>
                  </div>
                  <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                      <Label htmlFor="dob" className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">Date of Birth</Label>
                      <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required className="w-full h-12 border-gray-300 rounded-lg" />
                  </div>
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg [font-family:'Barlow',Helvetica]">
                      {error}
                    </div>
                  )}
                  <Button type="submit" disabled={isLoading} className="w-full h-12 font-medium text-white bg-[#68161c] rounded-2xl hover:bg-[#4d1216] disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Barlow',Helvetica] ml-0 lg:ml-3">
                     {isLoading ? "Saving..." : "Complete Setup"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
