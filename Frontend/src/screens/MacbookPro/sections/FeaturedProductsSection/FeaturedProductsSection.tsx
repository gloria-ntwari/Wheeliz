import { ArrowRightIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { MOTION_VIDEO_SRC } from "../../../../config/assets";

const navigationItems = [
  { label: "ABOUT US", href: "#about-section" },
  { label: "PRODUCTS", href: "#intro-section" },
  { label: "WHERE TO BUY", href: "#newsletter-section" },
  { label: "CONTACT US", href: "#contact-section" },
];

export const FeaturedProductsSection = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <section className="relative w-full h-[420px] sm:h-[480px] md:h-[560px] lg:h-[760px] xl:h-[760px] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
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

      <nav className="absolute top-4 sm:top-6 md:top-8 lg:top-[30px] left-0 right-0 flex w-full items-center justify-between px-4 sm:px-6 md:px-8 lg:px-[97px] z-10">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#68161c]" />
            ) : (
              <Menu className="w-6 h-6 text-[#68161c]" />
            )}
          </Button>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden">
          <img
            className="w-32 h-auto sm:w-40 md:w-48 sm:h-20 md:h-24"
            alt="Clip path group"
            src="/clip-path-group-15.png"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center gap-[50px] w-full ml-28">
          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={() => smoothScrollTo('about-section')}
          >
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[20px] tracking-[0] leading-[normal]">
              {navigationItems[0].label}
            </span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={() => smoothScrollTo('intro-section')}
          >
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[1].label}
            </span>
          </Button>

          <img
            className="w-[255.33px] h-[85.2px] "
            alt="Clip path group"
            src="/clip-path-group-15.png"
          />

          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={() => smoothScrollTo('newsletter-section')}
          >
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[2].label}
            </span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={() => smoothScrollTo('contact-section')}
          >
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[20px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[3].label}
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto px-6 py-3 bg-[#68161c] border-none rounded-none hover:bg-[#6d1414] transition-colors"
            asChild
          >
            <Link to="/login">
              <span className="[font-family:'Barlow',Helvetica] font-normal text-base lg:text-[18px] text-white tracking-[0] leading-[normal]">
                LOGIN
              </span>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg top-full lg:hidden">
            <div className="flex flex-col py-4">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="justify-start h-auto p-4 hover:bg-gray-50"
                  onClick={() => {
                    const sectionIds = ['about-section', 'intro-section', 'newsletter-section', 'contact-section'];
                    smoothScrollTo(sectionIds[index]);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-lg tracking-[0] leading-[normal]">
                    {item.label}
                  </span>
                </Button>
              ))}
              <div className="px-4 pt-2">
                <Button
                  variant="outline"
                  className="w-full h-auto px-5 py-2 bg-[#8B1A1A] border-none rounded-none hover:bg-[#6d1414] transition-colors"
                  asChild
                >
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <span className="[font-family:'Barlow',Helvetica] font-normal text-white text-[16px] tracking-[0] leading-[normal]">
                      LOGIN
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <h1 className="absolute top-64 left-1/2 -translate-x-1/2 -translate-y-1/2 [font-family:'Barlow',Helvetica] font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-[90px] xl:text-[90px] tracking-[-2.90px] leading-tight text-center whitespace-nowrap">
          <span className="inline-block animate-hero-title">
            {"PLAY    LEARN    SNACK".split("").map((ch, i) => (
              <span
                key={i}
                className="hero-char"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
        </h1>

        <div className="pointer-events-none absolute inset-x-0 top-[calc(50%+60px)] sm:top-[calc(50%+70px)] md:top-[calc(50%+80px)] lg:top-[calc(50%+85px)] xl:top-[calc(50%+155px)] flex justify-center animate-hero-button lg:mt-20" style={{ animationDelay: '1100ms' }}>

        </div>
      </div>
    </section>
  );
};