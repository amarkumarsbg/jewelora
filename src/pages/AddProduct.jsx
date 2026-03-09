


import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "Necklaces",
    price: "",
    description: "",
    stock: "",
    trending: false,
    visible: true,
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Upload multiple images to Cloudinary
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let uploadedUrls = [];

    for (let file of files) {
      const cloudData = new FormData();
      cloudData.append("file", file);
      cloudData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: cloudData }
        );
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    setImages(uploadedUrls);
    setUploading(false);
  };

  // ✅ Save products to Firestore
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!formData.id || images.length === 0) {
      setMessage({ type: "warning", text: "Fill all required fields" });
      return;
    }

    try {
      for (let i = 0; i < images.length; i++) {
        await addDoc(collection(db, "dynamic_products"), {
          id: `${formData.id}-${i + 1}`,
          sku: `${formData.id}-${i + 1}`,
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          description: formData.description,
          imageUrl: images[i],

          stock: Number(formData.stock),
          inStock: Number(formData.stock) > 0,
          trending: formData.trending,
          visible: formData.visible,

          createdAt: new Date(),
        });
      }

      setMessage({ type: "success", text: "✅ Products added successfully" });

      setFormData({
        id: "",
        name: "",
        category: "Necklaces",
        price: "",
        description: "",
        stock: "",
        trending: false,
        visible: true,
      });
      setImages([]);
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-warning fw-bold mb-4">Add New Products</h2>

      {message && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleAddProduct} className="card p-4 shadow-sm">

        <input
          name="id"
          className="form-control mb-3"
          placeholder="Base Product ID (e.g. e11)"
          value={formData.id}
          onChange={handleChange}
          required
        />

        <input
          name="name"
          className="form-control mb-3"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="form-select mb-3"
          value={formData.category}
          onChange={handleChange}
        >
          <option>Mangalsutra</option>
          <option>Necklaces</option>
          <option>Pendants</option>
          <option>Bracelets</option>
          <option>Earrings</option>
          <option>Bangles</option>
          <option>KADA</option>
          <option>Oxidised Necklaces</option>
          <option>Modern Mangalsutra</option>
          <option>Special Collection</option>
        </select>

        <input
          type="number"
          name="price"
          className="form-control mb-3"
          placeholder="Price ₹"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="stock"
          className="form-control mb-3"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          className="form-control mb-3"
          placeholder="Description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Toggles */}
        <div className="form-check mb-2">
          <input
            type="checkbox"
            name="trending"
            className="form-check-input"
            checked={formData.trending}
            onChange={handleChange}
          />
          <label className="form-check-label">Trending Product</label>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="visible"
            className="form-check-input"
            checked={formData.visible}
            onChange={handleChange}
          />
          <label className="form-check-label">Visible on Store</label>
        </div>

        <input
          type="file"
          multiple
          className="form-control mb-3"
          onChange={handleImageUpload}
        />

        <button className="btn btn-warning text-white" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Products"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
