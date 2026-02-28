import React from "react";

export const AboutSection = (): JSX.Element => {
  return (
    <section className="flex flex-col lg:flex-row w-full items-center justify-center gap-8 lg:gap-[109px] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col w-full lg:max-w-[819px] items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 order-2 lg:order-1">
        <div className="flex flex-col items-center gap-6 lg:items-start sm:gap-8 md:gap-10 lg:gap-12">
          <h2 className="w-full max-w-[691px] [font-family:'Barlow',Helvetica] font-semibold text-black  text-center lg:text-left text-xl sm:text-2xl md:text-3xl lg:text-[34px] tracking-[1px] leading-tight uppercase">
            WELCOME TO WHEELIEZ
            <br />
            WORLD
          </h2>

           <p className="[font-family:'Barlow',Helvetica] text-left font-normal text-black text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed">
          Born from the adventurous spirit of <strong>Hollanda FairFoods</strong>, Wheeliez brings together flavor, excitement, and a dash of play in every crunchy bite. For over 10 years, we have proudly been crafting high-quality snacks made in Rwanda. Wheeliez is our invitation to every explorer at heart; the ones who like to play outside, read comic books and like to do smart games, alone or with their friends.
          <br /><br />
          Hollanda Fair Foods is the producer of <strong>Winnaz</strong> potato crisps, <strong>Tsinda</strong> banana crisps and <strong>Wheeliez.</strong> We are based in Karwasa, Cyanika road in Musanze. For more information please contact us on <em className="underline">customerservice@hollandafairfoods.com</em>  or give us a call at +250780050540. And dont forget to follow us on Instagram @Wheeliezworld.
          <br/> <br/>
          Did you know you can book a tour in our factory with your family or school class? 
        </p>
        </div>
      </div>

      <div className="relative w-full max-w-[453px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[451px] flex-shrink-0 order-1 lg:order-2">
        <div className="absolute top-0 left-1/2 lg:left-[245px] w-32 sm:w-40 md:w-48 lg:w-52 h-full bg-[#f9ce34] transform -translate-x-1/2 lg:translate-x-0 bg-opacity-95" />

        <img
          className="absolute top-4 sm:top-6 md:top-8 lg:top-[41px] left-0 w-full max-w-[420px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[382px] object-cover"
          alt="Rectangle"
          src="/wheeliz.jpeg"
        />
      </div>
    </section>
  );
};
