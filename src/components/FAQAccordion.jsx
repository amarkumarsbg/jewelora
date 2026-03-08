import { useState } from "react";

const faqs = [
  {
    q: "What is your return policy?",
    a: "We offer easy returns within 7 days of delivery. Items must be unused and in original packaging. Contact us at info@jewelora.in to initiate a return.",
  },
  {
    q: "How long does shipping take?",
    a: "Delivery typically takes 5–8 business days across India. We use reliable courier partners for safe delivery.",
  },
  {
    q: "Do you offer custom or personalized jewelry?",
    a: "Yes! Add custom details at checkout (e.g., engraving, size preferences) or contact us for bespoke orders.",
  },
  {
    q: "How do I care for my jewelry?",
    a: "Avoid contact with water, perfume, and chemicals. Store in a dry jewelry box or pouch. Gently wipe with a soft cloth after wear.",
  },
  {
    q: "Is online payment secure?",
    a: "Yes. We use Razorpay for secure payments. Your card details are never stored on our servers.",
  },
];

export default function FAQAccordion({ variant = "light" }) {
  const [openIndex, setOpenIndex] = useState(null);
  const isDark = variant === "dark";

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`border rounded-xl overflow-hidden ${
            isDark ? "border-white/20 bg-white/5" : "border-black/10 bg-white"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={`w-full px-5 py-4 text-left font-semibold flex justify-between items-center transition-colors ${
              isDark
                ? "text-white hover:bg-white/10"
                : "text-neutral-dark hover:bg-neutral-50"
            }`}
          >
            {faq.q}
            <span className="text-primary text-xl">{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <div className={`px-5 pb-4 text-sm ${isDark ? "text-white/70" : "text-neutral-mid"}`}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
