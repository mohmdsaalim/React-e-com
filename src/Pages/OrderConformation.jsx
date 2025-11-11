// components/OrderConfirmation.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiCheck, FiTruck, FiHome, FiShoppingBag } from "react-icons/fi";
import { ordersAPI } from "../api";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${ordersAPI}/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-24 flex justify-center items-center">Loading...</div>;
  }

  if (!order) {
    return <div className="min-h-screen pt-24 flex justify-center items-center">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-lg text-[#004d98] font-bold mb-8">Order ID: {order.id}</p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <FiTruck className="w-8 h-8 text-[#004d98] mx-auto mb-2" />
              <p className="font-semibold">Cash on Delivery</p>
              <p className="text-sm text-gray-600">Pay when delivered</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <FiShoppingBag className="w-8 h-8 text-[#004d98] mx-auto mb-2" />
              <p className="font-semibold">{order.items.length} Items</p>
              <p className="text-sm text-gray-600">In your order</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-[#a50044] text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">₹</span>
              </div>
              <p className="font-semibold">₹{order.total?.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total amount</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/profile"
              className="px-8 py-4 bg-[#004d98] text-white font-bold rounded-xl hover:shadow-xl transition-all"
            >
              View Your Orders
            </Link>
            <Link
              to="/kits"
              className="px-8 py-4 border-2 border-[#004d98] text-[#004d98] font-bold rounded-xl hover:bg-[#004d98] hover:text-white transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}