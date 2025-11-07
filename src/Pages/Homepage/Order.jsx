import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  FiCheckCircle, 
  FiPackage, 
  FiTruck, 
  FiHome, 
  FiCreditCard, 
  FiArrowLeft,
  FiEdit3,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiShoppingBag
} from "react-icons/fi";
import { IoShirtOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

  // Mock order data - in real app, this would come from API or state management
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const mockOrder = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        status: "confirmed",
        items: location.state?.cartItems || JSON.parse(localStorage.getItem("cart")) || [],
        shippingAddress: {
          fullName: "John Culé",
          address: "123 Camp Nou Street",
          city: "Barcelona",
          state: "Catalonia",
          zipCode: "08028",
          country: "Spain",
          phone: "+34 123 456 789"
        },
        paymentMethod: "Credit Card",
        paymentDetails: {
          cardType: "Visa",
          lastFour: "4242"
        },
        pricing: {
          subtotal: location.state?.subtotal || 0,
          discount: location.state?.discount || 0,
          shipping: location.state?.shipping || 0,
          tax: location.state?.tax || 0,
          total: location.state?.total || 0
        },
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: "FCB123456789"
      };
      
      setOrder(mockOrder);
      setLoading(false);
      
      // Clear cart after successful order
      if (location.state?.fromCheckout) {
        localStorage.removeItem("cart");
        toast.success("🎉 Order placed successfully! Visca Barça!");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [location]);

  const steps = [
    { id: 1, name: "Order Confirmed", icon: FiCheckCircle, description: "Order received" },
    { id: 2, name: "Processing", icon: FiPackage, description: "Preparing your order" },
    { id: 3, name: "Shipped", icon: FiTruck, description: "On the way" },
    { id: 4, name: "Delivered", icon: FiHome, description: "Order delivered" }
  ];

  const OrderItem = ({ item }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0 relative">
          <img
            src={item.image_url || item.image}
            alt={item.name}
            className="w-28 h-28 lg:w-32 lg:h-32 object-cover rounded-xl border-2 border-gray-100 group-hover:border-[#004d98] transition-colors"
          />
          <div className="absolute -top-2 -right-2 bg-[#a50044] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {item.quantity || 1}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Product Info */}
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {item.name}
              </h3>
              
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

              <div className="flex items-center gap-4 pt-2">
                <span className="text-sm font-semibold text-gray-700">Quantity: {item.quantity || 1}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col items-end gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-[#a50044] mb-1">
                  ₹{((item.price_inr || item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  ₹{(item.price_inr || item.price || 0).toLocaleString()} each
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 mt-8 border border-gray-100">
            <div className="w-32 h-32 bg-gradient-to-br from-[#004d98] to-[#004d98] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ece8dc]"></div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-oswald">
              Processing Your Order
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Getting your FC Barcelona gear ready...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 mt-8 border border-gray-100">
            <div className="w-32 h-32 bg-gradient-to-br from-[#004d98] to-[#004d98] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <IoShirtOutline className="w-16 h-16 text-[#ece8dc]" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-oswald">
              No Order Found
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              It seems you haven't placed any order yet.
            </p>
            
            <button
              onClick={() => navigate("/kits")}
              className="px-10 py-4 bg-gradient-to-r from-[#004d98] to-[#003366] text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Start Shopping
            </button>
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
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-[#004d98] transition-colors group text-lg font-medium"
          >
            <FiArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Home
          </Link>
        </div>

        {/* Success Message */}
        {location.state?.fromCheckout && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-1">Order Confirmed!</h3>
                <p className="text-green-700 font-medium">
                  Thank you for your purchase. Your order #{order.id} has been confirmed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Header */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl px-8 py-8 shadow-2xl border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-2xl flex items-center justify-center shadow-lg">
                  <FiShoppingBag className="w-10 h-10 text-[#edbb00]" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-blue-950 font-oswald mb-2">
                    Order Details
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">FC Barcelona Official Store</p>
                </div>
              </div>
              
              <div className="bg-blue-50 px-6 py-4 rounded-2xl border-2 border-blue-100">
                <p className="text-sm text-blue-800 font-semibold">Order Number</p>
                <p className="text-2xl font-bold text-[#004d98]">{order.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Progress */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-xl flex items-center justify-center">
                  <FiTruck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#004d98]">Order Status</h2>
              </div>

              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-1 bg-gradient-to-r from-[#004d98] to-[#a50044] rounded-full transition-all duration-500"
                    style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const isCompleted = step.id <= activeStep;
                    const isActive = step.id === activeStep;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center text-center w-24">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-[#004d98] to-[#a50044] text-white shadow-lg transform scale-110' 
                            : isActive
                            ? 'bg-blue-100 border-2 border-[#004d98] text-[#004d98]'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <p className={`font-bold text-sm mb-1 ${
                          isCompleted ? 'text-[#004d98]' : isActive ? 'text-[#004d98]' : 'text-gray-400'
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-[#004d98]">
                <div className="flex items-center gap-4">
                  <FiCalendar className="w-8 h-8 text-[#004d98]" />
                  <div>
                    <p className="font-bold text-[#004d98] text-lg">Estimated Delivery</p>
                    <p className="text-gray-700 font-medium">
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-xl flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#004d98]">
                  Order Items ({order.items.length})
                </h2>
              </div>

              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <OrderItem key={`${item.id}-${item.size}-${index}`} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-xl flex items-center justify-center">
                  <FiCreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#004d98]">Order Summary</h2>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-700 py-2">
                  <span className="text-lg">Subtotal ({order.items.length} items)</span>
                  <span className="font-bold text-lg">₹{order.pricing.subtotal.toLocaleString()}</span>
                </div>

                {order.pricing.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600 bg-green-50 p-4 rounded-xl border border-green-200">
                    <span className="font-semibold">Discount</span>
                    <span className="font-bold text-lg">-₹{order.pricing.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-gray-700 py-2">
                  <span className="text-lg">Shipping</span>
                  <span className="font-bold text-lg">
                    {order.pricing.shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${order.pricing.shipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-700 py-2">
                  <span className="text-lg">Tax (18%)</span>
                  <span className="font-bold text-lg">₹{order.pricing.tax.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#004d98]">Total Amount</span>
                  <span className="text-3xl font-bold text-[#a50044]">
                    ₹{order.pricing.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Order Status</span>
                  <span className="font-medium text-[#004d98] capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tracking Number</span>
                  <span className="font-medium text-[#a50044]">{order.trackingNumber}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FiMapPin className="w-5 h-5 text-[#004d98]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#004d98]">Shipping Address</h3>
                </div>
                <button className="text-gray-400 hover:text-[#004d98] transition-colors">
                  <FiEdit3 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{order.shippingAddress.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <span>{order.shippingAddress.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5 text-[#004d98]" />
                </div>
                <h3 className="text-xl font-bold text-[#004d98]">Payment Method</h3>
              </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{order.paymentMethod}</span>
                  <span className="text-sm text-gray-500">•••• {order.paymentDetails.lastFour}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Payment completed on {new Date(order.date).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => navigate("/tracking")}
                className="w-full bg-gradient-to-r from-[#004d98] to-[#004d98] text-white font-bold py-5 rounded-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group text-lg shadow-lg"
              >
                <FiTruck className="w-6 h-6" />
                Track Order
              </button>

              <button
                onClick={() => navigate("/kits")}
                className="w-full border-2 border-[#004d98] text-[#004d98] font-bold py-4 rounded-xl hover:bg-[#004d98] hover:text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg"
              >
                <FiShoppingBag className="w-5 h-5" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}