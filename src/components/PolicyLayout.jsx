import { useEffect } from "react";
import MobileBackHeader from "./ui/MobileBackHeader";

export default function PolicyLayout({ title, lastUpdated = "2025-09-01", children }) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} • Jewelora`;
    return () => (document.title = prev);
  }, [title]);

  return (
    <main className="bg-cream pt-0 pb-16 min-h-screen">
      <MobileBackHeader title={title} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <header className="mb-6 lg:block hidden">
          <h1 className="font-heading text-3xl font-medium text-neutral-dark m-0">
            {title}
          </h1>
          <p className="mt-2 text-sm text-neutral-mid">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div
          className="p-4 border border-border rounded-lg bg-linen mb-8 text-sm text-neutral-mid"
          aria-label="Legal disclaimer"
        >
          This page is provided for general information and does not constitute legal advice.
        </div>

        <article className="text-neutral-mid leading-relaxed [&_h2]:font-bold [&_h2]:text-neutral-dark [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg">
          {children}
        </article>

        <footer className="mt-10 text-sm text-neutral-mid">
          Questions? Email{" "}
          <a href="mailto:info@jewelora.in" className="text-primary hover:underline">
            info@jewelora.in
          </a>
        </footer>
      </div>
    </main>
  );
}
