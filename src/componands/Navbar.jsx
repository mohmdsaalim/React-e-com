
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { IoGlobeOutline } from "react-icons/io5";
import { useAuth } from "../Context/AuthContext";


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);//for menu bar in mobile
  const location = useLocation();
  const { user } = useAuth();


  const menuItems = [
    { name: "HOME", path: "/" },
    { name: "KITS", path: "/Kits" },
    // { name: "TRAINING", path: "/training" },
    { name: "APPAREL", path: "/apparel" },
    // { name: "MEMORABILIA", path: "/memorabilia" },
    { name: "PLAYERS", path: "/Players" },
  ];

    useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
         } else {
      document.body.style.overflow = "unset";
           }

       return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isHome = location.pathname === "/";

   return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isHome
            ? scrolled
              ? "bg-[#171630] shadow-md backdrop-blur-md"
              : "bg-transparent"
            : "bg-[#171630] shadow-md backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between max-w-[1920px] h-[70px] px-4 sm:px-6 lg:px-10 mx-auto text-white roboto-condensed">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 z-60">
            <img
              src="https://store.fcbarcelona.com/cdn/shop/t/9/assets/logo-simple-white.svg?v=15706832919691285971675422275"
              alt="FC Barcelona"
              className="w-25 h-25 md:w-[120px] md:h-[120px]"
            />
          </Link>

          {/* Desktop Menu Items */}
          <ul className="hidden md:flex gap-10">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-[13px] font-semibold tracking-wide transition-colors duration-300 ${
                      isActive
                        ? "text-[#ffd700]"
                        : "text-white hover:text-[#ffd700]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              to=""
              className="hidden sm:flex items-center gap-2 hover:text-[#ffd700] transition-colors"
            >
              <IoGlobeOutline size={20} />
              <span className="text-sm font-semibold">EN</span>
            </Link>

            {/* <Link to="/kits" className="hover:text-[#ffd700] transition-colors">
              <FiSearch size={20} />
            </Link> */}


            {/* Conditional User Section proffile and login */}

            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-1 hover:text-[#ffd700] transition-colors"
              >
                <FiUser size={20} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-[#ffd700] transition-colors"
              >
                <FiUser size={20} />
              </Link>
            )}

            <Link
              to="/cart"
              className="hover:text-[#ffd700] transition-colors"
            >
              <FiShoppingCart size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 text-white hover:text-[#ffd700] transition-colors z-60"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay - FIXED VERSION */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-[#171630] bg-opacity-95 backdrop-blur-lg z-40 transition-all duration-300 md:hidden ${
            mobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          }`}
          style={{ marginTop: '70px' }} // Push content below navbar
        >
          {/* Mobile Menu Content */}
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Mobile Menu Items */}
            <ul className="flex flex-col items-center gap-2 w-full px-6 py-4">
              {menuItems.map((item) => (
                <li key={item.name} className="w-full text-center">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block text-lg font-bold tracking-wider py-4 transition-all duration-300 border-b border-white/10 ${
                        isActive
                          ? "text-[#ffd700] scale-105"
                          : "text-white hover:text-[#ffd700] hover:scale-105"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile Additional Options */}
            <div className="flex flex-col items-center gap-4 mt-4 px-6 w-full max-w-sm mx-auto pb-8">
              <Link
                to="/language"
                className="flex items-center justify-center gap-3 text-white hover:text-[#ffd700] transition-colors w-full py-3 border border-white/20 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <IoGlobeOutline size={22} />
                <span className="text-base font-semibold">Change Language (EN)</span>
              </Link>

              {/* Mobile User Section */}
              <div className="flex gap-3 w-full">
                {user ? (
                  <Link
                    to="/Profile"
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser size={20} />
                    <span className="font-semibold">Profile</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#a50044] hover:bg-[#8a0038] text-white py-3 rounded-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser size={20} />
                    <span className="font-semibold">Login</span>
                  </Link>
                )}

                <Link
                  to="/cart"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#004d98] hover:bg-[#003366] text-white py-3 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiShoppingCart size={20} />
                  <span className="font-semibold">Cart</span>
                </Link>
              </div>
            </div>

            {/* Club Motto or Footer */}
            <div className="mt-auto text-center text-white/60 py-6">
              <p className="text-sm">Més que un club</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu - REMOVED since we have overlay */}
    </>
  );
};

export default Navbar;