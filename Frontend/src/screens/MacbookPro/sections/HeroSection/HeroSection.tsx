import React from "react";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row w-full items-center justify-center gap-8 lg:gap-[109px]  bg-[#f57e14] py-8 sm:py-6 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
      <div className="flex flex-col w-full lg:max-w-[819px] items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 order-2 lg:order-1">
        <div className="flex flex-col items-center gap-6 lg:items-start sm:gap-8 md:gap-10 lg:gap-12">
          <h1 className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-bold text-black text-center lg:text-left text-xl sm:text-2xl md:text-3xl lg:text-[34px] tracking-[1px] leading-tight uppercase">
            WHEELIEZ
          </h1>

          <p className="[font-family:'Barlow',Helvetica] font-normal text-black text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed text-left lg:max-w-[700px]">
            Wheeliez is a puffed snack made of wheat and potatoes. Its packed in small bags and family bags. So you can bring it with you to school or eat it at home with family and friends.
          </p>
        </div>
      </div>

      <div className="max-w-[380px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[700px] xl:max-w-[640px] order-1 lg:order-2">
        <img
          className="object-contain mx-auto max-h-[460px] sm:max-h-[520px] md:max-h-[580px] lg:max-h-[940px] xl:max-h-[700px] lg:max-w-[538px]"
          alt="Group"
          src="/Group 37406.png"
        />
      </div>
    </section>
  );
};
