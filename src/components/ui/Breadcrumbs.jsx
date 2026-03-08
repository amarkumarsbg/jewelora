import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-neutral-mid mb-6 flex-wrap" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary transition-colors">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-neutral-mid/60" />
          {item.to ? (
            <Link to={item.to} className="hover:text-primary transition-colors">{item.label}</Link>
          ) : (
            <span className="text-neutral-dark font-medium line-clamp-1 max-w-[200px]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
