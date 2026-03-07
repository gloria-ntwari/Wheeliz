import React from "react";

const contentData = [
  {
    label: "CHEESE",
    title: "SWEET CHEESE",
    description:
      "Wheeliez Sweet Cheese combines the irresistible crunch of golden potato and wheat with a smooth, cheesy sweetness that keeps you rolling back for more. It's the perfect balance of fun, flavor, and crunch ;  a cheesy joyride in every bite!",
    badge: "*Best selling",
    cardSide: "right" as const,
  },
  {
    label: "TOMATO",
    title: "SWEET TOMATO",
    description:
      "Buckle up for a tangy twist! Wheeliez Sweet Tomato brings together the bright, zesty flavor of ripe tomatoes with a hint of sweetness,  full of energy and excitement. Every bite is a burst of flavor that makes snacking feel like an adventure.",
    badge: "*Best selling",
    cardSide: "left" as const,
  },
];

export const IntroSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center w-full gap-20 px-4 py-12 lg:gap-28 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 lg:py-20">
      {contentData.map((item, index) => {
        const cardOnRight = item.cardSide === "right";

        return (
          <div
            key={index}
            className="relative w-full max-w-[1000px] mx-auto"
            style={{ minHeight: "420px" }}
          >
            {/* Background image — positioned to one side */}
            <div
              className={`absolute top-0 ${
                cardOnRight ? "left-0" : "right-0"
              } w-[65%] h-full rounded-2xl overflow-hidden shadow-md`}
            >
              <img
                className="object-cover w-full h-full"
                alt="Store shelf display"
                src="/Rectangle 339.png"
              />
            </div>

            {/* White text card — overlaps the image on the opposite side */}
            <div
              className={`relative ${
                cardOnRight ? "ml-auto" : "mr-auto"
              } w-[65%] bg-white rounded-2xl shadow-xl p-8 sm:p-10 md:p-14  flex flex-col justify-center gap-5 z-10`}
              style={{ marginTop: "50px", marginBottom: "40px" }}
            >
              <h3 className="[font-family:'Barlow',Helvetica] font-bold text-[#68161c] text-xl sm:text-2xl md:text-3xl lg:text-[34px] tracking-[1px] leading-tight uppercase">
                {item.title}
              </h3>

              <p className="[font-family:'Barlow',Helvetica]  md:text-[16px] font-normal text-black text-sm sm:text-base md:text-lg lg:text-[18px] tracking-[0] leading-relaxed">
                {item.description}
              </p>

              <span className="[font-family:'Barlow',Helvetica] font-normal text-gray-500 text-xs sm:text-sm mt-4">
                {item.badge}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};
