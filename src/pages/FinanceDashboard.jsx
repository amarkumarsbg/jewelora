import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function FinanceDashboard() {
  const [records, setRecords] = useState([]);
  const [totals, setTotals] = useState({
    sales: 0,
    expenses: 0,
    profit: 0,
    investments: 0,
    withdrawals: 0,
    refunds: 0,
    totalFunds: 0,
    availableFunds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email === "info@jewelora.in") {
        setIsAdmin(true);

        // Fetch finance records
        const querySnapshot = await getDocs(collection(db, "financeRecords"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(data);

        // Calculations
        const sales = data
          .filter((r) => r.type === "sale")
          .reduce((acc, cur) => acc + (cur.finalAmount || cur.amount), 0);

        const expenses = data
          .filter((r) => r.type === "expense")
          .reduce((acc, cur) => acc + cur.amount, 0);

        const investments = data
          .filter((r) => r.type === "investment")
          .reduce((acc, cur) => acc + cur.amount, 0);

        const withdrawals = data
          .filter((r) => r.type === "withdrawal")
          .reduce((acc, cur) => acc + cur.amount, 0);

        const refunds = data
          .filter((r) => r.type === "refund")
          .reduce((acc, cur) => acc + cur.amount, 0);

        const totalFunds = investments + sales;
        const availableFunds = totalFunds - (expenses + withdrawals + refunds);

        setTotals({
          sales,
          expenses,
          profit: sales - expenses,
          investments,
          withdrawals,
          refunds,
          totalFunds,
          availableFunds,
        });
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center p-4">Loading...</p>;
  }

  if (!isAdmin) {
    return (
      <div className="p-6 text-center font-semibold text-error">
        Access Denied. Only Admin Can View This Page.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-neutral-dark mb-6 text-center">
        Finance Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 text-center">
          <p className="text-sm text-neutral-mid">Total Sales</p>
          <p className="text-xl font-bold text-success">₹{totals.sales}</p>
        </div>
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 text-center">
          <p className="text-sm text-neutral-mid">Total Expenses</p>
          <p className="text-xl font-bold text-error">₹{totals.expenses}</p>
        </div>
        <div
          className={`rounded-xl border border-black/5 shadow-sm p-4 text-center ${
            totals.profit >= 0 ? "bg-success/10" : "bg-error/10"
          }`}
        >
          <p className="text-sm text-neutral-mid">Profit / Loss</p>
          <p
            className={`text-xl font-bold ${
              totals.profit >= 0 ? "text-success" : "text-error"
            }`}
          >
            {totals.profit >= 0
              ? `₹${totals.profit}`
              : `-₹${Math.abs(totals.profit)}`}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 text-center">
          <p className="text-sm text-neutral-mid">Total Investment</p>
          <p className="text-xl font-bold text-primary">₹{totals.investments}</p>
        </div>
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 text-center">
          <p className="text-sm text-neutral-mid">Total Funds</p>
          <p className="text-xl font-bold text-neutral-dark">
            ₹{totals.totalFunds}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 text-center">
          <p className="text-sm text-neutral-mid">Available Funds</p>
          <p className="text-xl font-bold text-neutral-dark">
            ₹{totals.availableFunds}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h4 className="text-lg font-semibold text-neutral-dark mb-3">
          Recent Records
        </h4>
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-black/10 bg-cream/50">
              <th className="text-left py-2 px-3 text-sm font-medium text-neutral-dark">
                Type
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-neutral-dark">
                Product / Category
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-neutral-dark">
                Amount
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-neutral-dark">
                Description
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-neutral-dark">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-black/5 hover:bg-cream/30">
                <td className="py-2 px-3 text-sm capitalize">{r.type}</td>
                <td className="py-2 px-3 text-sm">
                  {r.type === "sale" ? r.product : r.category}
                </td>
                <td className="py-2 px-3 text-sm">₹{r.finalAmount}</td>
                <td className="py-2 px-3 text-sm">{r.description}</td>
                <td className="py-2 px-3 text-sm">
                  {r.date?.toDate?.()?.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
