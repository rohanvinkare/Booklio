import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Container } from "./Container";
import { useNavigate, Link } from "react-router-dom";
import GradientText from "../ui/GradientText";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
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

    const AuthButtons = () => (
        <>
            <Link to="/auth/login">
                <InteractiveHoverButton>Login as User</InteractiveHoverButton>
            </Link>
            <Link to="/auth/register">
                <InteractiveHoverButton>Register as User</InteractiveHoverButton>
            </Link>
            <Link to="/auth/seller/login">
                <InteractiveHoverButton>Login as Seller</InteractiveHoverButton>
            </Link>
            <Link to="/auth/seller/register">
                <InteractiveHoverButton>Register as Seller</InteractiveHoverButton>
            </Link>
        </>
    );

    const LoggedInButtons = () => (
        <>

            <InteractiveHoverButton
                onClick={() => {
                    const role = localStorage.getItem("role");
                    if (role === "seller") navigate("/seller");
                    else navigate("/user");
                }}
            >
                My Account
            </InteractiveHoverButton>



            <InteractiveHoverButton onClick={handleLogout}>Logout</InteractiveHoverButton>
        </>
    );

    return (
        // <header className="sticky top-0  text-gray-200 z-[60]">

        //     <div className="z-50 bg-tr md:relative md:top-auto">
        //         <Container className="flex justify-between items-center py-3 px-4">

        <header className="text-white relative z-[60]">
            {/* Optional solid background shield */}
            <div className="absolute inset-0 z-[-1]" />

            {/* Sticky for mobile */}
            <div className="sticky top-0 z-50 md:relative md:top-auto">
                <Container className="flex justify-between items-center min-h-[--header-row-height] py-6 px-1">
                    <Link to="/">
                        <GradientText
                            colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                            animationSpeed={10}
                            showBorder={false}
                            className="font-unbounded text-4xl font-semibold"
                        >
                            Booklio
                        </GradientText>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center space-x-2 text-sm">
                        {isLoggedIn ? <LoggedInButtons /> : <AuthButtons />}
                    </div>

                    {/* Hamburger */}
                    <button className="md:hidden text-gray-200" onClick={() => setPopupOpen(true)} aria-label="Toggle Menu">
                        <Menu size={28} />
                    </button>
                </Container>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {popupOpen && (
                    <>
                        <div className="fixed inset-0  z-40" onClick={() => setPopupOpen(false)} />
                        <div
                            ref={popupRef}
                            className="fixed top-0 right-0 h-full w-[80vw] max-w-xs z-50  shadow-lg p-4 overflow-y-auto rounded-l-xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-lg font-semibold text-sky-400">Menu</p>
                                <button onClick={() => setPopupOpen(false)}><X size={22} /></button>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {isLoggedIn ? (
                                    <>
                                        <InteractiveHoverButton
                                            className="w-full"
                                            onClick={() => {
                                                const role = localStorage.getItem("role");
                                                setPopupOpen(false);
                                                navigate(role === "seller" ? "/seller" : "/user");
                                            }}
                                        >
                                            My Account
                                        </InteractiveHoverButton>



                                        <InteractiveHoverButton className="w-full" onClick={() => { handleLogout(); setPopupOpen(false); }}>
                                            Logout
                                        </InteractiveHoverButton>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/auth/login" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">Login as User</InteractiveHoverButton>
                                        </Link>
                                        <Link to="/auth/register" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">Register as User</InteractiveHoverButton>
                                        </Link>
                                        <Link to="/auth/seller/login" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">Login as Seller</InteractiveHoverButton>
                                        </Link>
                                        <Link to="/auth/seller/register" onClick={() => setPopupOpen(false)}>
                                            <InteractiveHoverButton className="w-full">Register as Seller</InteractiveHoverButton>
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

