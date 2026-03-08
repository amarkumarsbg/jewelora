import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, MapPin, ShoppingBag, Receipt } from "lucide-react";
import successIcon from "../assets/sucessicon.png";

const OrderConfirmation = () => {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/" />;
  }

  const {
    orderId,
    total,
    paymentStatus,
    fullName,
    email,
    phone,
    address,
    city,
    state: userState,
    pincode,
    paymentMethod,
  } = state;

  const isPaid = paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-linen">
      {/* Header */}
      <div className="bg-primary py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-medium !text-white">
            {isPaid ? "Order Confirmed" : "Order Placed"}
          </h1>
          <p className="mt-2 text-white/80 text-sm md:text-base">
            Thank you for shopping with Jewelora. Your order is being processed.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isPaid ? "bg-success/20" : "bg-warning/20"
              }`}
            >
              <CheckCircle
                size={48}
                className={isPaid ? "text-success" : "text-warning"}
              />
            </div>
          </div>

          <h2 className="font-heading text-2xl font-semibold text-neutral-dark mb-2">
            {isPaid ? "Payment Successful" : "Payment Pending"}
          </h2>
          <p className="text-neutral-mid mb-8">
            We'll send you order updates and tracking information.
          </p>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6 text-left">
            <h3 className="font-heading text-lg font-semibold text-neutral-dark mb-4 flex items-center gap-2">
              <Receipt size={20} className="text-primary" />
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-neutral-mid">Order ID</span>
                <span className="font-medium text-neutral-dark">{orderId}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-neutral-mid">Payment Method</span>
                <span className="font-medium text-neutral-dark">
                  {paymentMethod || "Razorpay"}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-neutral-mid">Status</span>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    isPaid ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                  }`}
                >
                  {isPaid ? "Paid" : "Pending"}
                </span>
              </p>
              <p className="flex justify-between pt-2 border-t border-black/5">
                <span className="text-neutral-mid">Total</span>
                <span className="font-semibold text-neutral-dark">₹{total}</span>
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-8 text-left">
            <h3 className="font-heading text-lg font-semibold text-neutral-dark mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Delivery Address
            </h3>
            <div className="space-y-1 text-sm text-neutral-dark">
              <p className="font-semibold">{fullName}</p>
              <p>{address}</p>
              <p>
                {city}, {userState} – {pincode}
              </p>
              <p>{phone}</p>
              {email && <p>{email}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <Package size={18} />
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
