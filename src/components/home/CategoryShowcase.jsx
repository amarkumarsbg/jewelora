import { Link, useLocation } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import MobileBackHeader from "../ui/MobileBackHeader";

const categories = [
  {
    name: "Mangalsutra",
    image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766602914/h2gvmvrs1dhkws5l54fv.jpg",
    slug: "Mangalsutra",
  },
  {
    name: "Necklaces",
    image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766602799/o91ndinkixpvdaiglfms.jpg",
    slug: "Necklaces",
  },
  {
    name: "Pendants",
    image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766569169/g2uieic9vsiq6wufqqfy.jpg",
    slug: "Pendants",
  },
  {
    name: "Bangles",
    image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766573932/gf7fm3ltynknxx5v7ezj.jpg",
    slug: "Bangles",
  },
  {
    name: "Bracelets",
    image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766664915/prikhjwwayexdj02m2mj.jpg",
    slug: "Bracelets",
  },
  {
    name: "Earrings",
    image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1766605977/xciabxz0eoiqflshoh5q.jpg",
    slug: "Earrings",
  },
  {
    name: "Rakhi",
    image: "https://res.cloudinary.com/dvxaztwnz/image/upload/v1772303416/RAKHI1_e9kgld.jpg",
    slug: "Rakhi",
  },
];

const CategoryShowcasePolished = () => {
  const { pathname } = useLocation();
  const isCategoryPage = pathname === "/category";

  return (
    <section className="pt-0 pb-16 bg-linen">
      {isCategoryPage && <MobileBackHeader title="Categories" to="/shop" />}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 font-heading text-3xl md:text-4xl font-medium text-neutral-dark"
        >
          Shop By Category
        </motion.h2>

        <div className="flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 md:gap-[4.5rem] lg:gap-[5rem] xl:gap-[6rem]">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center w-full md:w-auto"
            >
              <Link
                to={`/shop?category=${category.slug}`}
                className="block group w-full flex flex-col items-center"
              >
                <div className="w-full aspect-square md:w-64 md:h-64 lg:w-56 lg:h-56 xl:w-48 xl:h-48 2xl:w-44 2xl:h-44 rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 shrink-0 md:mx-auto">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-center mt-4 text-sm font-semibold text-neutral-dark group-hover:text-primary transition-colors uppercase tracking-wider">
                  {category.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcasePolished;
