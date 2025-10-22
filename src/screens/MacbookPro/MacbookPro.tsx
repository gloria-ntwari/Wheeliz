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
    icon: "/material-symbols-light-off.svg",
    title: "MADE IN RWANDA",
    description:
      "Proudly crafting snacks in British Columbia's\none and only chip making\nfacility.",
  },
  {
    icon: "/token-rwn.svg",
    title: "IRRESISTABLE FLAVOUR",
    description:
      "Proudly crafting snacks in British Columbia's\none and only chip making\nfacility.",
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
          {/* Section header */}
          <div className="flex flex-col items-center mb-8 text-center sm:mb-10 md:mb-12 lg:gap-4">
            <div className="[font-family:'Barlow',Helvetica] font-semibold text-white text-sm sm:text-base tracking-[0] uppercase lg:text-[22px]">WHY WHEELIEZ</div>
            <h2 className="[font-family:'Barlow',Helvetica] font-bold text-[#fcc809] text-2xl sm:text-3xl md:text-4xl lg:text-[43px] leading-tight mt-2">CHANGE THE WAY YOU CHIP</h2>
          </div>
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4 ">
            {/* Left side - text block */}
            <div className="flex flex-col gap-10 sm:gap-14 md:gap-16 lg:gap-[100px] w-full md:flex-1 md:max-w-[420px]">
              {featureItems.slice(0, 1).map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-3 sm:gap-4 max-w-[420px] w-full"
                >
                  <img className="w-5 h-5 sm:w-6 sm:h-6" alt={item.title} src={item.icon} />
                  <div className="[font-family:'Barlow',Helvetica] font-semibold text-[#fcc809] text-xl sm:text-2xl tracking-[-0.50px] leading-tight">
                    {item.title}
                  </div>

                  <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-base sm:text-lg md:text-[18px] tracking-[-0px] leading-relaxed lg:text-[18px] max-w-[320px] sm:max-w-[340px] md:max-w-[360px] whitespace-nowrap">
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
            <div className="flex-shrink-0 mx-0 md:mx-8">
              <img
                className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[460px] lg:w-auto lg:h-[420px] object-contain lg:mr-[50px] lg:scale-y-110"
                alt="Central illustration"
                src="/clip-path-group.png"
              />
            </div>

            {/* Right side - text block */}
            <div className="flex flex-col gap-10 sm:gap-14 md:gap-16 lg:gap-[100px] w-full md:flex-1 md:max-w-[420px] -mt-[20px] " >
              {featureItems.slice(1, 2).map((item, index) => (
                <div
                  key={index + 1}
                  className="flex flex-col items-start gap-3 sm:gap-4 max-w-[420px] w-full"
                >
                  <img className="w-5 h-5 sm:w-6 sm:h-6" alt={item.title} src={item.icon} />
                  <div className="[font-family:'Barlow',Helvetica] font-semibold text-[#fcc809] text-xl sm:text-2xl tracking-[-0.50px] leading-tight">
                    {item.title}
                  </div>

                  <div className="[font-family:'Barlow',Helvetica] font-medium text-white text-base sm:text-lg md:text-[18px] tracking-[-0px] leading-relaxed lg:text-[18px] max-w-[320px] sm:max-w-[340px] md:max-w-[360px] whitespace-nowrap">
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
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-12 lg:pt-8">
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
                Warehouse: KG 173 st, Kigali- Remera
                <br></br>
                Opposite Grand Legacy Hotel Main office: KG 622 st, House 3<br></br>
                Factory: Musanze Gyanika Road
                <br></br><br></br>
                Tel: +250780050540<br></br>
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
