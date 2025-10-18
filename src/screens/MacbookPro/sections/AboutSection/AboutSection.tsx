import React from "react";

export const AboutSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row w-full items-center justify-center gap-8 lg:gap-[109px] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col w-full lg:max-w-[819px] items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 order-2 lg:order-1">
        <div className="flex flex-col items-center gap-6 lg:items-start sm:gap-8 md:gap-10 lg:gap-12">
          <h2 className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px] tracking-[-0.90px] leading-tight text-center lg:text-left">
            TAKE A BITE OUTTA
            <br />
            LIFE
          </h2>

           <p className="[font-family:'Barlow',Helvetica] font-normal text-black text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed text-left">
          Born from the adventurous spirit of <strong>Hollanda FairFoods</strong>, Wheeliez brings together flavor, excitement, and a dash of play in every crunchy bite. For over 10 years, we have proudly been crafting high-quality snacks made in Rwanda. Wheeliez is our invitation to every explorer at heart; the ones who seek laughter, good vibes, and unforgettable moments.
          <br /><br />
          Whether you're hanging out with friends, on the go, or just in the mood for a snack, Wheeliez is the perfect choice to brighten your day. <strong>So buckle up</strong>, grab a pack, and let the adventure begin, because with Wheeliez, every crunch is a journey worth taking!
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
