import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"loading"|"error"|"success"|"info">("info");
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductWithImage = async () => {
      try {
        setModalOpen(false);
        // 1️⃣ Fetch product details
        const productResponse = await axios.get<Product>(`http://localhost:8080/api/products/${id}`);
        const productData = productResponse.data;

        // 2️⃣ Fetch image as blob
        try {
          const imageResponse = await axios.get(`http://localhost:8080/api/product/${id}/image`, {
            responseType: "blob",
          });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setProduct({ ...productData, imageUrl });
        } catch (imgErr) {
          console.warn("No image available or failed to fetch image", imgErr);
          setProduct({ ...productData });
        }
      } catch (error: any) {
        console.error("Error fetching product or image:", error);
        const status = error?.response?.status;
        setModalType("error");
        if (status) {
          if (status === 404) {
            setModalTitle("Not Found");
            setModalMessage("Product not found.");
            setModalType("info");
          } else if (status === 401) {
            setModalTitle("Unauthorized");
            setModalMessage("Please log in to view this product.");
          } else if (status === 403) {
            setModalTitle("Forbidden");
            setModalMessage("You don't have permission to view this product.");
          } else if (status >= 500) {
            setModalTitle("Server Error");
            setModalMessage("Server is unavailable. Try again later.");
          } else {
            setModalTitle("Error");
            setModalMessage(`Request failed with status ${status}.`);
          }
        } else {
          setModalTitle("Network Error");
          setModalMessage("Failed to contact server. Check your connection.");
        }
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProductWithImage();
  }, [id]);


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setModalOpen(false);
      const response = await axios.delete(`http://localhost:8080/api/product/${id}`);
      if (response && (response.status === 200 || response.status === 204)) {
        setModalType("success");
        setModalTitle("Deleted");
        setModalMessage("Product deleted successfully.");
        setModalOpen(true);
        // navigate after a short moment so user sees the message
        setTimeout(() => navigate("/"), 700);
      } else {
        setModalType("error");
        setModalTitle("Delete Failed");
        setModalMessage(`Failed to delete product (status ${response.status}).`);
        setModalOpen(true);
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      const status = error?.response?.status;
      setModalType("error");
      if (status) {
        if (status === 401) {
          setModalTitle("Unauthorized");
          setModalMessage("You must be logged in to delete this product.");
        } else if (status === 403) {
          setModalTitle("Forbidden");
          setModalMessage("You don't have permission to delete this product.");
        } else if (status === 404) {
          setModalTitle("Not Found");
          setModalMessage("Product not found.");
        } else if (status >= 500) {
          setModalTitle("Server Error");
          setModalMessage("Server error while deleting. Try again later.");
        } else {
          setModalTitle("Delete Error");
          setModalMessage(`Request failed with status ${status}.`);
        }
      } else {
        setModalTitle("Network Error");
        setModalMessage("Unable to reach server. Check your connection.");
      }
      setModalOpen(true);
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
