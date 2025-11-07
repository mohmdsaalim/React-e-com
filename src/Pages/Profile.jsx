// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiUser, FiMail, FiLogOut, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiMapPin, FiPhone } from "react-icons/fi";
// import { IoShirtOutline } from "react-icons/io5";
// import { useAuth } from "../Context/AuthContext";

// const ProfilePage = () => {
//   const { user, logout } = useAuth(); //   user  and  logout from context
//   const [orders, setOrders] = useState([]);
//   const [activeTab, setActiveTab] = useState("orders");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const navigate = useNavigate();


//   // Fetch user orders from json-server
//   const fetchOrders = async (userId) => {
//     try {
//       const res = await fetch(`http://localhost:3000/orders?userId=${userId}`);
//       const data = await res.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   // Cancel order
//   const handleCancel = async (orderId) => {
//     if (!window.confirm("Are you sure you want to cancel this order?")) return;

//     try {
//       await fetch(`http://localhost:3000/orders/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: "Cancelled" }),
//       });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === orderId ? { ...order, status: "Cancelled" } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//     }
//   };

//   // Logout handler using AuthContext
//   const handleLogout = () => {
//     logout(); //  This clears user from context and localStorage
//     navigate("/login");
//   };

//   const handleSaveProfile = () => {
//     // Update both localStorage and context
//     localStorage.setItem("user", JSON.stringify(editForm));
    
    
//     window.location.reload(); // Simple solution to reflect changes
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Delivered":
//         return <FiCheckCircle className="text-green-500" />;
//       case "Cancelled":
//         return <FiXCircle className="text-red-500" />;
//       default:
//         return <FiClock className="text-yellow-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Delivered":
//         return "bg-green-100 text-green-800";
//       case "Cancelled":
//         return "bg-red-100 text-red-800";
//       case "Shipped":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   // Don't render anything if no user
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-[#03182e] font-oswald mb-3">
//             My Account
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Manage your profile and track your orders
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//               {/* User Info Card */}
//               <div className="text-center mb-6">
//                 <div className="w-20 h-20 bg-gradient-to-r from-[#004d98] to-[#a50044] rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FiUser className="w-8 h-8 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {user.firstName} {user.lastName}
//                 </h2>
//                 <p className="text-gray-600 text-sm flex items-center justify-center mt-1">
//                   <FiMail className="w-4 h-4 mr-1" />
//                   {user.email}
//                 </p>
//               </div>

//               {/* Navigation Tabs */}
//               <nav className="space-y-2">
//                 <button
//                   onClick={() => setActiveTab("profile")}
//                   className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
//                     activeTab === "profile"
//                       ? "bg-[#004d98] text-white shadow-md"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <FiUser className="w-5 h-5 mr-3" />
//                   Profile Information
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("orders")}
//                   className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
//                     activeTab === "orders"
//                       ? "bg-[#004d98] text-white shadow-md"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <FiShoppingBag className="w-5 h-5 mr-3" />
//                   My Orders
//                   {orders.length > 0 && (
//                     <span className="ml-auto bg-[#a50044] text-white text-xs px-2 py-1 rounded-full">
//                       {orders.length}
//                     </span>
//                   )}
//                 </button>
//               </nav>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center justify-center px-4 py-3 mt-6 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
//               >
//                 <FiLogOut className="w-5 h-5 mr-2" />  
//                 Logout 
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             {/* Profile Information Tab */}
//             {activeTab === "profile" && (
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
//                   {/* <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="flex items-center px-4 py-2 text-[#004d98] border border-[#004d98] rounded-lg hover:bg-[#004d98] hover:text-white transition-all"
//                   >
//                     <FiEdit className="w-4 h-4 mr-2" />
//                     {isEditing ? "Cancel" : "Edit Profile"}
//                   </button> */}
//                 </div>

//                 {isEditing ? (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.firstName || ""}
//                           onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.lastName || ""}
//                           onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         value={editForm.email || ""}
//                         onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           <FiPhone className="w-4 h-4 inline mr-2" />
//                           Phone
//                         </label>
//                         <input
//                           type="tel"
//                           value={editForm.phone || ""}
//                           onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           <FiMapPin className="w-4 h-4 inline mr-2" />
//                           Address
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.address || ""}
//                           onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex space-x-4 pt-4">
//                       <button
//                         onClick={handleSaveProfile}
//                         className="px-6 py-3 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
//                       >
//                         Save Changes
//                       </button>
//                       <button
//                         onClick={() => setIsEditing(false)}
//                         className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           First Name
//                         </label>
//                         <p className="text-lg text-gray-900">{user.firstName}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Last Name
//                         </label>
//                         <p className="text-lg text-gray-900">{user.lastName}</p>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Email Address
//                       </label>
//                       <p className="text-lg text-gray-900 flex items-center">
//                         <FiMail className="w-4 h-4 mr-2 text-gray-400" />
//                         {user.email}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Phone Number
//                         </label>
//                         <p className="text-lg text-gray-900 flex items-center">
//                           <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
//                           {user.phone || "Not provided"}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Shipping Address
//                         </label>
//                         <p className="text-lg text-gray-900 flex items-center">
//                           <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
//                           {user.address || "Not provided"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Orders Tab */}
//             {activeTab === "orders" && (
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Order History</h3>

//                 {orders.length === 0 ? (
//                   <div className="text-center py-12">
//                     <IoShirtOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                     <h4 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h4>
//                     <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
//                     <button
//                       onClick={() => navigate("/kits")}
//                       className="px-6 py-3 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
//                     >
//                       Start Shopping
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {orders.map((order) => (
//                       <div
//                         key={order.id}
//                         className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all"
//                       >
//                         <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//                           <div>
//                             <h4 className="font-semibold text-gray-900 text-lg">
//                               {order.productName}
//                             </h4>
//                             <p className="text-gray-600">Order #{(order.id).toString().padStart(6, '0')}</p>
//                           </div>
//                           <div className="flex items-center space-x-4 mt-2 md:mt-0">
//                             <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                               <span className="flex items-center">
//                                 {getStatusIcon(order.status)}
//                                 <span className="ml-1">{order.status}</span>
//                               </span>
//                             </span>
//                             <p className="text-xl font-bold text-[#a50044]">
//                               ₹{order.price}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex flex-col md:flex-row md:items-center justify-between">
//                           <div className="flex items-center space-x-4">
//                             <img
//                               src={order.image}
//                               alt={order.productName}
//                               className="w-16 h-16 rounded-lg object-cover border"
//                             />
//                             <div className="text-sm text-gray-600">
//                               <p>Size: {order.size || "M"}</p>
//                               <p>Quantity: {order.quantity || 1}</p>
//                               <p>Ordered on: {new Date(order.orderDate || Date.now()).toLocaleDateString()}</p>
//                             </div>
//                           </div>

//                           {order.status !== "Cancelled" && order.status !== "Delivered" && (
//                             <button
//                               onClick={() => handleCancel(order.id)}
//                               className="mt-4 md:mt-0 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
//                             >
//                               Cancel Order
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;







// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiUser, FiMail, FiLogOut, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiMapPin, FiPhone } from "react-icons/fi";
// import { IoShirtOutline } from "react-icons/io5";
// import { useAuth } from "../Context/AuthContext";

// const ProfilePage = () => {
//   const { user, logout } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [activeTab, setActiveTab] = useState("orders");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const navigate = useNavigate();

//   // Fetch user orders from json-server
//   const fetchOrders = async (userId) => {
//     try {
//       const res = await fetch(`http://localhost:3000/orders?userId=${userId}`);
//       const data = await res.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   // Load user data for editing
//   useEffect(() => {
//     if (user) {
//       setEditForm({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         address: user.address || ""
//       });
      
//       // Fetch orders when user is available
//       fetchOrders(user.id || user.userId);
//     }
//   }, [user]);

//   // Cancel order
//   const handleCancel = async (orderId) => {
//     if (!window.confirm("Are you sure you want to cancel this order?")) return;

//     try {
//       await fetch(`http://localhost:3000/orders/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: "Cancelled" }),
//       });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === orderId ? { ...order, status: "Cancelled" } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//     }
//   };

//   // Logout handler using AuthContext
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleSaveProfile = () => {
//     // Update both localStorage and context
//     localStorage.setItem("user", JSON.stringify({ ...user, ...editForm }));
//     // You might want to update your AuthContext here as well
//     window.location.reload();
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Delivered":
//         return <FiCheckCircle className="text-green-500" />;
//       case "Cancelled":
//         return <FiXCircle className="text-red-500" />;
//       default:
//         return <FiClock className="text-yellow-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Delivered":
//         return "bg-green-100 text-green-800";
//       case "Cancelled":
//         return "bg-red-100 text-red-800";
//       case "Shipped":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Don't render anything if no user
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-[#03182e] font-oswald mb-3">
//             My Account
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Manage your profile and track your orders
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//               {/* User Info Card */}
//               <div className="text-center mb-6">
//                 <div className="w-20 h-20 bg-gradient-to-r from-[#004d98] to-[#a50044] rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FiUser className="w-8 h-8 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {user.firstName} {user.lastName}
//                 </h2>
//                 <p className="text-gray-600 text-sm flex items-center justify-center mt-1">
//                   <FiMail className="w-4 h-4 mr-1" />
//                   {user.email}
//                 </p>
//               </div>

//               {/* Navigation Tabs */}
//               <nav className="space-y-2">
//                 <button
//                   onClick={() => setActiveTab("profile")}
//                   className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
//                     activeTab === "profile"
//                       ? "bg-[#004d98] text-white shadow-md"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <FiUser className="w-5 h-5 mr-3" />
//                   Profile Information
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("orders")}
//                   className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all ${
//                     activeTab === "orders"
//                       ? "bg-[#004d98] text-white shadow-md"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <FiShoppingBag className="w-5 h-5 mr-3" />
//                   My Orders
//                   {orders.length > 0 && (
//                     <span className="ml-auto bg-[#a50044] text-white text-xs px-2 py-1 rounded-full">
//                       {orders.length}
//                     </span>
//                   )}
//                 </button>
//               </nav>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center justify-center px-4 py-3 mt-6 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
//               >
//                 <FiLogOut className="w-5 h-5 mr-2" />  
//                 Logout 
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             {/* Profile Information Tab */}
//             {activeTab === "profile" && (
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
//                   <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="flex items-center px-4 py-2 text-[#004d98] border border-[#004d98] rounded-lg hover:bg-[#004d98] hover:text-white transition-all"
//                   >
//                     <FiEdit className="w-4 h-4 mr-2" />
//                     {isEditing ? "Cancel" : "Edit Profile"}
//                   </button>
//                 </div>

//                 {isEditing ? (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.firstName || ""}
//                           onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.lastName || ""}
//                           onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         value={editForm.email || ""}
//                         onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           <FiPhone className="w-4 h-4 inline mr-2" />
//                           Phone
//                         </label>
//                         <input
//                           type="tel"
//                           value={editForm.phone || ""}
//                           onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           <FiMapPin className="w-4 h-4 inline mr-2" />
//                           Address
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.address || ""}
//                           onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-transparent"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex space-x-4 pt-4">
//                       <button
//                         onClick={handleSaveProfile}
//                         className="px-6 py-3 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
//                       >
//                         Save Changes
//                       </button>
//                       <button
//                         onClick={() => setIsEditing(false)}
//                         className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           First Name
//                         </label>
//                         <p className="text-lg text-gray-900">{user.firstName}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Last Name
//                         </label>
//                         <p className="text-lg text-gray-900">{user.lastName}</p>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Email Address
//                       </label>
//                       <p className="text-lg text-gray-900 flex items-center">
//                         <FiMail className="w-4 h-4 mr-2 text-gray-400" />
//                         {user.email}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Phone Number
//                         </label>
//                         <p className="text-lg text-gray-900 flex items-center">
//                           <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
//                           {user.phone || "Not provided"}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Shipping Address
//                         </label>
//                         <p className="text-lg text-gray-900 flex items-center">
//                           <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
//                           {user.address || "Not provided"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Orders Tab */}
//             {activeTab === "orders" && (
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Order History</h3>

//                 {orders.length === 0 ? (
//                   <div className="text-center py-12">
//                     <IoShirtOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                     <h4 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h4>
//                     <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
//                     <button
//                       onClick={() => navigate("/kits")}
//                       className="px-6 py-3 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
//                     >
//                       Start Shopping
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {orders.map((order) => (
//                       <div
//                         key={order.id}
//                         className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all"
//                       >
//                         <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//                           <div>
//                             <h4 className="font-semibold text-gray-900 text-lg">
//                               Order #{order.id}
//                             </h4>
//                             <p className="text-gray-600">
//                               {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''} • 
//                               Placed on {formatDate(order.createdAt)}
//                             </p>
//                           </div>
//                           <div className="flex items-center space-x-4 mt-2 md:mt-0">
//                             <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                               <span className="flex items-center">
//                                 {getStatusIcon(order.status)}
//                                 <span className="ml-1">{order.status}</span>
//                               </span>
//                             </span>
//                             <p className="text-xl font-bold text-[#a50044]">
//                               ₹{order.total?.toLocaleString()}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Order Items */}
//                         <div className="space-y-4">
//                           {order.items?.map((item, index) => (
//                             <div key={index} className="flex items-center justify-between border-t pt-4">
//                               <div className="flex items-center space-x-4">
//                                 <img
//                                   src={item.image_url}
//                                   alt={item.name}
//                                   className="w-16 h-16 rounded-lg object-cover border"
//                                 />
//                                 <div>
//                                   <h5 className="font-medium text-gray-900">{item.name}</h5>
//                                   <div className="text-sm text-gray-600 space-y-1">
//                                     <p>Size: {item.size}</p>
//                                     <p>Quantity: {item.quantity}</p>
//                                     <p>Price: ₹{item.price_inr?.toLocaleString()}</p>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <p className="font-semibold text-gray-900">
//                                   ₹{(item.price_inr * item.quantity)?.toLocaleString()}
//                                 </p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Order Summary */}
//                         <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 pt-4 border-t">
//                           <div className="text-sm text-gray-600">
//                             <p><strong>Shipping to:</strong> {order.shippingInfo?.fullName}, {order.shippingInfo?.city}</p>
//                             <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()} • {order.paymentStatus}</p>
//                           </div>

//                           {order.status !== "Cancelled" && order.status !== "Delivered" && (
//                             <button
//                               onClick={() => handleCancel(order.id)}
//                               className="mt-4 md:mt-0 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
//                             >
//                               Cancel Order
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;










// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiUser, FiMail, FiLogOut, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiMapPin, FiPhone, FiChevronRight } from "react-icons/fi";
// import { IoShirtOutline } from "react-icons/io5";
// import { useAuth } from "../Context/AuthContext";

// const ProfilePage = () => {
//   const { user, logout } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [activeTab, setActiveTab] = useState("orders");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const navigate = useNavigate();

//   // Fetch user orders from json-server
//   const fetchOrders = async (userId) => {
//     try {
//       const res = await fetch(`http://localhost:3000/orders?userId=${userId}`);
//       const data = await res.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   // Load user data for editing
//   useEffect(() => {
//     if (user) {
//       setEditForm({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         address: user.address || ""
//       });
      
//       // Fetch orders when user is available
//       fetchOrders(user.id || user.userId);
//     }
//   }, [user]);

//   // Cancel order
//   const handleCancel = async (orderId) => {
//     if (!window.confirm("Are you sure you want to cancel this order?")) return;

//     try {
//       await fetch(`http://localhost:3000/orders/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: "Cancelled" }),
//       });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === orderId ? { ...order, status: "Cancelled" } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//     }
//   };

//   // Logout handler using AuthContext
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleSaveProfile = () => {
//     localStorage.setItem("user", JSON.stringify({ ...user, ...editForm }));
//     window.location.reload();
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Delivered":
//         return <FiCheckCircle className="text-green-600" />;
//       case "Cancelled":
//         return <FiXCircle className="text-red-600" />;
//       default:
//         return <FiClock className="text-yellow-600" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Delivered":
//         return "border-l-4 border-l-green-500 bg-green-50";
//       case "Cancelled":
//         return "border-l-4 border-l-red-500 bg-red-50";
//       case "Shipped":
//         return "border-l-4 border-l-blue-500 bg-blue-50";
//       default:
//         return "border-l-4 border-l-yellow-500 bg-yellow-50";
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Don't render anything if no user
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-white pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <h1 className="text-3xl font-bold text-[#004D98] font-oswald mb-4">
//             MY ACCOUNT
//           </h1>
//           <div className="w-24 h-1 bg-[#A50044] mx-auto"></div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
//               {/* User Info Card */}
//               <div className="text-center mb-8">
//                 <div className="w-24 h-24 bg-[#004D98] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#A50044]">
//                   <FiUser className="w-10 h-10 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {user.firstName} {user.lastName}
//                 </h2>
//                 <p className="text-gray-600 text-sm flex items-center justify-center mt-2">
//                   <FiMail className="w-4 h-4 mr-2" />
//                   {user.email}
//                 </p>
//               </div>

//               {/* Navigation Tabs */}
//               <nav className="space-y-3">
//                 <button
//                   onClick={() => setActiveTab("profile")}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all border ${
//                     activeTab === "profile"
//                       ? "bg-[#004D98] text-white border-[#004D98]"
//                       : "text-gray-700 border-gray-200 hover:border-[#004D98] hover:text-[#004D98]"
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <FiUser className="w-5 h-5 mr-3" />
//                     Profile Information
//                   </div>
//                   <FiChevronRight className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("orders")}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all border ${
//                     activeTab === "orders"
//                       ? "bg-[#004D98] text-white border-[#004D98]"
//                       : "text-gray-700 border-gray-200 hover:border-[#004D98] hover:text-[#004D98]"
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <FiShoppingBag className="w-5 h-5 mr-3" />
//                     My Orders
//                     {orders.length > 0 && (
//                       <span className="ml-3 bg-[#A50044] text-white text-xs px-2 py-1 rounded-full">
//                         {orders.length}
//                       </span>
//                     )}
//                   </div>
//                   <FiChevronRight className="w-4 h-4" />
//                 </button>
//               </nav>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center justify-center px-4 py-3 mt-8 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-red-300 hover:text-red-600 transition-all"
//               >
//                 <FiLogOut className="w-5 h-5 mr-2" />  
//                 Logout 
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             {/* Profile Information Tab */}
//             {activeTab === "profile" && (
//               <div className="bg-white border border-gray-200 rounded-lg p-8">
//                 <div className="flex items-center justify-between mb-8">
//                   <h3 className="text-2xl font-bold text-[#004D98]">Profile Information</h3>
//                   <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="flex items-center px-6 py-2 text-[#004D98] border-2 border-[#004D98] rounded-lg hover:bg-[#004D98] hover:text-white transition-all font-medium"
//                   >
//                     <FiEdit className="w-4 h-4 mr-2" />
//                     {isEditing ? "Cancel" : "Edit Profile"}
//                   </button>
//                 </div>

//                 {isEditing ? (
//                   <div className="space-y-8">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.firstName || ""}
//                           onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D98] focus:border-[#004D98] outline-none transition-all"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.lastName || ""}
//                           onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D98] focus:border-[#004D98] outline-none transition-all"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-3">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         value={editForm.email || ""}
//                         onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D98] focus:border-[#004D98] outline-none transition-all"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                           <FiPhone className="w-4 h-4 inline mr-2" />
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           value={editForm.phone || ""}
//                           onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D98] focus:border-[#004D98] outline-none transition-all"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                           <FiMapPin className="w-4 h-4 inline mr-2" />
//                           Shipping Address
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.address || ""}
//                           onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D98] focus:border-[#004D98] outline-none transition-all"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex space-x-4 pt-6 border-t border-gray-200">
//                       <button
//                         onClick={handleSaveProfile}
//                         className="px-8 py-3 bg-[#004D98] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
//                       >
//                         Save Changes
//                       </button>
//                       <button
//                         onClick={() => setIsEditing(false)}
//                         className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-8">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                       <div className="border-b border-gray-100 pb-6">
//                         <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
//                           First Name
//                         </label>
//                         <p className="text-lg text-gray-900 font-medium">{user.firstName}</p>
//                       </div>
//                       <div className="border-b border-gray-100 pb-6">
//                         <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
//                           Last Name
//                         </label>
//                         <p className="text-lg text-gray-900 font-medium">{user.lastName}</p>
//                       </div>
//                     </div>
                    
//                     <div className="border-b border-gray-100 pb-6">
//                       <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
//                         Email Address
//                       </label>
//                       <p className="text-lg text-gray-900 font-medium flex items-center">
//                         <FiMail className="w-5 h-5 mr-3 text-[#004D98]" />
//                         {user.email}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                       <div className="border-b border-gray-100 pb-6">
//                         <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
//                           Phone Number
//                         </label>
//                         <p className="text-lg text-gray-900 font-medium flex items-center">
//                           <FiPhone className="w-5 h-5 mr-3 text-[#004D98]" />
//                           {user.phone || "Not provided"}
//                         </p>
//                       </div>
//                       <div className="border-b border-gray-100 pb-6">
//                         <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
//                           Shipping Address
//                         </label>
//                         <p className="text-lg text-gray-900 font-medium flex items-center">
//                           <FiMapPin className="w-5 h-5 mr-3 text-[#004D98]" />
//                           {user.address || "Not provided"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Orders Tab */}
//             {activeTab === "orders" && (
//               <div className="bg-white border border-gray-200 rounded-lg p-8">
//                 <div className="flex items-center justify-between mb-8">
//                   <h3 className="text-2xl font-bold text-[#004D98]">Order History</h3>
//                   <div className="text-sm text-gray-600">
//                     Total Orders: <span className="font-semibold text-[#A50044]">{orders.length}</span>
//                   </div>
//                 </div>

//                 {orders.length === 0 ? (
//                   <div className="text-center py-16">
//                     <IoShirtOutline className="w-20 h-20 text-gray-300 mx-auto mb-6" />
//                     <h4 className="text-2xl font-semibold text-gray-600 mb-4">No Orders Yet</h4>
//                     <p className="text-gray-500 mb-8 max-w-md mx-auto">
//                       You haven't placed any orders yet. Explore our collection and find your favorite Barcelona merchandise.
//                     </p>
//                     <button
//                       onClick={() => navigate("/kits")}
//                       className="px-8 py-3 bg-[#004D98] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
//                     >
//                       Explore Collection
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {orders.map((order) => (
//                       <div
//                         key={order.id}
//                         className={`border border-gray-200 rounded-lg ${getStatusColor(order.status)} transition-all hover:border-[#004D98]`}
//                       >
//                         <div className="p-6">
//                           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//                             <div>
//                               <h4 className="font-bold text-gray-900 text-lg mb-2">
//                                 Order #{order.id}
//                               </h4>
//                               <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//                                 <span className="flex items-center">
//                                   <FiClock className="w-4 h-4 mr-1" />
//                                   {formatDate(order.createdAt)}
//                                 </span>
//                                 <span>•</span>
//                                 <span>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
//                                 <span>•</span>
//                                 <span className="font-medium">{order.paymentMethod?.toUpperCase()}</span>
//                               </div>
//                             </div>
//                             <div className="flex items-center space-x-6 mt-4 md:mt-0">
//                               <div className="text-right">
//                                 <p className="text-2xl font-bold text-[#A50044]">
//                                   ₹{order.total?.toLocaleString()}
//                                 </p>
//                                 <p className="text-sm text-gray-600">Total Amount</p>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Order Items */}
//                           <div className="space-y-4">
//                             {order.items?.map((item, index) => (
//                               <div key={index} className="flex items-center justify-between py-4 border-t border-gray-100 first:border-t-0">
//                                 <div className="flex items-center space-x-4">
//                                   <img
//                                     src={item.image_url}
//                                     alt={item.name}
//                                     className="w-20 h-20 rounded border border-gray-200 object-cover"
//                                   />
//                                   <div>
//                                     <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
//                                     <div className="text-sm text-gray-600 space-y-1">
//                                       <div className="flex space-x-4">
//                                         <span>Size: <strong>{item.size}</strong></span>
//                                         <span>Qty: <strong>{item.quantity}</strong></span>
//                                       </div>
//                                       <p>Category: <span className="capitalize">{item.category?.replace('_', ' ')}</span></p>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <p className="font-semibold text-gray-900 text-lg">
//                                     ₹{(item.price_inr * item.quantity)?.toLocaleString()}
//                                   </p>
//                                   <p className="text-sm text-gray-600">₹{item.price_inr?.toLocaleString()} each</p>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>

//                           {/* Order Footer */}
//                           <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 pt-6 border-t border-gray-200">
//                             <div className="text-sm text-gray-600 mb-4 md:mb-0">
//                               <p className="font-medium mb-1">Shipping to:</p>
//                               <p>{order.shippingInfo?.fullName}, {order.shippingInfo?.address}, {order.shippingInfo?.city}</p>
//                             </div>

//                             <div className="flex items-center space-x-4">
//                               <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                                 order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
//                                 order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
//                                 order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
//                                 'bg-yellow-100 text-yellow-800'
//                               }`}>
//                                 <span className="flex items-center">
//                                   {getStatusIcon(order.status)}
//                                   <span className="ml-2">{order.status}</span>
//                                 </span>
//                               </span>
                              
//                               {order.status !== "Cancelled" && order.status !== "Delivered" && (
//                                 <button
//                                   onClick={() => handleCancel(order.id)}
//                                   className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
//                                 >
//                                   Cancel Order
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;











// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiUser, FiMail, FiLogOut, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiMapPin, FiPhone } from "react-icons/fi";
// import { IoShirtOutline } from "react-icons/io5";
// import { useAuth } from "../Context/AuthContext";

// const ProfilePage = () => {
//   const { user, logout } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [activeTab, setActiveTab] = useState("orders");
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({});
//   const navigate = useNavigate();

//   // Fetch user orders from json-server
//   const fetchOrders = async (userId) => {
//     try {
//       const res = await fetch(`http://localhost:3000/orders?userId=${userId}`);
//       const data = await res.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   // Load user data for editing
//   useEffect(() => {
//     if (user) {
//       setEditForm({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         address: user.address || ""
//       });
      
//       // Fetch orders when user is available
//       fetchOrders(user.id || user.userId);
//     }
//   }, [user]);

//   // Cancel order
//   const handleCancel = async (orderId) => {
//     if (!window.confirm("Are you sure you want to cancel this order?")) return;

//     try {
//       await fetch(`http://localhost:3000/orders/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: "Cancelled" }),
//       });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === orderId ? { ...order, status: "Cancelled" } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//     }
//   };

//   // Logout handler using AuthContext
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleSaveProfile = () => {
//     localStorage.setItem("user", JSON.stringify({ ...user, ...editForm }));
//     window.location.reload();
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Delivered":
//         return <FiCheckCircle className="text-green-600" />;
//       case "Cancelled":
//         return <FiXCircle className="text-red-600" />;
//       default:
//         return <FiClock className="text-yellow-600" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Delivered":
//         return "text-green-600 border-green-200";
//       case "Cancelled":
//         return "text-red-600 border-red-200";
//       case "Shipped":
//         return "text-blue-600 border-blue-200";
//       default:
//         return "text-yellow-600 border-yellow-200";
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Don't render anything if no user
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             My Account
//           </h1>
//           <p className="text-gray-600">
//             Welcome back, {user.firstName}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               {/* User Info */}
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 bg-gradient-to-r from-[#004d98] to-[#a50044] rounded-full flex items-center justify-center mx-auto mb-3">
//                   <FiUser className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="font-semibold text-gray-900">
//                   {user.firstName} {user.lastName}
//                 </h2>
//                 <p className="text-gray-500 text-sm mt-1">{user.email}</p>
//               </div>

//               {/* Navigation */}
//               <div className="space-y-2">
//                 <button
//                   onClick={() => setActiveTab("profile")}
//                   className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     activeTab === "profile"
//                       ? "bg-blue-50 text-[#004d98] border border-blue-200"
//                       : "text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   <FiUser className="w-4 h-4 mr-3" />
//                   Profile
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("orders")}
//                   className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     activeTab === "orders"
//                       ? "bg-blue-50 text-[#004d98] border border-blue-200"
//                       : "text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   <FiShoppingBag className="w-4 h-4 mr-3" />
//                   My Orders
//                   {orders.length > 0 && (
//                     <span className="ml-auto bg-[#a50044] text-white text-xs px-2 py-1 rounded-full">
//                       {orders.length}
//                     </span>
//                   )}
//                 </button>
//               </div>

//               {/* Logout */}
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center justify-center px-3 py-2 mt-6 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
//               >
//                 <FiLogOut className="w-4 h-4 mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             {/* Profile Tab */}
//             {activeTab === "profile" && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
//                   <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="flex items-center px-4 py-2 text-[#004d98] border border-[#004d98] rounded-lg hover:bg-[#004d98] hover:text-white transition-colors text-sm font-medium"
//                   >
//                     <FiEdit className="w-4 h-4 mr-2" />
//                     {isEditing ? "Cancel" : "Edit Profile"}
//                   </button>
//                 </div>

//                 {isEditing ? (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           First Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.firstName || ""}
//                           onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Last Name
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.lastName || ""}
//                           onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         value={editForm.email || ""}
//                         onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone
//                         </label>
//                         <input
//                           type="tel"
//                           value={editForm.phone || ""}
//                           onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Address
//                         </label>
//                         <input
//                           type="text"
//                           value={editForm.address || ""}
//                           onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d98] focus:border-[#004d98]"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex space-x-3 pt-4">
//                       <button
//                         onClick={handleSaveProfile}
//                         className="px-4 py-2 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-medium"
//                       >
//                         Save Changes
//                       </button>
//                       <button
//                         onClick={() => setIsEditing(false)}
//                         className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           First Name
//                         </label>
//                         <p className="text-gray-900">{user.firstName}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Last Name
//                         </label>
//                         <p className="text-gray-900">{user.lastName}</p>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Email
//                       </label>
//                       <p className="text-gray-900 flex items-center">
//                         <FiMail className="w-4 h-4 mr-2 text-gray-400" />
//                         {user.email}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Phone
//                         </label>
//                         <p className="text-gray-900 flex items-center">
//                           <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
//                           {user.phone || "Not provided"}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">
//                           Address
//                         </label>
//                         <p className="text-gray-900 flex items-center">
//                           <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
//                           {user.address || "Not provided"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Orders Tab */}
//             {activeTab === "orders" && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
//                   <span className="text-sm text-gray-600">
//                     {orders.length} order{orders.length !== 1 ? 's' : ''}
//                   </span>
//                 </div>

//                 {orders.length === 0 ? (
//                   <div className="text-center py-12">
//                     <IoShirtOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                     <h4 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h4>
//                     <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
//                     <button
//                       onClick={() => navigate("/kits")}
//                       className="px-6 py-2 bg-[#004d98] text-white rounded-lg hover:bg-[#003366] transition-colors"
//                     >
//                       Start Shopping
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="max-h-[600px] overflow-y-auto pr-2">
//                     <div className="space-y-4">
//                       {orders.map((order) => (
//                         <div
//                           key={order.id}
//                           className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
//                         >
//                           <div className="flex items-center justify-between mb-4">
//                             <div>
//                               <h4 className="font-semibold text-gray-900">
//                                 Order #{order.id}
//                               </h4>
//                               <p className="text-sm text-gray-600">
//                                 {formatDate(order.createdAt)} • {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-semibold text-[#a50044]">
//                                 ₹{order.total?.toLocaleString()}
//                               </p>
//                               <div className={`flex items-center text-sm ${getStatusColor(order.status)}`}>
//                                 {getStatusIcon(order.status)}
//                                 <span className="ml-1">{order.status}</span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Order Items */}
//                           <div className="space-y-3">
//                             {order.items?.map((item, index) => (
//                               <div key={index} className="flex items-center justify-between py-2 border-t border-gray-100 first:border-t-0">
//                                 <div className="flex items-center space-x-3">
//                                   <img
//                                     src={item.image_url}
//                                     alt={item.name}
//                                     className="w-12 h-12 rounded border border-gray-200 object-cover"
//                                   />
//                                   <div>
//                                     <p className="font-medium text-gray-900 text-sm">{item.name}</p>
//                                     <div className="text-xs text-gray-600">
//                                       <span>Size: {item.size}</span>
//                                       <span className="mx-2">•</span>
//                                       <span>Qty: {item.quantity}</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <p className="font-semibold text-gray-900 text-sm">
//                                   ₹{(item.price_inr * item.quantity)?.toLocaleString()}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>

//                           {/* Order Actions */}
//                           <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
//                             <div className="text-xs text-gray-600">
//                               <p>
//                                 <strong>Shipping:</strong> {order.shippingInfo?.fullName}, {order.shippingInfo?.city}
//                               </p>
//                               <p>
//                                 <strong>Payment:</strong> {order.paymentMethod?.toUpperCase()} • {order.paymentStatus}
//                               </p>
//                             </div>

//                             {order.status !== "Cancelled" && order.status !== "Delivered" && (
//                               <button
//                                 onClick={() => handleCancel(order.id)}
//                                 className="px-3 py-1 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50 transition-colors"
//                               >
//                                 Cancel
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;








import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLogOut, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiMapPin, FiPhone } from "react-icons/fi";
import { IoShirtOutline } from "react-icons/io5";
import { useAuth } from "../Context/AuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  // Fetch user orders from json-server
  const fetchOrders = async (userId) => {
    try {
      console.log("🔍 Fetching orders for user ID:", userId);
      
      const res = await fetch(`http://localhost:3000/orders?userId=${userId}`);
      const data = await res.json();
      
      console.log("📦 Orders found:", data);
      setOrders(data);
      
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setOrders([]);
    }
  };

  // Load user data for editing
  useEffect(() => {
    if (user) {
      console.log("👤 Current user in Profile:", user);
      console.log("🆔 User ID:", user.id);
      
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || user.shippingAddress?.phone || "",
        address: user.address || user.shippingAddress?.address || ""
      });
      
      // Fetch orders when user is available
      fetchOrders(user.id);
    }
  }, [user]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheckCircle className="text-green-600" />;
      case "Cancelled":
        return <FiXCircle className="text-red-600" />;
      default:
        return <FiClock className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 border-green-200";
      case "Cancelled":
        return "text-red-600 border-red-200";
      case "Shipped":
        return "text-blue-600 border-blue-200";
      default:
        return "text-yellow-600 border-yellow-200";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                  <span className="text-sm text-gray-600">
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {orders.length === 0 ? (
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
                                {formatDate(order.createdAt)} • {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#a50044]">
                                ₹{order.total?.toLocaleString()}
                              </p>
                              <div className={`flex items-center text-sm ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{order.status}</span>
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
                                  ₹{(item.price_inr * item.quantity)?.toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Order Actions */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="text-xs text-gray-600">
                              <p>
                                <strong>Shipping:</strong> {order.shippingInfo?.fullName}, {order.shippingInfo?.city}
                              </p>
                              <p>
                                <strong>Payment:</strong> {order.paymentMethod?.toUpperCase()} • {order.paymentStatus}
                              </p>
                            </div>

                            {order.status !== "Cancelled" && order.status !== "Delivered" && (
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