import { Library } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
    <>
      <header className="sticky top-0 z-40 w-full text-white border-b bg-background">
        <div className="flex h-20 items-center justify-between px-20 md:px-40">
          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2">
            <Library className="h-6 w-6" />
            <span className="font-extrabold text-4xl font-unbounded">BOOKLIO</span>
          </Link>

          {/* Authentication Actions */}
          <div className="flex justify-around gap-2 items-center">
            <div>
              <a
                className="text-xs px-4 py-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/user")}
              >
                My Account
              </a>
            </div>
            <div>
              {isLoggedIn ? (
                <a
                  className="text-xs px-4 py-2 rounded cursor-pointer bg-red-600 hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              ) : (
                <a
                  className="text-xs px-4 py-2 rounded cursor-pointer bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/auth/login")}
                >
                  Login Now
                </a>
              )}
            </div>
          </div>
        </div>
      </header >
    </>
  );
}

export default ShoppingHeader;
