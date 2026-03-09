import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AnnouncementBar = () => {
  const offers = [
    "Free Shipping on Orders over ₹999",
    "Use code WELCOME10 for 10% off your first order",
    "Follow Us on Instagram for Exclusive Offers",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevOffer = () => {
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
  };

  const nextOffer = () => {
    setCurrentIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === offers.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [offers.length]);

  return (
    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white flex items-center justify-center gap-3 sm:gap-6 py-2.5 px-2 sm:px-4 text-[11px] sm:text-xs font-medium tracking-widest uppercase safe-area-pt">
      <button
        type="button"
        className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/15 rounded-full transition-all duration-200 touch-manipulation"
        onClick={prevOffer}
        aria-label="Previous offer"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="flex-1 min-w-0 text-center truncate sm:whitespace-normal sm:overflow-visible transition-opacity duration-300">
        {offers[currentIndex]}
      </span>
      <button
        type="button"
        className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/15 rounded-full transition-all duration-200 touch-manipulation"
        onClick={nextOffer}
        aria-label="Next offer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
