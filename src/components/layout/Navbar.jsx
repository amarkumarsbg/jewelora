import React, { useState, useEffect } from "react";
import { LogIn, ShoppingCart, User, Menu, X, Home, ShoppingBag, LayoutGrid, Info, Heart, Package, MapPin, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAddToCartAnimation } from "../../context/AddToCartAnimationContext";
import { motion } from "framer-motion";
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
  const { bounce } = useAddToCartAnimation();
  const [cartCount, setCartCount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = currentUser?.email === "info@jewelora.in";

  useEffect(() => {
    if (!currentUser || isAdmin) return;
    const unsub = onSnapshot(
      collection(db, "carts", currentUser.uid, "items"),
      (snap) => setCartCount(snap.size)
    );
    return () => unsub();
  }, [currentUser, isAdmin]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setCartDrawerOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
    closeMenu();
  };

  return (
    <>
      <AnnouncementBar />

      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Hamburger */}
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 text-neutral-dark hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={closeMenu}>
              <img
                src="https://res.cloudinary.com/dvxaztwnz/image/upload/v1754728677/jewelora_rlc5cq.jpg"
                alt="Jewelora"
                className="rounded-full border-2 border-secondary object-contain bg-white"
                style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}
              />
              <span className="hidden sm:inline font-[family-name:var(--font-heading)] text-2xl font-bold text-neutral-dark">
                Jewelora
              </span>
            </NavLink>

            {/* Desktop: Search */}
            <div className="hidden lg:block">
              <GlobalSearch />
            </div>

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

            {/* Right: Wishlist + Cart + Profile */}
            <div className="flex items-center gap-3">
              {!isAdmin && (
                <>
                  {currentUser && (
                    <NavLink
                      to="/wishlist"
                      onClick={closeMenu}
                      className="relative p-2 text-neutral-dark hover:text-primary transition-colors"
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
                      className="relative p-2 text-neutral-dark hover:text-primary transition-colors"
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
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-primary text-primary hover:bg-primary-light transition-colors"
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
                                {currentUser.displayName || "User"}
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
                  className="flex items-center gap-2 bg-primary text-white rounded-full px-6 py-2.5 text-xs uppercase tracking-[0.1em] font-semibold hover:bg-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <LogIn size={16} /> Login
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeMenu}
              aria-hidden="true"
            />
            <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-xl flex flex-col">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <span className="font-[family-name:var(--font-heading)] text-xl font-semibold">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="p-2 text-neutral-dark hover:text-primary"
                >
                  <X size={24} />
                </button>
              </div>
              <ul className="p-6 flex flex-col gap-4">
                {navLinks.map(({ path, label }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                      `block text-sm uppercase tracking-wider font-semibold py-2 ${
                        isActive ? "text-primary" : "text-neutral-dark hover:text-primary"
                      }`
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border flex justify-around py-2 safe-area-pb">
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex flex-col items-center gap-1 py-2 px-4 text-neutral-mid hover:text-primary transition-colors"
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink
          to="/shop"
          onClick={closeMenu}
          className="flex flex-col items-center gap-1 py-2 px-4 text-neutral-mid hover:text-primary transition-colors"
        >
          <ShoppingBag size={20} />
          <span className="text-xs">Shop</span>
        </NavLink>
        <NavLink
          to="/category"
          onClick={closeMenu}
          className="flex flex-col items-center gap-1 py-2 px-4 text-neutral-mid hover:text-primary transition-colors"
        >
          <LayoutGrid size={20} />
          <span className="text-xs">Category</span>
        </NavLink>
        {!isAdmin && (
          <>
            {currentUser && (
              <NavLink
                to="/wishlist"
                onClick={closeMenu}
                className="flex flex-col items-center gap-1 py-2 px-4 text-neutral-mid hover:text-primary transition-colors relative"
              >
                <Heart size={20} />
                <span className="text-xs">Wishlist</span>
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
              className="flex flex-col items-center gap-1 py-2 px-4 text-neutral-mid hover:text-primary transition-colors relative"
            >
              <ShoppingCart size={20} />
              <span className="text-xs">Cart</span>
              {currentUser && cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </>
        )}
        <NavLink
          to="/about"
          onClick={closeMenu}
          className="flex flex-col items-center gap-1 py-2 px-4 text-neutral-mid hover:text-primary transition-colors"
        >
          <Info size={20} />
          <span className="text-xs">About</span>
        </NavLink>
      </div>
    </>
  );
};

export default Navbar;
