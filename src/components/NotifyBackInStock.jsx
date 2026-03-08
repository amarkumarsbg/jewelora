import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function NotifyBackInStock({ productId, productName }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await addDoc(collection(db, "backInStockNotifications"), {
        productId,
        productName: productName || "",
        email: email.trim(),
        createdAt: new Date(),
      });
      setSubmitted(true);
      setEmail("");
      toast.success("We'll notify you when it's back!");
    } catch (err) {
      toast.error("Could not subscribe");
    }
  };

  if (submitted) {
    return (
      <p className="text-sm text-success font-medium">You'll be notified when back in stock.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark"
      >
        Notify Me
      </button>
    </form>
  );
}
