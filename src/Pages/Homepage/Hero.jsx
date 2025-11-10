import React, { useRef, useEffect, useState } from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi';
import Barcavdo1 from '../../assets/Barcavdo1.mp4';
import '../../../src/App.css';
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showContent, setShowContent] = useState(false);
  
  const handleNavigate = () => {
    navigate("/kits");
  }

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage (-50% to 50%)
      const x = (clientX / innerWidth - 0.8) * 2;
      const y = (clientY / innerHeight - 0.8) * 2;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Show content after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Apply transform to video based on mouse position
  useEffect(() => {
    if (videoRef.current) {
      // Adjust these values to control the intensity of the effect
      const moveX = mousePosition.x * 20; // 20px max movement on X axis
      const moveY = mousePosition.y * 20; // 20px max movement on Y axis
      
      videoRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    }
  }, [mousePosition]);

  return (
    <section className="relative w-full h-[680px] overflow-hidden flex items-center justify-center ">
      {/* Background video with parallax effect */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 ease-out"
        src={Barcavdo1}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Subtle dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center flex flex-col items-center gap-3 px-4">
        <h1 className="text-5xl md:text-7xl roboto-condensed font-extrabold uppercase tracking-wider">
          <span className={`roboto-condensed text-white transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            FC
          </span>{' '}
          <span className={`roboto-condensed text-gray-200 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            BARCELONA
          </span>
        </h1>

        <button 
          onClick={handleNavigate} 
          className={`bg-[#ffbb00] text-[#1a1d3a] px-8 py-3 font-segoe font-bold text-lg rounded-md shadow-lg hover:bg-[#d9ce72] hover:-translate-y-1 transition-all duration-1000 flex items-center gap-3 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
        >
          SHOP NOW
          <HiOutlineArrowRight size={22} />
        </button>
      </div>
    </section>
  );
}