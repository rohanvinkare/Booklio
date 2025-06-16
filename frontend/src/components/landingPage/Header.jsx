import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Container } from "./Container";
import { useNavigate, Link } from "react-router-dom";
import GradientText from "../ui/GradientText";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const navigate = useNavigate();
    const popupRef = useRef(null);

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
        <header className="bg-[#060606] text-white relative z-[60]">
            {/* Sticky only on mobile */}
            <div className="sticky top-0 z-50 bg-[#060606] md:relative md:top-auto">
                <Container className="flex justify-between items-center min-h-[--header-row-height] py-3 px-4">
                    <Link to="/">
                        <GradientText
                            colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                            animationSpeed={10}
                            showBorder={false}
                            className="font-unbounded text-3xl font-semibold"
                        >
                            Booklio
                        </GradientText>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2 text-sm">
                        {isLoggedIn ? (
                            <>
                                <Link to="/user">
                                    <InteractiveHoverButton>My Account</InteractiveHoverButton>
                                </Link>
                                <Link to="/shop">
                                    <InteractiveHoverButton>Store</InteractiveHoverButton>
                                </Link>
                                <button onClick={handleLogout}>
                                    <InteractiveHoverButton>Logout</InteractiveHoverButton>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/shop">
                                    <InteractiveHoverButton>Store</InteractiveHoverButton>
                                </Link>
                                <Link to="/auth/login">
                                    <InteractiveHoverButton>Login Now</InteractiveHoverButton>
                                </Link>
                                <Link to="/auth/register">
                                    <InteractiveHoverButton>Register</InteractiveHoverButton>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setPopupOpen(true)}
                        aria-label="Toggle Menu"
                    >
                        <Menu size={28} />
                    </button>
                </Container>
            </div>

            {/* Backdrop */}
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

                        {/* Slide-in Drawer */}
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
                                {isLoggedIn ? (
                                    <>
                                        <Link to="/user" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">My Account</InteractiveHoverButton>
                                        </Link>
                                        <Link to="/shop" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">Store</InteractiveHoverButton>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setPopupOpen(false);
                                            }}
                                        >
                                            <InteractiveHoverButton className="w-full">Logout</InteractiveHoverButton>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/shop" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">Store</InteractiveHoverButton>
                                        </Link>
                                        <Link to="/auth/login" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">Login</InteractiveHoverButton>
                                        </Link>
                                        <Link to="/auth/register" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">Register</InteractiveHoverButton>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
