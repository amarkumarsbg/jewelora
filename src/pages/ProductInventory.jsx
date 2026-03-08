import { useEffect, useState } from "react";
import { db } from "../firebase";
import toast from "react-hot-toast";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none";

const AdminProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "dynamic_products"));
        const list = snap.docs.map((d) => ({
          firestoreId: d.id,
          ...d.data(),
        }));
        setProducts(list);
      } catch (err) {
        toast.error("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.firestoreId === id ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSave = async (product) => {
    try {
      setSavingId(product.firestoreId);

      await updateDoc(
        doc(db, "dynamic_products", product.firestoreId),
        {
          price: Number(product.price),
          stock: Number(product.stock),
          trending: !!product.trending,
          visible: !!product.visible,
          category: product.category,
          inStock: Number(product.stock) > 0,
        }
      );

      toast.success("Product updated successfully");
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setSavingId(null);
    }
  };

  const LOW_STOCK_THRESHOLD = 5;
  const lowStockProducts = products.filter((p) => {
    const s = Number(p.stock);
    return !isNaN(s) && s > 0 && s <= LOW_STOCK_THRESHOLD;
  });
  const outOfStock = products.filter((p) => Number(p.stock) === 0);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-neutral-dark mb-4">
        Product Inventory
      </h2>

      {(lowStockProducts.length > 0 || outOfStock.length > 0) && (
        <div className="mb-4 p-4 rounded-xl bg-warning/20 border border-warning/40">
          <p className="font-semibold text-neutral-dark mb-2">Stock Alerts</p>
          <ul className="text-sm text-neutral-dark space-y-1">
            {lowStockProducts.length > 0 && (
              <li>
                <strong>{lowStockProducts.length}</strong> product(s) with low
                stock (≤{LOW_STOCK_THRESHOLD}):{" "}
                {lowStockProducts.map((p) => p.name).join(", ")}
              </li>
            )}
            {outOfStock.length > 0 && (
              <li>
                <strong>{outOfStock.length}</strong> product(s) out of stock:{" "}
                {outOfStock.map((p) => p.name).join(", ")}
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-black/10 bg-cream/50">
              <th className="text-left py-2 px-2 text-sm font-medium text-neutral-dark">
                Image
              </th>
              <th className="text-left py-2 px-2 text-sm font-medium text-neutral-dark">
                Name / ID
              </th>
              <th className="text-left py-2 px-2 text-sm font-medium text-neutral-dark">
                Category
              </th>
              <th className="text-left py-2 px-2 text-sm font-medium text-neutral-dark">
                Price (₹)
              </th>
              <th className="text-left py-2 px-2 text-sm font-medium text-neutral-dark">
                Stock
              </th>
              <th className="text-center py-2 px-2 text-sm font-medium text-neutral-dark">
                Trending
              </th>
              <th className="text-center py-2 px-2 text-sm font-medium text-neutral-dark">
                Visible
              </th>
              <th className="text-left py-2 px-2 text-sm font-medium text-neutral-dark">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.firestoreId} className="border-b border-black/5 hover:bg-cream/30">
                <td className="py-2 px-2">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-14 w-14 object-cover rounded-lg"
                  />
                </td>
                <td className="py-2 px-2">
                  <p className="font-medium text-neutral-dark">{p.name}</p>
                  <p className="text-xs text-neutral-mid">{p.id}</p>
                </td>
                <td className="py-2 px-2">
                  <input
                    className={inputClass}
                    value={p.category || ""}
                    onChange={(e) =>
                      handleChange(p.firestoreId, "category", e.target.value)
                    }
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    className={inputClass}
                    value={p.price || ""}
                    onChange={(e) =>
                      handleChange(p.firestoreId, "price", e.target.value)
                    }
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    className={`${inputClass} ${
                      Number(p.stock) <= LOW_STOCK_THRESHOLD
                        ? "border-warning ring-1 ring-warning/30"
                        : ""
                    }`}
                    value={p.stock ?? ""}
                    onChange={(e) =>
                      handleChange(p.firestoreId, "stock", e.target.value)
                    }
                  />
                  {Number(p.stock) <= LOW_STOCK_THRESHOLD && Number(p.stock) > 0 && (
                    <p className="text-xs text-warning mt-0.5">Low stock</p>
                  )}
                  {Number(p.stock) === 0 && (
                    <p className="text-xs text-error mt-0.5">Out of stock</p>
                  )}
                </td>
                <td className="py-2 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={p.trending || false}
                    onChange={(e) =>
                      handleChange(p.firestoreId, "trending", e.target.checked)
                    }
                    className="rounded border-black/20"
                  />
                </td>
                <td className="py-2 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={p.visible || false}
                    onChange={(e) =>
                      handleChange(p.firestoreId, "visible", e.target.checked)
                    }
                    className="rounded border-black/20"
                  />
                </td>
                <td className="py-2 px-2">
                  <button
                    type="button"
                    className="rounded-lg bg-primary text-white px-3 py-1.5 text-sm font-medium hover:bg-primary-dark disabled:opacity-60"
                    disabled={savingId === p.firestoreId}
                    onClick={() => handleSave(p)}
                  >
                    {savingId === p.firestoreId ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <p className="text-center text-neutral-mid py-8">No products found.</p>
      )}
    </div>
  );
};

export default AdminProductInventory;
