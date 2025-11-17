import { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";

interface Product {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  quantity: number;
  releaseDate: string;
  availability: boolean;
  imageFile?: File | null;
}

function AddProduct() {
  const categories = [
    "Electronics",
    "Fashion",
    "Beauty & Personal Care",
    "Home & Kitchen",
    "Sports & Outdoors",
    "Toys & Kids",
    "Books & Stationery",
    "Automotive",
    "Grocery & Food",
    "Pet Supplies"
  ];
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: 0,
    quantity: 0,
    releaseDate: "",
    availability: true,
    imageFile: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);




  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct((prev) => ({ ...prev, imageFile: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if(!product.name || !product.description || !product.category || !product.brand || product.price <= 0 || product.quantity < 0 || !product.releaseDate) {      
      alert("❌ Please fill in all required fields correctly.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      // Convert the product object to JSON and append as 'product' part
      const { imageFile, ...productData } = product;
      formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));

      // Append image separately as 'image' part
      if (imageFile) formData.append("imageFile", imageFile);

      await axios.post("http://localhost:8080/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product added successfully!");
    } catch (error: any) {
      console.error(error);
      alert("❌ Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-3xl text-gray-100 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          🛍️ Add New Product
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center border-2 border-dashed border-gray-600 rounded-xl p-6 hover:border-blue-500 transition-all duration-300">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-lg mb-4 shadow-lg"
            />
          ) : (
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
          )}

          <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium text-white transition">
            {preview ? "Change Image" : "Upload Image"}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm mb-2 font-semibold text-gray-300">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter product name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-2 font-semibold text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Write product description..."
          />
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2 font-semibold text-gray-300">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter brand name"
            />
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 font-semibold text-gray-300">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 font-semibold text-gray-300">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Release Date & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 font-semibold text-gray-300">
              Release Date
            </label>
            <input
              type="date"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center mt-7">
            <input
              type="checkbox"
              name="availability"
              checked={product.availability}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-500 mr-2"
            />
            <label className="text-sm font-semibold text-gray-300">
              Available in Stock
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg ${loading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/40"
            }`}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
