import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLogOut, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiMapPin, FiPhone, FiPackage, FiTruck } from "react-icons/fi";
import { IoShirtOutline } from "react-icons/io5";
import { useAuth } from "../Context/AuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  // Status configuration that matches OrderManagement
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: FiPackage },
    { value: 'confirmed', label: 'Confirmed', color: 'text-green-600 bg-green-50 border-green-200', icon: FiCheckCircle },
    { value: 'processing', label: 'Processing', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: FiClock },
    { value: 'shipped', label: 'Shipped', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: FiTruck },
    { value: 'delivered', label: 'Delivered', color: 'text-green-600 bg-green-50 border-green-200', icon: FiCheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600 bg-red-50 border-red-200', icon: FiXCircle }
  ];

  // Fetch user orders from json-server
  const fetchOrders = async (userEmail) => {
    try {
      console.log("🔍 Fetching orders for user email:", userEmail);
      setLoadingOrders(true);
      
      // Fetch all orders and filter by user email
      const res = await fetch(`http://localhost:3000/orders`);
      const allOrders = await res.json();
      
      // Filter orders by user email
      const userOrders = allOrders.filter(order => 
        order.shippingInfo?.email === userEmail
      );
      
      console.log("📦 Orders found for user:", userOrders);
      setOrders(userOrders);
      setLoadingOrders(false);
      
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setOrders([]);
      setLoadingOrders(false);
    }
  };

  // Load user data for editing
  useEffect(() => {
    if (user) {
      console.log("👤 Current user in Profile:", user);
      console.log("📧 User Email:", user.email);
      
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || user.shippingAddress?.phone || "",
        address: user.address || user.shippingAddress?.address || ""
      });
      
      // Fetch orders when user is available using email
      if (user.email) {
        fetchOrders(user.email);
      }
    }
  }, [user]);

  // Clear orders when user logs out or changes
  useEffect(() => {
    // This will clear orders when component unmounts or user changes
    return () => {
      setOrders([]);
    };
  }, []);

  // Cancel order
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }), // lowercase to match your system
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  // Logout handler using AuthContext
  const handleLogout = () => {
    // Clear orders before logout
    setOrders([]);
    logout();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    try {
      // Update localStorage
      localStorage.setItem("currentUser", JSON.stringify({ ...user, ...editForm }));
      
      // Also update in database
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to update user in database");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Updated status functions that match OrderManagement
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    const statusConfig = statusOptions.find(s => s.value === statusLower) || statusOptions[0];
    const IconComponent = statusConfig.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    const statusConfig = statusOptions.find(s => s.value === statusLower) || statusOptions[0];
    return statusConfig.color;
  };

  const getStatusText = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    const statusConfig = statusOptions.find(s => s.value === statusLower) || statusOptions[0];
    return statusConfig.label;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Don't render anything if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-2 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.firstName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#004d98] to-[#a50044] rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUser className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-[#004d98] border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiUser className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "orders"
                      ? "bg-blue-50 text-[#004d98] border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiShoppingBag className="w-4 h-4 mr-3" />
                  My Orders
                  {orders.length > 0 && (
                    <span className="ml-auto bg-[#a50044] text-white text-xs px-2 py-1 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-3 py-2 mt-6 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 text-[#004d98] border border-[#004d98] rounded-lg hover:bg-[#004d98] hover:text-white transition-colors text-sm font-medium"
                  >
                    <FiEdit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editForm.firstName || ""}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editForm.lastName || ""}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone || ""}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={editForm.address || ""}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          First Name
                        </label>
                        <p className="text-gray-900">{user.firstName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Last Name
                        </label>
                        <p className="text-gray-900">{user.lastName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                        <p className="text-gray-900 flex items-center">
                          <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Phone
                        </label>
                        <p className="text-gray-900 flex items-center">
                          <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.phone || user.shippingAddress?.phone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Address
                        </label>
                        <p className="text-gray-900 flex items-center">
                          <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {user.address || user.shippingAddress?.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                  {!loadingOrders && (
                    <span className="text-sm text-gray-600">
                      {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {loadingOrders ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d98] mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <IoShirtOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h4>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                    <button
                      onClick={() => navigate("/kits")}
                      className="px-6 py-2 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto pr-2">
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Order #{order.id}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatDate(order.createdAt)} • {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#a50044]">
                                ₹{order.total?.toLocaleString() || "0"}
                              </p>
                              <div className={`flex items-center justify-end text-sm px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 font-medium capitalize">
                                  {getStatusText(order.status)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex items-center justify-between py-2 border-t border-gray-100 first:border-t-0">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-12 h-12 rounded border border-gray-200 object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                    <div className="text-xs text-gray-600">
                                      <span>Size: {item.size}</span>
                                      <span className="mx-2">•</span>
                                      <span>Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  ₹{((item.price_inr || 0) * (item.quantity || 1))?.toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Order Actions */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="text-xs text-gray-600">
                              {order.shippingInfo && (
                                <p>
                                  <strong>Shipping:</strong> {order.shippingInfo.fullName}, {order.shippingInfo.city}
                                </p>
                              )}
                              {order.paymentMethod && (
                                <p>
                                  <strong>Payment:</strong> {order.paymentMethod?.toUpperCase()} 
                                </p>
                              )}
                            </div>

                            {order.status !== "cancelled" && order.status !== "delivered" && (
                              <button
                                onClick={() => handleCancel(order.id)}
                                className="px-3 py-1 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;