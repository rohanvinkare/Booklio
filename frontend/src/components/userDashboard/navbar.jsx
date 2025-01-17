import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

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
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Generate a new random color every time the component mounts
    setRandomColor(getRandomColor());
  }, [userData]);

  return (
    <nav className="bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_1px_0_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/shop" className="text-4xl font-unbounded font-bold text-gray-900">
          Booklio
        </a>
        <ul className="flex space-x-8">
          <li>
            <a
              href="/user/"
              className={`${
                isActive("/user/")
                  ? " p-2 px-4 bg-blue-700 text-white rounded-xl"
                  : " p-2 px-4 bg-blue-700 text-white rounded-xl"
              } transition-all duration-300 ease-in-out`}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/user/orders"
              className={`${
                isActive("/user/orders")
                  ? " p-2 px-4 bg-blue-700 text-white rounded-xl"
                  : " p-2 px-4 bg-blue-700 text-white rounded-xl"
              } transition-all duration-300 ease-in-out`}
            >
              My Orders
            </a>
          </li>
        </ul>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-4 focus:outline-none"
          >
            <Avatar className="w-12 h-12 border-2 border-gray-300">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback
                className="text-3xl font-bold"
                style={{ backgroundColor: randomColor, color: "white" }}
              >
                {userData.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-900">{userData.name}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-300">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-semibold text-gray-900">{userData.name}</p>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
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
