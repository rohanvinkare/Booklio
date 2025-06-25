// import { Container } from "@/components/landingPage/Container";
// import { FadeIn } from "@/components/landingPage/FadeIn";


// export const Usps = () => {
//     return (
//         <Container className="relative z-10 text-3xl md:text-4xl font-bold space-y-1 bg-[#060606] text-white max-w-[692px] mt-20 py-16">
//             <FadeIn>
//                 <p className="py-5">Explore top-rated titles across all genres, from bestsellers to hidden gems — all in one place.</p>
//             </FadeIn>
//             <FadeIn>
//                 <p className="py-5">Discover books tailored to your taste with our smart recommendation engine, designed to match you with your next favorite read.</p>
//             </FadeIn>

//             <FadeIn>
//                 <p className="py-5">Get your favorite books delivered fast and free with our nationwide shipping service.</p>
//             </FadeIn>
//             <FadeIn>
//                 <p className="py-5">Stay ahead with early access to the latest books at unbeatable prices, only for our members.</p>
//             </FadeIn>
//         </Container>
//     );
// }

import { Container } from "@/components/landingPage/Container";
import { FadeIn } from "@/components/landingPage/FadeIn";

export const Usps = () => {
    return (
        <Container className="relative z-10 text-white font-semibold text-2xl sm:text-3xl md:text-4xl max-w-4xl py-20 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-lg">
            <div className="space-y-10">
                <FadeIn>
                    <p className="py-2 transition duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#FF0080] hover:via-[#7928CA] hover:to-[#38bdf8]">
                        Explore top-rated titles across all genres, from bestsellers to hidden gems — all in one place.
                    </p>
                </FadeIn>

                <FadeIn>
                    <p className="py-2 transition duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#38bdf8] via-[#7928CA] to-[#FF0080]">
                        Discover books tailored to your taste with our smart recommendation engine, designed to match you with your next favorite read.
                    </p>
                </FadeIn>

                <FadeIn>
                    <p className="py-2 transition duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#7928CA] via-[#FF0080] to-[#38bdf8]">
                        Get your favorite books delivered fast and free with our nationwide shipping service.
                    </p>
                </FadeIn>

                <FadeIn>
                    <p className="py-2 transition duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#0070F3] via-[#7928CA] to-[#FF0080]">
                        Stay ahead with early access to the latest books at unbeatable prices, only for our members.
                    </p>
                </FadeIn>
            </div>
        </Container>
    );
};
