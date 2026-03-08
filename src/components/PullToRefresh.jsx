import { useState, useRef } from "react";

export default function PullToRefresh({ onRefresh, children, disabled }) {
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const threshold = 80;
  const maxPull = 120;

  const handleTouchStart = (e) => {
    if (disabled) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (disabled || refreshing) return;
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop > 10) return; // Only when at top
    const y = e.touches[0].clientY;
    const delta = y - startY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, maxPull));
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && onRefresh && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div
          className="absolute left-0 right-0 top-0 flex justify-center pt-4 z-10 pointer-events-none"
          style={{ opacity: Math.min(pullDistance / threshold, 1) }}
        >
          <div className="bg-white/95 backdrop-blur rounded-full p-3 shadow-lg border border-black/5">
            {refreshing ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : pullDistance >= threshold ? (
              <span className="text-sm font-semibold text-primary">Release to refresh</span>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
