import { Link } from "react-router-dom";

const FeaturesSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-blue-500">
                    Everything you need in one place
                </h2>
                <p className="mt-2 text-gray-500  max-w-xl mx-auto text-sm sm:text-base">
                    We offer a seamless experience to <strong>Buy</strong> books, <strong>Sell</strong> your old ones, and <strong>Track</strong> every order easily.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* BUY */}
                <Link to="/auth/login" className="text-center group">
                    <div className="flex justify-center items-center w-20 h-20 sm:w-16 sm:h-16 rounded-full mx-auto bg-neutral-800 border-neutral-700 transition-transform group-hover:scale-105">
                        <svg className="w-8 h-8 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
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
                    <h3 className="mt-4 text-lg font-semibold text-white">Buy Books</h3>
                    <div className="mx-10">
                        <p className="mt-1 text-sm text-gray-500 ">Browse, compare, and purchase from thousands of books.</p>
                    </div>
                </Link>

                {/* SELL */}
                <Link to="/auth/seller/login" className="text-center group">
                    <div className="flex justify-center items-center w-20 h-20 sm:w-16 sm:h-16  rounded-full mx-auto bg-neutral-800 border-neutral-700 transition-transform group-hover:scale-105">
                        <svg className="w-8 h-8 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
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
                    <h3 className="mt-4 text-lg font-semibold text-white">Sell Books</h3>
                    <div className="mx-10">
                        <p className="mt-1 text-sm text-gray-500 ">List your old books and earn by selling directly to readers.</p>
                    </div>

                </Link>

                {/* TRACK */}
                <Link to="/auth/login" className="text-center group">
                    <div className="flex justify-center items-center w-20 h-20 sm:w-16 sm:h-16  rounded-full mx-auto bg-neutral-800 border-neutral-700 transition-transform group-hover:scale-105">
                        <svg className="w-8 h-8 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
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
                    <h3 className="mt-4 text-lg font-semibold  text-white">Track Orders</h3>
                    <div className="mx-10">
                        <p className="mt-1 text-sm text-gray-500 ">Stay updated with real-time delivery status of all your orders.</p>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default FeaturesSection;
