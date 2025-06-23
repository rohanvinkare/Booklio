import { Link } from "react-router-dom";

const Mobile_HeroSection = () => {
    return (
        <div className="bg-[linear-gradient(to_bottom,_rgba(138,43,226,0.08)_0%,_rgba(6,6,6,0.6)_60%,_rgba(6,6,6,1)_97%)]">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">

                {/* 📢 Banner */}
                <div className="flex justify-center">
                    <Link
                        to="/shop"
                        className="group inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/10 p-1 ps-4 rounded-full shadow-md focus:outline-none"
                    >
                        <p className="me-2 text-white text-sm">
                            Booklio is live — Join the early wave
                        </p>
                        <span className="group-hover:bg-white/20 py-1.5 px-2.5 flex justify-center items-center gap-x-2 rounded-full bg-white/10 font-semibold text-white text-sm">
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                        </span>
                    </Link>
                </div>

                {/* 🧠 Title */}
                <div className="max-w-3xl text-center mx-auto">
                    <h1
                        className="font-unbounded font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-tight"
                        style={{ animation: "none", transition: "none" }} // ✅ kill LCP delay
                    >
                        Discover, Share & Sell Books Smarter with{" "}
                        <span className="text-violet-300">Booklio</span>
                    </h1>
                </div>

                {/* 💬 Subtitle */}
                <div className="max-w-3xl text-center mx-auto">
                    <p className="text-lg text-white/70 font-sans">
                        Booklio is your community-powered marketplace for rare reads, indie titles, and smart book discovery.
                    </p>
                </div>

                {/* 🚀 CTA */}
                <div className="text-center">
                    <Link
                        to="/shop"
                        className="inline-flex justify-center items-center gap-x-3 bg-gradient-to-tr from-blue-600 to-violet-600 shadow-lg hover:shadow-blue-700/50 border border-transparent text-white text-sm font-medium rounded-full py-3 px-6 transition"
                    >
                        Explore Booklio
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Mobile_HeroSection;
