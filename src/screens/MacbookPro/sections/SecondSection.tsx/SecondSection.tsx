import { PaginationDots } from "../../../../components/ui/pagination-dots";

export const SecondSection = (): JSX.Element => {
  return (
    <section 
      className="flex flex-col w-full items-center justify-center relative px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48"
      style={{
        paddingTop: '60px',
        paddingBottom: '60px',
        backgroundColor: '#F7A61E4D'
      }}
    >
      <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative w-full max-w-7xl">
        <h2 className="relative w-fit [font-family:'Barlow',Helvetica] font-bold text-[#333333] text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-0.90px] leading-tight text-center px-4">
          KEEPING IT REAL SINCE 1998
        </h2>

        <h3 className="relative w-fit [font-family:'Barlow',Helvetica] font-bold text-[#A04040] text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-[-0.60px] leading-tight text-center px-4">
          WE KEEP GROWING
        </h3>

        <p className="w-full font-normal text-[#333333] text-sm sm:text-base md:text-lg lg:text-xl text-center relative [font-family:'Barlow',Helvetica] tracking-[0] leading-relaxed px-4 max-w-4xl">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&#39;s standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not
          only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>

        {/* <img
        className="relative flex-[0_0_auto]"
        alt="Frame"
        src="/frame-84.svg"
      /> */}
      <PaginationDots />

      </div>
    </section>
  );
};
