import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom'; //  import navigate hook
import '../../../src/App.css';
import Barcavdo1 from '../../assets/Barcavdo1.mp4';

export default function Hero2({ className = '' }) {
  const navigate = useNavigate(); //  initialize navigate

  // Handle navigation on button click
  const handleShopNow = () => {
    navigate('/newera'); // navigate to /newera route
  };

  return (
    <section
      className={`relative w-full h-[680px] overflow-hidden flex items-center justify-center bg-[#171630] ${className}`}
    >
      {/* Background image */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://store.fcbarcelona.com/cdn/shop/files/Main-Banner-3200x2000-NEW-ERA-d.jpg?v=1761753012&width=3840"
        alt="FC Barcelona New Era Collection"
      />

      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black/40 z-5" />

      {/* Content */}
      <div className="relative z-20 text-center flex flex-col items-center gap-3 px-4">
        <h1 className="text-5xl md:text-7xl roboto-condensed font-extrabold uppercase tracking-wider">
          <span className="text-white">FC</span>{' '}
          <span className="text-gray-200">BARCELONA X NEW ERA</span>
        </h1>

        <button
          onClick={handleShopNow} //  click navigates to /newera
          className="bg-[#ffb700] text-[#1a1d3a] px-8 py-3 font-segoe font-bold text-lg rounded-md shadow-lg hover:bg-[#ffe600] hover:-translate-y-1 transition-transform flex items-center gap-3"
        >
          SHOP NOW
          <HiOutlineArrowRight size={22} />
        </button>
      </div>
    </section>
  );
}


