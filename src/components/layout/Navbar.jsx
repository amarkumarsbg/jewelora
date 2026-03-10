import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogIn, ShoppingCart, User, Menu, X, Home, ShoppingBag, LayoutGrid, Info, Heart, Package, MapPin, LogOut, HelpCircle, CreditCard } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAddToCartAnimation } from "../../context/AddToCartAnimationContext";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import AnnouncementBar from "../AnnouncementBar";
import CartDrawer from "../CartDrawer";
import GlobalSearch from "../GlobalSearch";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/shop", label: "Shop" },
  { path: "/category", label: "Category" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const hideSearch = ["/signin", "/signup"].includes(location.pathname);
  const { bounce } = useAddToCartAnimation();
  const [cartCount, setCartCount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = currentUser?.email === "info@jewelora.in";

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(
      collection(db, "carts", currentUser.uid, "items"),
      (snap) => setCartCount(snap.docs.reduce((sum, d) => sum + Number(d.data().quantity ?? 1), 0))
    );
    return () => unsub();
  }, [currentUser]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setCartDrawerOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
    closeMenu();
  };

  return (
    <>
      <AnnouncementBar />

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-[0_1px_0_rgba(0,0,0,0.05)] safe-area-pt">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo - left on mobile */}
            <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={closeMenu}>
              <img
                src="https://res.cloudinary.com/dvxaztwnz/image/upload/v1754728677/jewelora_rlc5cq.jpg"
                alt="Jewelora"
                className="rounded-full border-2 border-secondary object-contain bg-white"
                style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}
              />
              <span className="font-[family-name:var(--font-heading)] text-lg sm:text-2xl font-bold text-neutral-dark">
                Jewelora
              </span>
            </NavLink>

            {/* Desktop: Search (hidden on auth pages) */}
            {!hideSearch && (
              <div className="hidden lg:block">
                <GlobalSearch />
              </div>
            )}

            {/* Desktop Nav Links */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map(({ path, label }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `relative text-sm font-medium transition-colors py-1 ${
                        isActive
                          ? "text-primary"
                          : "text-neutral-dark hover:text-primary"
                      } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full after:content-[''] ${
                        isActive ? "after:w-full" : ""
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right: Wishlist + Cart + Profile - desktop only */}
            <div className="hidden lg:flex items-center gap-3">
              {!isAdmin && (
                <>
                  {currentUser && (
                    <NavLink
                      to="/wishlist"
                      onClick={closeMenu}
                      className="relative min-w-[44px] min-h-[44px] p-3 flex items-center justify-center text-neutral-dark hover:text-primary transition-colors touch-manipulation"
                    >
                      <Heart size={20} />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                          {wishlistCount}
                        </span>
                      )}
                    </NavLink>
                  )}
                    <button
                    type="button"
                    onClick={() => setCartDrawerOpen(true)}
                    className="relative min-w-[44px] min-h-[44px] p-3 flex items-center justify-center text-neutral-dark hover:text-primary transition-colors touch-manipulation"
                    aria-label="Open cart"
                  >
                    <motion.span
                      animate={bounce ? { scale: [1, 1.3, 1], y: [0, -4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <ShoppingCart size={20} />
                    </motion.span>
                    {currentUser && cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full border border-primary text-primary hover:bg-primary-light transition-colors touch-manipulation"
                  >
                    <User size={18} />
                  </button>

                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileOpen(false)}
                        aria-hidden="true"
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-border shadow-[0_20px_50px_-12px_rgba(30,58,95,0.15)] overflow-hidden z-50">
                        {/* Header */}
                        <div className="px-4 py-4 bg-primary text-white">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shrink-0">
                              <User size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold truncate text-sm">
                                {currentUser.displayName || currentUser.email?.split("@")[0] || "User"}
                              </div>
                              <div className="text-xs text-white/80 truncate">{currentUser.email}</div>
                            </div>
                          </div>
                        </div>

                        {/* Menu links */}
                        <ul className="py-2">
                        {!isAdmin && (
                          <>
                            <li>
                              <NavLink
                                to="/wishlist"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <Heart size={18} className="text-secondary shrink-0" />
                                Wishlist
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/orders"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <Package size={18} className="text-secondary shrink-0" />
                                My Orders
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/saved-address"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <MapPin size={18} className="text-secondary shrink-0" />
                                Saved Addresses
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/payments"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <CreditCard size={18} className="text-secondary shrink-0" />
                                Payments
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/profile"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <User size={18} className="text-secondary shrink-0" />
                                My Profile
                              </NavLink>
                            </li>
                          </>
                        )}

                        {isAdmin && (
                          <>
                            <li>
                              <NavLink
                                to="/admin/orders"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <Package size={18} className="text-secondary shrink-0" />
                                Orders
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/admin/message"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <Package size={18} className="text-secondary shrink-0" />
                                Messages
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/addproduct"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <Package size={18} className="text-secondary shrink-0" />
                                Add Product
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/admin/finance"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <Package size={18} className="text-secondary shrink-0" />
                                Finance
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/admin/finance/add"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <Package size={18} className="text-secondary shrink-0" />
                                Add Finance Entry
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/admin/inventory"
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-dark hover:bg-primary-light hover:text-primary transition-colors"
                              >
                                <Package size={18} className="text-secondary shrink-0" />
                                Product Inventory
                              </NavLink>
                            </li>
                          </>
                        )}

                        <li className="border-t border-border mt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-error hover:bg-primary-light transition-colors"
                          >
                            <LogOut size={18} className="shrink-0" />
                            Logout
                          </button>
                        </li>
                      </ul>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/signin"
                  onClick={closeMenu}
                  className="flex items-center gap-2 bg-primary text-white rounded-full px-5 sm:px-6 py-2.5 min-h-[44px] text-xs uppercase tracking-[0.1em] font-semibold hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 touch-manipulation"
                >
                  <LogIn size={16} /> Login
                </NavLink>
              )}
            </div>

            {/* Hamburger - right on mobile */}
            <button
              type="button"
              className="lg:hidden min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-neutral-dark hover:text-primary transition-colors touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay - rendered via portal to ensure visibility */}
        {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
          {mobileMenuOpen && (
            <>
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden fixed inset-0 z-[9999] bg-black/40"
              onClick={closeMenu}
              aria-hidden="true"
            />
            <motion.div
              key="menu-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              style={{ willChange: "transform" }}
              className="lg:hidden fixed right-0 top-0 z-[10000] h-full w-[80%] max-w-[360px] min-w-[280px] bg-white shadow-xl flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
            >
              {/* Header */}
              <div className="shrink-0 px-5 pt-5 pb-4 flex items-start justify-between border-b border-neutral-200/80">
                <button
                  type="button"
                  onClick={closeMenu}
                  className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center text-neutral-dark hover:text-primary transition-colors touch-manipulation"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
                <div className="text-right">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Flat 20% OFF</p>
                  <p className="text-[10px] text-neutral-mid mt-0.5">on first order</p>
                </div>
              </div>

              {/* Menu list */}
              <ul className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain">
                <li className="border-b border-neutral-100">
                  <NavLink to="/" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                    <Home size={22} className="text-neutral-mid shrink-0" />
                    Home
                  </NavLink>
                </li>
                <li className="border-b border-neutral-100">
                  <NavLink to="/shop" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                    <ShoppingBag size={22} className="text-neutral-mid shrink-0" />
                    Shop
                  </NavLink>
                </li>
                <li className="border-b border-neutral-100">
                  <NavLink to="/category" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                    <LayoutGrid size={22} className="text-neutral-mid shrink-0" />
                    Category
                  </NavLink>
                </li>
                <li className="border-b border-neutral-100">
                  <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                    <Info size={22} className="text-neutral-mid shrink-0" />
                    About
                  </NavLink>
                </li>
                <li className="border-b border-neutral-100">
                  <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                    <MapPin size={22} className="text-neutral-mid shrink-0" />
                    Contact
                  </NavLink>
                </li>
                <li className="border-b border-neutral-100">
                  <NavLink to="/faq" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                    <HelpCircle size={22} className="text-neutral-mid shrink-0" />
                    FAQ
                  </NavLink>
                </li>

                <li className="border-b border-neutral-100">
                  <button type="button" onClick={() => { setMobileMenuOpen(false); setCartDrawerOpen(true); }} className="flex items-center gap-4 w-full px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors text-left">
                    <ShoppingCart size={22} className="text-neutral-mid shrink-0" />
                    Cart
                    {currentUser && !isAdmin && cartCount > 0 && (
                      <span className="ml-auto bg-primary text-white rounded-full min-w-[22px] h-[22px] px-1.5 text-xs flex items-center justify-center font-semibold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </li>
                {!isAdmin && currentUser ? (
                      <>
                        <li className="border-b border-neutral-100">
                          <NavLink to="/wishlist" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                            <Heart size={22} className="text-neutral-mid shrink-0" />
                            Wishlist
                            {wishlistCount > 0 && (
                              <span className="ml-auto bg-primary text-white rounded-full min-w-[22px] h-[22px] px-1.5 text-xs flex items-center justify-center font-semibold">
                                {wishlistCount}
                              </span>
                            )}
                          </NavLink>
                        </li>
                        <li className="border-b border-neutral-100">
                          <NavLink to="/orders" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                            <Package size={22} className="text-neutral-mid shrink-0" />
                            My Orders
                          </NavLink>
                        </li>
                        <li className="border-b border-neutral-100">
                          <NavLink to="/saved-address" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                            <MapPin size={22} className="text-neutral-mid shrink-0" />
                            Saved Addresses
                          </NavLink>
                        </li>
                        <li className="border-b border-neutral-100">
                          <NavLink to="/payments" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                            <CreditCard size={22} className="text-neutral-mid shrink-0" />
                            Payments
                          </NavLink>
                        </li>
                        <li className="border-b border-neutral-100">
                          <NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => `flex items-center gap-4 px-5 py-4 text-sm font-medium text-neutral-dark hover:bg-neutral-50 transition-colors ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                            <User size={22} className="text-neutral-mid shrink-0" />
                            My Profile
                          </NavLink>
                        </li>
                        <li>
                          <button type="button" onClick={handleLogout} className="flex items-center gap-4 w-full px-5 py-4 text-sm font-semibold text-error hover:bg-error/10 transition-colors">
                            <LogOut size={22} className="shrink-0" />
                            Log out
                          </button>
                        </li>
                      </>
                    ) : (
                      <li>
                        <NavLink to="/signin" onClick={closeMenu} className="flex items-center gap-4 px-5 py-4 text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors">
                          <LogIn size={22} />
                          Login
                        </NavLink>
                      </li>
                    )}
                )}

                {isAdmin && (
                  <li>
                    <button type="button" onClick={handleLogout} className="flex items-center gap-4 w-full px-5 py-4 text-sm font-semibold text-error hover:bg-error/10 transition-colors">
                      <LogOut size={22} className="shrink-0" />
                      Log out
                    </button>
                  </li>
                )}
              </ul>

              {/* User profile section at bottom */}
              {currentUser && (
                <div className="shrink-0 px-5 py-4 border-t border-neutral-200/80 bg-neutral-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg shrink-0">
                      {(currentUser.displayName || currentUser.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-dark truncate">
                        {currentUser.displayName || currentUser.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-xs text-neutral-mid truncate">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
          </AnimatePresence>,
          document.body
        )}
      </nav>

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border flex justify-around items-stretch py-2 safe-area-pb">
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 px-3 sm:px-4 text-neutral-mid hover:text-primary transition-colors touch-manipulation"
        >
          <Home size={20} />
          <span className="text-[10px] sm:text-xs">Home</span>
        </NavLink>
        <NavLink
          to="/shop"
          onClick={closeMenu}
          className="flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 px-3 sm:px-4 text-neutral-mid hover:text-primary transition-colors touch-manipulation"
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] sm:text-xs">Shop</span>
        </NavLink>
        <NavLink
          to="/category"
          onClick={closeMenu}
          className="flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 px-3 sm:px-4 text-neutral-mid hover:text-primary transition-colors touch-manipulation"
        >
          <LayoutGrid size={20} />
          <span className="text-[10px] sm:text-xs">Category</span>
        </NavLink>
        {currentUser && !isAdmin && (
          <NavLink
            to="/wishlist"
            onClick={closeMenu}
            className="flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 px-3 sm:px-4 text-neutral-mid hover:text-primary transition-colors relative touch-manipulation"
          >
            <Heart size={20} />
            <span className="text-[10px] sm:text-xs">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </NavLink>
        )}
        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 px-3 sm:px-4 text-neutral-mid hover:text-primary transition-colors relative touch-manipulation"
        >
          <ShoppingCart size={20} />
          <span className="text-[10px] sm:text-xs">Cart</span>
          {currentUser && !isAdmin && cartCount > 0 && (
            <span className="absolute top-1 right-1 bg-primary text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <NavLink
          to="/about"
          onClick={closeMenu}
          className="flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 px-3 sm:px-4 text-neutral-mid hover:text-primary transition-colors touch-manipulation"
        >
          <Info size={20} />
          <span className="text-[10px] sm:text-xs">About</span>
        </NavLink>
      </div>
    </>
  );
};

export default Navbar;
