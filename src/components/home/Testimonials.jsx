import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const staticTestimonials = [
  {
    id: "s1",
    name: "Rupali Srivastava",
    review:
      "Absolutely stunning collection! I loved the Peacock Aura Mangalsutra set I bought. Fast delivery and beautiful packaging.",
    image: null,
    rating: 5,
  },
  {
    id: "s2",
    name: "Shobhit Srivastava",
    review:
      "Beautiful Rakhi and great value for money! The quality exceeded my expectations, and the customer service was amazing.",
    image: null,
    rating: 5,
  },
  {
    id: "s3",
    name: "Neha Singh",
    review:
      "Very elegant designs. The earrings I bought were perfect for my wedding!",
    image: null,
    rating: 5,
  },
];

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(6));
        const snap = await getDocs(q);
        const firebaseReviews = snap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().customerName,
          review: doc.data().description,
          productPhoto: doc.data().photoUrl || null,
          rating: doc.data().rating || 5,
          createdAt: doc.data().createdAt || null,
        }));

        setReviews([...firebaseReviews, ...staticTestimonials]);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews(staticTestimonials);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-linen via-cream to-linen" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-48 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            <span className="w-8 h-px bg-primary/50" />
            Testimonials
            <span className="w-8 h-px bg-primary/50" />
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-neutral-dark tracking-tight">
            What Our Customers{" "}
            <span className="text-primary/90">Say</span>
          </h2>
          <p className="mt-4 text-neutral-mid max-w-xl mx-auto text-lg">
            Real stories from people who fell in love with our jewelry
          </p>
        </motion.div>

        {reviews.length === 0 ? (
          <p className="text-center text-neutral-mid py-12">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 lg:gap-y-10">
            {reviews.map((r, index) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group relative bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-[0_20px_40px_-15px_rgba(45,42,50,0.08),0_0_0_1px_rgba(45,42,50,0.03)] hover:border-primary/10 transition-all duration-500"
              >
                {/* Quote accent */}
                <span className="absolute top-6 right-6 text-primary/15 font-serif text-6xl leading-none select-none">
                  "
                </span>

                <div className="relative flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm">
                    {r.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h6 className="font-semibold text-neutral-dark text-base">{r.name}</h6>
                    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-mid mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Verified Purchase
                    </span>
                    <div className="flex gap-0.5 mt-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < (r.rating ?? 5) ? "fill-accent text-accent" : "text-neutral-mid/40"}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="relative text-neutral-dark/90 text-[15px] leading-relaxed">
                  {r.review}
                </p>

                {r.productPhoto && (
                  <div className="mt-5 overflow-hidden rounded-xl border border-black/5">
                    <img
                      src={r.productPhoto}
                      alt="Customer purchase"
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}

                {r.createdAt && (
                  <time className="block mt-4 text-neutral-mid/80 text-xs">
                    {r.createdAt?.toDate?.()?.toLocaleDateString?.(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
