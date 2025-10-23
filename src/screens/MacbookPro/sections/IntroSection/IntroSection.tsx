import React from "react";

const contentData = [
  {
    imageSrc: "/cheese.svg",
    imageAlt: "Rectangle",
    label: "CHEESE",
    title: "Sweet Cheese",
    description:
      "Wheeliez Sweet Cheese combines the irresistible crunch of golden potato and wheat with a smooth, cheesy sweetness that keeps you rolling back for more. It’s the perfect balance of fun, flavor, and crunch ;  a cheesy joyride in every bite!",
    bestSellingLabel: "BEST SELLING",
    bestSellingText: "ALL NATURE",
    imagePosition: "left",
  },
  {
    imageSrc: "/tomato.svg",
    imageAlt: "Rectangle",
    label: "TOMATO",
    title: "Sweet Tomato",
    description:
      "Buckle up for a tangy twist! Wheeliez Sweet Tomato brings together the bright, zesty flavor of ripe tomatoes with a hint of sweetness,  full of energy and excitement. Every bite is a burst of flavor that makes snacking feel like an adventure.",
    bestSellingLabel: "BEST SELLING",
    bestSellingText: "ALL NATURE",
    imagePosition: "left",
  },
];

export const IntroSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start w-full gap-16 px-4 lg:gap-8 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
      {contentData.map((item, index) => (
        <div key={index} className="flex flex-col items-center w-full gap-0 lg:flex-row lg:gap-8">
          <div className={`flex flex-col w-full lg:w-1/2 items-start gap-2.5 ${index === 1 ? 'order-2 lg:order-2 lg:pr-24' : 'order-1 lg:order-1 lg:-ml-12'}`}>
            <img
              className="h-[360px] sm:h-[440px] md:h-[540px] lg:h-[640px] xl:h-[700px] object-contain"
              alt={item.imageAlt}
              src={item.imageSrc}
            />
          </div>

          <div className={`flex flex-col w-full lg:w-1/2 items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-[30px] px-4 sm:px-6 md:px-8 ${index === 1 ? 'lg:pr-24 lg:pl-0' : 'lg:pl-[60px] lg:pr-0'} py-8 sm:py-12 md:py-16 lg:py-0 ${index === 1 ? 'order-1 lg:order-1 lg:mr-20' : 'order-2 lg:order-2 '}`}>
            <div className="flex flex-col items-center lg:items-start gap-6 sm:gap-8 md:gap-10 lg:gap-[38px] w-full">
              <div className="w-full font-normal text-black text-base sm:text-lg md:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed text-center lg:text-left lg:text-[18px]">
                {item.label}
              </div>

              <div className="w-full [font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px] tracking-[-0.90px] leading-tight text-center lg:text-left">
                {item.title}
              </div>

              <div className="w-full [font-family:'Barlow',Helvetica] font-normal text-black text-base sm:text-lg md:text-xl tracking-[0] leading-relaxed text-center lg:text-left lg:text-[18px]">
                {item.description}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-2 sm:gap-3 md:gap-4 lg:gap-1.5">
              <div className="font-normal text-black text-base sm:text-lg md:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed text-center lg:text-left lg:text-[18px]">
                {item.bestSellingLabel}
              </div>

              <div className="font-semibold text-black text-lg sm:text-xl md:text-2xl lg:text-[23px] [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed text-center lg:text-left ">
                {item.bestSellingText}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
