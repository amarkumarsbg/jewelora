import CategoryShowcase from "../components/home/CategoryShowcase";
import FeaturedProducts from "../components/home/FeatureProducts";
import Testimonials from "../components/home/Testimonials";
import WhyChooseUs from "../components/home/WhyChoose";
import TrendingCarousel from "../components/home/TrendingCarousel";
import Hero from "../components/home/hero";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <Testimonials />
      <WhyChooseUs />
      <TrendingCarousel />
    </motion.div>
  );
};

export default Home;
