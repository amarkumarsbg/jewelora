import { useAuth } from "../context/AuthContext";
import { User, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import MobileBackHeader from "../components/ui/MobileBackHeader";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[60vh] bg-cream pt-0 pb-12">
      <MobileBackHeader title="My Profile" to="/" />
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-heading text-2xl md:text-3xl font-semibold text-neutral-dark mb-8 lg:block hidden">
          My Profile
        </h1>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xl shrink-0">
              {(currentUser?.displayName || currentUser?.email || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-lg text-neutral-dark">
                {currentUser?.displayName || currentUser?.email?.split("@")[0] || "User"}
              </h2>
              <p className="text-neutral-mid text-sm">{currentUser?.email}</p>
            </div>
          </div>
          <div className="space-y-4">
            <Link
              to="/orders"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-primary-light/30 transition-colors"
            >
              <MapPin size={20} className="text-primary" />
              <span className="font-medium">My Orders</span>
            </Link>
            <Link
              to="/saved-address"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-primary-light/30 transition-colors"
            >
              <MapPin size={20} className="text-primary" />
              <span className="font-medium">Saved Addresses</span>
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-primary-light/30 transition-colors"
            >
              <User size={20} className="text-primary" />
              <span className="font-medium">Wishlist</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
