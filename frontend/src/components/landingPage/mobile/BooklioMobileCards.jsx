// "use client";
// import { Link } from "react-router-dom";

// const cardData = [
//     {
//         title: "Boosted Reading Engagement",
//         percentage: "47%",
//         description:
//             "Booklio has increased daily reading time among users by integrating personalized book recommendations and interactive summaries.",
//         iconColor: "#C084FC", // Neon Purple
//         glowColor: "#9333EA",
//         link: "/shop",
//     },
//     {
//         title: "30% Growth in Book Sales",
//         percentage: "30%",
//         description:
//             "By connecting authors with targeted audiences, Booklio has helped independent writers grow their reach and revenue significantly.",
//         iconColor: "#22D3EE", // Neon Cyan
//         glowColor: "#06B6D4",
//         link: "/shop",
//     },
//     {
//         title: "Frictionless Discovery",
//         percentage: "15%",
//         description:
//             "Our smart search and swipeable previews reduce time-to-read by surfacing the right book faster, tailored to user mood and genre.",
//         iconColor: "#F472B6", // Neon Rose
//         glowColor: "#DB2777",
//         link: "/shop",
//     },
// ];

// const BooklioMobileCards = () => {
//     return (
//         <div className="w-full px-4 py-10 bg-[#060606] text-white rounded-t-3xl">
//             <div className="grid grid-cols-1 gap-6">
//                 {cardData.map((card, idx) => (
//                     <Link
//                         key={idx}
//                         to={card.link}
//                         className="relative z-10 p-5 flex flex-col rounded-xl shadow-xl transition group overflow-hidden"
//                         style={{
//                             backgroundColor: "#000000",
//                             backgroundImage: `linear-gradient(135deg, ${card.glowColor}22 0%, transparent 20%)`,
//                             border: "1px solid rgba(255,255,255,0.05)",
//                         }}
//                     >
//                         {/* Optional soft blur overlay */}
//                         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent blur-2xl opacity-10 pointer-events-none z-0" />

//                         {/* Icon + Stat */}
//                         <div className="flex items-center justify-start space-x-4 mb-4 z-10">
//                             <div
//                                 className="h-10 w-10 rounded-full shadow-lg"
//                                 style={{
//                                     background: `radial-gradient(circle at 30% 30%, ${card.iconColor}, #000000)`,
//                                     boxShadow: `0 0 12px ${card.iconColor}`,
//                                 }}
//                             ></div>
//                             <p className="text-4xl font-bold">{card.percentage}</p>
//                         </div>

//                         {/* Title & Description */}
//                         <h3 className="text-lg font-semibold z-10">{card.title}</h3>
//                         <p className="mt-2 text-sm text-neutral-300 z-10">{card.description}</p>

//                         {/* CTA */}
//                         <span className="mt-auto pt-4 text-yellow-300 text-sm font-medium border-b-2 border-neutral-700 group-hover:border-yellow-300 transition z-10">
//                             Learn more
//                         </span>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BooklioMobileCards;



"use client";
import { Link } from "react-router-dom";

const cardData = [
    {
        title: "Boosted Reading Engagement",
        percentage: "47%",
        description:
            "Booklio has increased daily reading time among users by integrating personalized book recommendations and interactive summaries.",
        iconColor: "#C084FC",
        glowColor: "#9333EA",
        link: "/shop",
    },
    {
        title: "30% Growth in Book Sales",
        percentage: "30%",
        description:
            "By connecting authors with targeted audiences, Booklio has helped independent writers grow their reach and revenue significantly.",
        iconColor: "#22D3EE",
        glowColor: "#06B6D4",
        link: "/shop",
    },
    {
        title: "Frictionless Discovery",
        percentage: "15%",
        description:
            "Our smart search and swipeable previews reduce time-to-read by surfacing the right book faster, tailored to user mood and genre.",
        iconColor: "#F472B6",
        glowColor: "#DB2777",
        link: "/shop",
    },
];

const BooklioMobileCards = () => {
    return (
        <div className="w-full px-4 py-10 bg-gradient-to-b from-black via-[#0d0b1e] to-black text-white rounded-t-3xl">
            <div className="grid grid-cols-1 gap-6">
                {cardData.map((card, idx) => (
                    <Link
                        key={idx}
                        to={card.link}
                        className="relative z-10 p-5 flex flex-col rounded-xl border border-white/10 shadow-lg backdrop-blur-md overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
                        style={{
                            backgroundColor: "#000000",
                            backgroundImage: `linear-gradient(135deg, ${card.glowColor}1A 0%, transparent 50%)`,
                        }}
                    >
                        {/* Glow Overlay */}
                        <div className="absolute -inset-1 rounded-xl z-0 bg-gradient-to-br from-transparent to-black blur-lg opacity-30" />
                        {/* Aurora Pulse Ring */}
                        <div
                            className="absolute -top-4 -left-4 w-24 h-24 bg-opacity-20 blur-2xl animate-pulse rounded-full"
                            style={{ backgroundColor: card.iconColor }}
                        />
                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className="h-10 w-10 rounded-full shadow-md animate-pulse"
                                    style={{
                                        background: `radial-gradient(circle at 30% 30%, ${card.iconColor}, #000000)`,
                                        boxShadow: `0 0 16px ${card.iconColor}`,
                                    }}
                                ></div>
                                <p className="text-4xl font-bold text-white">{card.percentage}</p>
                            </div>
                            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                            <p className="mt-2 text-sm text-gray-300">{card.description}</p>
                            <span className="mt-4 inline-block text-sm text-[#38bdf8] border-b-2 border-transparent group-hover:border-[#38bdf8] transition duration-200">
                                Learn more →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BooklioMobileCards;
