import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTopBtn = () => {
    const [showButton, setShowButton] = useState(false);

    const handleScroll = () => {
        // Update visibility based on scroll position
        if (window.scrollY > window.innerHeight) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    };

    useEffect(() => {
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClick = () => {
        document.getElementById("header").scrollIntoView({ behavior: "smooth" });
    };

    return (
        showButton && (
            <div
                onClick={handleClick}
                className="fixed bottom-4 right-4 p-2 bg-textBlack outline-1 outline-white rounded-full shadow-lg cursor-pointer hover:bg-backgroundContrast transition-colors duration-500 z-20 flex justify-center items-center"
            >
                <ChevronUp className="text-white" />
            </div>
        )
    );
};
