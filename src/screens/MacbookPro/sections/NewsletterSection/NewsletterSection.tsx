import { ArrowRightIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export const NewsletterSection = (): JSX.Element => {
  return (
    <section 
      className="absolute flex flex-col w-full max-w-[797px] h-auto min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[423px] items-center lg:items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-[38px] px-4 sm:px-6 md:px-8 lg:px-[67px] py-8 sm:py-12 md:py-16 lg:py-[80px] bg-[#000000cc] left-1/2 -translate-x-1/2 lg:left-[105px] lg:translate-x-0 top-1/2 -translate-y-1/2 lg:top-[113px] lg:translate-y-0"
    >
      <h2 className="w-full [font-family:'Barlow',Helvetica] font-semibold text-white text-2xl sm:text-3xl md:text-4xl lg:text-[45px] tracking-[-0.90px] leading-tight text-center lg:text-left">
        Where To Find Us
      </h2>

      <p className="w-full font-normal text-white text-base sm:text-lg md:text-xl [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed text-center lg:text-left">
        We believe the best moments in life come with a side of snacks. Whether
        you&apos;re trekking a trail with a buddy, cracking up with a co-worker,
        or enjoying a movie night with the fam,
      </p>

      <Button className="flex w-[250px] sm:w-[280px] md:w-[300px] h-[50px] sm:h-[55px] md:h-[60px] items-center justify-center gap-2.5 p-2.5 bg-[#fcc809] hover:bg-[#fcc809]/90 rounded-none">
        <span className="text-sm sm:text-base md:text-lg lg:text-xl tracking-[-0.40px] leading-[22.6px] whitespace-nowrap [font-family:'Barlow',Helvetica] font-medium text-white">
          WHERE TO BUY
        </span>
        <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </Button>
    </section>
  );
};
