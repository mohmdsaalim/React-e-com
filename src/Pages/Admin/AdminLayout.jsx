// import React, { useState } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   FiHome, 
//   FiUsers, 
//   FiPackage, 
//   FiShoppingCart, 
//   FiMenu, 
//   FiX,
//   FiSearch,
//   FiBell,
//   FiSettings,
//   FiLogOut,
//   FiChevronLeft,
//   FiChevronRight,
//   FiBarChart2
// } from 'react-icons/fi';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { path: '/admin/Adashboard', label: 'Dashboard', icon: <FiBarChart2 className="w-5 h-5" /> },
//     { path: '/admin/Ausers', label: 'Users', icon: <FiUsers className="w-5 h-5" /> },
//     { path: '/admin/Aproducts', label: 'Products', icon: <FiPackage className="w-5 h-5" /> },
//     { path: '/admin/Aorders', label: 'Orders', icon: <FiShoppingCart className="w-5 h-5" /> },
//   ];

//   const userMenuItems = [
//     { label: 'Profile', icon: <FiUsers className="w-4 h-4" /> },
//     { label: 'Settings', icon: <FiSettings className="w-4 h-4" /> },
//     { label: 'Logout', path:"login", icon: <FiLogOut className="w-4 h-4" /> },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar Overlay for Mobile */}
//       {!sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed lg:static inset-y-0 left-0 z-30
//         ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
//         bg-white shadow-xl border-r border-gray-200
//         transition-all duration-300 ease-in-out flex flex-col
//       `}>
//         {/* Logo Section */}
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//           {sidebarOpen ? (
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">FC</span>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">FC Barcelona</h1>
//                 <p className="text-xs text-gray-500">Admin Panel</p>
//               </div>
//             </div>
//           ) : (
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
//               <span className="text-white font-bold text-lg">FC</span>
//             </div>
//           )}
          
//           <button 
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <FiX className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <ul className="space-y-2">
//             {menuItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <li key={item.path}>
//                   <button
//                     onClick={() => navigate(item.path)}
//                     className={`
//                       w-full text-left p-3 rounded-xl transition-all duration-200 
//                       flex items-center group relative
//                       ${isActive 
//                         ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' 
//                         : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                       }
//                     `}
//                   >
//                     <div className={`
//                       flex items-center justify-center w-8 h-8 rounded-lg transition-colors
//                       ${isActive 
//                         ? 'bg-blue-100 text-blue-600' 
//                         : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
//                       }
//                     `}>
//                       {item.icon}
//                     </div>
//                     {sidebarOpen && (
//                       <span className="ml-3 font-medium">{item.label}</span>
//                     )}
                    
//                     {/* Active indicator */}
//                     {isActive && sidebarOpen && (
//                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                         <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//                       </div>
//                     )}
                    
//                     {/* Tooltip for collapsed state */}
//                     {!sidebarOpen && (
//                       <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
//                         {item.label}
//                       </div>
//                     )}
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* User Section & Toggle */}
//         <div className="p-4 border-t border-gray-200 space-y-4">
//           {/* User Info */}
//           {sidebarOpen && (
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                 A
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
//                 <p className="text-xs text-gray-500 truncate">admin@fcbarcelona.com</p>
//               </div>
//             </div>
//           )}

//           {/* Toggle Sidebar */}
//           <button 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="w-full p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-900 group"
//           >
//             {sidebarOpen ? (
//               <>
//                 <FiChevronLeft className="w-5 h-5" />
//                 <span className="ml-2 text-sm font-medium">Collapse</span>
//               </>
//             ) : (
//               <FiChevronRight className="w-5 h-5" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden min-w-0">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button 
//                 onClick={() => setSidebarOpen(true)}
//                 className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <FiMenu className="w-5 h-5 text-gray-600" />
//               </button>
              
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900 capitalize">
//                   {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
//                 </h2>
//                 <p className="text-sm text-gray-500 hidden sm:block">
//                   Manage your FC Barcelona store efficiently
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {/* Search */}
//               <div className="relative hidden md:block">
//                 {/* <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
//                 {/* <input 
//                   type="text" 
//                   placeholder="Search..." 
//                   className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 w-64 transition-all"
//                 /> */}
//               </div>

//               {/* Notifications */}
//               <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
//                 <FiBell className="w-5 h-5" />
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                   3
//                 </span>
//               </button>

//               {/* User Dropdown */}
//               <div className="relative">
//                 <button 
//                   onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                   className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                     A
//                   </div>
//                   <div className="hidden lg:block text-left">
//                     <p className="text-sm font-medium text-gray-900">Admin User</p>
//                     <p className="text-xs text-gray-500">Administrator</p>
//                   </div>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {userDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-40">
//                     {userMenuItems.map((item, index) => (
//                       <button
//                         key={index}
//                         className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                       >
//                         {item.icon}
//                         <span>{item.label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Mobile Search */}
//           <div className="mt-4 md:hidden">
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input 
//                 type="text" 
//                 placeholder="Search..." 
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//               />
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
//           <div className="max-w-7xl mx-auto">
//             <Outlet />
//           </div>
//         </main>

//         {/* Footer */}
//         <footer className="bg-white border-t border-gray-200 py-4 px-6">
//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <p>© 2024 FC Barcelona Store. All rights reserved.</p>
//             <div className="flex items-center space-x-4">
//               <button className="hover:text-gray-900 transition-colors">Privacy</button>
//               <button className="hover:text-gray-900 transition-colors">Terms</button>
//               <button className="hover:text-gray-900 transition-colors">Help</button>
//             </div>
//           </div>
//         </footer>
//       </div>

//       {/* Close dropdown when clicking outside */}
//       {userDropdownOpen && (
//         <div 
//           className="fixed inset-0 z-10"
//           onClick={() => setUserDropdownOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminLayout;

// import React, { useState } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   FiHome, 
//   FiUsers, 
//   FiPackage, 
//   FiShoppingCart, 
//   FiMenu, 
//   FiX,
//   FiSearch,
//   FiBell,
//   FiSettings,
//   FiLogOut,
//   FiChevronLeft,
//   FiChevronRight,
//   FiBarChart2
// } from 'react-icons/fi';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { path: '/admin/Adashboard', label: 'Dashboard', icon: <FiBarChart2 className="w-5 h-5" /> },
//     { path: '/admin/Ausers', label: 'Users', icon: <FiUsers className="w-5 h-5" /> },
//     { path: '/admin/Aproducts', label: 'Products', icon: <FiPackage className="w-5 h-5" /> },
//     { path: '/admin/Aorders', label: 'Orders', icon: <FiShoppingCart className="w-5 h-5" /> },
//   ];

//   const userMenuItems = [
//     { label: 'Profile', icon: <FiUsers className="w-4 h-4" />, action: () => {} },
//     { label: 'Settings', icon: <FiSettings className="w-4 h-4" />, action: () => {} },
//     { label: 'Logout', icon: <FiLogOut className="w-4 h-4" />, action: () => handleLogout() },
//   ];

//   const handleLogout = () => {
//     // Add any logout logic here (clear tokens, etc.)
//     navigate('/login');
//     setUserDropdownOpen(false);
//   };

//   const handleUserMenuItemClick = (item) => {
//     if (item.action) {
//       item.action();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar Overlay for Mobile */}
//       {!sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed lg:static inset-y-0 left-0 z-30
//         ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
//         bg-white shadow-xl border-r border-gray-200
//         transition-all duration-300 ease-in-out flex flex-col
//       `}>
//         {/* Logo Section */}
//         <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//           {sidebarOpen ? (
//             <div className="flex items-center space-x-3">
//               <div className="w-15 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
//                 <img src="https://www.shutterstock.com/image-illustration/barcelona-logo-white-background-surabaya-600nw-2403769679.jpg" alt="" className='className="w-15 h-15 object-cover scale-110"' />
//                 {/* <span className="text-white font-bold text-lg">FC</span> */}
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">FC Barcelona</h1>
//                 <p className="text-xs text-gray-500">Admin Panel</p>
//               </div>
//             </div>
//           ) : (
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
//               <span className="text-white font-bold text-lg">FC</span>
//             </div>
//           )}
          
//           <button 
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <FiX className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <ul className="space-y-2">
//             {menuItems.map((item) => {
//               const isActive = location.pathname === item.path;
//               return (
//                 <li key={item.path}>
//                   <button
//                     onClick={() => navigate(item.path)}
//                     className={`
//                       w-full text-left p-3 rounded-xl transition-all duration-200 
//                       flex items-center group relative
//                       ${isActive 
//                         ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' 
//                         : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                       }
//                     `}
//                   >
//                     <div className={`
//                       flex items-center justify-center w-8 h-8 rounded-lg transition-colors
//                       ${isActive 
//                         ? 'bg-blue-100 text-blue-600' 
//                         : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
//                       }
//                     `}>
//                       {item.icon}
//                     </div>
//                     {sidebarOpen && (
//                       <span className="ml-3 font-medium">{item.label}</span>
//                     )}
                    
//                     {/* Active indicator */}
//                     {isActive && sidebarOpen && (
//                       <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                         <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//                       </div>
//                     )}
                    
//                     {/* Tooltip for collapsed state */}
//                     {!sidebarOpen && (
//                       <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
//                         {item.label}
//                       </div>
//                     )}
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* User Section & Toggle */}
//         <div className="p-4 border-t border-gray-200 space-y-4">
//           {/* User Info */}
//           {sidebarOpen && (
//             <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                 A
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
//                 <p className="text-xs text-gray-500 truncate">admin@fcbarcelona.com</p>
//               </div>
//             </div>
//           )}

//           {/* Toggle Sidebar */}
//           <button 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="w-full p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-900 group"
//           >
//             {sidebarOpen ? (
//               <>
//                 <FiChevronLeft className="w-5 h-5" />
//                 <span className="ml-2 text-sm font-medium">Collapse</span>
//               </>
//             ) : (
//               <FiChevronRight className="w-5 h-5" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden min-w-0">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button 
//                 onClick={() => setSidebarOpen(true)}
//                 className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <FiMenu className="w-5 h-5 text-gray-600" />
//               </button>
              
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900 capitalize">
//                   {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
//                 </h2>
//                 <p className="text-sm text-gray-500 hidden sm:block">
//                   Manage your FC Barcelona store efficiently
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {/* Search */}
//               <div className="relative hidden md:block">
//                 {/* <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
//                 {/* <input 
//                   type="text" 
//                   placeholder="Search..." 
//                   className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 w-64 transition-all"
//                 /> */}
//               </div>

//               {/* Notifications */}
//               <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
//                 <FiBell className="w-5 h-5" />
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                   3
//                 </span>
//               </button>

//               {/* User Dropdown */}
//               <div className="relative">
//                 <button 
//                   onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                   className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                     A
//                   </div>
//                   <div className="hidden lg:block text-left">
//                     <p className="text-sm font-medium text-gray-900">Admin User</p>
//                     <p className="text-xs text-gray-500">Administrator</p>
//                   </div>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {userDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-40">
//                     {userMenuItems.map((item, index) => (
//                       <button
//                         key={index}
//                         onClick={() => handleUserMenuItemClick(item)}
//                         className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                       >
//                         {item.icon}
//                         <span>{item.label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Mobile Search */}
//           <div className="mt-4 md:hidden">
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input 
//                 type="text" 
//                 placeholder="Search..." 
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//               />
//             </div>
//           </div>
//         </header>

//         {/* Content Area */}
//         <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
//           <div className="max-w-7xl mx-auto">
//             <Outlet />
//           </div>
//         </main>

//         {/* Footer */}
//         <footer className="bg-white border-t border-gray-200 py-4 px-6">
//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <p>© 2024 FC Barcelona Store. All rights reserved.</p>
//             <div className="flex items-center space-x-4">
//               <button className="hover:text-gray-900 transition-colors">Privacy</button>
//               <button className="hover:text-gray-900 transition-colors">Terms</button>
//               <button className="hover:text-gray-900 transition-colors">Help</button>
//             </div>
//           </div>
//         </footer>
//       </div>

//       {/* Close dropdown when clicking outside */}
//       {userDropdownOpen && (
//         <div 
//           className="fixed inset-0 z-10"
//           onClick={() => setUserDropdownOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminLayout;




import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiPackage, 
  FiShoppingCart, 
  FiMenu, 
  FiX,
  FiSearch,
  FiBell,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiBarChart2
} from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/Adashboard', label: 'Dashboard', icon: <FiBarChart2 className="w-5 h-5" /> },
    { path: '/admin/Ausers', label: 'Users', icon: <FiUsers className="w-5 h-5" /> },
    { path: '/admin/Aproducts', label: 'Products', icon: <FiPackage className="w-5 h-5" /> },
    { path: '/admin/Aorders', label: 'Orders', icon: <FiShoppingCart className="w-5 h-5" /> },
  ];

  const userMenuItems = [
    { label: 'Profile', icon: <FiUsers className="w-4 h-4" />, action: () => {} },
    { label: 'Settings', icon: <FiSettings className="w-4 h-4" />, action: () => {} },
    { label: 'Logout', icon: <FiLogOut className="w-4 h-4" />, action: () => handleLogout() },
  ];

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/login');
    setUserDropdownOpen(false);
  };

  const handleUserMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Overlay for Mobile - Only show when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}
        bg-white shadow-xl border-r border-gray-200
        transition-all duration-300 ease-in-out flex flex-col
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-15 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <img src="https://www.shutterstock.com/image-illustration/barcelona-logo-white-background-surabaya-600nw-2403769679.jpg" alt="" className='className="w-15 h-15 object-cover scale-110"' />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FC Barcelona</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">FC</span>
            </div>
          )}
          
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`
                      w-full text-left p-3 rounded-xl transition-all duration-200 
                      flex items-center group relative
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }
                    `}>
                      {item.icon}
                    </div>
                    {sidebarOpen && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                    
                    {/* Active indicator */}
                    {isActive && sidebarOpen && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section & Toggle */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* User Info */}
          {sidebarOpen && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@fcbarcelona.com</p>
              </div>
            </div>
          )}

          {/* Toggle Sidebar */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 hover:text-gray-900 group"
          >
            {sidebarOpen ? (
              <>
                <FiChevronLeft className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium">Collapse</span>
              </>
            ) : (
              <FiChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Manage your FC Barcelona store efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                {/* Search input removed as per your comment */}
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
                <FiBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-40">
                    {userMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleUserMenuItemClick(item)}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 FC Barcelona Store. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <button className="hover:text-gray-900 transition-colors">Privacy</button>
              <button className="hover:text-gray-900 transition-colors">Terms</button>
              <button className="hover:text-gray-900 transition-colors">Help</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Close dropdown when clicking outside */}
      {userDropdownOpen && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;