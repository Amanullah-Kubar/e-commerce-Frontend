import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  quantity: number;
  releaseDate: string;
  availability: boolean;
  imageUrl?: string; // local blob URL
}

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductWithImage = async () => {
      try {
        // 1️⃣ Fetch product details
        const productResponse = await axios.get<Product>(`https://e-commerceapp-production-1342.up.railway.app/api/products/${id}`);
        const productData = productResponse.data;

        // 2️⃣ Fetch image as blob
        const imageResponse = await axios.get(`https://e-commerceapp-production-1342.up.railway.app/api/product/${id}/image`, {
          responseType: "blob",
        });

        // Convert blob to URL for <img src>
        const imageUrl = URL.createObjectURL(imageResponse.data);

        // 3️⃣ Set product state with imageUrl
        setProduct({ ...productData, imageUrl });
      } catch (error) {
        console.error("Error fetching product or image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductWithImage();
  }, [id]);


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`https://e-commerceapp-production-1342.up.railway.app/api/product/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Product deleted successfully");
        navigate("/");
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Error deleting product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg animate-pulse">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-lg">
        Product not found
      </div>
    );
  }

  const date = new Date(product.releaseDate);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6 py-12">
      <div className="bg-gray-800/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-3xl text-gray-100 transition-all duration-300 hover:shadow-blue-700/30">
        {/* Product Image */}
        <div className="overflow-hidden rounded-xl mb-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Details */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3 tracking-wide text-white">
            {product.name}
          </h2>
          <p className="text-gray-400 text-sm italic mb-5">{product.description}</p>

          <div className="flex flex-wrap justify-center gap-6 text-gray-300 mb-6">
            <p className="bg-gray-700/60 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-400">Category:</span> {product.category}
            </p>
            <p className="bg-gray-700/60 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-400">Brand:</span> {product.brand}
            </p>
            <p className="bg-gray-700/60 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-400">Stock:</span> {product.quantity}
            </p>
          </div>

          {/* Price and Date */}
          <div className="text-center mb-6">
            <p className="text-4xl font-extrabold text-blue-400 mb-1">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-500 text-sm">Listed On: {date.toLocaleDateString()}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
            >
              🗑️ Delete Product
            </button>
            <button onClick={() => navigate(`/product/update/${product.id}`)} className="bg-yellow-500 hover:bg-red-300 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg">
              Update Product
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
