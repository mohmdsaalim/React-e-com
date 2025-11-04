import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi';
import Barcavdo1 from '../assets/Barcavdo1.mp4';
import '../App.css';
import { useNavigate } from "react-router-dom";


export default function Hero() {
  
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate("/kits");
  }
  return (
    <section className="relative w-full h-[680px] overflow-hidden flex items-center justify-center ">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={Barcavdo1}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black/40 z-5" />

      {/* Content */}
      <div className="relative z-20 text-center flex flex-col items-center gap-3 px-4">
        <h1 className="text-5xl md:text-7xl roboto-condensed font-extrabold uppercase tracking-wider">
          <span className="roboto-condensed text-white">FC</span>{' '}
          <span className="roboto-condensed text-gray-200">BARCELONA</span>
        </h1>

        <button onClick={handleNavigate} className="bg-[#ffb700] text-[#1a1d3a] px-8 py-3 font-segoe font-bold text-lg rounded-md shadow-lg hover:bg-[#ffe600] hover:-translate-y-1 transition-transform flex items-center gap-3">
          SHOP NOW
          <HiOutlineArrowRight size={22} />
        </button>
      </div>
    </section>
  );
}