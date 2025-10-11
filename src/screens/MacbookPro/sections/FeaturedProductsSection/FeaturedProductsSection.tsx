import { ArrowRightIcon, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";

const navigationItems = [
  { label: "ABOUT US", href: "#about-section" },
  { label: "PRODUCTS", href: "#hero-section" },
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
    // Close mobile menu after clicking
    setIsMenuOpen(false);
  };

  return (
    <section className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[956px] overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%]"
          alt="Vector"
          src="/vector-1.svg"
        />

        <img
          className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%]"
          alt="Vector"
          src="/vector-1.svg"
        />

        <img
          className="absolute w-full h-full top-0 left-0"
          alt="Group"
          src="/group.png"
        />

        <img
          className="absolute w-full h-[37.13%] top-[62.86%] left-0"
          alt="Clip path group"
          src="/clip-path-group-1.png"
        />

        <img
          className="absolute h-[35.13%] top-[56.54%] left-[calc(50%-864px)] w-[562px] hidden lg:block"
          alt="Clip path group"
          src="/clip-path-group-2.png"
        />

        <img
          className="absolute w-[6.60%] h-[4.05%] top-0 left-[10.76%]"
          alt="Clip path group"
          src="/clip-path-group-3.png"
        />

        <img
          className="absolute w-[4.86%] h-0 top-0 left-[14.24%]"
          alt="Clip path group"
        />

        <img
          className="absolute w-0 h-0 top-[7.51%] left-[13.22%]"
          alt="Vector"
          src="/vector-5.svg"
        />

        <img
          className="absolute w-0 h-0 top-[8.87%] left-[10.58%]"
          alt="Vector"
          src="/vector-2.svg"
        />

        <img
          className="absolute w-0 h-0 top-[10.18%] left-[12.84%]"
          alt="Vector"
          src="/vector-4.svg"
        />

        <img
          className="absolute w-[9.80%] h-[6.21%] top-[8.97%] left-[2.04%]"
          alt="Vector"
          src="/vector-11.svg"
        />

        <img
          className="absolute w-[11.53%] h-[9.12%] top-[7.53%] left-0"
          alt="Clip path group"
          src="/clip-path-group-4.png"
        />

        <img
          className="absolute w-0 h-0 top-[9.67%] left-[6.13%]"
          alt="Vector"
          src="/vector-10.svg"
        />

        <img
          className="absolute w-0 h-0 top-[11.95%] left-[10.09%]"
          alt="Vector"
          src="/vector-12.svg"
        />

        <img
          className="absolute w-0 h-0 top-[13.66%] left-[9.42%]"
          alt="Vector"
          src="/vector-13.svg"
        />

        <img
          className="absolute w-0 h-0 top-[14.08%] left-[5.85%]"
          alt="Vector"
          src="/vector-13.svg"
        />

        <img
          className="absolute w-0 h-0 top-[12.83%] left-[2.98%]"
          alt="Vector"
          src="/vector-8.svg"
        />

        <img
          className="absolute w-[7.15%] h-[4.80%] top-[11.85%] left-[12.15%]"
          alt="Clip path group"
          src="/clip-path-group-5.png"
        />

        <img
          className="absolute w-[7.22%] h-[2.70%] top-[13.95%] left-[8.68%]"
          alt="Clip path group"
          src="/clip-path-group-6.png"
        />

        <img
          className="absolute w-[10.21%] h-[6.56%] top-0 left-0"
          alt="Vector"
          src="/vector-6.svg"
        />

        <img
          className="absolute w-[11.32%] h-[8.24%] top-0 left-0"
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
            className="w-32 sm:w-40 md:w-48 h-auto sm:h-20 md:h-24"
            alt="Clip path group"
            src="/clip-path-group-15.png"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center gap-[50px] w-full">
          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={() => smoothScrollTo('about-section')}
          >
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[25px] tracking-[0] leading-[normal]">
              {navigationItems[0].label}
            </span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={() => smoothScrollTo('hero-section')}
          >
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[1].label}
            </span>
          </Button>

          <img
            className="w-[325.33px] h-[105.2px]"
            alt="Clip path group"
            src="/clip-path-group-15.png"
          />

          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={() => smoothScrollTo('newsletter-section')}
          >
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[2].label}
            </span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto p-2 hover:bg-transparent"
            onClick={() => smoothScrollTo('contact-section')}
          >
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-[25px] tracking-[0] leading-[normal] whitespace-nowrap">
              {navigationItems[3].label}
            </span>
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 lg:hidden">
            <div className="flex flex-col py-4">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-auto p-4 hover:bg-gray-50 justify-start"
                  onClick={() => {
                    const sectionIds = ['about-section', 'hero-section', 'newsletter-section', 'contact-section'];
                    smoothScrollTo(sectionIds[index]);
                  }}
                >
                  <span className="[font-family:'Barlow',Helvetica] font-semibold text-[#68161c] text-lg tracking-[0] leading-[normal]">
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-[166px] w-full max-w-[968px] px-4 sm:px-6 md:px-8">
        <h1 className="[font-family:'Barlow',Helvetica] font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[90px] tracking-[-1.80px] leading-tight text-center">
          EXPLORER WHAT&apos;S REAL
        </h1>

        <Button className="w-[200px] sm:w-[250px] md:w-[280px] lg:w-[300px] h-[50px] sm:h-[55px] md:h-[60px] bg-[#68161c] hover:bg-[#68161c]/90 flex items-center justify-center gap-2.5 p-2.5">
          <span className="[font-family:'Barlow',Helvetica] font-medium text-white text-sm sm:text-base md:text-lg lg:text-xl tracking-[-0.40px] leading-[22.6px] whitespace-nowrap">
            FIND OUR FAVORS
          </span>
          <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </section>
  );
};
