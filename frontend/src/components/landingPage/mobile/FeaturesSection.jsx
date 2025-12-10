import { Link } from "react-router-dom";

const FeaturesSection = () => {
    return (
        <section className="w-full bg-gradient-to-b from-black via-[#0d0b1e] to-black py-16 px-4 sm:px-6 lg:px-8 text-white">
            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#38bdf8]">
                    Everything you need in one place
                </h2>
                <p className="mt-2 text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                    We offer a seamless experience to <strong>Buy</strong> books, <strong>Sell</strong> your old ones, and <strong>Track</strong> every order easily.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {/* BUY */}
                <Link to="/auth/login" className="text-center group hover:scale-[1.02] transition-all duration-300">
                    <div className="bg-gradient-to-b from-[#0d0b1e]/60 to-[#060606] p-6 rounded-2xl border border-neutral-800 shadow-lg hover:shadow-[0_0_16px_#60a5fa33] transition-all">
                        <div className="flex justify-center items-center w-20 h-20 rounded-full mx-auto bg-neutral-800 border border-neutral-700">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                <defs>
                                    <linearGradient id="grad-buy" x1="0" y1="0" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#7c3aed" />
                                        <stop offset="100%" stopColor="#60a5fa" />
                                    </linearGradient>
                                </defs>
                                <path d="M6 6h15l-1.5 9h-13L4 4H2" stroke="url(#grad-buy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="9" cy="20" r="1" stroke="url(#grad-buy)" />
                                <circle cx="18" cy="20" r="1" stroke="url(#grad-buy)" />
                            </svg>
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-white">Buy Books</h3>
                        <p className="mt-2 text-sm text-gray-400">Browse, compare, and purchase from thousands of books.</p>
                    </div>
                </Link>

                {/* SELL */}
                <Link to="/auth/seller/login" className="text-center group hover:scale-[1.02] transition-all duration-300">
                    <div className="bg-gradient-to-b from-[#0d0b1e]/60 to-[#060606] p-6 rounded-2xl border border-neutral-800 shadow-lg hover:shadow-[0_0_16px_#38bdf833] transition-all">
                        <div className="flex justify-center items-center w-20 h-20 rounded-full mx-auto bg-neutral-800 border border-neutral-700">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                <defs>
                                    <linearGradient id="grad-sell" x1="0" y1="0" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#38bdf8" />
                                    </linearGradient>
                                </defs>
                                <path d="M3 3h18v4H3z" stroke="url(#grad-sell)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 21H8a2 2 0 01-2-2V7h12v12a2 2 0 01-2 2z" stroke="url(#grad-sell)" strokeWidth="2" />
                            </svg>
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-white">Sell Books</h3>
                        <p className="mt-2 text-sm text-gray-400">List your old books and earn by selling directly to readers.</p>
                    </div>
                </Link>

                {/* TRACK */}
                <Link to="/auth/login" className="text-center group hover:scale-[1.02] transition-all duration-300">
                    <div className="bg-gradient-to-b from-[#0d0b1e]/60 to-[#060606] p-6 rounded-2xl border border-neutral-800 shadow-lg hover:shadow-[0_0_16px_#9333ea33] transition-all">
                        <div className="flex justify-center items-center w-20 h-20 rounded-full mx-auto bg-neutral-800 border border-neutral-700">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                <defs>
                                    <linearGradient id="grad-track" x1="0" y1="0" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#9333ea" />
                                        <stop offset="100%" stopColor="#4f46e5" />
                                    </linearGradient>
                                </defs>
                                <path d="M3 3h18v6H3z" stroke="url(#grad-track)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 21h6M12 18v3M5 9v12h14V9" stroke="url(#grad-track)" strokeWidth="2" />
                            </svg>
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-white">Track Orders</h3>
                        <p className="mt-2 text-sm text-gray-400">Stay updated with real-time delivery status of all your orders.</p>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default FeaturesSection;
