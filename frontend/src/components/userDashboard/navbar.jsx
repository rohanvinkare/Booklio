import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { FaArrowCircleRight, FaShoppingBasket } from "react-icons/fa";
import GradientText from '../ui/GradientText.jsx'
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Link } from "react-router-dom";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [randomColor, setRandomColor] = useState(getRandomColor());
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Generate a new random color every time the component mounts
    setRandomColor(getRandomColor());
  }, [userData]);

  return (
    <nav className="bg-[#060606] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_1px_0_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-4 sm:gap-0">
          {/* Logo */}
          {/* 
          <div className="flex items-center">
            <a href="/shop" className="text-2xl sm:text-3xl md:text-4xl font-unbounded font-bold text-white">
              Booklio
            </a>
          </div> */}

          <Link to="/shop">
            {/* <p className="font-unbounded py-4 text-4xl font-semibold">Booklio</p> */}

            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={10}
              showBorder={false}
              className="font-unbounded py-4 text-4xl font-semibold"
            >
              Booklio
            </GradientText>
          </Link>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <ul className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <li>
                <Link
                  to="/user"
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded cursor-pointer transition-colors ${location.pathname === "/user" ? "hidden" : ""
                    } ${isActive("/user") ? "bg-blue-600" : "bg-blue-600"}`}
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/listing"
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded cursor-pointer transition-colors ${isActive("/shop/listing") ? "bg-blue-700" : "bg-blue-600"
                    } text-white`}
                >
                  Shop
                  <FaArrowCircleRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </li>
              <li>
                <a onClick={handleLogout} >
                  <InteractiveHoverButton > Logout</InteractiveHoverButton>
                </a>


              </li>
            </ul>
          </div>
        </div>
      </div>
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