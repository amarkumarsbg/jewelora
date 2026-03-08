import { useParams, useNavigate, Link } from "react-router-dom";
import products from "../components/shop/product";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import FeaturedProducts from "../components/home/FeatureProducts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Share2 } from "lucide-react";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { ProductDetailSkeleton } from "../components/ui/Skeleton";
import ProductImageGallery from "../components/ProductImageGallery";
import NotifyBackInStock from "../components/NotifyBackInStock";
import SizeGuideModal from "../components/SizeGuideModal";
import { useRecentlyViewed, useTrackProduct } from "../context/RecentlyViewedContext";
import { useAddToCartAnimation } from "../context/AddToCartAnimationContext";
import { useAllProducts } from "../hooks/useProducts";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id } = useParams();
  const [dynamicProduct, setDynamicProduct] = useState(null);
  const [customDetails, setCustomDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const localProduct = products.find((p) => String(p.id) === id);

  useEffect(() => {
    const fetchDynamicProduct = async () => {
      if (localProduct) {
        setDynamicProduct(null);
        setLoading(false);
        return;
      }
      try {
        const prodRef = doc(db, "dynamic_products", id);
        const docSnap = await getDoc(prodRef);

        if (docSnap.exists()) {
          setDynamicProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          const q = query(
            collection(db, "dynamic_products"),
            where("id", "==", id)
          );
          const querySnap = await getDocs(q);
          if (!querySnap.empty) {
            const docData = querySnap.docs[0].data();
            setDynamicProduct({ id: querySnap.docs[0].id, ...docData });
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicProduct();
  }, [id, localProduct]);

  const product = localProduct || dynamicProduct;
  useTrackProduct(product);

  const { triggerAddAnimation } = useAddToCartAnimation();
  const { data: allProducts = [] } = useAllProducts();
  const { items: recentlyViewed } = useRecentlyViewed();
  const relatedProducts = allProducts
    .filter((p) => (p.firestoreId || p.id) !== (product?.firestoreId || product?.id) && p.category === product?.category)
    .slice(0, 4);

  const handleShare = () => {
    const url = window.location.href;
    const text = `${product?.name} - ₹${product?.salePrice || product?.price}`;
    if (navigator.share) {
      navigator.share({ title: product?.name, text, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast("Please sign in to add items to cart.");
      return;
    }

    const productId = product.id || product.firestoreId || id;
    const cartItemRef = doc(db, "carts", currentUser.uid, "items", productId);

    try {
      const existing = await getDoc(cartItemRef);

      if (existing.exists()) {
        await updateDoc(cartItemRef, {
          quantity: existing.data().quantity + 1,
          customDetails: customDetails || existing.data().customDetails || "",
        });
      } else {
        await setDoc(cartItemRef, {
          productId: productId,
          name: product.name,
          price: product.salePrice || product.price,
          image: product.image || product.imageUrl,
          quantity: 1,
          customDetails: customDetails,
        });
      }
      triggerAddAnimation();
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong while adding to cart.");
    }
  };

  const goToCheckout = () => {
    const checkoutProduct = {
      ...product,
      price: product.salePrice || product.price,
      customDetails: customDetails,
    };
    navigate("/checkout", { state: { product: checkoutProduct } });
  };

  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-neutral-mid">
        Product not found.
      </div>
    );
  }

  const displayPrice = product.salePrice || product.price;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs
          items={
            product.category
              ? [
                  { label: "Shop", to: "/shop" },
                  { label: product.category, to: `/shop?category=${encodeURIComponent(product.category)}` },
                  { label: product.name },
                ]
              : [{ label: "Shop", to: "/shop" }, { label: product.name }]
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Product Image */}
          <div className="md:col-span-3">
            <div className="bg-white border border-border rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <ProductImageGallery product={product} />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:col-span-2">
            <h1 className="font-heading text-3xl font-medium text-neutral-dark mb-4">
              {product.name}
            </h1>

            <div className="mb-6 text-neutral-mid text-sm leading-relaxed">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>

            <p className="font-semibold text-2xl text-primary mb-6">
              ₹{typeof displayPrice === "number" ? displayPrice : displayPrice}
            </p>

            {(product.stock === 0 || (product.stock > 0 && product.stock <= 5)) && (
              <div className="mb-4">
                <p className="text-sm font-semibold">
                  {product.stock === 0 ? (
                    <span className="text-error">Out of stock</span>
                  ) : (
                    <span className="text-warning">Only {product.stock} left</span>
                  )}
                </p>
                {product.stock === 0 && (
                  <NotifyBackInStock productId={product.firestoreId || product.id} productName={product.name} />
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 min-w-[140px] bg-primary text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Add to Bag
              </button>

              <button
                type="button"
                onClick={goToCheckout}
                className="flex-1 min-w-[140px] bg-accent text-white rounded-full px-6 py-3 text-sm font-semibold hover:brightness-90 transition-all"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-3 rounded-full border-2 border-neutral-dark/20 text-neutral-dark hover:border-primary hover:text-primary transition-colors"
                aria-label="Share"
              >
                <Share2 size={20} />
              </button>
            </div>

            <div className="mt-6">
              <label className="block font-semibold text-neutral-dark mb-2">
                Add Custom Details (optional):
              </label>
              <textarea
                className="w-full rounded-sm border border-input bg-white px-4 py-3 text-sm placeholder:text-neutral-mid/50 focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,160,191,0.1)] focus:outline-none transition-all"
                rows={3}
                placeholder="E.g., Bangle size: 2.4, Preferred color: Silver"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
              />
            </div>

            {/* Sticky add-to-cart bar (mobile) */}
            <div className="lg:hidden fixed bottom-20 left-0 right-0 z-30 p-4 bg-white border-t border-black/10 flex gap-3 safe-area-pb">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-primary text-white rounded-full py-3 font-semibold disabled:opacity-50"
              >
                Add to Bag
              </button>
              <button
                type="button"
                onClick={goToCheckout}
                disabled={product.stock === 0}
                className="flex-1 bg-accent text-white rounded-full py-3 font-semibold disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            <p className="mt-6 text-neutral-mid text-sm">
              ✨ Free Shipping over ₹999 | Easy Returns | 5–8 days delivery
            </p>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="mt-2 text-sm text-primary hover:underline font-medium"
            >
              Size Guide →
            </button>
          </div>
        </div>

        <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

        {(relatedProducts.length > 0 || recentlyViewed.length > 0) && (
          <div className="mt-16">
            <h3 className="font-heading text-2xl font-medium text-neutral-dark mb-6">
              {relatedProducts.length > 0 ? "You May Also Like" : "Recently Viewed"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {(relatedProducts.length > 0 ? relatedProducts : recentlyViewed.slice(0, 4)).map((p) => (
                <Link
                  key={p.firestoreId || p.id}
                  to={`/product/${p.firestoreId || p.id}`}
                  className="bg-white rounded-xl border border-black/5 overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square p-4 flex items-center justify-center bg-white">
                    <img
                      src={p.image || p.imageUrl}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm line-clamp-2 text-neutral-dark">{p.name}</p>
                    <p className="text-primary font-semibold text-sm">₹{p.price ?? p.salePrice ?? "—"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <FeaturedProducts />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
