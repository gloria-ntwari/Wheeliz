import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationDotsProps {
  totalDots?: number;
  initialActiveDot?: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  totalDots = 4,
  initialActiveDot = 2,
}) => {
  const [activeDot, setActiveDot] = useState(initialActiveDot);

  const handlePrevious = () => {
    setActiveDot((prev) => (prev > 0 ? prev - 1 : totalDots - 1));
  };

  const handleNext = () => {
    setActiveDot((prev) => (prev < totalDots - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index: number) => {
    setActiveDot(index);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={handlePrevious}
        className="text-[#F7A61E] hover:text-[#d89419] transition-colors"
        aria-label="Previous"
      >
        <ArrowLeft size={32} strokeWidth={2.5} />
      </button>

      <div className="flex items-center gap-3">
        {Array.from({ length: totalDots }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`rounded-full transition-all ${
              index === activeDot
                ? "w-6 h-6 bg-[#F7A61E]"
                : "w-4 h-4 bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeDot ? "true" : "false"}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="text-[#F7A61E] hover:text-[#d89419] transition-colors"
        aria-label="Next"
      >
        <ArrowRight size={32} strokeWidth={2.5} />
      </button>
    </div>
  );
};
