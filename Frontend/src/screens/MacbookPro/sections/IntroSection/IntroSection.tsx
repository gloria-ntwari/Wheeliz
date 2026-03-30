import React from "react";

const contentData = [
  {
    label: "TOMATO",
    title: "SWEET TOMATO",
    description:
      "We believe the best moments in life come with a side of snacks. Whether you're trekking a trail with a buddy, cracking up with a co-worker, or enjoying a movie night with the fam, Hardbite wants you to take a bite outta life, one crunchy, all-natural chip at a time.",
    verticalImages: ["/tomato_image.jpg", "/smile_tomato.heic"],
    shelfImage: "/shelf_tomato.jpg",
    layout: "left" as const,
  },
  {
    label: "CHEESE",
    title: "SWEET CHEESE",
    description:
      "We believe the best moments in life come with a side of snacks. Whether you're trekking a trail with a buddy, cracking up with a co-worker, or enjoying a movie night with the fam, Hardbite wants you to take a bite outta life, one crunchy, all-natural chip at a time.",
    verticalImages: ["/cheese_smile.heic", "/smile_cheese.heic"],
    shelfImage: "/shelf_cheese.jpg",
    layout: "right" as const,
  },
];

export const IntroSection = (): JSX.Element => {
  return (
    <section className="flex flex-col items-center w-full gap-20 py-28 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
      {contentData.map((item, index) => {
        const isLayoutLeft = item.layout === "left";

        return (
          <div
            key={index}
            className="w-full max-w-[1490px] flex flex-col lg:flex-row gap-6 items-end"
          >
            {/* Image columns group */}
            <div className={`flex gap-6 w-full lg:w-1/2  ${isLayoutLeft ? 'order-1' : 'lg:order-2'}`}>
              {item.verticalImages.map((img, i) => (
                <div key={i} className="flex-[1.08] aspect-[3/5] overflow-hidden">
                  <img
                    src={img}
                    alt={`${item.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Content group (Text + Shelf image) */}
            <div className={`flex flex-col gap-6 w-full lg:w-1/2 pt-10 ${isLayoutLeft ? 'order-2' : 'lg:order-1'}`}>
              <div className="flex flex-col gap-4">
                <h3 className="[font-family:'Barlow',Helvetica] font-bold text-[#68161c] text-3xl md:text-[40px] tracking-tight uppercase">
                  {item.title}
                </h3>
                <p className="[font-family:'Barlow',Helvetica] font-normal text-black text-sm sm:text-base md:text-lg lg:text-[18px] leading-relaxed max-w-[700px]">
                  {item.description}
                </p>
              </div>
              <div className="w-full aspect-[16/6.5] overflow-hidden">
                <img
                  src={item.shelfImage}
                  alt={`${item.title} shelf`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
