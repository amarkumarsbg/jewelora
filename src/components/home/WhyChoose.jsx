import React from "react";
import { ShieldCheck, Gem, Truck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Gem,
    title: "Premium Quality",
    description: "Crafted with the finest materials for long-lasting beauty.",
  },
  {
    icon: ShieldCheck,
    title: "Authenticity Guaranteed",
    description: "Every piece is certified and 100% genuine.",
  },
  {
    icon: Truck,
    title: "Fast & Free Delivery",
    description: "Get your orders quickly with our free express shipping.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-linen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-neutral-dark mb-3">
            Why Choose Jewelora?
          </h2>
          <p className="text-neutral-mid" style={{ fontSize: "1.05rem" }}>
            Experience elegance, quality, and trust with every purchase.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-modern bg-white border border-black/5 rounded-2xl p-10 text-center"
            >
              <div className="flex justify-center mb-4">
                <item.icon size={40} className="text-primary" />
              </div>
              <h5 className="font-heading font-semibold text-lg text-neutral-dark mb-2">
                {item.title}
              </h5>
              <p className="text-neutral-mid text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
