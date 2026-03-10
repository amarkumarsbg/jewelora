import { ChevronLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

/**
 * Mobile-only back button header with chevron + title.
 * Shows only on screens smaller than lg. Desktop users rely on nav/links.
 */
export default function MobileBackHeader({ title, to }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (to) return; // Link will handle
    e.preventDefault();
    navigate(-1);
  };

  const content = (
    <>
      <ChevronLeft size={24} className="shrink-0 text-neutral-dark" aria-hidden />
      <span className="font-medium text-neutral-dark truncate">{title}</span>
    </>
  );

  const linkClass = "flex items-center gap-2 min-h-[52px] py-3 w-full text-left px-4 sm:px-6 text-neutral-dark hover:text-primary transition-colors touch-manipulation";
  return (
    <div className="lg:hidden shrink-0 w-full sticky top-16 sm:top-20 z-20 bg-white/95 backdrop-blur-sm border-b border-black/5">
      {to ? (
        <Link
          to={to}
          className={linkClass}
          aria-label={`Back to ${title}`}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={linkClass}
          aria-label={`Back`}
        >
          {content}
        </button>
      )}
    </div>
  );
}
