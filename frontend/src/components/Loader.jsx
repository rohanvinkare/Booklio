import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

export default function Loader() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 1000); // Show for 1 sec
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center bg-white/30 dark:bg-black overflow-hidden">
            {/* Grid Background */}
            <div
                className={cn(
                    "absolute inset-0",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
                )}
            />

            {/* Radial Mask for fade effect */}
            <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

            {/* Spinner */}
            <div className="relative z-20 mb-6 h-14 w-14 animate-spin rounded-full border-4 border-t-[#002F9E] border-white dark:border-[#1a1a1a] dark:border-t-[#002F9E]" />

            {/* Gradient Loading Text */}
            <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-3xl sm:text-5xl font-bold text-transparent animate-pulse">
                Loading...
            </p>
        </div>
    );
}
