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
import Kits from './Pages/Kits';
import CardSlider2 from './Pages/Homepage/Card2';
import { AuthProvider } from './Context/AuthContext';
import ProfilePage from './Pages/Profile';
import Apparel from './Pages/Apparel';
import PlayersPage from './Pages/Players';
import CircularGallery from './Pages/CircularGallery';
import ProductDetails from './Pages/ProductDetails';
// import ProductKits from './Pages/ProductKits';
import Cart from './Pages/Cart';
import Newkit from './Pages/New-era';



export default function App() {

  const [cartItems, setCartItems] = useState([]);
  
  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  
  const handleClear = () => {
    setCartItems([]);
  };

// const handleAddToCart = (product) => {
//   const existing = cartItems.find((item) => item.id === product.id);
//   if (existing) {
//     setCartItems(
//    cartItems.map((item) =>
//         item.id === product.id
//     ? { ...item, quantity: item.quantity + 1 }
//           : item
//       )
//     );
//   }   else {
//     setCartItems([...cartItems, { ...product, quantity: 1 }]);
//   }
// };
  return (
<AuthProvider>

    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<><Hero /><div className="p-0 m-0 space-y-0 bg-[#171630]">
          <Example className="mt-[-30px] p-0" />
          <ScrollVelocity
            texts={[' MÉS QUE UN CLUB ','VISCA BARÇA']}
            velocity={100}
            className="custom-scroll-text mb- [-0px] p-2"
          />
          <Hero2 className="mt-8" />


<div style={{ height: '600px', position: 'relative' }}>
  <CircularGallery bend={0} textColor="#ffffff" borderRadius={0} scrollEase={0.07}  autoPlay={false}  animate={false}  />
</div>
          {/* <CircularGallery/> */}
          <CardSlider2/>
        </div></>} />
        <Route path="/Login" element={<><LoginPage/></>}/>
        <Route path="/Register" element={<><RegistrationPage/></>}/>
        <Route path="/Kits" element={<Kits/>}/>
      <Route path="/profile" element={<ProfilePage />}/>
      <Route path="/Apparel" element={<Apparel/>}/>
      <Route path="/Players" element={<PlayersPage />} />
       <Route path="/product/:category/:id" element={<ProductDetails />} />
       <Route path="/newera" element={<Newkit/>}/>

     <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={handleRemove} clearCart={handleClear}/>}/>
     {/* <Route path="/category/:category" element={<YourCategoryPage />} /> */}
       {/* <Route path="/kits/:id" element={<ProductKits addToCart={(product) => setCartItems([...cartItems, product])} />} /> */}
 

 
        </Routes> 
        <Footer/>
    </div>

      </AuthProvider>
  );
}
