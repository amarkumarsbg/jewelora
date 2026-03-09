



import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";

import { Truck, CreditCard, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Coupons
const coupons = [
  { code: "DISCOUNT10", discount: 50 },
  { code: "DISCOUNTGIVEAWAY", discount: 30 },
  {code:"DISCOUNTOWNER",discount:298},
];

const Checkout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowProduct = location.state?.product;

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Loader
  const [showLoader, setShowLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Save address
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Order notes & payment method
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Razorpay"); // "Razorpay" | "COD"

  // Estimated delivery
  const today = new Date();
  const deliveryStart = new Date(today);
  const deliveryEnd = new Date(today);
  deliveryStart.setDate(today.getDate() + 5);
  deliveryEnd.setDate(today.getDate() + 8);
  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const estimatedDelivery = `${formatDate(deliveryStart)} – ${formatDate(
    deliveryEnd
  )}`;

  // Load cart / buy now
  useEffect(() => {
    if (buyNowProduct) {
      setCartItems([{ ...buyNowProduct, quantity: 1 }]);
      setLoading(false);
    } else if (!currentUser) {
      setLoading(false);
    } else {
      const fetchCart = async () => {
        const snapshot = await getDocs(
          collection(db, "carts", currentUser.uid, "items")
        );
        setCartItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      };
      fetchCart();
    }
  }, [currentUser, buyNowProduct]);

  // Load saved addresses
  useEffect(() => {
    if (!currentUser) return;
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      const snapshot = await getDocs(
        collection(db, "users", currentUser.uid, "addresses")
      );
      setSavedAddresses(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingAddresses(false);
    };
    fetchAddresses();
  }, [currentUser]);

  const handleSelectSavedAddress = (addr) => {
    setFullName(addr.fullName);
    setEmail(addr.email || currentUser.email);
    setPhone(addr.phone);
    setAddress(addr.address);
    setPincode(addr.pincode);
    setCity(addr.city);
    setState(addr.state);
  };

  // Price calculation
  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      parseInt(item.price?.toString().replace(/[^\d]/g, "")) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const shipping = 0;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  // Apply coupon
  const handleApplyCoupon = () => {
    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === couponCode.toUpperCase()
    );
    if (coupon) {
      setDiscountAmount(coupon.discount);
      setCouponMessage(`Coupon applied! ₹${coupon.discount} off.`);
    } else {
      setDiscountAmount(0);
      setCouponMessage("Invalid coupon code.");
    }
  };

  // =====================
  // PLACE ORDER (PREPAID or COD)
  // =====================
  const handlePlaceOrderClick = async () => {
    if (!currentUser) {
      toast("Please sign in to place an order.");
      return;
    }
    if (!fullName || !phone || !address || !pincode || !city || !state) {
      toast("Please fill all required fields.");
      return;
    }

    try {
      setPlacingOrder(true);
      setShowLoader(true);
      setLoaderText("Initializing payment...");

      // Save address (optional)
      if (saveAddress) {
        await addDoc(collection(db, "users", currentUser.uid, "addresses"), {
          fullName,
          email,
          phone,
          address,
          pincode,
          city,
          state,
          createdAt: new Date(),
        });
      }

      const isCOD = paymentMethod === "COD";

      // ✅ CREATE ORDER FIRST
      const orderRef = await addDoc(
        collection(db, "orders", currentUser.uid, "orders"),
        {
          userId: currentUser.uid,
          items: cartItems,
          total,
          shipping,
          paymentMethod: isCOD ? "COD" : "Razorpay",
          paymentStatus: isCOD ? "pending" : "pending",
          status: isCOD ? "confirmed" : "payment_pending",
          shippingInfo: {
            fullName,
            email,
            phone,
            address,
            pincode,
            city,
            state,
          },
          orderNotes: orderNotes || null,
          estimatedDelivery,
          createdAt: new Date(),
        }
      );

      // COD: Skip payment, complete order
      if (isCOD) {
        if (!buyNowProduct) {
          const cartRef = collection(db, "carts", currentUser.uid, "items");
          const snapshot = await getDocs(cartRef);
          await Promise.all(
            snapshot.docs.map((d) =>
              deleteDoc(doc(db, "carts", currentUser.uid, "items", d.id))
            )
          );
        }
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORDER,
          {
            customer_name: fullName,
            customer_email: email,
            order_id: orderRef.id,
            order_total: total,
            payment_method: "Cash on Delivery",
            order_items: cartItems
              .map((item) => `${item.name} × ${item.quantity || 1}`)
              .join(", "),
            address: `${address}, ${city}, ${state} - ${pincode}`,
          },
          { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
        ).catch(() => { /* Email notification failed */ });
        setShowLoader(false);
        setPlacingOrder(false);
        navigate("/order-confirmation", {
          state: {
            orderId: orderRef.id,
            total,
            paymentStatus: "pending",
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            paymentMethod: "COD",
          },
        });
        return;
      }

      // Create Razorpay order (prepaid)
      const response = await fetch(
        "https://jewelorabackend.onrender.com/create-razorpay-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            firestoreOrderId: orderRef.id, // 👈 REQUIRED FOR YOUR BACKEND
          }),
        }
      );

      const razorpayOrder = await response.json();
      setShowLoader(false);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Jewelora",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            setShowLoader(true);
            setLoaderText("Verifying payment...");

            const verifyRes = await fetch(
              "https://jewelorabackend.onrender.com/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  firestoreOrderId: orderRef.id,
                  userId: currentUser.uid,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error();

            // Clear cart
            if (!buyNowProduct) {
              const cartRef = collection(db, "carts", currentUser.uid, "items");
              const snapshot = await getDocs(cartRef);
              await Promise.all(
                snapshot.docs.map((d) =>
                  deleteDoc(doc(db, "carts", currentUser.uid, "items", d.id))
                )
              );
            }
// =======================
// SEND ORDER CONFIRMATION EMAIL
// =======================
emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORDER,
  {
    customer_name: fullName,
    customer_email: email,
    order_id: orderRef.id,
    order_total: total,
    payment_method: "Razorpay",
    order_items: cartItems
      .map(item => `${item.name} × ${item.quantity || 1}`)
      .join(", "),
    address: `${address}, ${city}, ${state} - ${pincode}`,
  },
  { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
)
.catch(() => {
  /* Email notification failed - order still placed */
});

            setShowLoader(false);
            setPlacingOrder(false);

            navigate("/order-confirmation", {
              state: {
                orderId: orderRef.id,
                total,
                paymentStatus: "paid",
                fullName,
                email,
                phone,
                address,
                city,
                state,
                pincode,
                paymentMethod: "Razorpay",
              },
            });
          } catch {
            setShowLoader(false);
            setPlacingOrder(false);
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: fullName,
          email,
          contact: phone,
        },
        theme: { color: "#f5b700" },
      };

      new window.Razorpay(options).open();
    } catch {
      setShowLoader(false);
      setPlacingOrder(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  // Sign-in gate for guests
  if (!currentUser) {
    return (
      <section className="min-h-[60vh] bg-cream flex items-center justify-center py-16">
        <div className="mx-auto max-w-lg px-4">
          <div className="bg-white rounded-2xl border border-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <LogIn className="text-primary" size={40} />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-neutral-dark mb-3">
              Sign in to checkout
            </h2>
            <p className="text-neutral-mid mb-8 max-w-sm mx-auto">
              Sign in to complete your order and proceed to secure payment.
            </p>
            <Link
              to="/signin"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-primary-dark transition-colors"
            >
              <LogIn size={20} />
              Sign In
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
  <>
    {showLoader && (
      <div className="fixed inset-0 bg-white/90 z-[9999] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <strong>{loaderText}</strong>
        <small>Please don’t refresh or close this page</small>
      </div>
    )}

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="mb-8 text-center font-heading text-3xl font-medium text-neutral-dark">Checkout</h2>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[
          { step: 1, label: "Cart", done: true },
          { step: 2, label: "Shipping", done: true },
          { step: 3, label: "Payment", done: false },
        ].map(({ step, label, done }, i) => (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step < 3 || placingOrder ? "bg-primary text-white" : "bg-neutral-200 text-neutral-mid"
                }`}
              >
                {step < 3 ? "✓" : step}
              </div>
              <span className="text-sm font-medium text-neutral-dark hidden sm:inline">{label}</span>
            </div>
            {i < 2 && <div className="w-12 h-0.5 bg-primary/30 mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-border rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h5 className="mb-6 font-semibold text-primary flex items-center gap-2">
              <Truck size={20} />
              Shipping Information
            </h5>

            {/* Payment method selector */}
            <div className="mb-6">
              <label className="block font-semibold text-neutral-dark mb-2">Payment Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                    className="w-4 h-4 text-primary"
                  />
                  <span>Online Payment (Razorpay)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-4 h-4 text-primary"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            {loadingAddresses ? (
              <p>Loading saved addresses...</p>
            ) : savedAddresses.length > 0 ? (
              <div className="mb-6">
                <label className="block font-semibold text-neutral-dark mb-2">
                  Select Saved Address
                </label>
                <select
                  className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all"
                  onChange={(e) => {
                    const selected = savedAddresses.find(
                      (a) => a.id === e.target.value
                    );
                    if (selected) handleSelectSavedAddress(selected);
                  }}
                  defaultValue=""
                  disabled={placingOrder || showLoader}
                >
                  <option value="" disabled>
                    -- Choose an address --
                  </option>
                  {savedAddresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.fullName} — {addr.address}, {addr.city}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* 🔒 DISABLE FORM DURING PAYMENT */}
            <fieldset disabled={placingOrder || showLoader} className="border-0 p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">Full Name *</label>
                  <input
                    className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all disabled:opacity-60"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">Email</label>
                  <input
                    className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all disabled:opacity-60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">Phone *</label>
                  <input
                    className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all disabled:opacity-60"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-dark mb-2">Address *</label>
                  <input
                    className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all disabled:opacity-60"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">Pincode *</label>
                  <input
                    className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all disabled:opacity-60"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">City *</label>
                  <input
                    className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all disabled:opacity-60"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">State *</label>
                  <input
                    className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all disabled:opacity-60"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                    checked={saveAddress}
                    onChange={() => setSaveAddress(!saveAddress)}
                  />
                  <label htmlFor="saveAddress" className="text-sm text-neutral-dark">
                    Save this address for future use
                  </label>
                </div>

                <div className="md:col-span-2 mt-4">
                  <label className="block text-sm font-medium text-neutral-dark mb-2">Order Notes (optional)</label>
                  <textarea
                    className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm placeholder:text-neutral-mid/50 focus:border-primary focus:outline-none transition-all disabled:opacity-60"
                    rows={3}
                    placeholder="Gift wrap, message for recipient, special instructions..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    disabled={placingOrder || showLoader}
                  />
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="bg-linen border border-border rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h5 className="mb-6 font-semibold text-primary flex items-center gap-2">
              <CreditCard size={20} />
              Order Summary
            </h5>

            {/* Optional info */}
            <div className="mb-4 text-neutral-mid text-sm">
              Payment Method: <strong>{paymentMethod === "COD" ? "Cash on Delivery" : "Prepaid (Razorpay)"}</strong>
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-neutral-dark mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-sm border border-input bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all disabled:opacity-60"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={placingOrder || showLoader}
                />
                <button
                  type="button"
                  className="bg-primary text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
                  onClick={handleApplyCoupon}
                  disabled={placingOrder || showLoader}
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <small className={couponMessage.startsWith("Invalid") ? "text-error" : "text-success"}>{couponMessage}</small>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {cartItems.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-start py-2 border-b border-border"
                >
                  <div>
                    <strong className="text-neutral-dark">{item.name}</strong>
                    <div className="text-sm text-neutral-mid">
                      Qty: {item.quantity || 1}
                    </div>
                  </div>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-b border-border">
                <span>Subtotal</span>
                <strong>₹{subtotal}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span>Shipping</span>
                <strong>₹{shipping}</strong>
              </div>
              <div className="flex justify-between py-2 font-bold text-primary">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <p className="text-neutral-mid text-sm mb-6">
              <strong>Estimated Delivery:</strong> {estimatedDelivery}
            </p>

            <button
              type="button"
              className="w-full bg-accent text-white rounded-full py-4 text-base font-semibold hover:brightness-90 transition-all disabled:opacity-60"
              onClick={handlePlaceOrderClick}
              disabled={placingOrder || showLoader}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

};

export default Checkout;








