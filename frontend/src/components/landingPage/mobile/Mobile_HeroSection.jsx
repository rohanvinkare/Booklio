// import { Link } from "react-router-dom";

// const Mobile_HeroSection = () => {
//     return (
//         <div className="bg-gradient-to-b from-black via-[#0d0b1e] to-black">
//             <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">

//                 {/* 📢 Banner */}
//                 <div className="flex justify-center">
//                     <Link
//                         to="/shop"
//                         className="group inline-flex items-center bg-gradient-to-r from-[#7928CA]/20 to-[#FF0080]/20 hover:from-[#7928CA]/30 hover:to-[#FF0080]/30 border border-white/10 p-1 ps-4 rounded-full shadow-md backdrop-blur-lg transition-all"
//                     >
//                         <p className="me-2 text-white text-sm">
//                             Booklio is live — Join the early wave
//                         </p>
//                         <span className="group-hover:bg-white/10 py-1.5 px-2.5 flex justify-center items-center gap-x-2 rounded-full bg-white/5 font-semibold text-white text-sm transition-all">
//                             <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
//                         </span>
//                     </Link>
//                 </div>

//                 {/* 🧠 Title */}
//                 <div className="max-w-3xl text-center mx-auto">

//                     {/* <h1
//                         className="font-unbounded font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-tight"
//                     >
//                         Discover, Share & Sell Books Smarter with{" "}
//                         <span className="bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#38bdf8] text-transparent bg-clip-text">
//                             Booklio
//                         </span>
//                     </h1> */}

//                     <h1
//                         className="font-bold text-white text-4xl sm:text-5xl md:text-6xl tracking-tight min-h-[3.5rem] sm:min-h-[4rem] md:min-h-[5rem] font-sans"
//                     >
//                         Discover, Share & Sell Books Smarter with{" "}
//                         <span className="bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#38bdf8] text-transparent bg-clip-text">
//                             Booklio
//                         </span>
//                     </h1>

//                 </div>




//                 {/* 💬 Subtitle */}
//                 <div className="max-w-3xl text-center mx-auto">
//                     <p className="text-lg text-white/70 font-sans">
//                         Booklio is your community-powered marketplace for rare reads, indie titles, and smart book discovery.
//                     </p>
//                 </div>

//                 {/* 🚀 CTA */}
//                 <div className="text-center">
//                     <Link
//                         to="/shop"
//                         className="inline-flex justify-center items-center gap-x-3 bg-gradient-to-tr from-[#0070F3] via-[#7928CA] to-[#FF0080] shadow-xl hover:shadow-[0_0_20px_#FF0080] text-white text-sm font-medium rounded-full py-3 px-6 transition duration-300"
//                     >
//                         Explore Booklio
//                         <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
//                     </Link>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default Mobile_HeroSection;



import { Link } from "react-router-dom";

const Mobile_HeroSection = () => {
    return (
        <div className="bg-gradient-to-b from-black via-[#0d0b1e] to-black">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">

                {/* 📢 Banner */}
                <div className="flex justify-center">
                    <Link
                        to="/shop"
                        className="group inline-flex items-center bg-gradient-to-r from-[#7928CA]/20 to-[#FF0080]/20 hover:from-[#7928CA]/30 hover:to-[#FF0080]/30 border border-white/10 p-1 ps-4 rounded-full shadow-md backdrop-blur-lg transition-all"
                    >
                        <p className="me-2 text-white text-sm">
                            Booklio is live — Join the early wave
                        </p>
                        <span className="group-hover:bg-white/10 py-1.5 px-2.5 flex justify-center items-center gap-x-2 rounded-full bg-white/5 font-semibold text-white text-sm transition-all">
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                        </span>
                    </Link>
                </div>

                {/* 🧠 Optimized Title */}
                <div className="max-w-3xl text-center mx-auto">
                    <h1
                        className="text-white text-[2.25rem] leading-tight font-bold tracking-tight font-sans"
                        style={{
                            fontFamily: `'Unbounded', system-ui, sans-serif`,
                            fontDisplay: "swap",
                            marginBottom: "0",
                            minHeight: "3.5rem",
                        }}
                    >
                        Discover, Share & Sell Books Smarter with{" "}
                        <span className="bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#38bdf8] text-transparent bg-clip-text">
                            Booklio
                        </span>
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
                        className="inline-flex justify-center items-center gap-x-3 bg-gradient-to-tr from-[#0070F3] via-[#7928CA] to-[#FF0080] shadow-xl hover:shadow-[0_0_20px_#FF0080] text-white text-sm font-medium rounded-full py-3 px-6 transition duration-300"
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
