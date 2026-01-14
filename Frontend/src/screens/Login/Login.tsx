import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const descriptions = [
  "From quick snacks on the go to full party packs, our irresistible flavors bring joy and adventure to every moment.",
  "We craft great tasting natural snacks that inspire people to go beyond.",
  "Every bite is a burst of flavor that makes snacking feel like an adventure.",
  "From our kitchen to yours, we're all about spreading joy and flavor, one crunchy bite at a time!",
];

export const Login = (): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password, rememberMe });
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
              <Link
                to="/"
                className="text-sm text-white w-fit hover:text-gray-100 [font-family:'Barlow',Helvetica] font-normal sm:text-lg md:text-xl"
              >
                ← Back to Website
              </Link>
            </div>

            {/* Bottom - Headline and Description */}
            <div className="flex flex-col max-w-lg gap-4">
              <h1 className="text-4xl leading-normal text-white  font-semibold sm:text-3xl md:text-4xl lg:text-[43px] tracking-[-0.10px] max-w-screen-2xl">
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
              <h2 className="[font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px]">Welcome Back!</h2>
              <p className="text-base text-black/70 [font-family:'Barlow',Helvetica] font-normal text-black sm:text-lg md:text-xl tracking-[0] leading-relaxed  lg:text-[18px]">
                Log in to explore our delicious snacks and discover your next favorite flavor.
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
                  className="h-12 border-gray-300 rounded-lg"
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
                    className="h-12 pr-10 border-gray-300 rounded-lg"
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

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">

                <Link
                  to="/forgot-password"
                  className="text-sm text-black hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 font-medium text-white bg-black rounded-lg hover:bg-black/90"
              >
                Login
              </Button>

              {/* Sign Up Link */}
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-medium text-black hover:underline">
                    Sign up here
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

