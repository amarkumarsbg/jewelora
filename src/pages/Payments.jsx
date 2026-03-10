import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
import MobileBackHeader from "../components/ui/MobileBackHeader";

export default function Payments() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[60vh] bg-cream pt-0 pb-12">
      <MobileBackHeader title="Payments & Transactions" to="/profile" />
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-dark mb-2 lg:block hidden">
          Payments & Transactions
        </h1>
        <p className="text-neutral-mid text-sm mb-8">
          View your payment history in your order details.
        </p>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
          <CreditCard size={48} className="mx-auto text-primary/50 mb-4" />
          <p className="text-neutral-mid mb-6">
            Payment history is available in your order details.
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
