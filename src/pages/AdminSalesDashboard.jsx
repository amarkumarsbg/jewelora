import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collectionGroup, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminSalesDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.email === "info@jewelora.in";

  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderCount: 0,
    popularProducts: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }

    const fetch = async () => {
      const snapshot = await getDocs(collectionGroup(db, "orders"));
      const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      const paidOrders = orders.filter((o) => o.paymentStatus === "paid" || o.status === "delivered" || o.status === "shipped");
      const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      const itemCount = {};
      paidOrders.forEach((o) => {
        (o.items || []).forEach((item) => {
          const name = item.name || "Unknown";
          itemCount[name] = (itemCount[name] || 0) + (item.quantity || 1);
        });
      });
      const popularProducts = Object.entries(itemCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      const recentOrders = orders
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 10);

      setStats({
        totalRevenue,
        orderCount: orders.length,
        popularProducts,
        recentOrders,
      });
      setLoading(false);
    };

    fetch();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;
  if (loading) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">Sales Dashboard</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Total Revenue (Paid Orders)</h5>
              <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <h3>{stats.orderCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header fw-bold">Popular Products</div>
            <ul className="list-group list-group-flush">
              {stats.popularProducts.map((p, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between">
                  <span>{p.name}</span>
                  <span className="badge bg-primary">{p.count} sold</span>
                </li>
              ))}
              {stats.popularProducts.length === 0 && (
                <li className="list-group-item text-muted">No data yet</li>
              )}
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header fw-bold">Recent Orders</div>
            <ul className="list-group list-group-flush">
              {stats.recentOrders.map((o) => (
                <li key={o.id} className="list-group-item d-flex justify-content-between">
                  <span>
                    {o.id.slice(0, 8)}... — {o.shippingInfo?.fullName}
                  </span>
                  <span className="fw-bold">₹{o.total}</span>
                </li>
              ))}
              {stats.recentOrders.length === 0 && (
                <li className="list-group-item text-muted">No orders yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
