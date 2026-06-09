import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../../config/api";
import { MOTION_VIDEO_SRC } from "../../config/assets";


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
