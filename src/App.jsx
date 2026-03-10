import React, { Suspense, lazy } from "react";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { Routes, Route, useLocation } from "react-router-dom";
import TambolaModal from "./components/TambolaModal";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./pages/ScrollToTop";

// Lazy load all route components - each page loads only when visited
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const CategoryShowcase = lazy(() => import("./components/home/CategoryShowcase"));
const SavedAddresses = lazy(() => import("./pages/SavedAddresses"));
const Profile = lazy(() => import("./pages/Profile"));
const Payments = lazy(() => import("./pages/Payments"));
const Sale = lazy(() => import("./pages/Sale"));
const CustomerReviews = lazy(() => import("./pages/CustomerReviews"));
const AddReview = lazy(() => import("./pages/AddReview"));
const MyOrders = lazy(() => import("./pages/MyOrder"));
const Terms = lazy(() => import("./pages/policies/Terms"));
const Privacy = lazy(() => import("./pages/policies/Privacy"));
const Refund = lazy(() => import("./pages/policies/Refund"));
const Replacement = lazy(() => import("./pages/policies/Replacement"));
const Cancellation = lazy(() => import("./pages/policies/Cancellation"));
const Shipping = lazy(() => import("./pages/policies/Shipping"));
const FAQ = lazy(() => import("./pages/FAQ"));

const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminContactMessages = lazy(() => import("./pages/AdminContactPage"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const FinanceDashboard = lazy(() => import("./pages/FinanceDashboard"));
const AddFinanceEntry = lazy(() => import("./pages/AddFinanceEntry"));
const ProductInventory = lazy(() => import("./pages/ProductInventory"));
const AdminSalesDashboard = lazy(() => import("./pages/AdminSalesDashboard"));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const location = useLocation();
  const hideFooter = ["/signin", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#2D2A32",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
            padding: "14px 48px 14px 18px",
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ message }) => (
              <div className="relative flex items-center gap-3 pr-8">
                {t.icon && <span className="flex-shrink-0">{t.icon}</span>}
                <span className="text-[15px] font-medium">{message}</span>
                {t.type !== "loading" && (
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute -top-1 -right-1 w-8 h-8 flex items-center justify-center rounded-full text-neutral-mid hover:bg-neutral-dark/5 hover:text-neutral-dark transition-colors"
                    aria-label="Dismiss"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
      <TambolaModal />
      <ScrollToTop />
      <Navbar />
      <div className="flex-1 pb-24 lg:pb-0 safe-area-pb">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/category" element={<CategoryShowcase />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/saved-address" element={<SavedAddresses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reviews" element={<CustomerReviews />} />
            <Route path="/add-review" element={<AddReview />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/policies/terms" element={<Terms />} />
            <Route path="/policies/privacy" element={<Privacy />} />
            <Route path="/policies/refund" element={<Refund />} />
            <Route path="/policies/replacement" element={<Replacement />} />
            <Route path="/policies/cancellation" element={<Cancellation />} />
            <Route path="/policies/shipping" element={<Shipping />} />
            <Route path="/faq" element={<FAQ />} />

            <Route element={<AdminLayout />}>
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/message" element={<AdminContactMessages />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/admin/finance" element={<FinanceDashboard />} />
              <Route path="/admin/finance/add" element={<AddFinanceEntry />} />
              <Route path="/admin/inventory" element={<ProductInventory />} />
              <Route path="/admin/sales" element={<AdminSalesDashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
