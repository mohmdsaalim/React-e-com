import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CardSlider() {
  const [products, setProducts] = useState([]);

  //  Fetch data from JSON server
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => {
        setProducts(res.data.new_era.slice(0, 6));
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);
  // console.log(" this is ",products)

  return (
    <section className="bg-[#171630] text-white py-16 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-[#ffc72c] mb-8 uppercase tracking-wider">
          New Collection
        </h2>

        {/* Horizontal Scroll */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {products.length > 0 ? (
            products.map((product,index) => (
              <Link key={`${product.id}-${index}`} //  Unique key using id + index
              to={`/product/new_era/${product.id}`}>
                <div className="group flexshrink-0 w-[250px] bg-[#1c1b3a]  overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  
                  {/* Image Section */}
                  <div className="relative">
                    {product.label && (
                      <span className="absolute top-3 left-3 z-20 bg-[#ffc72c] text-[#171630] text-xs font-bold px-2 py-1 rounded-sm uppercase">
                        {product.label}
                      </span>
                    )}
                    <div className="overflow-hidden ">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-72 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 flex flex-col justify-between h[160px]">
                    <div>
                      <p className="text-[12px] font-semibold text-[#ffc72c] uppercase">
                        ED SHEERAN COLLECTION
                      </p>
                      <h3 className="text-base font-bold mt-1">{product.name}</h3>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">₹{product.price_inr}</p>
                      <p className="text-xs text-red-400">Few items remaining</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400">Loading products...</p>
          )}
        </div>
      </div>
    </section>
  );
}