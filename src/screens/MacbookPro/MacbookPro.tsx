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
    title: "IRRESISTABLE FLAVOUR",
    description:
      "Proudly crafting snacks in British Columbia's one and only chip making facility.",
  },
];

export const MacbookPro = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-white" style={{ scrollBehavior: 'smooth' }}>
      <section id="featured-products-section">
        <FeaturedProductsSection />
      </section>

      {/* <SecondSection /> */}

      <section id="about-section">
        <AboutSection />
      </section>

      <section id="hero-section">
        <HeroSection />
      </section>

      <section id="intro-section">
        <IntroSection />
      </section>

      <section className="w-full bg-[#181817] py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <div className="max-w-[1490px] mx-auto">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
            {/* Left side - 2 text blocks */}
            <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-[100px] w-full md:flex-1 md:max-w-[360px]">
              {featureItems.slice(0, 1).map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 sm:gap-5 max-w-[360px] w-full bg-[#1b1b1a]/70 border border-[#2a2a28] rounded-xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <img className="w-6 h-6 sm:w-8 sm:h-8" alt={item.title} src={item.icon} />
                  <div className="[font-family:'Barlow',Helvetica] font-semibold text-[#fcc809] text-lg sm:text-xl md:text-2xl lg:text-[20px] tracking-[-0.50px] leading-tight">
                    {item.title}
                  </div>

                  <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[-0.40px] leading-relaxed">
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
            <div className="flex-shrink-0 order-first mx-0 md:mx-8 md:order-none">
              <img
                className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[420px] lg:w-auto lg:h-[400px] object-contain"
                alt="Central illustration"
                src="/clip-path-group-2.png"
              />
            </div>

            {/* Right side - 2 text blocks */}
            <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-[100px] w-full md:flex-1 md:max-w-[360px]">
              {featureItems.slice(1, 2).map((item, index) => (
                <div
                  key={index + 1}
                  className="flex flex-col items-center gap-4 sm:gap-5 max-w-[360px] w-full bg-[#1b1b1a]/70 border border-[#2a2a28] rounded-xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <img className="w-6 h-6 sm:w-8 sm:h-8" alt={item.title} src={item.icon} />
                  <div className="[font-family:'Barlow',Helvetica] font-semibold text-[#fcc809] text-lg sm:text-xl md:text-2xl lg:text-[20px] tracking-[-0.50px] leading-tight">
                    {item.title}
                  </div>

                  <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[-0.40px] leading-relaxed ">
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

      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32" style={{ paddingTop: '24px', paddingBottom: '20px' }}>
        <div className="max-w-[1490px] mx-auto">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-12">
            {/* Left column - Contact Us content */}
            <div id="contact-section" className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-8 w-full lg:flex-1 origin-top-left scale-[0.98] md:scale-95 lg:scale-95">
              <ProductShowcaseSection />
              <div className="origin-top-left scale-[0.98] md:scale-95 lg:scale-90">
                <ContactFormSection />
              </div>
            </div>

            {/* Right column - Wheeliez info */}
            <div className="flex flex-col items-center w-full gap-6 sm:gap-8 md:gap-10 lg:gap-[38px] lg:items-start lg:w-auto">
              <div className="[font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px] tracking-[-0.90px] leading-tight text-center lg:text-left">
                Hollanda FairFoods LTD
              </div>
              <div className="[font-family:'Barlow',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed text-center lg:text-left lg:text-[18px]">
                Warehouse: KG 173 st, Kigali- Remera <br></br>
                Opposite Grand Legacy Hotel Main office: KG 622 st, House 3 <br></br>
                Factory: Musanze Gyanika Road
                <br></br>
                Tel: +250780050540 <br></br>
                Email: customerservice@hollandafairfoods.com
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter-section" className="relative w-full">
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
