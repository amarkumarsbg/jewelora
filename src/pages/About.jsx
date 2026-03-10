import React from "react";
import logo from "../assets/jewelora.jpg";
import FeaturedProducts from "../components/home/FeatureProducts";
import MobileBackHeader from "../components/ui/MobileBackHeader";
import { Instagram, Facebook, Tag, Truck, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6";

const features = [
  {
    icon: Tag,
    label: "Transparent Pricing",
    desc: "Honest, upfront prices on every piece",
  },
  {
    icon: Truck,
    label: "Fast Delivery",
    desc: "5–8 business days across India",
  },
  {
    icon: Users,
    label: "500+ Happy Customers",
    desc: "Trusted by jewelry lovers nationwide",
  },
];

const socialLinks = [
  {
    href: "https://wa.me/919129987687",
    icon: FaWhatsapp,
    label: "WhatsApp",
    className: "bg-[#25D366] hover:bg-[#20BD5A] text-white",
  },
  {
    href: "https://x.com/jew_elora",
    icon: FaXTwitter,
    label: "X",
    className: "bg-neutral-dark hover:bg-neutral-dark/90 text-white",
  },
  {
    href: "https://instagram.com/jew_elora",
    icon: Instagram,
    label: "Instagram",
    className: "bg-primary hover:bg-primary-dark text-white",
  },
  {
    href: "https://www.facebook.com/share/1CcdEpJRH4/",
    icon: Facebook,
    label: "Facebook",
    className: "bg-primary hover:bg-primary-dark text-white",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Content section - header integrated at top */}
      <section className="bg-cream pt-0 pb-12 md:pb-16">
        <MobileBackHeader title="About" to="/" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Compact header strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center justify-center gap-2 md:gap-3 py-3 px-4 mb-6 rounded-xl bg-primary text-white"
          >
            <span className="inline-flex items-center gap-1 text-secondary font-medium text-xs uppercase tracking-wider">
              <Sparkles size={12} /> Our Story
            </span>
            <span className="text-white/40">|</span>
            <h1 className="font-heading text-lg md:text-xl font-semibold !text-white">
              About Jewelora
            </h1>
            <span className="text-white/40">|</span>
            <p className="text-white/80 text-sm">Where tradition meets trend</p>
          </motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-square max-w-[400px] mx-auto rounded-2xl overflow-hidden bg-white shadow-xl border border-black/5 flex items-center justify-center p-6">
                <img
                  src={logo}
                  alt="Jewelora"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-secondary/20 border-2 border-secondary -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-neutral-dark">
                Crafting stories in every piece
              </h2>
              <p className="text-lg text-neutral-dark leading-relaxed">
                Welcome to{" "}
                <span className="text-primary font-semibold">Jewelora</span> –
                we craft premium-quality handcrafted jewelry that tells your
                story. Each piece is designed by India&apos;s finest artisans,
                blending elegance with authenticity.
              </p>
              <p className="text-neutral-mid leading-relaxed">
                From classic styles to contemporary fashion, we offer jewelry
                that fits every mood and moment. Every design is made with care
                to bring you pieces you&apos;ll cherish.
              </p>

              {/* Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {features.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl bg-white border border-black/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="text-primary" size={20} />
                    </div>
                    <p className="font-semibold text-neutral-dark text-sm">
                      {label}
                    </p>
                    <p className="text-neutral-mid text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="pt-0">
                <p className="text-sm font-medium text-neutral-dark mb-2">
                  Connect with us
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(({ href, icon: Icon, label, className }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${className}`}
                      aria-label={label}
                    >
                      <Icon size={18} />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FeaturedProducts />
    </div>
  );
};

export default About;
