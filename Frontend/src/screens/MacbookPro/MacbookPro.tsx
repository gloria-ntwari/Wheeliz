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

      {/* Adventure Club Section */}
      <section className="relative w-full overflow-hidden">
        {/* Dashboard image – absolutely positioned on the RIGHT, spans both blocks */}
        <div className="hidden lg:block absolute top-[13%] right-[0%] w-[42%] h-[37%] z-10">
          <img
            src="/dashboard.png"
            alt="Wheeliez Adventure Club dashboard"
            className="object-cover object-left-top w-full h-full"
          />
        </div>

        {/* Wheel 1: top-left of black section */}
        <img src="/clip-path-group-9.png" alt="" className="hidden lg:block absolute top-[2%] left-[-44px] w-16 md:w-20 lg:w-36 pointer-events-none select-none z-20" />

        {/* Wheel 2: straddling black/white boundary – left side, mostly in white */}
        <img src="/clip-path-group-9.png" alt="" className="hidden lg:block absolute top-[39%] left-2 w-20 md:w-24 lg:w-52 pointer-events-none select-none z-20" />

        {/* Wheel 3: bottom-right of the black section */}
        <img src="/clip-path-group-11.png" alt="" className="hidden lg:block absolute top-[55%] right-6 w-16 md:w-20 lg:w-48 pointer-events-none select-none z-20" />


        <div className="w-full bg-[#181817] relative">
          {/* Centered title at the very top of the dark section */}
          <div className="w-full pt-20 pb-2 text-center">
            <span className="[font-family:'Barlow',Helvetica] font-semibold text-white text-xs sm:text-sm md:text-[20px] tracking-wide uppercase">
              WHEELIEZ ADVENTURE CLUB
            </span>
          </div>
          <div className="max-w-[1490px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-10 sm:py-16 lg:py-52">
            {/* Content constrained to left ~55% so it doesn't overlap the image */}
            <div className="w-full lg:w-[52%] flex flex-col items-start gap-5">
              <h2 className="[font-family:'Barlow',Helvetica] font-extrabold text-[#fcc809] text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] leading-tight tracking-tight uppercase">
                PLAY OUTSIDE. THINK SMART.
              </h2>
              <p className="[font-family:'Barlow',Helvetica] font-normal text-white text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed">
                The Wheeliez Adventure Club was created to celebrate the launch of Wheeliez.<br />
                It invites children aged 4–11 to explore, move, think and discover the world around them
                through fun, play and learning.
              </p>
              <p className="[font-family:'Barlow',Helvetica] font-normal text-white text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed">
                Together with Manzi and Nzozi, children go on monthly adventures across
                Rwanda – from volcanoes and forests to lakes and wildlife parks.
              </p>
              <button className="mt-2 flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#6d1414] transition-colors text-white [font-family:'Barlow',Helvetica] font-semibold text-sm sm:text-base px-6 py-3 tracking-wide">
                JOIN THE CLUB
                <span className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* === Block 2: EACH MONTH INCLUDES – full-width white background === */}
        <div className="relative w-full bg-white">
          <div className="max-w-[1490px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-14 sm:py-16 lg:py-32">
            {/* Content constrained to left ~50% */}
            <div className="w-full lg:w-[100%] flex flex-col items-start gap-5">
              <h2 className="[font-family:'Barlow',Helvetica] font-extrabold text-black text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] leading-tight tracking-tight uppercase">
                EACH MONTH INCLUDES:
              </h2>
              <p className="[font-family:'Barlow',Helvetica] font-normal text-black text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed">
                Children can win prizes by sending photos of completed challenges, games or coloring pages.<br className="hidden sm:block" />
                All content is shared exclusively within the secure, login-protected member section of this website
              </p>
              <p className="[font-family:'Barlow',Helvetica] font-normal text-black text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed">
                As a member of the Adventure Club, each child receives a personal username and password to access this secure area.<br className="hidden sm:block" />
                Here they can read and download all adventures and games, and see the announcement of the monthly winners.
              </p>
              <ul className="flex flex-col gap-3 mt-4 w-full list-none p-0 m-0 ml-6 sm:ml-8 md:ml-[72px] lg:ml-[88px]">
                {[
                  "A new comic-book style adventure story (English or Kinyarwanda)",
                  "A featured location in Rwanda",
                  "Outdoor challenges that encourage children to play outside",
                  "Smart games such as puzzles, mazes and drawing activities",
                  "Monthly Prizes",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 sm:gap-4 [font-family:'Barlow',Helvetica] text-black text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed font-normal">
                    <span className="mt-2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gray-500 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile-only: dashboard image below both blocks */}
        <div className="block w-full lg:hidden">
          <img
            src="/dashboard.png"
            alt="Wheeliez Adventure Club dashboard"
            className="object-cover w-full"
          />
        </div>

        {/* JOIN THE ADVENTURE CLUB section */}
        <div className="w-full bg-[#181817] flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pt-14 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 lg:pb-28">
          <h2 className="[font-family:'Barlow',Helvetica] font-extrabold text-[#fcc809] text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] tracking-wide uppercase text-center">
            JOIN THE ADVENTURE CLUB
          </h2>
          <p className="[font-family:'Barlow',Helvetica] font-normal text-white text-sm sm:text-base text-center -mt-2">
            Your parent can register you here
          </p>
          <div className="w-full max-w-[580px] mt-4">
            <img
              src="/image 12.png"
              alt="Wheeliez Adventure Club merchandise"
              className="object-contain w-full"
            />
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
                Kigali Office:KK 261 St-Kigali
                <br></br>
                Factory: Musanze-Cyanika Road
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
          src="/wheeliz.jpeg"
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
