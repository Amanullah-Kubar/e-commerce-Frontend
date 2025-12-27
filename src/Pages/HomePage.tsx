import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal';

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
  imageUrl?: string;  // URL created from blob
}


export default function HomePage({ searchQuery }: { searchQuery: string }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"loading"|"error"|"success"|"info">("info");
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);
  const [retrySearch, setRetrySearch] = useState(false);

  const fetchProducts = async () => {
    let productsData: Product[] = [];
    setLoading(true);
    try {
      // 1️⃣ Fetch product list
      if (searchQuery === '') {
        const response = await axios.get<Product[]>('http://localhost:8080/api/products');
        productsData = response.data;

      } else {
        const response = await axios.get<Product[]>(
          `http://localhost:8080/api/products/search?query=${searchQuery}`
        );
        productsData = response.data;
      }


      // 2️⃣ Fetch images for each product
      const productsWithImages = await Promise.all(
        productsData.map(async (product) => {
          try {
            const imageResponse = await axios.get(
              `http://localhost:8080/api/product/${product.id}/image`,
              { responseType: 'blob' }
            );
            const imageUrl = URL.createObjectURL(imageResponse.data);
            return { ...product, imageUrl };
          } catch (err) {
            console.warn(`No image for product ${product.id}`);
            return { ...product }; // return without image
          }
        })
      );

      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching products:', error);
      const status = (error as any)?.response?.status;
      setModalType("error");
      if (status) {
        if (status === 401) {
          setModalTitle("Unauthorized");
          setModalMessage("Please log in to view products.");
        } else if (status === 403) {
          setModalTitle("Forbidden");
          setModalMessage("You don't have access to view these products.");
        } else if (status === 404) {
          setModalTitle("Not Found");
          setModalMessage("No products were found.");
          setModalType("info");
        } else if (status >= 500) {
          setModalTitle("Server Error");
          setModalMessage("Server is currently unavailable. Try again later.");
        } else {
          setModalTitle("Error Fetching");
          setModalMessage(`Request failed with status ${status}.`);
        }
      } else {
        setModalTitle("Network Error");
        setModalMessage("Could not contact server. Check your network.");
      }
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, retrySearch]);

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-gray-100">

      <Modal open={modalOpen || loading} title={modalTitle} message={modalMessage} type={loading ? "loading" : modalType} onClose={() => setModalOpen(false)} />

      {products.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-3xl font-bold text-gray-300 mb-2">No Products Found</h2>
          <p className="text-gray-400 mb-6">Try a different search or browse all products</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className={`bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer relative ${
                !product.availability ? 'opacity-75' : ''
              }`}
            >
              {/* Product Image */}
              <div className="h-48 w-full bg-gray-700 flex items-center justify-center relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
                {!product.availability && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">OUT OF STOCK</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-300 mb-4 flex-1">{product.description}</p>
                <p className="text-green-400 font-bold text-lg mb-2">
                  ${product.price}
                </p>
                <p
                  className={`text-sm font-medium ${
                    product.availability ? 'text-green-400' : 'text-red-500'
                  }`}
                >
                  {product.availability ? '✓ In Stock' : '✗ Out of Stock'}
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
      {modalOpen && modalType === "error" && (
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={() => setRetrySearch(!retrySearch)}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition"
          >
            🔄 Retry
          </button>
        </div>
      )}
    </div>
  );
}
