// import React from 'react';
// import { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './componands/Navbar';
// import Hero from './Pages/Homepage/Hero';
// import ScrollVelocity from './Pages/Homepage/Hero1';
// import Example from './Pages/Homepage/Card';
// import Hero2 from './Pages/Homepage/Hero2';
// import Footer from './componands/Footer';
// import LoginPage from './Pages/Login';
// import RegistrationPage from './Pages/Register';
// import Kits from './Pages/category/Kits';
// import CardSlider2 from './Pages/Homepage/Card2';
// import { AuthProvider } from './Context/AuthContext';
// import ProfilePage from './Pages/Profile';
// import Apparel from './Pages/category/Apparel';
// import CircularGallery from './Pages/Homepage/CircularGallery';
// import ProductDetails from './Pages/ProductDetails';
// import Cart from './Pages/Cart';
// import Newkit from './Pages/category/New-era';
// import ScrollToTop from './componands/ScrollTop';
// import PlayersPage from './Pages/Players';
// // import Order from './Pages/Order';
// import Checkout from './Pages/Checkout';
// import OrderConfirmation from './Pages/OrderConformation';


// //admin
// import AdminHome from './Pages/Admin/AdminHome';

// export default function App() {
//   return (
//     <AuthProvider>
//       <ScrollToTop />
//       <div className="min-h-screen">
//         <Navbar />
//         <Routes>
//           <Route 
//             path="/" 
//             element={
//               <>
//                 <Hero />
//                 <div className="p-0 m-0 space-y-0 bg-[#171630]">
//                   <Example className="mt-[-30px] p-0" />
//                   <ScrollVelocity
//                     texts={[' MÉS QUE UN CLUB ','VISCA BARÇA']}
//                     velocity={150}
//                     className="custom-scroll-text mb- [-0px] p-2"
//                   />
//                   <Hero2 className="mt-8" />
//                   <div style={{ height: '600px', position: 'relative'}}>
//                     <CircularGallery 
//                       bend={0} 
//                       textColor="#ffffff" 
//                       borderRadius={0} 
//                       scrollEase={0.07}  
//                       autoPlay={false}  
//                       animate={false} 
//                     />
//                   </div>
//                   <CardSlider2/>
//                 </div>
//               </>
//             } 
//           />
//           <Route path="/Login" element={<LoginPage/>}/>
//           <Route path="/Register" element={<RegistrationPage/>}/>
//           <Route path="/Kits" element={<Kits/>}/>
//           <Route path="/profile" element={<ProfilePage />}/>
//           <Route path="/Apparel" element={<Apparel/>}/>
//           <Route path="/Players" element={<PlayersPage />} />
//           <Route path="/product/:category/:id" element={<ProductDetails />} />
//           <Route path="/newera" element={<Newkit/>}/>
//           {/* <Route path="/order" element={<Order/>}/> */}
//           <Route path="/checkout" element={<Checkout/>}/>
//           <Route path="/order-confirmation/:orderId" element={<OrderConfirmation/>}/>
//           <Route path="/cart" element={<Cart />}/>
//         </Routes> 
//         <Footer/>
//       </div>
//     </AuthProvider>





//   );
// }



import React from 'react';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './componands/Navbar';
import Hero from './Pages/Homepage/Hero';
import ScrollVelocity from './Pages/Homepage/Hero1';
import Example from './Pages/Homepage/Card';
import Hero2 from './Pages/Homepage/Hero2';
import Footer from './componands/Footer';
import LoginPage from './Pages/Login';
import RegistrationPage from './Pages/Register';
import Kits from './Pages/category/Kits';
import CardSlider2 from './Pages/Homepage/Card2';
import { AuthProvider } from './Context/AuthContext';
import ProfilePage from './Pages/Profile';
import Apparel from './Pages/category/Apparel';
import CircularGallery from './Pages/Homepage/CircularGallery';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Newkit from './Pages/category/New-era';
import ScrollToTop from './componands/ScrollTop';
import PlayersPage from './Pages/Players';
import Checkout from './Pages/Checkout';
import OrderConfirmation from './Pages/OrderConformation';


// Admin Components
import AdminLayout from './Pages/Admin/AdminLayout'; // You'll need to create this
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminHome from './Pages/Admin/AdminHome';
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminProducts from './Pages/Admin/AdminProducts';
import AdminOrders from './Pages/Admin/AdminOrders';




export default function App() {
  return (
    <AuthProvider>
     <ScrollToTop />
      
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes with Navbar & Footer */}
          <Route path="/*" element={
            <>
            
              <Navbar />
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <>
                     
                      <Hero />
                      <div className="p-0 m-0 space-y-0 bg-[#171630]">
                        <Example className="mt-[-30px] p-0" />
                        <ScrollVelocity
                          texts={[' MÉS QUE UN CLUB ','VISCA BARÇA']}
                          velocity={150}
                          className="custom-scroll-text mb- [-0px] p-4"
                        />
                        <Hero2 className="mt-1" />
                        <div style={{ height: '600px', position: 'relative', backgroundColor: 'black'}}>
                          <CircularGallery 
                            bend={1} 
                            textColor="#ffffff" 
                            borderRadius={0} 
                            scrollEase={0.10}  
                            />
                        </div>
                        <CardSlider2/>
                      </div>
                   
                    </>
                  } 
                  />
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegistrationPage/>}/>
                <Route path="/kits" element={<Kits/>}/>
                <Route path="/profile" element={<ProfilePage />}/>
                <Route path="/apparel" element={<Apparel/>}/>
                <Route path="/players" element={<PlayersPage />} />
                <Route path="/product/:category/:id" element={<ProductDetails />} />
                <Route path="/newera" element={<Newkit/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation/>}/>
                <Route path="/cart" element={<Cart />}/>
              </Routes>
              <Footer/>
              
            </>
          }/>
          
    <Route path="/admin/*" element={<AdminLayout />}>   
<Route index element={<AdminHome />} />
<Route path="Adashboard" element={<AdminDashboard/>}/>
<Route path="Aorders" element={<AdminOrders />} />
<Route path="Aproducts" element={<AdminProducts />} />
<Route path="Ausers" element={<AdminUsers />} />
</Route>
        {/* <Route path="/admin/*" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminHome />} />
  </Route> */}
    

        </Routes>
      </div>

    </AuthProvider>
  );
}