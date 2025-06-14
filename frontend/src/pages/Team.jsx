// import { Github, Linkedin, Mail } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { BorderBeam } from "@/components/magicui/border-beam";
// import BlurText from "@/components/ui/BlurText.jsx";

// const teamMembers = [
//     {
//         name: "Rohan Vinkare",
//         role: "Full Stack Developer",
//         image: "",
//         bio: "Full stack developer turning ideas into scalable web apps with clean code and smart architecture.",
//         github: "https://github.com/rohanvinkare",
//         linkedin: "https://www.linkedin.com/in/rohan-vinkare/",
//         email: "rohanvinkare2022@gmail.com"
//     },
//     {
//         name: "Abhishek Sahay",
//         role: "Full Stack Developer",
//         image: "",
//         bio: "Passionate about creating seamless web experiences and solving complex problems through elegant code.",
//         github: "https://github.com/abhi5hek001",
//         linkedin: "https://www.linkedin.com/in/abhi5hek001/",
//         email: "sahayabhishek.edu@gmail.com"
//     },

//     {
//         name: "Mamatha Krishna",
//         role: "Full Stack Developer",
//         image: "",
//         bio: "Passionate about creating seamless web experiences and solving complex problems through elegant code.",
//         github: "",
//         linkedin: "",
//         email: ""
//     },
//     {
//         name: "Sujal Awargand",
//         role: "Full Stack Developer",
//         image: "",
//         bio: "Creative designer focused on crafting beautiful and intuitive user interfaces that delight users.",
//         github: "",
//         linkedin: "",
//         email: ""
//     },
//     {
//         name: "Paritosh Tigga",
//         role: "Full Stack Developer",
//         image: "",
//         bio: "Creative designer focused on crafting beautiful and intuitive user interfaces that delight users.",
//         github: "",
//         linkedin: "",
//         email: ""
//     },
// ];

// const Team = () => {
//     return (
//         <>
//             <div className="min-h-screen bg-[#000003] text-white/90 py-20 px-6">
//                 <div className="max-w-7xl mx-auto">

//                     <div className="text-center mb-16 px-4 sm:px-8 md:px-12 lg:px-20">
//                         <div className="flex justify-center">
//                             <BlurText
//                                 text="Our Core Team"
//                                 delay={100}
//                                 animateBy="opacity"
//                                 direction="top"
//                                 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
//                             />
//                         </div>

//                         <motion.p
//                             className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto"
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.6, delay: 0.2 }}
//                         >
//                             A team of passionate creators building the future of how books are discovered and enjoyed.
//                         </motion.p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//                         {teamMembers.map((member, index) => (
//                             <motion.div
//                                 key={member.name}
//                                 className="relative flex flex-col justify-between rounded-2xl bg-[#060010] group overflow-hidden border border-[#111835] shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_#3b82f6] transition-all duration-300 hover:-translate-y-1 p-5 h-full"
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.4, delay: index * 0.1 }}
//                             >
//                                 {/* Avatar / Fallback */}
//                                 <div className="w-full h-48 overflow-hidden rounded-xl mb-4 bg-[#060010]">
//                                     <img
//                                         src={member.image}
//                                         alt={member.name}
//                                         onError={(e) => {
//                                             e.target.onerror = null;
//                                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                                                 member.name
//                                             )}&background=060010&color=ffffff&size=256`;
//                                         }}
//                                         className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
//                                     />
//                                 </div>

//                                 {/* Text Info */}
//                                 <div className="text-center flex flex-col flex-grow px-2">
//                                     <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
//                                     <p className="text-sm text-blue-400 mb-2">{member.role}</p>
//                                     <p className="text-sm text-neutral-400 mb-4 line-clamp-3">{member.bio}</p>

//                                     {/* Social Icons */}
//                                     <div className="mt-auto flex justify-center gap-4">
//                                         {member.github && (
//                                             <a
//                                                 href={member.github}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-neutral-400 hover:text-blue-400 transition"
//                                             >
//                                                 <Github className="w-5 h-5" />
//                                             </a>
//                                         )}
//                                         {member.linkedin && (
//                                             <a
//                                                 href={member.linkedin}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-neutral-400 hover:text-blue-400 transition"
//                                             >
//                                                 <Linkedin className="w-5 h-5" />
//                                             </a>
//                                         )}
//                                         {member.email && (
//                                             <a
//                                                 href={`mailto:${member.email}`}
//                                                 className="text-neutral-400 hover:text-blue-400 transition"
//                                             >
//                                                 <Mail className="w-5 h-5" />
//                                             </a>
//                                         )}
//                                     </div>
//                                 </div>
//                             </motion.div>

//                         ))}
//                     </div>

//                     <motion.div
//                         className="text-center mt-20"
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6, delay: 0.3 }}
//                     >
//                         <h2 className="text-2xl font-semibold text-white mb-2">Interested in Collaborating?</h2>
//                         <p className="text-neutral-400 mb-6">We're always excited to connect with talented minds.</p>


//                         <Button className="relative overflow-hidden bg-[#060010] hover:bg-white/90 hover:text-black hover:font-extrabold" size="lg">
//                             Contact Us
//                             <BorderBeam
//                                 size={70}
//                                 initialOffset={40}
//                                 className="from-transparent via-yellow-400 to-transparent"
//                                 transition={{
//                                     type: "spring",
//                                     stiffness: 80,
//                                     damping: 50,
//                                 }}
//                             />
//                         </Button>
//                     </motion.div>
//                 </div>


//             </div>
//         </>

//     );
// };

// export default Team;


import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import BlurText from "@/components/ui/BlurText.jsx";

const teamMembers = [
    {
        name: "Rohan Vinkare",
        role: "Full Stack Developer",
        image: "",
        bio: "Full stack developer turning ideas into scalable web apps with clean code and smart architecture.",
        github: "https://github.com/rohanvinkare",
        linkedin: "https://www.linkedin.com/in/rohan-vinkare/",
        email: "rohanvinkare2022@gmail.com",
    },
    {
        name: "Abhishek Sahay",
        role: "Full Stack Developer",
        image: "",
        bio: "Passionate about creating seamless web experiences and solving complex problems through elegant code.",
        github: "https://github.com/abhi5hek001",
        linkedin: "https://www.linkedin.com/in/abhi5hek001/",
        email: "sahayabhishek.edu@gmail.com",
    },
    {
        name: "Mamatha Krishna",
        role: "Full Stack Developer",
        image: "",
        bio: "Passionate about creating seamless web experiences and solving complex problems through elegant code.",
        github: "",
        linkedin: "",
        email: "",
    },
    {
        name: "Sujal Awargand",
        role: "Full Stack Developer",
        image: "",
        bio: "Creative designer focused on crafting beautiful and intuitive user interfaces that delight users.",
        github: "",
        linkedin: "",
        email: "",
    },
    {
        name: "Paritosh Tigga",
        role: "Full Stack Developer",
        image: "",
        bio: "Creative designer focused on crafting beautiful and intuitive user interfaces that delight users.",
        github: "",
        linkedin: "",
        email: "",
    },
];

const Team = () => {
    return (
        <div className="min-h-screen bg-[#000003] text-white/90 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 px-4 sm:px-8 md:px-12 lg:px-20">
                    <div className="flex justify-center">
                        <BlurText
                            text="Our Core Team"
                            delay={100}
                            animateBy="opacity"
                            direction="top"
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
                        />
                    </div>

                    <motion.p
                        className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        A team of passionate creators building the future of how books are discovered and enjoyed.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {teamMembers.map((member, index) => {
                        const imageSrc =
                            member.image && member.image.trim() !== ""
                                ? member.image
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    member.name
                                )}&background=060010&color=ffffff&size=256`;

                        return (
                            <motion.div
                                key={member.name}
                                className="relative flex flex-col justify-between rounded-2xl bg-[#060010] group overflow-hidden border border-[#111835] shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_#3b82f6] transition-all duration-300 hover:-translate-y-1 p-5 h-full"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                {/* Avatar */}
                                <div className="w-full h-48 overflow-hidden rounded-xl mb-4 bg-[#060010]">
                                    <img
                                        src={imageSrc}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Info */}
                                <div className="text-center flex flex-col flex-grow px-2">
                                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                                    <p className="text-sm text-blue-400 mb-2">{member.role}</p>
                                    <p className="text-sm text-neutral-400 mb-4 line-clamp-3">{member.bio}</p>

                                    {/* Social Icons */}
                                    <div className="mt-auto flex justify-center gap-4">
                                        {member.github && (
                                            <a
                                                href={member.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neutral-400 hover:text-blue-400 transition"
                                            >
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.linkedin && (
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-neutral-400 hover:text-blue-400 transition"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.email && (
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="text-neutral-400 hover:text-blue-400 transition"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    className="text-center mt-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className="text-2xl font-semibold text-white mb-2">Interested in Collaborating?</h2>
                    <p className="text-neutral-400 mb-6">We're always excited to connect with talented minds.</p>

                    <Button className="relative overflow-hidden bg-[#060010] hover:bg-white/90 hover:text-black hover:font-extrabold" size="lg">
                        Contact Us
                        <BorderBeam
                            size={70}
                            initialOffset={40}
                            className="from-transparent via-yellow-400 to-transparent"
                            transition={{
                                type: "spring",
                                stiffness: 80,
                                damping: 50,
                            }}
                        />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default Team;
