import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";

export default function AddFinanceEntry() {
  const [type, setType] = useState("sale");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [referenceId, setReferenceId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [billNo, setBillNo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addedBy, setAddedBy] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "info@jewelora.in") {
        setIsAdmin(true);
        setAddedBy(user.email);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    let finalAmount = 0;

    if (type === "sale") {
      const total = Number(price) * Number(quantity);
      const discountAmt = (total * Number(discount)) / 100;
      finalAmount = total - discountAmt;
    } else {
      finalAmount = Number(amount);
    }

    await addDoc(collection(db, "financeRecords"), {
      type,
      product: type === "sale" ? product : null,
      price: type === "sale" ? Number(price) : null,
      quantity: type === "sale" ? Number(quantity) : null,
      discount: type === "sale" ? Number(discount) : null,
      finalAmount,
      category: type === "expense" ? category : null,
      vendorName: type === "expense" ? vendorName : null,
      billNo: type === "expense" ? billNo : null,
      dueDate: type === "expense" && dueDate ? Timestamp.fromDate(new Date(dueDate)) : null,
      customerName: type === "sale" ? customerName : null,
      customerContact: type === "sale" ? customerContact : null,
      paymentMethod,
      referenceId,
      description,
      addedBy,
      date: Timestamp.now(),
    });

    toast.success("Entry added successfully");

    // Reset form
    setProduct("");
    setPrice("");
    setQuantity(1);
    setDiscount(0);
    setAmount("");
    setCategory("");
    setDescription("");
    setPaymentMethod("Cash");
    setReferenceId("");
    setCustomerName("");
    setCustomerContact("");
    setVendorName("");
    setBillNo("");
    setDueDate("");
  };

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!isAdmin) {
    return (
      <div className="alert alert-danger text-center mt-5">
        Access Denied. Only Admin Can Add Finance Entries.
      </div>
    );
  }

  return (
    <div className="container my-5">
      <motion.form
        onSubmit={handleSubmit}
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "600px" }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-center mb-4">Add Finance Entry</h2>

        {/* Entry Type */}
        <div className="mb-3">
          <label className="form-label">Entry Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-select"
          >
            <option value="sale">Sale</option>
            <option value="expense">Expense</option>
            <option value="investment">Investment</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="refund">Refund</option>
          </select>
        </div>

        {/* Dynamic Fields */}
        <AnimatePresence mode="wait">
          {type === "sale" ? (
            <motion.div
              key="sale"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="row g-2">
                <div className="col-md-6">
                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="mt-3">
                <input
                  type="number"
                  placeholder="Discount %"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Customer Contact"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  className="form-control"
                />
              </div>
            </motion.div>
          ) : type === "expense" ? (
            <motion.div
              key="expense"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Vendor Name"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Bill / Receipt No."
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="others"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-control"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Common Fields */}
        <div className="mb-3">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="form-select"
          >
            <option>Cash</option>
            <option>UPI</option>
            <option>Bank Transfer</option>
            <option>Card</option>
            <option>PayPal</option>
            <option>Other</option>
          </select>
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Reference / Transaction ID"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <textarea
            placeholder="Description / Notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            rows="3"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-100">
          Add Entry
        </button>
      </motion.form>
    </div>
  );
}
