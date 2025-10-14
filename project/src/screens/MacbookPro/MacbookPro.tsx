import React from "react";
import { AboutSection } from "./sections/AboutSection";
import { ContactFormSection } from "./sections/ContactFormSection";
import { FeaturedProductsSection } from "./sections/FeaturedProductsSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { IntroSection } from "./sections/IntroSection";
import { NewsletterSection } from "./sections/NewsletterSection";
import { ProductShowcaseSection } from "./sections/ProductShowcaseSection";
import { SweetTreatsSection } from "./sections/SweetTreatsSection";
import { SecondSection } from "./sections/SecondSection.tsx";

const featureItems = [
  {
    icon: "/emojione-monotone-potato.svg",
    title: "MADE IN RWANDA",
    description:
      "Proudly crafting snacks in British Columbia's one and only chip making facility.",
  },
  {
    icon: "/emojione-monotone-potato.svg",
    title: "MADE IN RWANDA",
    description:
      "Proudly crafting snacks in British Columbia's one and only chip making facility.",
  },
  {
    icon: "/emojione-monotone-potato.svg",
    title: "MADE IN RWANDA",
    description:
      "Proudly crafting snacks in British Columbia's one and only chip making facility.",
  },
  {
    icon: "/emojione-monotone-potato.svg",
    title: "MADE IN RWANDA",
    description:
      "Proudly crafting snacks in British Columbia's one and only chip making facility.",
  },
];

export const MacbookPro = (): JSX.Element => {
  return (
    <div className="bg-white w-full min-h-screen flex flex-col" style={{ scrollBehavior: 'smooth' }}>
      <section id="featured-products-section">
        <FeaturedProductsSection />
      </section>

      <SecondSection />

      <section id="about-section">
        <AboutSection />
      </section>

      <section id="hero-section">
        <HeroSection />
      </section>

      <section id="intro-section">
        <IntroSection />
      </section>

      <section className="w-full bg-[#181817] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1490px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            {/* Left side - 2 text blocks */}
            <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-[100px] w-full md:w-auto">
              {featureItems.slice(0, 2).map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 sm:gap-5 max-w-[308px] w-full"
                >
                  <img className="w-6 h-6 sm:w-8 sm:h-8" alt={item.title} src={item.icon} />
                  <div className="[font-family:'Barlow',Helvetica] font-semibold text-[#fcc809] text-lg sm:text-xl md:text-2xl lg:text-[25px] tracking-[-0.50px] leading-tight text-center">
                    {item.title}
                  </div>
                  
                  <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-sm sm:text-base md:text-lg lg:text-xl tracking-[-0.40px] leading-relaxed text-center">
                    {item.description.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < item.description.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Center - Image */}
            <div className="flex-shrink-0 mx-0 md:mx-8 order-first md:order-none">
              <img 
                className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:w-auto lg:h-[400px] object-contain" 
                alt="Central illustration" 
                src="/clip-path-group-2.png" 
              />
            </div>

            {/* Right side - 2 text blocks */}
            <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-[100px] w-full md:w-auto">
              {featureItems.slice(2, 4).map((item, index) => (
                <div
                  key={index + 2}
                  className="flex flex-col items-center gap-4 sm:gap-5 max-w-[308px] w-full text-center"
                >
                  <img className="w-6 h-6 sm:w-8 sm:h-8" alt={item.title} src={item.icon} />
                  <div className="[font-family:'Barlow',Helvetica] font-semibold text-[#fcc809] text-lg sm:text-xl md:text-2xl lg:text-[25px] tracking-[-0.50px] leading-tight">
                    {item.title}
                  </div>
                  
                  <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-sm sm:text-base md:text-lg lg:text-xl tracking-[-0.40px] leading-relaxed">
                    {item.description.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < item.description.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 md:px-8" style={{ paddingTop: '40px', paddingBottom: '35px' }}>
        <div className="max-w-[1490px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[88px]">
            {/* Left column - Contact Us content */}
            <div id="contact-section" className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-[38px] w-full lg:flex-1">
              <ProductShowcaseSection />
              <ContactFormSection />
            </div>
            
            {/* Right column - Wheeliez info */}
            <div className="flex flex-col items-center lg:items-start gap-2 sm:gap-3 w-full lg:w-auto">
              <div className="[font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[45px] tracking-[-0.90px] leading-tight text-center lg:text-left">
                WHEELIEZ
              </div>
              <div className="[font-family:'Barlow',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed text-center lg:text-left">
                Kigali- Rwanda
              </div>
              <div className="[font-family:'Barlow',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed text-center lg:text-left">
                KN 09 ST
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter-section" className="w-full relative">
        <img
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[620px] object-cover"
          alt="Rectangle"
          src="/rectangle-342.png"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0">
          <NewsletterSection />
        </div>
      </section>

      <section id="faq-section">
        <SweetTreatsSection />
      </section>

      <FooterSection />

    
    </div>
  );
};
