import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import GradientText from "@/components/ui/GradientText";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";



function ShoppingHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token && !!role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    toast.success("Logout successful!");
    navigate("/");
  };

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
    <header className="bg-black text-white fixed top-0 w-full z-[60]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={10}
              showBorder={false}
              className="font-unbounded py-4 text-3xl sm:text-4xl font-semibold"
            >
              Booklio
            </GradientText>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-4">
            {location.pathname !== "/shop" && (
              <Link to="/shop">
                <InteractiveHoverButton>Store</InteractiveHoverButton>
              </Link>
            )}
            {isLoggedIn && location.pathname !== "/user" && (
              <Link to="/user">
                <InteractiveHoverButton>My Account</InteractiveHoverButton>
              </Link>
            )}

            {isLoggedIn ? (
              <button onClick={handleLogout}>
                <InteractiveHoverButton>Logout</InteractiveHoverButton>
              </button>
            ) : (
              <InteractiveHoverButton onClick={() => navigate("/auth/login")}>
                Login Now
              </InteractiveHoverButton>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden text-white"
            onClick={() => setPopupOpen(true)}
            aria-label="Toggle Menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-xs z-50 bg-[#111] shadow-lg p-4 overflow-y-auto rounded-l-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Menu</p>
                <button onClick={() => setPopupOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                {location.pathname !== "/shop" && (
                  <Link to="/shop" onClick={() => setPopupOpen(false)}>
                    <InteractiveHoverButton className="w-full">Store</InteractiveHoverButton>
                  </Link>
                )} {isLoggedIn && location.pathname !== "/user" && (
                  <Link to="/user" onClick={() => setPopupOpen(false)}>
                    <InteractiveHoverButton className="w-full">
                      My Account
                    </InteractiveHoverButton>
                  </Link>
                )}

                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setPopupOpen(false);
                    }}
                  >
                    <InteractiveHoverButton className="w-full">Logout</InteractiveHoverButton>
                  </button>
                ) : (
                  <Link to="/auth/login" onClick={() => setPopupOpen(false)}>
                    <InteractiveHoverButton className="w-full">Login Now</InteractiveHoverButton>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default ShoppingHeader;
