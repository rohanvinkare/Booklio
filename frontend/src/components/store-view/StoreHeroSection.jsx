import { Link } from "react-router-dom";

const StoreHeroSection = () => {
    return (
        <div className="my-9 text-white font-sans">
            <section className="py-12 sm:py-16 lg:py-24">
                <div className="max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8 items-center">
                    {/* Left Text Content */}
                    <div className="text-center lg:text-left">
                        <p className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">
                            Welcome to Booklio
                        </p>
                        <h1 className="mt-4 text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                            Your journey to World of Books starts here
                        </h1>
                        <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
                            Discover curated resources, connect with mentors, and elevate your learning All in one platform.
                        </p>

                        {/* CTA Button */}
                        <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center lg:justify-start sm:space-x-4">
                            <Link
                                to="/shop/listing"
                                className="inline-flex items-center justify-center px-6 py-3 font-semibold bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition duration-150 w-full sm:w-auto"
                            >
                                Explore Store
                                <svg
                                    className="w-5 h-5 ml-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>

                            <p className="mt-4 sm:mt-0 text-gray-400 text-sm">
                                Looking for something else?{" "}
                                <Link to="/user" className="underline hover:text-yellow-300 transition">
                                    Go to Dashboard
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="w-full">
                        <img
                            src="https://res.cloudinary.com/djwfg6dgl/image/upload/v1750761684/Store-view_suux8j.webp"
                            alt="Learning Hero"
                            className="w-full h-auto rounded-xl max-w-md mx-auto lg:max-w-full"

                            decoding="async"
                            width={600}
                            height={400}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StoreHeroSection;

