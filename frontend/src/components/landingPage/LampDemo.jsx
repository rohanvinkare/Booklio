
// import { motion } from "motion/react";
// import { LampContainer } from "../ui/lamp";

// const LampDemo = () => {
//     return (
//         <LampContainer>
//             <motion.h1
//                 initial={{ opacity: 0.5, y: 100 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{
//                     delay: 0.3,
//                     duration: 0.8,
//                     ease: "easeInOut",
//                 }}
//                 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
//                 From Shelf To Self <br />
//                 <span className="pt-2">With</span><br />
//                 <span className="bg-gradient-to-r from-blue-600 via-[#00acf5] to-[#00a0f5] bg-clip-text text-transparent">
//                     Booklio
//                 </span>
//             </motion.h1>
//         </LampContainer>
//     );
// }

// export default LampDemo;


import { motion } from "motion/react";
import { LampContainer } from "../ui/lamp";

const LampDemo = () => {
    return (
        <LampContainer>
            <motion.h1
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="mt-6 sm:mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-2 sm:py-4 bg-clip-text text-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-snug text-transparent"
            >
                From Shelf To Self <br />
                <span className="block pt-2">With</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-[#00acf5] to-[#00a0f5] bg-clip-text text-transparent">
                    Booklio
                </span>
            </motion.h1>
        </LampContainer>
    );
};

export default LampDemo;
