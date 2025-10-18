import { useState } from "react";
import { Separator } from "../../../../components/ui/separator";

const commonAnswer = "To ensure our products remain non-GMO, sometimes sourcing within Canada is not an option. Our seasonings often contain spices, which may not be available in Canada due to our climate.\nWe also take transportation emissions into consideration. For example, we are far closer to say, Oregon than we are to Prince Edward Island.";

const faqDataColumn1 = [
  {
    id: "item-1",
    question: "What are Wheeliez made from",
    answer: "Wheeliez are made from a delicious blend of high-quality potatoes and wheat for that perfect crispy crunch.",
  },
  {
    id: "item-2",
    question: "What flavours are available?",
    answer: "Wheeliez come in two exciting flavours ; Sweet Cheese and Sweet Tomato.",
  },
  {
    id: "item-3",
    question: "How can I become a distributor?",
    answer: "You can become a distributor by visiting our contact page and following the same simple steps ",
  },
];

const faqDataColumn2 = [
  {
    id: "item-4",
    question:
      "Where is Wheeliez from?",
    answer: "Wheeliez are proudly made in Rwanda by Hollanda FairFoods.",
  },
  {
    id: "item-5",
    question: "Are Wheeliez for adults or kids?",
    answer: "Wheeliez are made for kids but loved and enjoyed by all ages!",
  },
];

export const SweetTreatsSection = (): JSX.Element => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <section 
      className="flex flex-col items-start w-full gap-8 px-4 py-8 bg-white sm:gap-10 md:gap-12 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-32 sm:py-12 md:py-16 lg:py-20"
    >
      <h2 className="w-full [font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[43px] tracking-[-0.90px] leading-tight text-center lg:text-left">
        FAQ
      </h2>

      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[104px] w-full">
        <div className="flex flex-col items-start flex-1 w-full lg:w-auto">
          {faqDataColumn1.map((item) => (
            <div key={item.id} className="w-full">
              <Separator className="w-full" />
              <div className="py-4 sm:py-5 md:py-6">
                <div 
                  className="flex items-center w-full gap-4 cursor-pointer sm:gap-6 md:gap-8"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#fcc809] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-black sm:text-base md:text-lg">
                      {openItems.includes(item.id) ? '−' : '+'}
                    </span>
                  </div>
                  <div className="font-semibold text-black text-base sm:text-lg md:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed text-left flex-1">
                    {item.question}
                  </div>
                </div>
                {openItems.includes(item.id) && (
                  <div className="mt-3 ml-8 sm:mt-4 sm:ml-10 md:ml-12">
                    <div className="w-full font-medium text-[#1e1e1e] text-sm sm:text-base md:text-lg lg:text-[18px] [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start flex-1 w-full lg:w-auto">
          {faqDataColumn2.map((item) => (
            <div key={item.id} className="w-full">
              <Separator className="w-full" />
              <div className="py-4 sm:py-5 md:py-6">
                <div 
                  className="flex items-center w-full gap-4 cursor-pointer sm:gap-6 md:gap-8"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#fcc809] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-black sm:text-base md:text-lg">
                      {openItems.includes(item.id) ? '−' : '+'}
                    </span>
                  </div>
                  <div className="font-semibold text-black text-base sm:text-lg md:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed text-left flex-1">
                    {item.question}
                  </div>
                </div>
                {openItems.includes(item.id) && (
                  <div className="mt-3 ml-8 sm:mt-4 sm:ml-10 md:ml-12">
                    <div className="w-full font-medium text-[#1e1e1e] text-sm sm:text-base md:text-lg lg:text-[18px] [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
