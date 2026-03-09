import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Star, Send, ImagePlus, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import FeaturedProducts from "../components/home/FeatureProducts";

const AddReview = () => {
  const [formData, setFormData] = useState({
    userName: "Anonymous",
    customerName: "",
    customerCity: "",
    description: "",
    rating: 5,
    photoUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const cloudData = new FormData();
    cloudData.append("file", file);
    cloudData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: cloudData }
      );
      const data = await res.json();
      setFormData((prev) => ({ ...prev, photoUrl: data.secure_url }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => setFormData((prev) => ({ ...prev, photoUrl: "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.description) {
      toast.error("Please fill in your name and review");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        createdAt: serverTimestamp(),
        customerCity: formData.customerCity || "Unknown",
        customerName: formData.customerName,
        description: formData.description,
        photoUrl: formData.photoUrl,
        rating: formData.rating,
        userName: formData.userName || "Anonymous",
      });
      toast.success("Thank you! Your review has been submitted.");
      setFormData({
        userName: "Anonymous",
        customerName: "",
        customerCity: "",
        description: "",
        rating: 5,
        photoUrl: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-mid focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-linen">
      {/* Header */}
      <div className="bg-primary py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-medium !text-white">
            Share Your Experience
          </h1>
          <p className="mt-2 text-white/80 text-sm md:text-base max-w-xl mx-auto">
            Your feedback helps us improve and inspires other customers. We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-black/5 shadow-lg p-6 md:p-8"
        >
          <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-6">
            Write a review
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">
                Your Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="Enter your name"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, customerName: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">
                Your City <span className="text-neutral-mid text-xs">(optional)</span>
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Mumbai, Delhi"
                value={formData.customerCity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, customerCity: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">
                Rating <span className="text-error">*</span>
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                    className="p-1 rounded-lg hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= formData.rating
                          ? "fill-secondary text-secondary"
                          : "text-neutral-mid/40"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">
                Your Review <span className="text-error">*</span>
              </label>
              <textarea
                className={`${inputClass} min-h-[140px] resize-none`}
                placeholder="Tell us about your experience with our jewelry..."
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1.5">
                Add a photo <span className="text-neutral-mid text-xs">(optional)</span>
              </label>
              <div className="space-y-3">
                {formData.photoUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.photoUrl}
                      alt="Preview"
                      className="rounded-xl object-cover max-h-40 w-auto border border-black/10"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-error text-white flex items-center justify-center hover:bg-error/90 transition-colors"
                      aria-label="Remove photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-black/15 bg-cream/50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <span className="text-sm text-neutral-mid">Uploading...</span>
                    ) : (
                      <>
                        <ImagePlus size={28} className="text-neutral-mid mb-1" />
                        <span className="text-sm text-neutral-mid">
                          Click to upload or drag & drop
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || submitting}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3.5 px-6 font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </motion.form>
      </div>

      <FeaturedProducts />
    </div>
  );
};

export default AddReview;
