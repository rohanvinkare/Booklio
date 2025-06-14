import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast'
import { Container } from "./Container";
import { useNavigate } from "react-router-dom";
import GradientText from '../ui/GradientText'
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { Link } from "react-router-dom";


export const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check if both token and role exist in localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");
        setIsLoggedIn(!!token && !!role);
    }, []);

    // Handle logout by clearing the token and role from localStorage
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        toast.success("Logout successful!");
        navigate("/"); // Redirect to homepage after logout
    };


    return (
        <>
            <header id="header" className="bg-[#060606] text-white relative z-20">
                <div className="sticky top-0 z-20 bg-[#060606] text-white">
                    <Container className="flex justify-between items-center min-h-[--header-row-height]">
                        <Link to="/">
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
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-2 text-sm">
                                <Link to="/user">
                                    <InteractiveHoverButton>My Account</InteractiveHoverButton>
                                </Link>
                                <Link to="/shop">
                                    <InteractiveHoverButton>Store</InteractiveHoverButton>
                                </Link>
                                <button onClick={handleLogout}>
                                    <InteractiveHoverButton>Logout</InteractiveHoverButton>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-sm">
                                <Link to="/shop">
                                    <InteractiveHoverButton>Store</InteractiveHoverButton>
                                </Link>
                                <Link to="/auth/login">
                                    <InteractiveHoverButton className=" text-white">Login Now</InteractiveHoverButton>
                                </Link>
                                <Link to="/auth/register">
                                    <InteractiveHoverButton className=" text-white">Register</InteractiveHoverButton>
                                </Link>
                            </div>
                        )}

                    </Container>
                </div>
            </header>
        </>
    );
};


