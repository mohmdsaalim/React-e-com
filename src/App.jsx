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






// export default function App() {

//   return (
        
// <AuthProvider>
// <ScrollToTop />
//     <div className="min-h-screen">
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<><Hero /><div className="p-0 m-0 space-y-0 bg-[#171630]">
//           <Example className="mt-[-30px] p-0" />
//           <ScrollVelocity
//             texts={[' MÉS QUE UN CLUB ','VISCA BARÇA']}
//             velocity={150}
//             className="custom-scroll-text mb- [-0px] p-2"
//           />
//           <Hero2 className="mt-8" />

// <div style={{ height: '600px', position: 'relative'}}>
//   <CircularGallery bend={0} textColor="#ffffff" borderRadius={0} scrollEase={0.07}  autoPlay={false}  animate={false}  />
// </div>
//           {/* <CircularGallery/> */}
//           <CardSlider2/>
//         </div></>} />
//         <Route path="/Login" element={<><LoginPage/></>}/>
//         <Route path="/Register" element={<><RegistrationPage/></>}/>
//         <Route path="/Kits" element={<Kits/>}/>
//       <Route path="/profile" element={<ProfilePage />}/>
//       <Route path="/Apparel" element={<Apparel/>}/>
//       <Route path="/Players" element={<PlayersPage />} />
//        <Route path="/product/:category/:id" element={<ProductDetails />} />
//        <Route path="/newera" element={<Newkit/>}/>
//         {/* <Route path="/order" element={<Order/>}/> */}
//         <Route path="/checkout" element={<Checkout/>}/>
//         <Route path="/order-confirmation/:orderId" element={<OrderConfirmation/>}/>
       
//      <Route path="/cart" element={<Cart />}/>
     
 

 
//         </Routes> 
//         <Footer/>
//     </div>

//       </AuthProvider>

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
// import Order from './Pages/Order';
import Checkout from './Pages/Checkout';
import OrderConfirmation from './Pages/OrderConformation';

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <div className="min-h-screen">
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
                    className="custom-scroll-text mb- [-0px] p-2"
                  />
                  <Hero2 className="mt-8" />
                  <div style={{ height: '600px', position: 'relative'}}>
                    <CircularGallery 
                      bend={0} 
                      textColor="#ffffff" 
                      borderRadius={0} 
                      scrollEase={0.07}  
                      autoPlay={false}  
                      animate={false} 
                    />
                  </div>
                  <CardSlider2/>
                </div>
              </>
            } 
          />
          <Route path="/Login" element={<LoginPage/>}/>
          <Route path="/Register" element={<RegistrationPage/>}/>
          <Route path="/Kits" element={<Kits/>}/>
          <Route path="/profile" element={<ProfilePage />}/>
          <Route path="/Apparel" element={<Apparel/>}/>
          <Route path="/Players" element={<PlayersPage />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/newera" element={<Newkit/>}/>
          {/* <Route path="/order" element={<Order/>}/> */}
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation/>}/>
          <Route path="/cart" element={<Cart />}/>
        </Routes> 
        <Footer/>
      </div>
    </AuthProvider>
  );
}