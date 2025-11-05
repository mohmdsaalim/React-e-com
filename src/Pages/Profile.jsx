import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLogOut, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiMapPin, FiPhone } from "react-icons/fi";
import { IoShirtOutline } from "react-icons/io5";
import { useAuth } from "../Context/AuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth(); //   user  and  logout from context
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();


  // Fetch user orders from json-server
  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3000/orders?userId=${userId}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Cancel order
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  // Logout handler using AuthContext
  const handleLogout = () => {
    logout(); //  This clears user from context and localStorage
    navigate("/login");
  };

  const handleSaveProfile = () => {
    // Update both localStorage and context
    localStorage.setItem("user", JSON.stringify(editForm));
    
    
    window.location.reload(); // Simple solution to reflect changes
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "Cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Don't render anything if no user
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#03182e] font-oswald mb-3">
            My Account
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your profile and track your orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              {/* User Info Card */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#004d98] to-[#a50044] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 text-sm flex items-center justify-center mt-1">
                  <FiMail className="w-4 h-4 mr-1" />
                  {user.email}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === "profile"
                      ? "bg-[#004d98] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiUser className="w-5 h-5 mr-3" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === "orders"
                      ? "bg-[#004d98] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiShoppingBag className="w-5 h-5 mr-3" />
                  My Orders
                  {orders.length > 0 && (
                    <span className="ml-auto bg-[#a50044] text-white text-xs px-2 py-1 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 mt-6 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
              >
                <FiLogOut className="w-5 h-5 mr-2" />  
                Logout 
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                  {/* <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 text-[#004d98] border border-[#004d98] rounded-lg hover:bg-[#004d98] hover:text-white transition-all"
                  >
                    <FiEdit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button> */}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editForm.firstName || ""}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiPhone className="w-4 h-4 inline mr-2" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone || ""}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiMapPin className="w-4 h-4 inline mr-2" />
                          Address
                        </label>
                        <input
                          type="text"
                          value={editForm.address || ""}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-3 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          First Name
                        </label>
                        <p className="text-lg text-gray-900">{user.firstName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Last Name
                        </label>
                        <p className="text-lg text-gray-900">{user.lastName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email Address
                      </label>
                      <p className="text-lg text-gray-900 flex items-center">
                        <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Phone Number
                        </label>
                        <p className="text-lg text-gray-900 flex items-center">
                          <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.phone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Shipping Address
                        </label>
                        <p className="text-lg text-gray-900 flex items-center">
                          <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {user.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Order History</h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <IoShirtOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h4>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                    <button
                      onClick={() => navigate("/kits")}
                      className="px-6 py-3 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {order.productName}
                            </h4>
                            <p className="text-gray-600">Order #{(order.id).toString().padStart(6, '0')}</p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 md:mt-0">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              <span className="flex items-center">
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{order.status}</span>
                              </span>
                            </span>
                            <p className="text-xl font-bold text-[#a50044]">
                              ₹{order.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={order.image}
                              alt={order.productName}
                              className="w-16 h-16 rounded-lg object-cover border"
                            />
                            <div className="text-sm text-gray-600">
                              <p>Size: {order.size || "M"}</p>
                              <p>Quantity: {order.quantity || 1}</p>
                              <p>Ordered on: {new Date(order.orderDate || Date.now()).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {order.status !== "Cancelled" && order.status !== "Delivered" && (
                            <button
                              onClick={() => handleCancel(order.id)}
                              className="mt-4 md:mt-0 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
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