
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useProductFilter from "../../Context/useProductFilter";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";

export default function K() {
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    gender,
    setGender,
    sortOrder,
    setSortOrder,
  } = useProductFilter("apparel");

  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setGender("All");
    setSortOrder("default");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-end p-6" />

      {/* Page Heading */}
      <div className="mx-auto max-w-7xl px-4 mb-4 mt-2">
        <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[120px] font-extrabold text-[#03182e] tracking-wide leading-tight font-oswald mt-9">
          APPAREL
        </h2>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowFilters(true)}
          className="bg-[#004d98] text-white p-4 rounded-full shadow-lg hover:bg-[#003366] transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        >
          <FiFilter size={24} />
        </button>
      </div>

      {/* Filter Bar - Desktop */}
      <div className="hidden lg:block w-full border-y-2 border-[#090c4d] bg-white-100 py-6 mb-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-row items-center gap-6">
          <div className="relative w-1/4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search kits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-[#004d98] focus:ring-2 focus:ring-[#004d98] focus:ring-opacity-20 transition-all"
            />
          </div>
          {/* sett here cat????....*/}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="px-4 py-2 rounded-md border border-white focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff] focus:ring-opacity-20 transition-all"
          >
            <option value="All">All Genders</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Kids">Kids</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 rounded-md border border-white focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff] focus:ring-opacity-20 transition-all"
          >
            <option value="default">Sort by</option>
            <option value="lowToHigh">Price: Low → High</option>
            <option value="highToLow">Price: High → Low</option>
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black underline transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Mobile Filter Popup */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          showFilters
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            showFilters ? "opacity-50" : "opacity-0"
          }`}
          onClick={() => setShowFilters(false)}
        />

        {/* Filter Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${
            showFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Filter Content */}
          <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search kits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff] focus:ring-opacity-20 focus:outline-none outline-none transition-all"
/>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
           
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff] focus:ring-opacity-20 ransition-all"
              >
                <option value="All">All Genders</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#004d98] focus:ring-2 focus:ring-[#004d98] focus:ring-opacity-20 transition-all"
              >
                <option value="default">Default</option>
                <option value="lowToHigh">Price: Low → High</option>
                <option value="highToLow">Price: High → Low</option>
              </select>
            </div>

            {/* Active Filters Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Active Filters</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {searchTerm && <p>Search: "{searchTerm}"</p>}
                {category !== "All" && <p>Category: {category}</p>}
                {gender !== "All" && <p>Gender: {gender}</p>}
                {sortOrder !== "default" && (
                  <p>Sort: {sortOrder === "lowToHigh" ? "Price: Low to High" : "Price: High to Low"}</p>
                )}
                {!searchTerm && category === "All" && gender === "All" && sortOrder === "default" && (
                  <p className="text-gray-400">No active filters</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-6 py-3 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-all duration-200 transform hover:scale-105"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        {/* Active Filters Mobile Summary */}
        <div className="lg:hidden mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {filteredProducts.length} products found
            </span>
            <button
              onClick={() => setShowFilters(true)}
              className="text-sm text-[#004d98] font-medium hover:text-[#003366] transition-colors"
            >
              Change Filters
            </button>
          </div>
          {(searchTerm || category !== "All" || gender !== "All" || sortOrder !== "default") && (
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              {searchTerm && <span className="inline-block mr-2">Search: "{searchTerm}"</span>}
              {category !== "All" && <span className="inline-block mr-2">Category: {category}</span>}
              {gender !== "All" && <span className="inline-block mr-2">Gender: {gender}</span>}
              {sortOrder !== "default" && (
                <span className="inline-block mr-2">
                  Sort: {sortOrder === "lowToHigh" ? "Price: Low to High" : "Price: High to Low"}
                </span>
              )}
            </div>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  alt={p.name}
                  src={p.image_url}
                  className="aspect-square w-full rounded-lg object-cover group-hover:scale-95 transition-transform duration-300"
                />
                <h3 className="mt-4 text-sm font-semibold text-gray-800 line-clamp-2">
                  {p.name}
                </h3>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  ₹{p.price_inr}
                </p>
                <Link
                  to={`/product/apparel/${p.id}`}
                  className="inline-block mt-2 text-sm text-[#004d98] font-medium underline hover:text-[#8a023b] transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              No kits found matching your filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}