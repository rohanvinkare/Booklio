import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast'
import { Container } from "./Container";
import { useNavigate } from "react-router-dom";

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
            <header id="header" className="bg-backgroundContrast text-white relative z-20">
            <div className="sticky top-0 z-20 bg-backgroundContrast text-white">
                <Container className="flex justify-between items-center min-h-[--header-row-height]">
                    <a href="/">
                        <p className="font-unbounded py-4 text-4xl font-semibold">Booklio</p>
                    </a>
                    {isLoggedIn ? (
                        <a className="text-xs px-2 py-1 rounded cursor-pointer bg-red-600" onClick={handleLogout}>Logout</a>
                    ) : (
                        <a className="text-xs px-2 py-1 rounded cursor-pointer bg-blue-600" onClick={() => navigate("/auth/login")}>Login Now</a>
                    )}
                </Container>
            </div>
            </header>
        </>
    );
};
