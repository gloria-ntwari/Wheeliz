import React from "react";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row w-full items-center justify-center gap-8 lg:gap-12 bg-[#f57e14] py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col w-full lg:max-w-[819px] items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 order-2 lg:order-1">
        <div className="flex flex-col items-center lg:items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <h1 className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-bold text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-1.20px] leading-tight text-center lg:text-left">
            Keeping It Real
            <br />
            since 2015
          </h1>

          <p className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed text-center lg:text-left">
          For the last 10 years, Hollanda FairFoods has been dedicated to making delicious snacks right here in Rwanda. We believe that our snacks do more than just taste great; they bring people together. From our kitchen to yours, we’re all about spreading joy and flavor, one crunchy bite at a time!

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
