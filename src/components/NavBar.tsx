import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Grid, PlusCircle, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

function NavBar({ searchQuery, setSearchQuery }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = () => {
    // Optional: implement search logic
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <nav className="bg-gray-900 text-gray-100 px-4 py-3 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-blue-400 tracking-wide flex items-center gap-2"
        >
          <ShoppingBag className="w-7 h-7 text-blue-500" />
          SportyStore
        </NavLink>

        {/* Search Bar - Always Visible */}
        <div className="flex-1 mx-4 hidden sm:flex">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1 rounded-lg text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="ml-2 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg text-white"
          >
            Search
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
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

          <NavLink
            to="/addProduct"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-blue-600/40"
          >
            <PlusCircle className="w-5 h-5" />
            Add Product
          </NavLink>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden flex items-center text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-300"
              }`
            }
          >
            <Home className="w-5 h-5" /> Home
          </NavLink>

          <NavLink
            to="/categories"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-300"
              }`
            }
          >
            <Grid className="w-5 h-5" /> Categories
          </NavLink>

          <NavLink
            to="/addProduct"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-blue-600/40"
          >
            <PlusCircle className="w-5 h-5" />
            Add Product
          </NavLink>
        </div>
      )}

      {/* Mobile Search Bar - Always Visible */}
      <div className="sm:hidden mt-3 px-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1 rounded-lg text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg text-white"
        >
          Search
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
