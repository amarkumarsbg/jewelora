import ProductGrid from "../components/shop/ProductGrid";
import MobileBackHeader from "../components/ui/MobileBackHeader";

const Sale = () => {
  return (
    <section className="pt-0 pb-4" style={{ backgroundColor: "#f8f9fa" }}>
      <MobileBackHeader title="Sale" to="/shop" />
      <div className="container px-4">
        {/* 🔥 Title */}
        <div className="text-center mb-3 pb-3">
          <h2 className="category-section-title">🔥 Sale Collection</h2>
        </div>

        <hr className="my-4" />

        {/* 🛒 Show only products with category = "Sale" */}
        <ProductGrid category="Sale" />
      </div>
    </section>
  );
};

export default Sale;
