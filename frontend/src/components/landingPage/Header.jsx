import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast'
import { Container } from "./Container";
import { useNavigate } from "react-router-dom";
import GradientText from '../ui/GradientText'
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";


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
                        <a href="/">
                            {/* <p className="font-unbounded py-4 text-4xl font-semibold">Booklio</p> */}

                            <GradientText
                                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                                animationSpeed={10}
                                showBorder={false}
                                className="font-unbounded py-4 text-4xl font-semibold"
                            >
                                Booklio
                            </GradientText>
                        </a>
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-2 text-sm">
                                <a onClick={() => navigate("/user")}>
                                    <InteractiveHoverButton>My Account</InteractiveHoverButton>
                                </a>
                                <a onClick={() => navigate("/shop")} >
                                    <InteractiveHoverButton> Store</InteractiveHoverButton>
                                </a>
                                <a onClick={handleLogout} >
                                    <InteractiveHoverButton>Logout</InteractiveHoverButton>
                                </a>
                            </div>

                        ) : (

                            <div className="flex items-center space-x-2 text-sm">
                                <a onClick={() => navigate("/shop")} >
                                    <InteractiveHoverButton> Store</InteractiveHoverButton>
                                </a>
                                <a onClick={() => navigate("/auth/login")}>
                                    <InteractiveHoverButton className=" text-white">Login Now</InteractiveHoverButton></a>
                                <a onClick={() => navigate("/auth/register")}>
                                    <InteractiveHoverButton className=" text-white">Register</InteractiveHoverButton></a>
                            </div>

                        )}
                    </Container>
                </div>
            </header>
        </>
    );
};


