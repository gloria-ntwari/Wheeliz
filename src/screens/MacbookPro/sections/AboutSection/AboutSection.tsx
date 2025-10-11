import React from "react";

export const AboutSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row w-full items-center justify-center gap-8 lg:gap-[109px] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col w-full lg:max-w-[819px] items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 order-2 lg:order-1">
        <div className="flex flex-col items-center lg:items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <h2 className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-0.90px] leading-tight text-center lg:text-left">
            TAKE A BITE OUTTA
            <br />
            LIFE
          </h2>

          <p className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed text-center lg:text-left">
            We believe the best moments in life come with a side of snacks.
            Whether you&apos;re trekking a trail with a buddy, cracking up with
            a co-worker, or enjoying a movie night with the fam, Hardbite wants
            you to take a bite outta life, one crunchy, all-natural chip at a
            time.
          </p>
        </div>
      </div>

      <div className="relative w-full max-w-[453px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[451px] flex-shrink-0 order-1 lg:order-2">
        <div className="absolute top-0 left-1/2 lg:left-[245px] w-32 sm:w-40 md:w-48 lg:w-52 h-full bg-[#68161c] transform -translate-x-1/2 lg:translate-x-0" />

        <img
          className="absolute top-4 sm:top-6 md:top-8 lg:top-[41px] left-0 w-full max-w-[368px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[382px] object-cover"
          alt="Rectangle"
          src="/rectangle-337.svg"
        />
      </div>
    </section>
  );
};
