



import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collectionGroup, getDocs, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReceiptInvoice from "../components/ReceiptInvoice";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 🔐 ADMIN CHECK
  const adminEmail = "info@jewelora.in";
  const isAdmin = currentUser?.email === adminEmail;

  const [orders, setOrders] = useState([]);

  // 🚚 Tracking modal states
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingLink, setTrackingLink] = useState("");
  const [trackingMessage, setTrackingMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 🔄 FETCH ALL ORDERS
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }

    const fetchAllOrders = async () => {
      const snapshot = await getDocs(collectionGroup(db, "orders"));

      const allOrders = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ref: docSnap.ref,
          ...docSnap.data(),
        }))
        .sort((a, b) => {
          const tA = a.createdAt?.seconds || 0;
          const tB = b.createdAt?.seconds || 0;
          return tB - tA;
        });

      setOrders(allOrders);
    };

    fetchAllOrders();
  }, [currentUser, isAdmin, navigate]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.id)));
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    const toUpdate = orders.filter((o) => selectedIds.has(o.id));
    for (const order of toUpdate) {
      await handleStatusChange(order, newStatus);
    }
    setSelectedIds(new Set());
  };

  const handleExportSelected = () => {
    const toExport = orders.filter((o) => selectedIds.has(o.id));
    const csv = [
      ["Order ID", "Date", "Customer", "Total", "Status"].join(","),
      ...toExport.map((o) =>
        [
          o.id,
          o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleString() : "",
          o.shippingInfo?.fullName || "",
          o.total || "",
          o.status || "",
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // 🔁 NORMAL STATUS UPDATE
  const handleStatusChange = async (order, newStatus) => {
    await updateDoc(order.ref, { status: newStatus });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id ? { ...o, status: newStatus } : o
      )
    );
  };

  // ✅ CONFIRM SHIPMENT (WITH TRACKING + EMAIL)
  const confirmShipment = async () => {
    if (!trackingLink || !trackingMessage) {
      toast.error("Please enter tracking link and message");
      return;
    }

    await updateDoc(selectedOrder.ref, {
      status: "shipped",
      trackingLink,
      trackingMessage,
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? {
              ...o,
              status: "shipped",
              trackingLink,
              trackingMessage,
            }
          : o
      )
    );

    // 📧 EMAIL TO CUSTOMER
    await emailjs.send(
      "service_pauibc6",
      "template_gfzrqmg",
      {
        to_email: selectedOrder.shippingInfo?.email,
        customer_name: selectedOrder.shippingInfo?.fullName,
        order_id: selectedOrder.id,
        order_status: "Shipped",
        tracking_message: trackingMessage,
        tracking_link: trackingLink,
      },
      { publicKey: "AL9Hdy7gl6JXUpK5z" }
    );

    // RESET
    setShowTrackingForm(false);
    setSelectedOrder(null);
    setTrackingLink("");
    setTrackingMessage("");
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-warning mb-4 text-center">
        Admin Panel: All Orders
      </h2>

      {/* Bulk actions */}
      {orders.length > 0 && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          <label className="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              checked={selectedIds.size === orders.length}
              onChange={toggleSelectAll}
            />
            Select all
          </label>
          {selectedIds.size > 0 && (
            <>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleBulkStatusUpdate("shipped")}
              >
                Mark {selectedIds.size} as Shipped
              </button>
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => handleBulkStatusUpdate("delivered")}
              >
                Mark {selectedIds.size} as Delivered
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleExportSelected}
              >
                Export selected
              </button>
            </>
          )}
        </div>
      )}

      {orders.map((order) => (
        <div key={order.id} className="card mb-5 shadow border-0 p-4">
          {/* HEADER */}
          <div className="d-flex justify-content-between flex-wrap">
            <div className="d-flex align-items-start gap-3">
              <input
                type="checkbox"
                checked={selectedIds.has(order.id)}
                onChange={() => toggleSelect(order.id)}
              />
              <div>
              <h5 className="fw-bold">Order ID: {order.id}</h5>

              <p className="mb-0">
                <strong>Name:</strong> {order.shippingInfo?.fullName}
              </p>

              <p className="mb-0">
                <strong>Email:</strong> {order.shippingInfo?.email}
              </p>

              <p className="mb-0">
                <strong>Phone:</strong> {order.shippingInfo?.phone}
              </p>

              {/* 📅 DATE */}
              <p className="mb-0">
                <strong>Date:</strong>{" "}
                {order.createdAt?.seconds
                  ? new Date(
                      order.createdAt.seconds * 1000
                    ).toLocaleString()
                  : "—"}
              </p>

              {/* 💳 PAYMENT STATUS */}
              <p className="mt-2 mb-0">
                <strong>Payment Status:</strong>{" "}
                {order.paymentStatus === "paid" ? (
                  <span className="badge bg-success ms-1">Paid</span>
                ) : (
                  <span className="badge bg-warning text-dark ms-1">
                    Pending
                  </span>
                )}
              </p>

              {/* 💳 PAYMENT METHOD */}
              <p className="mb-0">
                <strong>Payment Method:</strong>{" "}
                {order.paymentMethod || "Razorpay"}
              </p>

              {/* 🧾 RAZORPAY PAYMENT ID */}
              {order.razorpayPaymentId && (
                <p className="mb-0 small text-muted">
                  <strong>Razorpay Payment ID:</strong>{" "}
                  {order.razorpayPaymentId}
                </p>
              )}
              </div>
            </div>

            {/* STATUS DROPDOWN */}
            <select
              className="form-select w-auto"
              value={order.status}
              disabled={order.paymentStatus !== "paid"}
              onChange={(e) => {
                const newStatus = e.target.value;

                if (
                  order.status === "ordered" &&
                  newStatus === "shipped"
                ) {
                  setSelectedOrder(order);
                  setShowTrackingForm(true);
                } else {
                  handleStatusChange(order, newStatus);
                }
              }}
            >
              <option value="ordered">Ordered</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {order.paymentStatus !== "paid" && (
            <small className="text-muted">
              Payment required before shipping
            </small>
          )}

          <hr />

          {/* ADDRESS */}
          <p>
            <strong>Address:</strong>{" "}
            {order.shippingInfo?.address},{" "}
            {order.shippingInfo?.city},{" "}
            {order.shippingInfo?.state} –{" "}
            {order.shippingInfo?.pincode}
          </p>

          {/* ITEMS */}
          <h6 className="fw-bold mt-3">Items</h6>
          <ul className="list-group">
            {order.items?.map((item, idx) => (
              <li
                key={idx}
                className="list-group-item d-flex align-items-center gap-3"
              >
                <img
                  src={item.image || item.imageUrl}
                  alt={item.name}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />

                <div className="flex-grow-1">
                  <strong>{item.name}</strong>
                  <div className="text-muted small">
                    Qty: {item.quantity}
                  </div>
                </div>

                <span className="fw-bold">₹{item.price}</span>
              </li>
            ))}
          </ul>

          {/* FOOTER */}
          <div className="text-end mt-3">
            <p className="fw-bold fs-5 text-success">
              Total: ₹{order.total}
            </p>
            <ReceiptInvoice order={order} />
          </div>
        </div>
      ))}

      {/* 🚚 TRACKING MODAL */}
      {showTrackingForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: 420 }}>
            <h5 className="fw-bold mb-3">Enter Tracking Details</h5>

            <input
              type="url"
              className="form-control mb-3"
              placeholder="Tracking link (Courier URL)"
              value={trackingLink}
              onChange={(e) => setTrackingLink(e.target.value)}
            />

            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Tracking message for customer"
              value={trackingMessage}
              onChange={(e) => setTrackingMessage(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowTrackingForm(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-success"
                onClick={confirmShipment}
              >
                Confirm & Ship
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

