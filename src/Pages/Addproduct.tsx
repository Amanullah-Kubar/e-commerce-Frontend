import { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import Modal from "../components/Modal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"loading" | "error" | "success" | "info">("info");
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});




  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) newErrors.name = 'Product name is required';
        else delete newErrors.name;
        break;
      case 'description':
        if (!value.trim()) newErrors.description = 'Description is required';
        else if (value.length < 10) newErrors.description = 'Description must be at least 10 characters';
        else delete newErrors.description;
        break;
      case 'category':
        if (!value) newErrors.category = 'Please select a category';
        else delete newErrors.category;
        break;
      case 'brand':
        if (!value.trim()) newErrors.brand = 'Brand name is required';
        else delete newErrors.brand;
        break;
      case 'price':
        if (value <= 0) newErrors.price = 'Price must be greater than 0';
        else delete newErrors.price;
        break;
      case 'quantity':
        if (value < 0) newErrors.quantity = 'Quantity cannot be negative';
        else delete newErrors.quantity;
        break;
      case 'releaseDate':
        if (!value) newErrors.releaseDate = 'Release date is required';
        else delete newErrors.releaseDate;
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    validateField(name, type === "checkbox" ? checked : value);
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
    
    // Validate all fields
    if(!product.name || !product.description || !product.category || !product.brand || product.price <= 0 || product.quantity < 0 || !product.releaseDate) {      
      setModalType("error");
      setModalTitle("Validation Error");
      setModalMessage("Please fill in all required fields correctly.");
      setModalOpen(true);
      return;
    }

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      setModalType("error");
      setModalTitle("Form Errors");
      setModalMessage("Please fix the errors below before submitting.");
      setModalOpen(true);
      return;
    }

    setLoading(true);
    setModalOpen(false);

    try {
      const formData = new FormData();

      // Convert the product object to JSON and append as 'product' part
      const { imageFile, ...productData } = product;
      formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));

      // Append image separately as 'image' part
      if (imageFile) formData.append("imageFile", imageFile);

      const response = await axios.post("http://localhost:8080/api/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && (response.status === 200 || response.status === 201)) {
        setModalType("success");
        setModalTitle("Product Added");
        setModalMessage("Product added successfully!");
        setModalOpen(true);
      } else {
        setModalType("info");
        setModalTitle("Unexpected Response");
        setModalMessage(`Server returned status ${response.status}.`);
        setModalOpen(true);
      }
    } catch (error: any) {
      console.error(error);
      const status = error?.response?.status;
      if (status) {
        if (status === 400) {
          setModalTitle("Invalid Data");
          setModalMessage("Provided product data is invalid. Please check the fields.");
        } else if (status === 401) {
          setModalTitle("Unauthorized");
          setModalMessage("You must be logged in to add a product.");
        } else if (status === 403) {
          setModalTitle("Forbidden");
          setModalMessage("You don't have permission to add products.");
        } else if (status === 409) {
          setModalTitle("Conflict");
          setModalMessage("A product with similar data already exists.");
        } else if (status >= 500) {
          setModalTitle("Server Error");
          setModalMessage("Server encountered an error. Try again later.");
        } else {
          setModalTitle("Error")
          setModalMessage(`Request failed with status ${status}.`);
        }
      } else {
        setModalTitle("Network Error");
        setModalMessage("Unable to reach the server. Check your connection.");
      }
      setModalType("error");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };


  


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6 py-10">
      <Modal open={modalOpen || loading} title={modalTitle} message={modalMessage} type={loading ? "loading" : modalType} onClose={() => setModalOpen(false)} />
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
            className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 outline-none ${
              errors.name ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">⚠️ {errors.name}</p>}
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
            className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 outline-none ${
              errors.description ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
            placeholder="Write product description..."
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">⚠️ {errors.description}</p>}
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className={`w-full p-2 rounded-lg bg-gray-700 mb-4 focus:outline-none focus:ring-2 ${
                errors.category ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-sm mt-1">⚠️ {errors.category}</p>}
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
              className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 outline-none ${
                errors.brand ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter brand name"
            />
            {errors.brand && <p className="text-red-400 text-sm mt-1">⚠️ {errors.brand}</p>}
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
              className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 outline-none ${
                errors.price ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">⚠️ {errors.price}</p>}
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
              className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 outline-none ${
                errors.quantity ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.quantity && <p className="text-red-400 text-sm mt-1">⚠️ {errors.quantity}</p>}
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
              className={`w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 outline-none ${
                errors.releaseDate ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.releaseDate && <p className="text-red-400 text-sm mt-1">⚠️ {errors.releaseDate}</p>}
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
