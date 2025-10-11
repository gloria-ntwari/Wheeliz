import { useState } from "react";
import { Separator } from "../../../../components/ui/separator";

const commonAnswer = "To ensure our products remain non-GMO, sometimes sourcing within Canada is not an option. Our seasonings often contain spices, which may not be available in Canada due to our climate.\nWe also take transportation emissions into consideration. For example, we are far closer to say, Oregon than we are to Prince Edward Island.";

const faqDataColumn1 = [
  {
    id: "item-1",
    question: "Are your products gluten free?",
    answer: commonAnswer,
  },
  {
    id: "item-2",
    question: "Are your products gluten free?",
    answer: commonAnswer,
  },
  {
    id: "item-3",
    question: "Are your products gluten free?",
    answer: commonAnswer,
  },
  {
    id: "item-4",
    question:
      "Why do your products contain both imported and domestic ingredients?",
    answer: commonAnswer,
  },
];

const faqDataColumn2 = [
  {
    id: "item-5",
    question: "Are your products gluten free?",
    answer: commonAnswer,
  },
  {
    id: "item-6",
    question: "Are your products gluten free?",
    answer: commonAnswer,
  },
  {
    id: "item-7",
    question: "Are your products gluten free?",
    answer: commonAnswer,
  },
  {
    id: "item-8",
    question: "Are your products gluten free?",
    answer: commonAnswer,
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
      className="flex flex-col items-start gap-8 sm:gap-10 md:gap-12 w-full bg-white px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24 py-8 sm:py-12 md:py-16 lg:py-20"
    >
      <h2 className="w-full [font-family:'Barlow',Helvetica] font-semibold text-black text-2xl sm:text-3xl md:text-4xl lg:text-[45px] tracking-[-0.90px] leading-tight text-center lg:text-left">
        FAQ
      </h2>

      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[104px] w-full">
        <div className="flex flex-col items-start flex-1 w-full lg:w-auto">
          {faqDataColumn1.map((item) => (
            <div key={item.id} className="w-full">
              <Separator className="w-full" />
              <div className="py-4 sm:py-5 md:py-6">
                <div 
                  className="flex items-center gap-4 sm:gap-6 md:gap-8 w-full cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#fcc809] flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-sm sm:text-base md:text-lg font-bold">
                      {openItems.includes(item.id) ? '−' : '+'}
                    </span>
                  </div>
                  <div className="font-semibold text-black text-base sm:text-lg md:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed text-left flex-1">
                    {item.question}
                  </div>
                </div>
                {openItems.includes(item.id) && (
                  <div className="mt-3 sm:mt-4 ml-8 sm:ml-10 md:ml-12">
                    <div className="w-full font-medium text-[#1e1e1e] text-sm sm:text-base md:text-lg lg:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed whitespace-pre-line">
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
                  className="flex items-center gap-4 sm:gap-6 md:gap-8 w-full cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#fcc809] flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-sm sm:text-base md:text-lg font-bold">
                      {openItems.includes(item.id) ? '−' : '+'}
                    </span>
                  </div>
                  <div className="font-semibold text-black text-base sm:text-lg md:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed text-left flex-1">
                    {item.question}
                  </div>
                </div>
                {openItems.includes(item.id) && (
                  <div className="mt-3 sm:mt-4 ml-8 sm:ml-10 md:ml-12">
                    <div className="w-full font-medium text-[#1e1e1e] text-sm sm:text-base md:text-lg lg:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed whitespace-pre-line">
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
