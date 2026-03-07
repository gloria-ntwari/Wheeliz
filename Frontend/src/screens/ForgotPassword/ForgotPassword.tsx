import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

export const ForgotPassword = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/kid/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (data.status === "success" || response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#f57e14]">
      {/* Background (identical to Login) */}
      <div className="absolute inset-0 w-full h-full">
        {/* Base orange vectors */}
        <img className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%]" alt="Vector" src="/vector-1.svg" />
        <img className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%]" alt="Vector overlay" src="/vector-1.svg" />

        {/* Main illustration scene */}
        <img className="absolute top-0 left-0 w-full h-full" alt="Group" src="/group.png" />

        {/* Ground / hill at the bottom */}
        <img className="absolute w-full h-[37.13%] top-[62.86%] left-0" alt="Clip path group" src="/clip-path-group-1.png" />

        {/* Animated car entering the scene on large screens */}
        <img className="absolute h-[35.13%] top-[65%] left-[calc(50%-864px)] w-[562px] hidden lg:block animate-car-entrance img-hq" alt="Moving Car" src="/car_group1.svg" loading="eager" decoding="sync" />
        <img className="absolute w-[180px] sm:w-[220px] lg:w-[260px] h-auto top-[66px] left-[6%] z-10" src="/clip-path-group-16.png" alt="Wheeliez Logo" />

        {/* Decorative elements - clouds, coins, wheels, etc. */}
        <img className="absolute w-[6.60%] h-[2.05%] top-[30px] left-[10.76%] -rotate-12" alt="Clip path group" src="/clip-path-group-3.png" />
        <img className="absolute w-[4.86%] h-0 top-0 left-[14.24%]" alt="Clip path group" />
        <img className="absolute w-0 h-0 top-[calc(7.51%+30px)] left-[13.22%]" alt="Vector" src="/vector-5.svg" />
        <img className="absolute w-0 h-0 top-[calc(8.87%+30px)] left-[10.58%]" alt="Vector" src="/vector-2.svg" />
        <img className="absolute w-0 h-0 top-[calc(10.18%+30px)] left-[12.84%]" alt="Vector" src="/vector-4.svg" />
        <img className="absolute w-[9.80%] h-[6.21%] top-[calc(8.97%+30px)] left-[2.04%]" alt="Vector" src="/vector-11.svg" />
        <img className="absolute w-[9.8%] h-[6.4%] top-[calc(9.53%+25px)] left-8" alt="Clip path group" src="/clip-path-group-4.png" />
        <img className="absolute w-0 h-0 top-[calc(9.67%+30px)] left-[6.13%]" alt="Vector" src="/vector-10.svg" />
        <img className="absolute w-0 h-0 top-[calc(11.95%+30px)] left-[10.09%]" alt="Vector" src="/vector-12.svg" />
        <img className="absolute w-0 h-0 top-[calc(13.66%+30px)] left-[9.42%]" alt="Vector" src="/vector-13.svg" />
        <img className="absolute w-0 h-0 top-[calc(14.08%+30px)] left-[5.85%]" alt="Vector" src="/vector-13.svg" />
        <img className="absolute w-0 h-0 top-[calc(12.83%+30px)] left-[2.98%]" alt="Vector" src="/vector-8.svg" />

        {/* Wheels near logo area */}
        <img className="absolute w-[7.15%] h-[1.80%] top-[18.85%] left-[12.15%] -rotate-3" alt="Clip path group" src="/clip-path-group-5.png" />
        <img className="absolute w-[7.22%] h-[1.2%] top-[16.95%] left-[16.68%] -rotate-14" alt="Clip path group" src="/clip-path-group-6.png" />
        <img className="absolute w-[10.21%] h-[6.56%] top-0 left-0" alt="Vector" src="/vector-6.svg" />
        <img className="absolute w-[10.32%] h-[6.8%] top-0 left-0" alt="Clip path group" src="/clip-path-group-7.png" />
        <img className="absolute w-0 h-[2.81%] top-0 left-[3.75%]" alt="Clip path group" src="/clip-path-group-8.png" />
        <img className="absolute w-0 h-0 top-[3.92%] left-[6.99%]" alt="Vector" src="/vector-7.svg" />
        <img className="absolute w-0 h-0 top-[4.99%] left-[9.68%]" alt="Vector" src="/vector-15.svg" />
        <img className="absolute w-0 h-0 top-[6.38%] left-[7.37%]" alt="Vector" src="/vector-9.svg" />
        <img className="absolute w-0 h-0 top-[6.91%] left-[4.19%]" alt="Vector" src="/vector.svg" />
        <img className="absolute w-[13.44%] h-[28.30%] top-[15.56%] left-[13.64%]" alt="Clip path group" src="/clip-path-group-9.png" />

        {/* Floating wheels */}
        <img className="absolute w-[6.46%] h-[13.43%] top-[28.73%] left-[71.90%]" alt="Clip path group" src="/clip-path-group-10.png" />
        <img className="absolute w-[6.46%] h-[13.43%] top-[67.78%] left-[16.41%]" alt="Clip path group" src="/clip-path-group-11.png" />
        <img className="absolute w-[6.46%] h-[13.43%] top-[26.94%] left-[2.41%]" alt="Clip path group" src="/clip-path-group-12.png" />
        <img className="absolute w-[6.09%] h-[12.78%] top-[64.20%] left-[82.34%]" alt="Clip path group" src="/clip-path-group-13.png" />
        <img className="absolute w-[6.09%] h-[12.72%] top-[61.73%] left-[3.27%]" alt="Clip path group" src="/clip-path-group-14.png" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full min-h-screen">
        {/* Left panel — hidden on mobile */}
        <div className="relative hidden lg:flex lg:w-[60%]">
          <div className="flex flex-col justify-between w-full p-8 lg:p-12">
            <div className="flex flex-col items-start gap-6 mt-10 ml-[500px]">
              <a href="/" className="text-sm text-[#68161c] w-fit hover:text-[#4d1216] [font-family:'Barlow',Helvetica] sm:text-lg md:text-xl lg:text-[17px] font-semibold">
                ← Back to Website
              </a>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex items-stretch justify-center w-full px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:py-0 lg:w-[45%] lg:px-0">
          <div className="flex items-center justify-start w-full h-full bg-white lg:bg-white lg:shadow-none rounded-2xl lg:rounded-none">
            <div className="w-full max-w-xl px-6 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-16">

              {success ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 [font-family:'Barlow',Helvetica]">Check your email</h2>
                  <p className="text-gray-500 [font-family:'Barlow',Helvetica]">
                    If an account exists for that email, we've sent you instructions to reset your password.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="mt-6 font-medium text-[#68161c] hover:underline [font-family:'Barlow',Helvetica]"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2 mb-8">
                    <h2 className="font-semibold text-black text-2xl sm:text-3xl lg:text-[28px] [font-family:'Barlow',Helvetica]">
                      Forgot Password?
                    </h2>
                    <p className="text-base text-black/70 [font-family:'Barlow',Helvetica] font-medium sm:text-lg lg:text-[16px]">
                      Enter the email associated with your account and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6 ml-3">
                    {/* Email Field */}
                    <div className="flex flex-col gap-2 ml-0 lg:ml-3">
                      <label className="font-medium text-black [font-family:'Barlow',Helvetica] text-base lg:text-[16px]">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#68161c] focus:border-transparent outline-none transition-all [font-family:'Barlow',Helvetica]"
                        required
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="py-3 px-4 ml-0 lg:ml-3 w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg [font-family:'Barlow',Helvetica]">
                        {error}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full h-12 font-medium text-white bg-[#68161c] rounded-2xl hover:bg-[#4d1216] disabled:opacity-50 disabled:cursor-not-allowed [font-family:'Barlow',Helvetica] ml-0 lg:ml-3 mt-4"
                    >
                      {isLoading ? "Sending Link..." : "Send Reset Link"}
                    </button>

                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-600 [font-family:'Barlow',Helvetica]">
                        Remember your password?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="text-[#68161c] hover:underline font-medium"
                        >
                          Login here
                        </button>
                      </span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
