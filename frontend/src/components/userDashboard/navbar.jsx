import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import { FaArrowCircleRight } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import GradientText from "../ui/GradientText.jsx";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { motion, AnimatePresence } from "framer-motion";

// Utility function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Navbar = ({ userData }) => {
  const [randomColor, setRandomColor] = useState(getRandomColor());
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setRandomColor(getRandomColor());
  }, [userData]);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    };
    if (popupOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popupOpen]);

  return (
    <nav className="bg-[#060606] text-white shadow-md sticky top-0 z-[60]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/shop">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={10}
            showBorder={false}
            className="font-unbounded text-3xl font-semibold"
          >
            Booklio
          </GradientText>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden sm:flex gap-4 items-center text-sm">
          {location.pathname !== "/user" && (
            <li>
              <Link
                to="/user"
                className={`px-4 py-2 rounded ${isActive("/user") ? "bg-blue-600" : "bg-blue-500"}`}
              >
                My Account
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/shop/listing"
              className={`px-4 py-2 rounded flex items-center gap-2 ${isActive("/shop/listing") ? "bg-blue-700" : "bg-blue-600"}`}
            >
              Shop <FaArrowCircleRight className="w-4 h-4" />
            </Link>
          </li>
          <li>
            <button onClick={handleLogout}>
              <InteractiveHoverButton>Logout</InteractiveHoverButton>
            </button>
          </li>
        </ul>

        {/* Hamburger button - Mobile only */}
        <button
          className="sm:hidden text-white"
          onClick={() => setPopupOpen(true)}
          aria-label="Toggle Menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Popup drawer for mobile */}
      <AnimatePresence>
        {popupOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPopupOpen(false)}
            />
            <motion.div
              ref={popupRef}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-xs z-50 bg-[#111] shadow-lg p-4 overflow-y-auto rounded-l-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Menu</p>
                <button onClick={() => setPopupOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                {location.pathname !== "/user" && (
                  <Link to="/user" onClick={() => setPopupOpen(false)}>
                    <InteractiveHoverButton className="w-full">My Account</InteractiveHoverButton>
                  </Link>
                )}
                <Link to="/shop/listing" onClick={() => setPopupOpen(false)}>
                  <InteractiveHoverButton className="w-full">Shop</InteractiveHoverButton>
                </Link>
                {/* <button
                  onClick={() => {
                    handleLogout();
                    setPopupOpen(false);
                  }}
                >
                  <InteractiveHoverButton className="w-full">Logout</InteractiveHoverButton>
                </button> */}
                <InteractiveHoverButton
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setPopupOpen(false);
                  }}
                >
                  Logout
                </InteractiveHoverButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

Navbar.propTypes = {
  userData: PropTypes.shape({
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default Navbar;
