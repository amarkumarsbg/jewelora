import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import MobileBackHeader from "../components/ui/MobileBackHeader";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          orderBy("createdAt", "desc"),
          limit(50)
        );
        const snap = await getDocs(q);
        setReviews(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const formatDate = (ts) => {
    if (!ts) return "";
    try {
      const date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
      return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-linen">
      <MobileBackHeader title="Customer Reviews" to="/" />
      {/* Header */}
      <div className="bg-primary py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-medium !text-white">
            Customer Reviews
          </h1>
          <p className="mt-2 text-white/80 text-sm md:text-base">
            What our customers say about us
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-black/5 shadow-sm">
            <Star size={48} className="mx-auto text-neutral-mid/50 mb-4" />
            <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-2">
              No reviews yet
            </h2>
            <p className="text-neutral-mid text-sm">
              Be the first to share your experience with Jewelora
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-semibold shrink-0">
                    {review.customerName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-dark">
                      {review.customerName}
                    </p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= (review.rating || 0)
                              ? "fill-secondary text-secondary"
                              : "text-neutral-mid/30"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-dark text-sm flex-grow">
                  {review.description}
                </p>
                {review.photoUrl && (
                  <div className="mt-4 overflow-hidden rounded-xl aspect-video max-h-64">
                    <img
                      src={review.photoUrl}
                      alt="Customer review"
                      className="w-full h-full object-contain bg-neutral-50"
                    />
                  </div>
                )}
                <p className="text-neutral-mid text-xs mt-4">
                  {formatDate(review.createdAt)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;
