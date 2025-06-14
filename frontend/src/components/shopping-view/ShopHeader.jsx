import { Library } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GradientText from '../ui/GradientText'
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";



function ShoppingHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if both token and role exist in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token && !!role); // Set logged in state based on both token and role
  }, []);

  // Handle logout by clearing the token and role from localStorage
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    toast.success("Logout successful!"); // Show success toast
    navigate("/"); // Redirect to homepage after logout
  };

  return (
    <header className="fixed top-0 z-40 w-full text-white  bg-[#060606]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2">

            {/* <span className="font-bold text-2xl sm:text-3xl md:text-4xl font-unbounded">BOOKLIO</span> */}
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={10}
              showBorder={false}
              className="font-unbounded py-4 text-4xl font-semibold"
            >
              Booklio
            </GradientText>
          </Link>

          {/* Authentication Actions */}
          <div className="flex items-center gap-2 sm:gap-4  ">
            <div>
              <Link to="/user"
              >
                <InteractiveHoverButton>My Account</InteractiveHoverButton>
              </Link>
            </div>
            <div >
              {isLoggedIn ? (
                <a onClick={handleLogout}>
                  <InteractiveHoverButton >Logout</InteractiveHoverButton>
                </a>
              ) : (
                <a
                  className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors"
                  onClick={() => navigate("/auth/login")}
                >
                  Login Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
