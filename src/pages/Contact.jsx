import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import FeaturedProducts from "../components/home/FeatureProducts";
import { Mail, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa6";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        name,
        email,
        mobile,
        message,
        createdAt: serverTimestamp(),
      });
      toast.success("Message sent successfully! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMobile("");
      setMessage("");
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-mid focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-linen">
      {/* Header */}
      <div className="bg-primary py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-medium !text-white">
            Contact Us
          </h1>
          <p className="mt-2 text-white/80 text-sm md:text-base max-w-xl mx-auto">
            Have a question? We'd love to hear from you. Send us a message.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="order-2 lg:order-1"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-black/5 shadow-lg p-6 md:p-8"
            >
              <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-6">
                Send a message
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Your Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="hello@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    className={inputClass}
                    placeholder="+91 98765 43210"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1.5">Message</label>
                  <textarea
                    className={`${inputClass} min-h-[120px] resize-none`}
                    placeholder="How can we help you?"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3.5 px-6 font-semibold hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Contact info + map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="order-1 lg:order-2 space-y-6"
          >
            <div className="bg-white rounded-2xl border border-black/5 shadow-lg p-6 md:p-8">
              <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-6">
                Get in touch
              </h2>
              <div className="space-y-4">
                <a
                  href="mailto:info@jewelora.in"
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-cream transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-mid uppercase tracking-wider">Email</p>
                    <p className="text-neutral-dark font-medium group-hover:text-primary transition-colors">info@jewelora.in</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/919129987687"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-cream transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#25D366]/20 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/30">
                    <FaWhatsapp className="text-[#25D366]" size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-mid uppercase tracking-wider">WhatsApp</p>
                    <p className="text-neutral-dark font-medium group-hover:text-primary transition-colors">+91 91299 87687</p>
                  </div>
                </a>
                <div className="flex items-start gap-4 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-mid uppercase tracking-wider">Address</p>
                    <p className="text-neutral-dark font-medium">Jewelora Store, Delhi - 110001, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-black/5 shadow-lg">
              <iframe
                title="Jewelora Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83797095512!2d77.06889944999999!3d28.5272803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3652e091203%3A0xf4f37a2413a9f733!2sDelhi%2C%20India!5e0!3m2!1sen!2sin!4v1718373642793"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <FeaturedProducts />
    </div>
  );
};

export default Contact;
