import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";
import Addproduct from "./Pages/Addproduct";
import NavBar from "./components/NavBar";
import UpdateProductPage from "./Pages/UpdateProductPage";
import { useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery}/>} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/AddProduct" element={<Addproduct />} />
        <Route path="/product/update/:id" element={<UpdateProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
