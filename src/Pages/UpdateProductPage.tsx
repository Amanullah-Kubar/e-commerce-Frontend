import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
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
    imageUrl?: string;
}

export default function UpdateProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

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

    // Fetch existing product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${id}`);
                setProduct(response.data);

                // Load image preview if exists
                if (response.data.id) {
                    const imageResp = await axios.get(
                        `http://localhost:8080/api/product/${id}/image`,
                        { responseType: "blob" }
                    );
                    const imageUrl = URL.createObjectURL(imageResp.data);
                    setPreview(imageUrl);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        if (product) {
            setProduct({
                ...product,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    // Handle image change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Submit update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setLoading(true);
        try {
            const formData = new FormData();
            const { imageUrl, ...productData } = product;
            formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
            if (imageFile) formData.append("imageFile", imageFile);

            await axios.put(`https://e-commerceapp-production-1342.up.railway.app/api/product/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("✅ Product updated successfully!");
            navigate(`/product/${id}`);
        } catch (error) {
            console.error("Error updating product:", error);
            alert("❌ Failed to update product.");
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <p className="text-gray-100">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl w-full max-w-3xl space-y-6 text-gray-100">
                <h2 className="text-3xl font-bold text-center text-blue-400">Update Product</h2>

                {/* Image */}
                <div className="flex flex-col items-center border-2 border-dashed border-gray-600 rounded-xl p-6">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-48 h-48 object-cover mb-4 rounded-lg" />
                    ) : (
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    )}
                    <label className="cursor-pointer bg-blue-600 px-4 py-2 rounded-lg font-medium">
                        {preview ? "Change Image" : "Upload Image"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>

                {/* Name */}
                <label className="block text-sm mb-2 font-semibold text-gray-300">
                    Product Name
                </label>
                <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700" placeholder="Product Name" required />

                {/* Description */}
                <label className="block text-sm mb-2 font-semibold text-gray-300">
                    Discription
                </label>
                <textarea name="description" value={product.description} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700" rows={3} placeholder="Description" required />

                {/* Category & Brand */}
                <label className="block text-sm mb-2 font-semibold text-gray-300">
                    Category
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <div>

                        <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-700" required>
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="">
                        <label className="block text-sm mb-2 font-semibold text-gray-300">
                            Brand
                        </label>
                        <input type="text" name="brand" value={product.brand} onChange={handleChange} placeholder="Brand" className="w-full p-3 rounded-lg bg-gray-700" required />
                    </div>
                </div>

                {/* Price & Quantity */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-2 font-semibold text-gray-300">
                            Price
                        </label>

                        <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" className="w-full p-3 rounded-lg bg-gray-700" required />
                    </div>
                    <div>
                        <label className="block text-sm mb-2 font-semibold text-gray-300">
                            Quantity
                        </label>
                        <input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="Quantity" className="w-full p-3 rounded-lg bg-gray-700" required />
                    </div>
                </div>

                {/* Release Date & Availability */}
                <label className="block text-sm mb-2 font-semibold text-gray-300">
                    Product Name
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" name="releaseDate" value={product.releaseDate.split('T')[0]} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-700" required />
                    <div className="flex items-center">
                        <input type="checkbox" name="availability" checked={product.availability} onChange={handleChange} className="mr-2 w-5 h-5 accent-blue-500" />
                        <span>Available in Stock</span>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold">
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
}
