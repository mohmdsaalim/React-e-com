import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiHeart, FiShare2, FiArrowLeft, FiStar, FiTruck, FiShield, FiRefreshCw, FiCheck } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetails() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  const validCategories = ["apparel", "kids_kits", "new_era"];
  const currentCategory = validCategories.includes(category) ? category : "apparel";

  // Image gallery simulation
  const productImages = product ? [
    product.image_url,
    product.image_url,
    product.image_url,
  ] : [];

  // Get current user from localStorage or API
  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      checkIfInCart(user);
    } else {
      // Fallback: Get user from API (you might want to implement proper authentication)
      axios.get("http://localhost:3000/users")
        .then(res => {
          const users = res.data;
          if (users.length > 0) {
            const user = users[0]; // For demo, using first user
            setCurrentUser(user);
            localStorage.setItem("currentUser", JSON.stringify(user));
            checkIfInCart(user);
          }
        })
        .catch(err => console.error("Error fetching user:", err));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/products")
      .then((res) => {
        const categoryData = res.data[currentCategory] || [];
        const found = categoryData.find((p) => String(p.id) === String(id));
        setProduct(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product details");
        setLoading(false);
      });
  }, [id, currentCategory]);

  useEffect(() => {
    if (product && currentUser) {
      checkIfInCart(currentUser);
    }
  }, [product, currentUser, selectedSize]);

  useEffect(() => {
    if (product) {
      axios
        .get("http://localhost:3000/products")
        .then((res) => {
          const all = res.data[currentCategory] || [];
          const similar = all.filter(
            (p) =>
              p.id !== product.id &&
              (p.category === product.category ||
                p.gender?.toLowerCase() === product.gender?.toLowerCase())
          );
          setRelated(similar.slice(0, 4));
        })
        .catch((err) => {
          console.error("Error fetching related products:", err);
          toast.error("Failed to load related products");
        });
    }
  }, [product, currentCategory]);

  const checkIfInCart = (user) => {
    if (!user || !user.cart || !product) return;
    
    const existingItem = user.cart.find(
      item => 
        item.productId === product.id && 
        item.category === currentCategory &&
        item.size === selectedSize
    );
    
    setIsInCart(!!existingItem);
  };

  const updateUserInDatabase = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:3000/users/${updatedUser.id}`, updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  const handleAddToCart = async () => {
    if (isInCart) {
      navigate("/cart");
      return;
    }

    if (!currentUser) {
      toast.error("Please login to add items to cart!", {
        icon: '⚠️',
        style: {
          background: '#fef3f2',
          color: '#d92c20',
          border: '1px solid #fecdca'
        }
      });
      return;
    }

    if (!product.status) {
      toast.error("This product is currently out of stock!", {
        icon: '❌',
        style: {
          background: '#fef3f2',
          color: '#d92c20',
          border: '1px solid #fecdca'
        }
      });
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size before adding to cart!", {
        icon: '⚠️',
        style: {
          background: '#fef3f2',
          color: '#d92c20',
          border: '1px solid #fecdca'
        }
      });
      return;
    }

    setAddingToCart(true);
    
    try {
      const cartItem = {
        productId: product.id,
        name: product.name,
        category: currentCategory,
        price_inr: product.price_inr,
        image_url: product.image_url,
        size: selectedSize,
        quantity: 1,
        materials: product.materials,
        care_instructions: product.care_instructions,
        addedDate: new Date().toISOString()
      };

      const updatedUser = {
        ...currentUser,
        cart: [...(currentUser.cart || []), cartItem]
      };

      const success = await updateUserInDatabase(updatedUser);
      
      if (success) {
        setIsInCart(true);
        toast.success(
          <div className="flex items-center space-x-2">
            <FiCheck className="w-5 h-5" />
            <span>Added to cart successfully!</span>
          </div>,
          {
            duration: 2000,
            style: {
              background: '#f0f9ff',
              color: '#0369a1',
              border: '1px solid #bae6fd',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          }
        );
      } else {
        throw new Error("Failed to update cart");
      }
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.", {
        icon: '❌',
        style: {
          background: '#fef3f2',
          color: '#d92c20',
          border: '1px solid #fecdca'
        }
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!currentUser) {
      toast.error("Please login to add items to wishlist!", {
        icon: '⚠️',
        style: {
          background: '#fef3f2',
          color: '#d92c20',
          border: '1px solid #fecdca'
        }
      });
      return;
    }

    if (!product.status) {
      toast.error("Cannot add out of stock items to wishlist!", {
        icon: '❌',
        style: {
          background: '#fef3f2',
          color: '#d92c20',
          border: '1px solid #fecdca'
        }
      });
      return;
    }

    const wishlistItem = {
      productId: product.id,
      name: product.name,
      category: currentCategory,
      price_inr: product.price_inr,
      image_url: product.image_url,
      materials: product.materials,
      care_instructions: product.care_instructions,
      addedDate: new Date().toISOString()
    };

    // Check if item already in wishlist
    const existingItem = (currentUser.wishlist || []).find(
      item => item.productId === product.id
    );
    
    if (existingItem) {
      toast('Already in wishlist!', {
        icon: '❤️',
        style: {
          background: '#fef3f2',
          color: '#dc2626',
        }
      });
      return;
    }

    try {
      const updatedUser = {
        ...currentUser,
        wishlist: [...(currentUser.wishlist || []), wishlistItem]
      };

      const success = await updateUserInDatabase(updatedUser);
      
      if (success) {
        toast.success(
          <div className="flex items-center space-x-2">
            <FiHeart className="w-5 h-5" />
            <span>Added to wishlist!</span>
          </div>,
          {
            style: {
              background: '#fdf2f8',
              color: '#be185d',
              border: '1px solid #fbcfe8',
            }
          }
        );
      } else {
        throw new Error("Failed to update wishlist");
      }
    } catch (error) {
      toast.error("Failed to add item to wishlist. Please try again.", {
        icon: '❌',
        style: {
          background: '#fef3f2',
          color: '#d92c20',
          border: '1px solid #fecdca'
        }
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} from FC Barcelona Store`,
        url: window.location.href,
      })
      .then(() => toast.success('Product shared successfully!'))
      .catch(() => toast.error('Failed to share product'));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', {
        icon: '📋',
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#004d98]"></div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <Link to="/" className="text-[#004d98] hover:underline">Return to Home</Link>
      </div>
    </div>
  );

  const getButtonText = () => {
    if (!currentUser) return "LOGIN TO ADD";
    if (!product.status) return "OUT OF STOCK";
    if (isInCart) return "GO TO CART";
    if (!selectedSize) return "SELECT SIZE";
    return "ADD TO CART";
  };

  const getButtonIcon = () => {
    if (isInCart) return <FiCheck className="w-5 h-5" />;
    if (addingToCart) return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
    return <FiShoppingCart className="w-5 h-5" />;
  };

  const getButtonStyle = () => {
    if (isInCart) {
      return "flex-1 flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all";
    }
    return "flex-1 flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-[#004d98] to-[#003366] text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link 
          to="/kits" 
          className="inline-flex items-center text-gray-600 hover:text-[#004d98] transition-colors group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-100 lg:h-[500px] object-contain"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={handleAddToWishlist}
                  disabled={!product.status}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiHeart className="w-5 h-5 text-gray-700" />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <FiShare2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? "border-[#004d98] scale-110" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-[#004d98]/10 text-[#004d98] text-sm font-medium rounded-full">
                {product.category}
              </span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">(4.8)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-oswald mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <p className="text-3xl font-bold text-[#a50044]">
                ₹{product.price_inr}
              </p>
              <span
                className={`px-2 py-1 text-sm font-medium rounded ${
                  product.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {product.status ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              This premium {product.category.toLowerCase()} is crafted with advanced performance 
              fabric and features the iconic FC Barcelona colors. Designed for ultimate 
              comfort and style for {product.gender?.toLowerCase()} fans.
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-gray-900">Select Size:</p>
                <button className="text-sm text-[#004d98] hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!product.status}
                    className={`py-3 border-2 rounded-xl font-semibold transition-all ${
                      selectedSize === size
                        ? "border-[#004d98] bg-[#004d98] text-white transform scale-105"
                        : "border-gray-300 text-gray-700 hover:border-[#004d98] hover:scale-105"
                    } ${!product.status ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <FiTruck className="w-5 h-5 text-[#004d98]" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FiShield className="w-5 h-5 text-[#004d98]" />
                <span className="text-sm">2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FiRefreshCw className="w-5 h-5 text-[#004d98]" />
                <span className="text-sm">Easy Returns</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={(!selectedSize || !product.status || !currentUser || addingToCart) && !isInCart}
                className={getButtonStyle()}
              >
                {getButtonIcon()}
                <span>{getButtonText()}</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Product ID:</span>
                  <span className="font-medium">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span className="font-medium">{product.materials}</span>
                </div>
                <div className="flex justify-between">
                  <span>Care:</span>
                  <span className="font-medium">{product.care_instructions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span className="font-medium">{product.stock_quantity} units</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 font-oswald mb-3">
                Complete Your Look
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fans who bought this item also loved these matching products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${currentCategory}/${item.id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    {!item.status && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#004d98] transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-[#a50044]">
                        ₹{item.price_inr}
                      </p>
                      <span className="text-xs text-gray-500">{item.category}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
