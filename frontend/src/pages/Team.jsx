import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const teamMembers = [
    {
        name: "Abhishek Sahay",
        role: "Full Stack Developer",
        image: "", // Add your image path
        bio: "Passionate about creating seamless web experiences and solving complex problems through elegant code.",
        github: "https://github.com/abhi5hek001",
        linkedin: "https://www.linkedin.com/in/abhi5hek001/",
        email: "sahayabhishek.edu@gmail.com"
    },
    {
        name: "Rohan Vinkare",
        role: "Full Stack Developer",
        image: "", // Add your image path
        bio: "Creative designer focused on crafting beautiful and intuitive user interfaces that delight users.",
        github: "",
        linkedin: "",
        email: ""
    },
    {
        name: "Mamatha Krishna",
        role: "Full Stack Developer",
        image: "", // Add your image path
        bio: "Passionate about creating seamless web experiences and solving complex problems through elegant code.",
        github: "",
        linkedin: "",
        email: ""
    },
    {
        name: "Sujal Awargand",
        role: "Full Stack Developer",
        image: "", // Add your image path
        bio: "Creative designer focused on crafting beautiful and intuitive user interfaces that delight users.",
        github: "",
        linkedin: "",
        email: ""
    },
    {
        name: "Paritosh Tigga",
        role: "Full Stack Developer",
        image: "", // Add your image path
        bio: "Creative designer focused on crafting beautiful and intuitive user interfaces that delight users.",
        github: "",
        linkedin: "",
        email: ""
    },
];

export const Team = () => {
    return (
        <div className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.h1 
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Meet Our Team
                    </motion.h1>
                    <motion.p 
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        We're a passionate team dedicated to revolutionizing the way people discover and purchase books online.
                    </motion.p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="relative group">
                                <img 
                                    src={member.image} 
                                    alt={member.name}
                                    className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=256`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                                <p className="text-blue-400 text-sm mb-4">{member.role}</p>
                                <p className="text-gray-400 text-sm mb-6">{member.bio}</p>
                                
                                {/* Social Links */}
                                <div className="flex items-center space-x-4">
                                    <a 
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Github className="h-5 w-5" />
                                    </a>
                                    <a 
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a 
                                        href={`mailto:${member.email}`}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Mail className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Section */}
                <motion.div 
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold text-white mb-4">Want to Join Our Team?</h2>
                    <p className="text-gray-400 mb-6">We're always looking for talented individuals to join our mission.</p>
                    <a 
                        href="mailto:sahayabhishek.edu@gmail.com" 
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                    >
                        Get in Touch
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
