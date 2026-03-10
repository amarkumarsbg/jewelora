import { useState, useEffect } from "react";

const AnnouncementBar = () => {
  const offers = [
    "Free Shipping on Orders over ₹999",
    "Use code WELCOME10 for 10% off your first order",
    "Follow Us on Instagram for Exclusive Offers",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === offers.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [offers.length]);

  return (
    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white flex items-center justify-center min-h-[44px] py-2.5 px-4 text-[11px] sm:text-xs font-medium tracking-widest uppercase safe-area-pt">
      <span className="text-center truncate sm:whitespace-normal sm:overflow-visible transition-opacity duration-300">
        {offers[currentIndex]}
      </span>
    </div>
  );
};

export default AnnouncementBar;
