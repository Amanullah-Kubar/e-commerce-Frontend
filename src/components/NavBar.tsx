import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Grid, PlusCircle } from "lucide-react";
import { useEffect } from "react";

type NavBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};
function NavBar({ searchQuery, setSearchQuery } : NavBarProps) {
  const handleSearch = () => {
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  }
  useEffect(() => {
    console.log("Search query updated:", searchQuery);
  }, [searchQuery]);
  return (
    <nav className="bg-gray-900 text-gray-100 px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <NavLink to="/" className="text-2xl font-bold text-blue-400 tracking-wide flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-blue-500" />
          SportyStore
        </NavLink>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "text-blue-400 border-b-2 border-blue-500 pb-1"
                  : "text-gray-300 hover:text-blue-300"
              }`
            }
          >
            <Home className="w-5 h-5" /> Home
          </NavLink>

          {/* <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "text-blue-400 border-b-2 border-blue-500 pb-1"
                  : "text-gray-300 hover:text-blue-300"
              }`
            }
          >
            <ShoppingBag className="w-5 h-5" /> Products
          </NavLink> */}

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "text-blue-400 border-b-2 border-blue-500 pb-1"
                  : "text-gray-300 hover:text-blue-300"
              }`
            }
          >
            <Grid className="w-5 h-5" /> Categories
          </NavLink>
        </div>

        {/* Add Product Button */}
        <div className="flex items-center space-x-4">
  <input
    type="text"
    placeholder="Search products..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="px-3 py-1 rounded-lg text-gray-200"
  />
  <button
    onClick={handleSearch}
    className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg text-white"
  >
    Search
  </button>
</div>

        <NavLink
          to="/addProduct"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-blue-600/40"
        >
          <PlusCircle className="w-5 h-5" />
          Add Product
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
