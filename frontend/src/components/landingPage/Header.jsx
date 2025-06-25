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
    const popupRef = useRef(null);
    const navigate = useNavigate();

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

    // Close drawer on outside click
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
            {/* Optional solid background shield */}
            <div className="absolute inset-0 bg-[#060606] z-[-1]" />

            {/* Sticky for mobile */}
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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2 text-sm">
                        {isLoggedIn ? (
                            <>
                                <Link to="/user">
                                    <InteractiveHoverButton>My Account</InteractiveHoverButton>
                                </Link>
                                <Link to="/shop">
                                    <InteractiveHoverButton>Store</InteractiveHoverButton>
                                </Link>
                                <InteractiveHoverButton onClick={handleLogout}>
                                    Logout
                                </InteractiveHoverButton>
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

            {/* Mobile Slide Drawer */}
            <AnimatePresence>
                {popupOpen && (
                    <>
                        {/* Dimmed Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
                            onClick={() => setPopupOpen(false)}
                        />

                        {/* Drawer */}
                        <div
                            ref={popupRef}
                            className={`fixed top-0 right-0 h-full w-[80vw] max-w-xs z-50 bg-[#111] shadow-lg p-4 overflow-y-auto rounded-l-xl transform transition-transform duration-300 ${popupOpen ? "translate-x-0" : "translate-x-full"
                                }`}
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
                                        <InteractiveHoverButton
                                            className="w-full"
                                            onClick={() => {
                                                handleLogout();
                                                setPopupOpen(false);
                                            }}
                                        >
                                            Logout
                                        </InteractiveHoverButton>
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
                        </div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
