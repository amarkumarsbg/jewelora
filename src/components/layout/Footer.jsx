import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Shield, Truck, RotateCcw, CreditCard } from "lucide-react";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";

const Footer = () => {
  const { currentUser, logout } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail?.trim()) return;
    setNewsletterLoading(true);
    try {
      await addDoc(collection(db, "newsletter"), {
        email: newsletterEmail.trim(),
        createdAt: new Date(),
      });
      setNewsletterEmail("");
      toast.success("Thanks for subscribing! Check your inbox for 10% off.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white pt-12 sm:pt-16 lg:pt-20 pb-20 lg:pb-12 mt-auto safe-area-pb">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16 pb-8 sm:pb-12 border-b border-white/20">
          {[
            { icon: Shield, label: "Secure Checkout", desc: "100% safe payment" },
            { icon: Truck, label: "Free Shipping", desc: "On orders over ₹999" },
            { icon: RotateCcw, label: "Easy Returns", desc: "Hassle-free exchanges" },
            { icon: CreditCard, label: "Secure Payment", desc: "Razorpay protected" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="text-primary" size={22} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white text-xs sm:text-sm truncate">{label}</p>
                <p className="text-white/60 text-[11px] sm:text-xs line-clamp-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {/* Brand + Social - full width on mobile, 2 cols on md, 1 on lg */}
          <div className="flex flex-col items-center md:items-start md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://res.cloudinary.com/dvxaztwnz/image/upload/v1754728677/jewelora_rlc5cq.jpg"
                alt="Jewelora"
                width={56}
                height={56}
                className="rounded-xl object-contain"
                style={{ maxWidth: 56, maxHeight: 56 }}
              />
              <span className="font-heading text-xl font-bold text-white">
                Jewelora
              </span>
            </div>
            <p className="text-sm text-white/70 text-center md:text-left mb-4">
              Discover timeless elegance. Premium crafted jewelry just for you.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="https://wa.me/919129987687?text=Hi!%20I'd%20like%20to%20know%20more%20about%20your%20jewelry%20collection."
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[44px] min-h-[44px] p-3 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20BD5A] hover:scale-110 transition-all touch-manipulation"
                aria-label="Chat on WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <a
                href="https://x.com/jew_elora"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all touch-manipulation"
                aria-label="X (Twitter)"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/jew_elora"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[44px] min-h-[44px] p-3 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors touch-manipulation"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/1CcdEpJRH4/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[44px] min-h-[44px] p-3 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors touch-manipulation"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Three sections side by side on mobile, grid items on md+ */}
          <div className="grid grid-cols-3 md:contents gap-4 md:gap-0">
          {/* Shop + Explore */}
          <div className="min-w-0">
            <h6 className="font-heading font-semibold text-white mb-3 sm:mb-5 text-xs sm:text-base">
              Shop + Explore
            </h6>
            <ul className="space-y-0.5 sm:space-y-3">
              {[
                { to: "/shop", label: "Shop it All" },
                { to: "/", label: "Home" },
                { to: "/category", label: "Categories" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="block py-2.5 sm:py-0 text-sm text-white/70 hover:text-white transition-colors touch-manipulation"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h6 className="font-heading font-semibold text-white mb-3 sm:mb-5 text-xs sm:text-base">
              Info
            </h6>
            <ul className="space-y-0.5 sm:space-y-3 text-[11px] sm:text-sm text-white/70">
              {currentUser && (
                <>
                  <li>
                    <Link to="/orders" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">
                      Cart
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full text-left py-1.5 sm:py-0 hover:text-white transition-colors font-medium touch-manipulation"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
              <li><Link to="/policies/terms" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">Terms</Link></li>
              <li><Link to="/policies/privacy" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">Privacy</Link></li>
              <li><Link to="/policies/refund" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">Refund</Link></li>
              <li><Link to="/policies/replacement" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">Replacement</Link></li>
              <li><Link to="/policies/cancellation" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">Cancellation</Link></li>
              <li><Link to="/policies/shipping" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">Shipping</Link></li>
              <li><Link to="/faq" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">FAQ</Link></li>
              <li><Link to="/add-review" className="block py-1.5 sm:py-0 hover:text-white transition-colors touch-manipulation">Give Review</Link></li>
              <li>
                <a
                  href="https://collaboration.payment.jewelora.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-1.5 sm:py-0 hover:text-primary transition-colors touch-manipulation"
                >
                  Collaborate With Us
                </a>
              </li>
              {!currentUser && (
                <li>
                  <Link to="/signin" className="block py-1.5 sm:py-0 font-semibold hover:text-primary transition-colors touch-manipulation">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="min-w-0">
            <h6 className="font-heading font-semibold text-white mb-3 sm:mb-5 text-xs sm:text-base">
              Refresh Your Inbox
            </h6>
            <p className="text-[11px] sm:text-sm text-white/70 mb-3 sm:mb-4">
              Join our email list to get 10% off your first order, plus early access to offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <input
                type="email"
                placeholder="Email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="w-full min-h-[44px] rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="min-h-[44px] bg-primary text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap disabled:opacity-70 touch-manipulation"
              >
                {newsletterLoading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/20 text-center text-xs sm:text-sm text-white/60 px-2">
          &copy; {new Date().getFullYear()} Jewelora. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
