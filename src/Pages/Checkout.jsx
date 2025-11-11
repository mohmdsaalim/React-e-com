import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ordersAPI, usersAPI } from "../api";
import { 
  FiArrowLeft, 
  FiCreditCard, 
  FiTruck, 
  FiMapPin, 
  FiUser,
  FiCheck,
  FiLock
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderNotes, setOrderNotes] = useState("");

  // Load user and cart data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setCartItems(user.cart || []);
        
        // Pre-fill shipping info if available
        if (user.shippingAddress) {
          setShippingInfo(user.shippingAddress);
        } else {
          setShippingInfo(prev => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || ""
          }));
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate order totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + (item.price_inr || item.price || 0) * (item.quantity || 1),
      0
    );
    const shipping = subtotal >= 5000 ? 0 : 199;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = ["fullName", "email", "phone", "address", "city", "state", "pincode"];
    for (let field of requiredFields) {
      if (!shippingInfo[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(shippingInfo.phone.replace(/\D/g, ''))) {
      toast.error("Please enter a valid Indian phone number");
      return false;
    }

    return true;
  };

  // Create order in database
  const createOrder = async (orderData) => {
    try {
      const response = await axios.post(ordersAPI, orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  };

  // Update user in database
  const updateUserInDatabase = async (updatedUser) => {
    try {
      await axios.put(`${usersAPI}/${updatedUser.id}`, updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setProcessing(true);

    try {
      if (!currentUser) {
        toast.error("User not found. Please login again.");
        return;
      }

      // Generate order ID
      const orderId = `FCB${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

      // Prepare order data
      const orderData = {
        id: orderId,
        userId: currentUser.id,
        items: cartItems,
        shippingInfo,
        paymentMethod,
        orderNotes,
        status: paymentMethod === "cod" ? "pending" : "confirmed",
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        subtotal,
        shipping,
        tax,
        total,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create order in database
      await createOrder(orderData);

      // Clear user's cart
      const updatedUser = {
        ...currentUser,
        cart: [],
        shippingAddress: shippingInfo, // Save shipping address for future
        orders: [...(currentUser.orders || []), orderId]
      };

      // Update user in database
      const success = await updateUserInDatabase(updatedUser);
      
      if (success) {
        setCurrentUser(updatedUser);
        
        // Show success message
        toast.success(
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="font-bold text-lg">Order Placed Successfully!</p>
            <p className="text-sm">Order ID: {orderId}</p>
            {paymentMethod === "cod" && (
              <p className="text-sm mt-1">Payment will be collected on delivery</p>
            )}
          </div>,
          {
            duration: 5000,
          }
        );

        // Redirect to order confirmation page after delay
        setTimeout(() => {
          navigate(`/order-confirmation/${orderId}`);
        }, 2000);

      } else {
        throw new Error("Failed to update user cart");
      }

    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16 flex items-center justify-center">
        <Toaster position="top-right" />
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#004d98]"></div>
      </div>
    );
  }

  // Empty cart redirect
  if (cartItems.length === 0) {
    useEffect(() => {
      toast.error("Your cart is empty");
      navigate("/cart");
    }, []);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/cart")}
            className="inline-flex items-center text-gray-600 hover:text-[#004d98] transition-colors group text-lg font-medium"
          >
            <FiArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Cart
          </button>
        </div>

        {/* Main Header */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl px-8 py-8 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-2xl flex items-center justify-center shadow-lg">
                <FiCreditCard className="w-10 h-10 text-[#edbb00]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-blue-950 font-oswald mb-2">
                  Checkout
                </h1>
                <p className="text-gray-600 text-lg font-medium">Complete your purchase</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiMapPin className="w-6 h-6 text-[#004d98]" />
                </div>
                <h2 className="text-2xl font-bold text-[#004d98]">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <textarea
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiCreditCard className="w-6 h-6 text-[#004d98]" />
                </div>
                <h2 className="text-2xl font-bold text-[#004d98]">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-[#004d98] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-[#004d98]"
                  />
                  <div className="flex items-center gap-3">
                    <FiTruck className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-[#004d98] transition-colors opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-[#004d98]"
                    disabled
                  />
                  <div className="flex items-center gap-3">
                    <FiCreditCard className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Pay securely with your card</p>
                    </div>
                  </div>
                  <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Coming Soon</span>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Notes (Optional)</h3>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special instructions for your order..."
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#004d98] mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4 py-3 border-b border-gray-100">
                    <img
                      src={item.image_url || item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      {item.size && (
                        <p className="text-xs text-gray-600">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="font-bold text-[#a50044]">
                      ₹{((item.price_inr || item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-[#004d98]">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-gradient-to-r from-[#004d98] to-[#004d98] text-white font-bold py-4 rounded-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiLock className="w-5 h-5" />
                    {paymentMethod === "cod" ? "Place Order (Cash on Delivery)" : "Place Order"}
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <FiLock className="w-4 h-4" />
                  <span>Secure checkout · SSL encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
