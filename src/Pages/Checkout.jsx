// import React, { useState, useEffect } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import { 
//   FiLock, 
//   FiCreditCard, 
//   FiMapPin, 
//   FiUser, 
//   FiPhone,
//   FiMail,
//   FiArrowLeft,
//   FiCheck,
//   FiEdit3,
//   FiShoppingBag,
//   FiShield,
//   FiTruck,
//   FiCalendar,
//   FiArrowRight,
//   FiDollarSign,
//   FiPackage
// } from "react-icons/fi";
// import { IoShirtOutline } from "react-icons/io5";
// import toast, { Toaster } from "react-hot-toast";

// export default function Checkout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [activeStep, setActiveStep] = useState(1);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   // Form states
//   const [shippingInfo, setShippingInfo] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "India"
//   });

//   const [paymentMethod, setPaymentMethod] = useState("creditCard");
//   const [cardInfo, setCardInfo] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     nameOnCard: ""
//   });

//   const [upiId, setUpiId] = useState("");
//   const [discountCode, setDiscountCode] = useState("");
//   const [appliedDiscount, setAppliedDiscount] = useState(0);
//   const [saveShippingInfo, setSaveShippingInfo] = useState(true);

//   // Load cart data and user info
//   useEffect(() => {
//     const loadCheckoutData = async () => {
//       try {
//         setLoading(true);
        
//         // Get current user
//         const userData = localStorage.getItem("currentUser");
//         if (userData) {
//           const user = JSON.parse(userData);
//           setCurrentUser(user);
//           setCartItems(user.cart || []);
          
//           // Pre-fill user data
//           setShippingInfo(prev => ({
//             ...prev,
//             email: user.email || "",
//             fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim()
//           }));
//         } else {
//           // Fallback to API
//           const response = await axios.get("http://localhost:3000/users");
//           const users = response.data;
//           if (users.length > 0) {
//             const user = users[0];
//             setCurrentUser(user);
//             setCartItems(user.cart || []);
//             localStorage.setItem("currentUser", JSON.stringify(user));
//           }
//         }

//         // Load saved shipping info if exists
//         const savedShippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
//         if (savedShippingInfo) {
//           setShippingInfo(savedShippingInfo);
//         }

//       } catch (error) {
//         console.error("Error loading checkout data:", error);
//         toast.error("Failed to load checkout data");
        
//         // Final fallback to localStorage
//         const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//         setCartItems(storedCart);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCheckoutData();
//   }, []);

//   // Update user in database
//   const updateUserInDatabase = async (updatedUser) => {
//     try {
//       await axios.put(`http://localhost:3000/users/${updatedUser.id}`, updatedUser);
//       setCurrentUser(updatedUser);
//       localStorage.setItem("currentUser", JSON.stringify(updatedUser));
//       return true;
//     } catch (error) {
//       console.error("Error updating user:", error);
//       return false;
//     }
//   };

//   // Pricing calculations
//   const subtotal = cartItems.reduce(
//     (total, item) => total + (item.price_inr || item.price || 0) * (item.quantity || 1),
//     0
//   );
//   const discount = subtotal * appliedDiscount;
//   const shipping = subtotal >= 5000 ? 0 : 199;
//   const tax = (subtotal - discount) * 0.18;
//   const total = subtotal - discount + shipping + tax;

//   // Apply discount code
//   const applyDiscount = () => {
//     if (!discountCode.trim()) {
//       toast.error("Please enter a discount code", {
//         icon: '📝',
//       });
//       return;
//     }

//     if (discountCode.toUpperCase() === "BARCA10") {
//       setAppliedDiscount(0.1);
//       toast.success("🎉 BARCA10 applied! 10% discount activated");
//     } else if (discountCode.toUpperCase() === "CULERS20") {
//       setAppliedDiscount(0.2);
//       toast.success("🎉 CULERS20 applied! 20% discount activated");
//     } else {
//       setAppliedDiscount(0);
//       toast.error("Invalid discount code. Try BARCA10 or CULERS20", {
//         icon: '❌',
//       });
//     }
//   };

//   // Format card number
//   const formatCardNumber = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     const matches = v.match(/\d{4,16}/g);
//     const match = matches && matches[0] || '';
//     const parts = [];
    
//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }
    
//     return parts.length ? parts.join(' ') : value;
//   };

//   // Format expiry date
//   const formatExpiryDate = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     if (v.length >= 2) {
//       return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
//     }
//     return value;
//   };

//   // Validate form
//   const validateForm = () => {
//     if (!shippingInfo.fullName.trim()) {
//       toast.error("Please enter your full name");
//       return false;
//     }
//     if (!shippingInfo.email.trim() || !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
//       toast.error("Please enter a valid email address");
//       return false;
//     }
//     if (!shippingInfo.phone.trim() || shippingInfo.phone.length < 10) {
//       toast.error("Please enter a valid phone number");
//       return false;
//     }
//     if (!shippingInfo.address.trim()) {
//       toast.error("Please enter your address");
//       return false;
//     }
//     if (!shippingInfo.city.trim()) {
//       toast.error("Please enter your city");
//       return false;
//     }
//     if (!shippingInfo.state.trim()) {
//       toast.error("Please enter your state");
//       return false;
//     }
//     if (!shippingInfo.zipCode.trim() || shippingInfo.zipCode.length < 6) {
//       toast.error("Please enter a valid ZIP code");
//       return false;
//     }

//     if (paymentMethod === "creditCard") {
//       if (!cardInfo.nameOnCard.trim()) {
//         toast.error("Please enter name on card");
//         return false;
//       }
//       if (!cardInfo.cardNumber.trim() || cardInfo.cardNumber.replace(/\s/g, '').length !== 16) {
//         toast.error("Please enter a valid 16-digit card number");
//         return false;
//       }
//       if (!cardInfo.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate)) {
//         toast.error("Please enter a valid expiry date (MM/YY)");
//         return false;
//       }
//       if (!cardInfo.cvv.trim() || cardInfo.cvv.length !== 3) {
//         toast.error("Please enter a valid 3-digit CVV");
//         return false;
//       }
//     }

//     if (paymentMethod === "upi" && !upiId.trim()) {
//       toast.error("Please enter your UPI ID");
//       return false;
//     }

//     return true;
//   };

//   // Handle Cash on Delivery
//   const handleCashOnDelivery = async () => {
//     if (!validateForm()) {

//       return;
//     }

//     setLoading(true);

//     try {
//       // Save shipping info if requested
//       if (saveShippingInfo) {
//         localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
//       }

//       // Clear cart after successful order
//       if (currentUser) {
//         const updatedUser = {
//           ...currentUser,
//           cart: []
//         };
//         await updateUserInDatabase(updatedUser);
//       }
      
//       // Also clear localStorage cart
//       localStorage.removeItem("cart");

//       // Show success modal
//       setShowSuccessModal(true);

//     } catch (error) {
//       console.error("Error processing COD order:", error);
//       toast.error("Failed to process order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle online payment submission
//   const handleOnlinePayment = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       // Simulate payment processing
//       await new Promise(resolve => setTimeout(resolve, 3000));

//       // Save shipping info if requested
//       if (saveShippingInfo) {
//         localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
//       }

//       // Clear cart after successful order
//       if (currentUser) {
//         const updatedUser = {
//           ...currentUser,
//           cart: []
//         };
//         await updateUserInDatabase(updatedUser);
//       }
      
//       // Also clear localStorage cart
//       localStorage.removeItem("cart");

//       // Navigate to order confirmation
//       navigate("/order-confirmation", {
//         state: {
//           orderId: `BARCA${Date.now()}`,
//           cartItems,
//           subtotal,
//           discount,
//           shipping,
//           tax,
//           total,
//           shippingInfo,
//           paymentMethod,
//           orderDate: new Date().toISOString(),
//           estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
//         }
//       });

//     } catch (error) {
//       console.error("Error processing order:", error);
//       toast.error("Failed to process order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle success modal close and navigation
//   const handleSuccessModalClose = () => {
//     setShowSuccessModal(false);
//     navigate("/profile");
//   };

//   const steps = [
//     { id: 1, name: "Shipping", description: "Delivery information", icon: FiMapPin },
//     { id: 2, name: "Payment", description: "Payment method", icon: FiCreditCard },
//     { id: 3, name: "Confirmation", description: "Order review", icon: FiCheck }
//   ];

//   const OrderSummaryItem = ({ item }) => (
//     <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
//       <img
//         src={item.image_url || item.image}
//         alt={item.name}
//         className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200"
//       />
//       <div className="flex-1">
//         <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
//         <div className="flex items-center gap-3 mt-2">
//           {item.size && (
//             <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium">
//               Size: {item.size}
//             </span>
//           )}
//           <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium">
//             Qty: {item.quantity || 1}
//           </span>
//         </div>
//       </div>
//       <div className="text-right">
//         <p className="font-bold text-[#a50044] text-lg">
//           ₹{((item.price_inr || item.price || 0) * (item.quantity || 1)).toLocaleString()}
//         </p>
//       </div>
//     </div>
//   );

//   // Success Modal Component
//   const SuccessModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform scale-95 animate-scale-in">
//         <div className="p-8 text-center">
//           <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//             <FiCheck className="w-10 h-10 text-white" />
//           </div>
          
//           <h2 className="text-3xl font-bold text-gray-900 mb-4 font-oswald">
//             Order Placed Successfully! 🎉
//           </h2>
          
//           <p className="text-gray-600 text-lg mb-2">
//             Thank you for your order!
//           </p>
//           <p className="text-gray-500 mb-6">
//             Your FC Barcelona merchandise will be delivered soon.
//           </p>

//           <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
//             <div className="flex items-center justify-center gap-2 text-blue-800 font-semibold mb-2">
//               <FiPackage className="w-5 h-5" />
//               Cash on Delivery Selected
//             </div>
//             <p className="text-blue-700 text-sm">
//               Please keep ₹{total.toLocaleString()} ready for payment upon delivery
//             </p>
//           </div>

//           <div className="space-y-3">
//             <button
//               onClick={handleSuccessModalClose}
//               className="w-full bg-gradient-to-r from-[#004d98] to-[#004d98] text-white font-bold py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
//             >
//               View Order in Profile
//             </button>
            
//             <button
//               onClick={() => navigate("/kits")}
//               className="w-full border-2 border-[#004d98] text-[#004d98] font-bold py-4 rounded-xl hover:bg-[#004d98] hover:text-white transition-all duration-300"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading && cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16 flex items-center justify-center">
//         <Toaster position="top-right" />
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#004d98]"></div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0 && !loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
//         <Toaster position="top-right" />
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="bg-white rounded-3xl shadow-2xl p-12 mt-8 border border-gray-100">
//             <div className="w-32 h-32 bg-gradient-to-br from-[#004d98] to-[#004d98] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//               <IoShirtOutline className="w-16 h-16 text-[#ece8dc]" />
//             </div>
            
//             <h2 className="text-4xl font-bold text-gray-900 mb-4 font-oswald">
//               Your Cart is Empty 🛍️
//             </h2>
            
//             <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
//               Add some FC Barcelona merchandise to proceed to checkout!
//             </p>
            
//             <button
//               onClick={() => navigate("/kits")}
//               className="px-10 py-4 bg-gradient-to-r from-[#004d98] to-[#003366] text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
//             >
//               Start Shopping
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-16">
//       <Toaster position="top-right" />
//       {showSuccessModal && <SuccessModal />}
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Navigation */}
//         <div className="mb-8">
//           <Link 
//             to="/cart" 
//             className="inline-flex items-center text-gray-600 hover:text-[#004d98] transition-colors group text-lg font-medium"
//           >
//             <FiArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" size={20} />
//             Back to Cart
//           </Link>
//         </div>

//         {/* Main Header */}
//         <div className="mb-12">
//           <div className="bg-white rounded-2xl px-8 py-8 shadow-2xl border border-gray-100">
//             <div className="flex items-center gap-6">
//               <div className="w-20 h-20 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-2xl flex items-center justify-center shadow-lg">
//                 <FiLock className="w-10 h-10 text-[#edbb00]" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-blue-950 font-oswald mb-2">
//                   Secure Checkout
//                 </h1>
//                 <p className="text-gray-600 text-lg font-medium">FC Barcelona Official Store</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-2">
//             <form onSubmit={handleOnlinePayment}>
//               {/* Progress Steps */}
//               <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
//                 <div className="flex items-center justify-between">
//                   {steps.map((step, index) => {
//                     const IconComponent = step.icon;
//                     return (
//                       <div key={step.id} className="flex items-center">
//                         <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 ${
//                           activeStep >= step.id 
//                             ? 'bg-[#004d98] border-[#004d98] text-white' 
//                             : 'border-gray-300 text-gray-300'
//                         } font-bold transition-all duration-300`}>
//                           {activeStep > step.id ? <FiCheck className="w-6 h-6" /> : <IconComponent className="w-6 h-6" />}
//                         </div>
//                         <div className="ml-4">
//                           <p className={`font-bold text-lg ${
//                             activeStep >= step.id ? 'text-[#004d98]' : 'text-gray-400'
//                           }`}>
//                             {step.name}
//                           </p>
//                           <p className="text-sm text-gray-500">{step.description}</p>
//                         </div>
//                         {index < steps.length - 1 && (
//                           <div className={`w-16 h-0.5 mx-8 ${
//                             activeStep > step.id ? 'bg-[#004d98]' : 'bg-gray-300'
//                           }`} />
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Shipping Information */}
//               <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
//                 <div className="flex items-center gap-4 mb-8">
//                   <div className="w-12 h-12 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-xl flex items-center justify-center">
//                     <FiMapPin className="w-6 h-6 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold text-[#004d98]">Shipping Information</h2>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Full Name *
//                     </label>
//                     <div className="relative">
//                       <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                       <input
//                         type="text"
//                         required
//                         value={shippingInfo.fullName}
//                         onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
//                         className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                         placeholder="Enter your full name"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Email Address *
//                     </label>
//                     <div className="relative">
//                       <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                       <input
//                         type="email"
//                         required
//                         value={shippingInfo.email}
//                         onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
//                         className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                         placeholder="Enter your email"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Phone Number *
//                     </label>
//                     <div className="relative">
//                       <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                       <input
//                         type="tel"
//                         required
//                         value={shippingInfo.phone}
//                         onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
//                         className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                         placeholder="Enter your phone number"
//                         maxLength={10}
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={shippingInfo.city}
//                       onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
//                       className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                       placeholder="Enter your city"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       Street Address *
//                     </label>
//                     <textarea
//                       required
//                       value={shippingInfo.address}
//                       onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
//                       rows={3}
//                       className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors resize-none"
//                       placeholder="Enter your complete address"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       State *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={shippingInfo.state}
//                       onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
//                       className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                       placeholder="Enter your state"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-gray-700 mb-2">
//                       ZIP Code *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={shippingInfo.zipCode}
//                       onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
//                       className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                       placeholder="Enter ZIP code"
//                       maxLength={6}
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-6 flex items-center">
//                   <input
//                     type="checkbox"
//                     id="saveShipping"
//                     checked={saveShippingInfo}
//                     onChange={(e) => setSaveShippingInfo(e.target.checked)}
//                     className="w-4 h-4 text-[#004d98] border-gray-300 rounded focus:ring-[#004d98]"
//                   />
//                   <label htmlFor="saveShipping" className="ml-2 text-sm text-gray-600">
//                     Save shipping information for future orders
//                   </label>
//                 </div>
//               </div>

//               {/* Payment Method */}
//               <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
//                 <div className="flex items-center gap-4 mb-8">
//                   <div className="w-12 h-12 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-xl flex items-center justify-center">
//                     <FiCreditCard className="w-6 h-6 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold text-[#004d98]">Payment Method</h2>
//                 </div>

//                 <div className="space-y-6">
//                   {/* Payment Options */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <button
//                       type="button"
//                       onClick={() => setPaymentMethod("creditCard")}
//                       className={`p-6 border-2 rounded-2xl text-left transition-all ${
//                         paymentMethod === "creditCard" 
//                           ? "border-[#004d98] bg-blue-50 shadow-md" 
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                           paymentMethod === "creditCard" ? "border-[#004d98] bg-[#004d98]" : "border-gray-400"
//                         }`}>
//                           {paymentMethod === "creditCard" && <FiCheck className="w-3 h-3 text-white" />}
//                         </div>
//                         <span className="font-bold text-gray-900">Credit/Debit Card</span>
//                       </div>
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => setPaymentMethod("upi")}
//                       className={`p-6 border-2 rounded-2xl text-left transition-all ${
//                         paymentMethod === "upi" 
//                           ? "border-[#004d98] bg-blue-50 shadow-md" 
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                           paymentMethod === "upi" ? "border-[#004d98] bg-[#004d98]" : "border-gray-400"
//                         }`}>
//                           {paymentMethod === "upi" && <FiCheck className="w-3 h-3 text-white" />}
//                         </div>
//                         <span className="font-bold text-gray-900">UPI Payment</span>
//                       </div>
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => setPaymentMethod("cod")}
//                       className={`p-6 border-2 rounded-2xl text-left transition-all ${
//                         paymentMethod === "cod" 
//                           ? "border-[#004d98] bg-blue-50 shadow-md" 
//                           : "border-gray-300 hover:border-gray-400"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                           paymentMethod === "cod" ? "border-[#004d98] bg-[#004d98]" : "border-gray-400"
//                         }`}>
//                           {paymentMethod === "cod" && <FiCheck className="w-3 h-3 text-white" />}
//                         </div>
//                         <span className="font-bold text-gray-900">Cash on Delivery</span>
//                       </div>
//                     </button>
//                   </div>

//                   {/* Card Details */}
//                   {paymentMethod === "creditCard" && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-2xl border border-blue-200">
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">
//                           Name on Card *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={cardInfo.nameOnCard}
//                           onChange={(e) => setCardInfo({...cardInfo, nameOnCard: e.target.value})}
//                           className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                           placeholder="Enter name as on card"
//                         />
//                       </div>

//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-bold text-gray-700 mb-2">
//                           Card Number *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={cardInfo.cardNumber}
//                           onChange={(e) => setCardInfo({...cardInfo, cardNumber: formatCardNumber(e.target.value)})}
//                           className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                           placeholder="1234 5678 9012 3456"
//                           maxLength={19}
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">
//                           Expiry Date *
//                         </label>
//                         <div className="relative">
//                           <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                           <input
//                             type="text"
//                             required
//                             value={cardInfo.expiryDate}
//                             onChange={(e) => setCardInfo({...cardInfo, expiryDate: formatExpiryDate(e.target.value)})}
//                             className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                             placeholder="MM/YY"
//                             maxLength={5}
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-bold text-gray-700 mb-2">
//                           CVV *
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={cardInfo.cvv}
//                           onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})}
//                           className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                           placeholder="123"
//                           maxLength={3}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {paymentMethod === "upi" && (
//                     <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
//                       <label className="block text-sm font-bold text-gray-700 mb-2">
//                         UPI ID *
//                       </label>
//                       <input
//                         type="text"
//                         required
//                         value={upiId}
//                         onChange={(e) => setUpiId(e.target.value)}
//                         className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors"
//                         placeholder="yourname@upi"
//                       />
//                       <p className="text-sm text-gray-600 mt-2">
//                         You will be redirected to your UPI app to complete the payment
//                       </p>
//                     </div>
//                   )}

//                   {paymentMethod === "cod" && (
//                     <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
//                       <div className="flex items-center gap-3 mb-3">
//                         <FiDollarSign className="w-6 h-6 text-green-600" />
//                         <h3 className="text-lg font-bold text-green-800">Cash on Delivery</h3>
//                       </div>
//                       <p className="text-green-700 mb-2">
//                         Pay when your order arrives at your doorstep
//                       </p>
//                       <p className="text-green-600 text-sm">
//                         Please keep ₹{total.toLocaleString()} ready for payment upon delivery
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Security Features */}
//               <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
//                       <FiShield className="w-6 h-6 text-green-600" />
//                     </div>
//                     <div>
//                       <p className="font-bold text-gray-900">Secure Payment</p>
//                       <p className="text-gray-600 text-sm">256-bit SSL encryption</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
//                       <FiLock className="w-6 h-6 text-[#004d98]" />
//                     </div>
//                     <div>
//                       <p className="font-bold text-gray-900">Privacy Protected</p>
//                       <p className="text-gray-600 text-sm">Your data is safe</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
//                       <FiTruck className="w-6 h-6 text-[#edbb00]" />
//                     </div>
//                     <div>
//                       <p className="font-bold text-gray-900">Fast Delivery</p>
//                       <p className="text-gray-600 text-sm">3-5 business days</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Buttons */}
//               <div className="space-y-4">
//                 {paymentMethod === "cod" ? (
//                   <button
//                     type="button"
//                     onClick={handleCashOnDelivery}
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-5 rounded-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
//                         Placing Order...
//                       </>
//                     ) : (
//                       <>
//                         <FiDollarSign className="w-6 h-6" />
//                         Place Order (Cash on Delivery)
//                         <FiCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
//                       </>
//                     )}
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-[#004d98] to-[#004d98] text-white font-bold py-5 rounded-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
//                         Processing Payment...
//                       </>
//                     ) : (
//                       <>
//                         <FiLock className="w-6 h-6" />
//                         Pay Now - ₹{total.toLocaleString()}
//                         <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8 border border-gray-100">
//               <div className="flex items-center gap-3 mb-8">
//                 <div className="w-12 h-12 bg-gradient-to-br from-[#004d98] to-[#a50044] rounded-xl flex items-center justify-center">
//                   <FiShoppingBag className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-[#004d98]">Order Summary</h2>
//               </div>

//               {/* Items List */}
//               <div className="mb-6 max-h-80 overflow-y-auto">
//                 {cartItems.map((item, index) => (
//                   <OrderSummaryItem key={`${item.productId}-${index}`} item={item} />
//                 ))}
//               </div>

//               {/* Discount Code */}
//               <div className="mb-6">
//                 <label className="block text-sm font-bold text-gray-700 mb-3">
//                   Discount Code
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={discountCode}
//                     onChange={(e) => setDiscountCode(e.target.value)}
//                     placeholder="Enter promo code"
//                     className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#004d98] transition-colors text-sm font-medium"
//                     onKeyPress={(e) => e.key === 'Enter' && applyDiscount()}
//                   />
//                   <button
//                     type="button"
//                     onClick={applyDiscount}
//                     className="px-4 py-3 bg-[#edbb00] text-[#004d98] font-bold rounded-xl hover:bg-[#004d98] hover:text-[#edbb00] transition-all duration-300 border-2 border-[#edbb00] hover:border-[#004d98] shadow"
//                   >
//                     Apply
//                   </button>
//                 </div>
//               </div>

//               {/* Pricing Breakdown */}
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between items-center text-gray-700">
//                   <span>Subtotal ({cartItems.length} items)</span>
//                   <span className="font-bold">₹{subtotal.toLocaleString()}</span>
//                 </div>

//                 {appliedDiscount > 0 && (
//                   <div className="flex justify-between items-center text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
//                     <span className="font-semibold">Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
//                     <span className="font-bold">-₹{discount.toLocaleString()}</span>
//                   </div>
//                 )}

//                 <div className="flex justify-between items-center text-gray-700">
//                   <span>Shipping</span>
//                   <span className="font-bold">
//                     {shipping === 0 ? (
//                       <span className="text-green-600">FREE</span>
//                     ) : (
//                       `₹${shipping}`
//                     )}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center text-gray-700">
//                   <span>Tax (18%)</span>
//                   <span className="font-bold">₹{tax.toLocaleString()}</span>
//                 </div>
//               </div>

//               {/* Total */}
//               <div className="border-t-2 border-gray-200 pt-4 mb-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xl font-bold text-[#004d98]">Total Amount</span>
//                   <span className="text-2xl font-bold text-[#a50044]">
//                     ₹{total.toLocaleString()}
//                   </span>
//                 </div>
//               </div>

//               {/* Security Badge */}
//               <div className="text-center pt-6 border-t border-gray-200">
//                 <div className="flex items-center justify-center gap-2 text-sm text-gray-600 font-medium mb-2">
//                   <FiLock className="w-4 h-4 text-green-500" />
//                   Secure SSL Encryption
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   Your payment information is secure and encrypted
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      const response = await axios.post("http://localhost:3000/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  };

  // Update user in database
  const updateUserInDatabase = async (updatedUser) => {
    try {
      await axios.put(`http://localhost:3000/users/${updatedUser.id}`, updatedUser);
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







