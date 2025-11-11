import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { usersAPI } from "../api";
import { 
  FiShoppingCart, 
  FiPackage, 
  FiTag, 
  FiCreditCard, 
  FiArrowRight, 
  FiTrash2, 
  FiPlus, 
  FiMinus,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiArrowLeft
} from "react-icons/fi";
import { IoShirtOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [updatingQuantity, setUpdatingQuantity] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load cart from user data
  useEffect(() => {
    loadUserCart();
  }, []);

  const loadUserCart = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setCartItems(user.cart || []);
      } else {
        // Fallback: Get user from API
        const response = await axios.get(usersAPI);
        const users = response.data;
        if (users.length > 0) {
          const user = users[0]; // For demo, using first user
          setCurrentUser(user);
          setCartItems(user.cart || []);
          localStorage.setItem("currentUser", JSON.stringify(user));
        }
      }
    } catch (error) {
      console.error("Error loading user cart:", error);
      toast.error("Failed to load cart data");
      // Fallback to localStorage if API fails
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
    } finally {
      setLoading(false);
    }
  };

  // Update user in database
  const updateUserInDatabase = async (updatedUser) => {
    try {
      await axios.put(`${usersAPI}/${updatedUser.id}`, updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  // Remove item from cart
  const removeItem = async (productId, name) => {
    try {
      if (!currentUser) {
        toast.error("User not found. Please login again.");
        return;
      }

      const updatedCart = cartItems.filter((item) => item.productId !== productId);
      const updatedUser = {
        ...currentUser,
        cart: updatedCart
      };

      const success = await updateUserInDatabase(updatedUser);
      
      if (success) {
        setCartItems(updatedCart);
        toast.success(
          <div className="flex items-center space-x-2">
            <FiTrash2 className="w-4 h-4" />
            <span>Removed {name} from cart</span>
          </div>,
          {
            style: {
              background: '#f0f9ff',
              color: '#0369a1',
              border: '1px solid #bae6fd',
            }
          }
        );
      } else {
        throw new Error("Failed to update cart");
      }
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error("Error removing item:", error);
    }
  };

  // Clear all items from cart
  const clearCart = async () => {
    if (cartItems.length === 0) return;
    
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        if (!currentUser) {
          toast.error("User not found. Please login again.");
          return;
        }

        const updatedUser = {
          ...currentUser,
          cart: []
        };

        const success = await updateUserInDatabase(updatedUser);
        
        if (success) {
          setCartItems([]);
          toast.success("Cart cleared successfully!", {
            icon: '🛒',
          });
        } else {
          throw new Error("Failed to clear cart");
        }
      } catch (error) {
        toast.error("Failed to clear cart");
        console.error("Error clearing cart:", error);
      }
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingQuantity(productId);

      if (!currentUser) {
        toast.error("User not found. Please login again.");
        return;
      }

      const updatedCart = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );

      const updatedUser = {
        ...currentUser,
        cart: updatedCart
      };

      const success = await updateUserInDatabase(updatedUser);
      
      if (success) {
        setCartItems(updatedCart);
      } else {
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingQuantity(null);
    }
  };

  // Pricing calculations
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price_inr || item.price || 0) * (item.quantity || 1),
    0
  );
  const discount = subtotal * appliedDiscount;
  const shipping = subtotal >= 5000 ? 0 : 199;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + shipping + tax;

  // Apply discount code
  const applyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code", {
        icon: '📝',
      });
      return;
    }

    if (discountCode.toUpperCase() === "BARCA10") {
      setAppliedDiscount(0.1);
      toast.success("🎉 BARCA10 applied! 10% discount activated");
    } else if (discountCode.toUpperCase() === "CULERS20") {
      setAppliedDiscount(0.2);
      toast.success("🎉 CULERS20 applied! 20% discount activated");
    } else {
      setAppliedDiscount(0);
      toast.error("Invalid discount code. Try BARCA10 or CULERS20", {
        icon: '❌',
      });
    }
  };

  // Cart Item Component
  const CartItem = ({ item }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0 relative">
          <Link 
            to={`/product/${item.category || 'apparel'}/${item.productId}`}
            className="block"
          >
            <img
              src={item.image_url || item.image}
              alt={item.name}
              className="w-28 h-28 lg:w-32 lg:h-32 object-cover rounded-xl border-2 border-gray-100 group-hover:border-[#004d98] transition-colors"
            />
          </Link>
          <div className="absolute -top-2 -right-2 bg-[#a50044] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {item.quantity || 1}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Product Info */}
            <div className="flex-1 space-y-3">
              <Link 
                to={`/product/${item.category || 'apparel'}/${item.productId}`}
                className="group block"
              >
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#004d98] transition-colors leading-tight">
                  {item.name}
                </h3>
              </Link>
              
              <div className="flex flex-wrap items-center gap-3">
                {item.size && (
                  <span className="bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                    Size: {item.size}
                  </span>
                )}
                <span className="bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium text-[#004d98] border border-blue-100">
                  {item.category || 'Apparel'}
                </span>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-200">
                  <button
                    onClick={() => updateQuantity(item.productId, (item.quantity || 1) - 1)}
                    disabled={updatingQuantity === item.productId || (item.quantity || 1) <= 1}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <FiMinus className="w-3 h-3 text-gray-600" />
                  </button>
                  
                  <span className="w-12 text-center font-bold text-gray-900 text-lg">
                    {updatingQuantity === item.productId ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#004d98] mx-auto"></div>
                    ) : (
                      item.quantity || 1
                    )}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.productId, (item.quantity || 1) + 1)}
                    disabled={updatingQuantity === item.productId}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <FiPlus className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-[#a50044] mb-1">
                  ₹{((item.price_inr || item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  ₹{(item.price_inr || item.price || 0).toLocaleString()} each
                </p>
              </div>
              
              <button
                onClick={() => removeItem(item.productId, item.name)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-all rounded-lg border border-red-200 group"
              >
                <FiTrash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16 flex items-center justify-center">
        <Toaster position="top-right" />
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#004d98]"></div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 mt-8 border border-gray-100">
            <div className="w-32 h-32 bg-gradient-to-br from-[#004d98] to-[#004d98] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <IoShirtOutline className="w-16 h-16 text-[#ece8dc]" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-oswald">
              Your Cart is Empty 🛍️
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Discover the latest FC Barcelona merchandise and fill your cart with official gear!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/kits")}
                className="px-10 py-4 bg-gradient-to-r from-[#004d98] to-[#003366] text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore Kits
              </button>
              
              <button
                onClick={() => navigate("/apparel")}
                className="px-10 py-4 border-2 border-[#004d98] text-[#004d98] font-bold rounded-xl hover:bg-[#004d98] hover:text-white transition-all duration-300 shadow-lg"
              >
                Browse Apparel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="mb-8">
          <Link 
            to="/kits" 
            className="inline-flex items-center text-gray-600 hover:text-[#004d98] transition-colors group text-lg font-medium"
          >
            <FiArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" size={20} />
            Continue Shopping
          </Link>
        </div>

        {/* Main Header */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl px-8 py-8 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-2xl flex items-center justify-center shadow-lg">
                <FiShoppingCart className="w-10 h-10 text-[#edbb00]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-blue-950 font-oswald mb-2">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 text-lg font-medium">FC Barcelona Official Store</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Header */}
            <div className="bg-gradient-to-r from-[#004d98] to-[#004d98] text-white p-6 rounded-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FiPackage className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} in Cart
                    </p>
                    <p className="text-blue-100 text-sm">Review your selection</p>
                  </div>
                </div>
                <span className="text-[#edbb00] font-bold text-xl bg-white/10 px-4 py-2 rounded-xl">
                  Visca Barça! 🔵🔴
                </span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <CartItem key={`${item.productId}-${item.size}`} item={item} />
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiTruck className="w-6 h-6 text-[#004d98]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Free Shipping</p>
                  <p className="text-gray-600 text-sm">On orders over ₹5,000</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiShield className="w-6 h-6 text-[#004d98]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Authentic Products</p>
                  <p className="text-gray-600 text-sm">Official FC Barcelona</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiRefreshCw className="w-6 h-6 text-[#004d98]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Easy Returns</p>
                  <p className="text-gray-600 text-sm">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-xl flex items-center justify-center">
                  <FiTag className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#004d98]">Order Summary</h2>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-700 py-2">
                  <span className="text-lg">Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-lg">₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-green-600 bg-green-50 p-4 rounded-xl border border-green-200">
                    <span className="font-semibold">Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                    <span className="font-bold text-lg">-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-gray-700 py-2">
                  <span className="text-lg">Shipping</span>
                  <span className="font-bold text-lg">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-700 py-2">
                  <span className="text-lg">Tax (18%)</span>
                  <span className="font-bold text-lg">₹{tax.toLocaleString()}</span>
                </div>

                {subtotal < 5000 && subtotal > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-[#004d98] p-4 rounded-lg">
                    <p className="text-sm font-bold text-[#004d98]">
                      Add ₹{(5000 - subtotal).toLocaleString()} more for FREE shipping!
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#004d98]">Total Amount</span>
                  <span className="text-3xl font-bold text-[#a50044]">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-700 mb-4">
                  Discount Code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors text-lg font-medium"
                    onKeyPress={(e) => e.key === 'Enter' && applyDiscount()}
                  />
                  <button
                    onClick={applyDiscount}
                    className="px-6 py-4 bg-[#edbb00] text-[#004d98] font-bold rounded-xl hover:bg-[#004d98] hover:text-[#edbb00] transition-all duration-300 border-2 border-[#edbb00] hover:border-[#004d98] shadow-lg"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3 font-medium">
                  Try: <span className="text-[#004d98] font-bold">BARXXX10</span> (10% off) or <span className="text-[#004d98] font-bold">CULXXX20</span> (20% off)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gradient-to-r from-[#004d98] to-[#004d98] text-white font-bold py-5 rounded-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group text-lg shadow-lg"
                >
                  <FiCreditCard className="w-6 h-6" />
                  Proceed to Checkout
                  <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full border-2 border-gray-300 text-gray-600 font-semibold py-4 rounded-xl hover:bg-gray-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                >
                  <FiTrash2 className="w-5 h-5" />
                  Clear Entire Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Secure Checkout
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>SSL Encrypted</span>
                  <span className="text-gray-300">•</span>
                  <span>Free Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





