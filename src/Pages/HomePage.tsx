import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const fetchProducts = async () => {
    let productsData: Product[] = [];
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
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-gray-100">
      <h1 className="text-4xl font-bold text-center text-indigo-400 mb-8">
        Welcome to Our Store
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer"
          >
            {/* Product Image */}
            <div className="h-48 w-full bg-gray-700 flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
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
                className={`text-sm font-medium ${product.availability ? 'text-green-400' : 'text-red-500'
                  }`}
              >
                {product.availability ? 'In Stock' : 'Out of Stock'}
              </p>
              <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center">
                Add to Cart
                <ShoppingCart className="inline-block w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
