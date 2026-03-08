import { useEffect, useState } from "react";
import { X, Instagram } from "lucide-react";

export default function PromoModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem("promoShown");

    if (!hasSeenPromo) {
      setShowModal(true);
      sessionStorage.setItem("promoShown", "true");
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h5 className="font-heading font-bold text-neutral-dark">
            🎉 Flat <span className="text-primary">20% OFF</span> on First Order
          </h5>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-primary-light text-neutral-mid hover:text-neutral-dark transition-colors"
            onClick={closeModal}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <img
            src="https://res.cloudinary.com/dvxaztwnz/image/upload/v1754764049/modal_mveu6q.png"
            alt="Jewelry Offer"
            className="w-full max-h-48 object-cover rounded-lg shadow-sm mb-4"
          />

          <p className="text-neutral-dark mb-2">
            ✨ Follow us on <strong>Instagram</strong> & get
          </p>

          <p className="font-bold text-success mb-4">
            FREE SHIPPING + Exclusive Deals
          </p>

          <p className="text-neutral-mid text-sm mb-6">
            Sign up today and unlock premium jewelry offers curated just for you.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="https://www.instagram.com/jew_elora/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary text-white rounded-full py-3 font-semibold hover:bg-primary-dark transition-colors"
            >
              <Instagram size={18} />
              Follow on Instagram
            </a>

            <a
              href="/signup"
              className="bg-accent text-white rounded-full py-3 font-bold hover:brightness-90 transition-all"
            >
              Sign Up / Sign In
            </a>

            <a
              href="/shop"
              className="border border-neutral-dark text-neutral-dark rounded-full py-3 font-semibold hover:bg-neutral-dark hover:text-white transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
