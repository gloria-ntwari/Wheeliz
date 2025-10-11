import React from "react";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row w-full items-center justify-center gap-8 lg:gap-12 bg-[#f57e14] py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col w-full lg:max-w-[819px] items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 order-2 lg:order-1">
        <div className="flex flex-col items-center lg:items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <h1 className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-bold text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-1.20px] leading-tight text-center lg:text-left">
            Keeping It Real
            <br />
            since 1998
          </h1>

          <p className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed text-center lg:text-left">
            We got into the chip-crafting business with one goal in mind: to
            create the ultimate all-natural chip we possibly can. We love chips
            (if you couldn&apos;t tell) and we&apos;re committed to staying true
            to our roots—crafting independent, innovative, Canadian snacks.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[674.6px] order-1 lg:order-2">
        <img
          className="w-full h-auto"
          alt="Group"
          src="/group-37406.png"
        />
      </div>
    </section>
  );
};
