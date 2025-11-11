import { useEffect, useState } from "react";
import axios from "axios";
import { productsAPI } from "../api";

export default function useProductFilter(dataKey) {
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  

  // Fetch products
  useEffect(() => {
    axios
      .get(productsAPI)
      .then((res) => {
        setProduct(res.data[dataKey] || []);
        setFilteredProducts(res.data[dataKey] || []);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [dataKey]);

  // console.log(product)
  // Apply filters + sorting
  useEffect(() => {
    let updated = [...product];

    // Search
    if (searchTerm.trim() !== "") {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    //  Category filter
    if (category !== "All") {
      updated = updated.filter((p) => p.category === category);
    }

    // Gender filter (case-insensitive)
    if (gender !== "All") {
      updated = updated.filter(
        (p) => p.gender && p.gender.toLowerCase() === gender.toLowerCase()
      );
    }

    // 💰 Sort by price
    if (sortOrder === "lowToHigh") {
      updated.sort((a, b) => parseFloat(a.price_inr) - parseFloat(b.price_inr));
    } else if (sortOrder === "highToLow") {
      updated.sort((a, b) => parseFloat(b.price_inr) - parseFloat(a.price_inr));
    }

    setFilteredProducts(updated);
  }, [searchTerm, category, gender, sortOrder, product]);

  return {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    gender,
    setGender,
    sortOrder,
    setSortOrder,
  };
}



