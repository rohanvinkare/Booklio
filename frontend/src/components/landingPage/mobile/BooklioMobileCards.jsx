"use client";
import { Link } from "react-router-dom";

const cardData = [
    {
        title: "Boosted Reading Engagement",
        percentage: "47%",
        description:
            "Booklio has increased daily reading time among users by integrating personalized book recommendations and interactive summaries.",
        iconColor: "#C084FC", // Neon Purple
        glowColor: "#9333EA",
        link: "/shop",
    },
    {
        title: "30% Growth in Book Sales",
        percentage: "30%",
        description:
            "By connecting authors with targeted audiences, Booklio has helped independent writers grow their reach and revenue significantly.",
        iconColor: "#22D3EE", // Neon Cyan
        glowColor: "#06B6D4",
        link: "/shop",
    },
    {
        title: "Frictionless Discovery",
        percentage: "15%",
        description:
            "Our smart search and swipeable previews reduce time-to-read by surfacing the right book faster, tailored to user mood and genre.",
        iconColor: "#F472B6", // Neon Rose
        glowColor: "#DB2777",
        link: "/shop",
    },
];

const BooklioMobileCards = () => {
    return (
        <div className="w-full px-4 py-10 bg-[#060606] text-white rounded-t-3xl">
            <div className="grid grid-cols-1 gap-6">
                {cardData.map((card, idx) => (
                    <Link
                        key={idx}
                        to={card.link}
                        className="relative z-10 p-5 flex flex-col rounded-xl shadow-xl transition group overflow-hidden"
                        style={{
                            backgroundColor: "#000000",
                            backgroundImage: `linear-gradient(135deg, ${card.glowColor}22 0%, transparent 20%)`,
                            border: "1px solid rgba(255,255,255,0.05)",
                        }}
                    >
                        {/* Optional soft blur overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent blur-2xl opacity-10 pointer-events-none z-0" />

                        {/* Icon + Stat */}
                        <div className="flex items-center justify-start space-x-4 mb-4 z-10">
                            <div
                                className="h-10 w-10 rounded-full shadow-lg"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, ${card.iconColor}, #000000)`,
                                    boxShadow: `0 0 12px ${card.iconColor}`,
                                }}
                            ></div>
                            <p className="text-4xl font-bold">{card.percentage}</p>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-semibold z-10">{card.title}</h3>
                        <p className="mt-2 text-sm text-neutral-300 z-10">{card.description}</p>

                        {/* CTA */}
                        <span className="mt-auto pt-4 text-yellow-300 text-sm font-medium border-b-2 border-neutral-700 group-hover:border-yellow-300 transition z-10">
                            Learn more
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BooklioMobileCards;
