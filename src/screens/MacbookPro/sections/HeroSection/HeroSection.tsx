import React from "react";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row w-full items-center justify-center gap-8 lg:gap-[109px]  bg-[#f57e14] py-8 sm:py-6 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 lg:py-24">
      <div className="flex flex-col w-full lg:max-w-[819px] items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 order-2 lg:order-1">
        <div className="flex flex-col items-center gap-6 lg:items-start sm:gap-8 md:gap-10 lg:gap-12">
          <h1 className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px] tracking-[-0.90px] leading-tight text-center lg:text-left">
            Keeping It Real
            <br />
            since 2015
          </h1>

          <p className="[font-family:'Barlow',Helvetica] font-normal text-black text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed text-left">
            For the last 10 years, Hollanda FairFoods has been dedicated to making delicious snacks right here in Rwanda. We believe that our snacks do more than just taste great; they bring people together. From our kitchen to yours, we’re all about spreading joy and flavor, one crunchy bite at a time!

          </p>
        </div>
      </div>

      <div className="max-w-[380px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[600px] xl:max-w-[640px] order-1 lg:order-2">
        <img
          className="w-full h-auto object-contain mx-auto max-h-[460px] sm:max-h-[520px] md:max-h-[580px] lg:max-h-[740px] xl:max-h-[700px]"
          alt="Group"
          src="/group-37406.png"
        />
      </div>
    </section>
  );
};
