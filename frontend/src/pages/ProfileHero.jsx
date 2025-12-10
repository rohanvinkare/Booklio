import { Mail, MapPin, PhoneCall, Building } from "lucide-react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { AuroraText } from "@/components/magicui/aurora-text";


export default function ProfileHero() {
    const techStack = [
        { name: "GitHub", logo: "https://images.icon-icons.com/3685/PNG/512/github_logo_icon_229278.png" },
        { name: "GitHub Actions", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
        { name: "DockerHub", logo: "https://www.svgrepo.com/show/452192/docker.svg" },
        { name: "AWS", logo: "https://www.svgrepo.com/show/448266/aws.svg" },
        { name: "EC2", logo: "https://icon.icepanel.io/AWS/svg/Compute/EC2.svg" },
        { name: "S3", logo: "https://icon.icepanel.io/AWS/svg/Storage/S3-on-Outposts.svg" },
        { name: "CloudFront", logo: "https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/CloudFront.svg" },
        { name: "Cloudflare", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg" },
        { name: "Cloudinary", logo: "https://www.svgrepo.com/show/353566/cloudinary.svg" },
        { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "Express", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "Redis", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
        { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Tailwind", logo: "https://images.icon-icons.com/2107/PNG/512/file_type_tailwind_icon_130128.png" },
        { name: "Redux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
        { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { name: "JWT", logo: "https://img.icons8.com/?size=48&id=rHpveptSuwDz&format=png" },
        { name: "Swagger", logo: "https://www.svgrepo.com/show/354420/swagger.svg" },
        { name: "Lighthouse", logo: "https://www.svgrepo.com/show/353997/lighthouse.svg" },
        { name: "Postman", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
    ];

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#000000] via-[#0d0b1e] to-black text-white font-sans px-6 sm:px-10 md:px-16 lg:px-24 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center md:items-start gap-6">
                    <img
                        src="https://avatars.githubusercontent.com/u/121507046?v=4"
                        alt="Rohan Profile"
                        className="rounded-3xl w-40 sm:w-56 md:w-64 h-56 sm:h-72 md:h-80 object-cover shadow-xl border-4 border-neutral-800"
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="md:col-span-2">
                    <p className="text-base sm:text-lg mb-1 text-[#FF0080] font-medium">Hello Everyone 👋</p>
                    <AuroraText className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-3">
                        Rohan Vinkare
                    </AuroraText>
                    <h2 className="text-lg sm:text-2xl lg:text-4xl text-neutral-400 font-light">
                        I build performant web systems & robust backend architectures.
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-base text-gray-300">
                        <div className="flex items-center gap-3"><Building size={20} /> IIIT Sri City</div>
                        <div className="flex items-center gap-3"><PhoneCall size={20} /> +91-8605515171</div>
                        <div className="flex items-center gap-3"><Mail size={20} /> rohanvinkare2022@gmail.com</div>
                        <div className="flex items-center gap-3"><MapPin size={20} /> India</div>
                    </div>

                    <div className="flex gap-5 mt-6 text-2xl">
                        {[{
                            icon: <FaGithub />, link: "https://github.com/rohanvinkare"
                        }, {
                            icon: <FaLinkedin />, link: "https://www.linkedin.com/in/rohan-vinkare/?originalSubdomain=in"
                        }, {
                            icon: <FaTwitter />, link: "https://twitter.com/rohanvinkare"
                        }, {
                            icon: <FaInstagram />, link: "https://instagram.com/rohanvinkare"
                        }].map((item, i) => (
                            <a
                                key={i}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition transform hover:scale-125 hover:-translate-y-1 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#FF0080] hover:via-[#7928CA] hover:to-[#38bdf8]"
                            >
                                {item.icon}
                            </a>
                        ))}
                    </div>

                    <p className="mt-6 text-gray-400 leading-relaxed max-w-3xl text-sm sm:text-base">
                        I’m a Full Stack Developer with deep focus on scalable backend systems,
                        DevOps automation, and delightful UI experiences. Former GDG Lead & Creative Director @ Nirvana.
                        Passionate about real-world tech, clean architecture, and making dev workflows efficient.
                    </p>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} viewport={{ once: true }} className="max-w-7xl mx-auto mt-20">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#7928CA] border-b-4 inline-block border-[#38bdf8] pb-2">
                    📖 What is Booklio?
                </h2>
                <p className="text-gray-300 text-base sm:text-lg max-w-5xl mb-4">
                    Booklio is a sleek, modern platform tailored for readers and indie publishers. Whether you're on the hunt for rare literary gems or launching your own book, Booklio offers a powerful yet intuitive space to connect, explore, and share.
                </p>
                <p className="text-gray-400 text-sm sm:text-base max-w-5xl">
                    Users enjoy personalized recommendations, seamless book listings, secure payment integration, and a mobile-first interface that ensures effortless interaction on any device.
                </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} viewport={{ once: true }} className="max-w-7xl mx-auto mt-16 mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-[#0070F3] border-b-4 inline-block border-[#FF0080] pb-2">
                    ⚙️ Tech Stack
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 items-center">
                    {techStack.map((tech, i) => (
                        <motion.div key={i} className="flex flex-col items-center gap-2 group cursor-pointer" whileHover={{ scale: 1.1, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 group-hover:border-[#FF0080] transition-all duration-300">
                                <img src={tech.logo} alt={tech.name} className="w-6 h-6 sm:w-8 sm:h-8 grayscale group-hover:grayscale-0 transition-all duration-300" />
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-400 group-hover:text-[#38bdf8] transition-colors duration-300 text-center">
                                {tech.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
