import { Facebook, Github, Mail, Linkedin, Users } from 'lucide-react';
import GradientText from '../ui/GradientText';
import { Link } from "react-router-dom";

export const Footer = () => {
    return (

        <footer className="bg-transparent text-gray-300">
            <div className="container mx-auto px-5 py-12 sm:py-16 min-h-[300px]"> 
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-8 text-center sm:text-left">
                    {/* Brand + Team */}
                    <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-block">
                            <GradientText
                                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                                animationSpeed={10}
                                showBorder={false}
                                className="custom-class font-unbounded text-4xl font-bold"
                            >
                                Booklio
                            </GradientText>
                        </Link>
     
                        <Link
                            to="/team"
                            className="flex justify-center sm:justify-start items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group"
                        >
                            <Users className="h-5 w-5 group-hover:scale-110 transition-transform text-red-600" /> 
                            <span className="text-sm font-bold text-white/90">About Devloper </span>
                        </Link>
                    </div>

                    {/* Get to Know Us */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-400">Get To Know Us</h3>
                        <div className="h-px w-12 bg-blue-400 mx-auto sm:mx-0" />
                        <Link to="/about" className="block text-sm hover:text-blue-400 transition-colors">
                            About Booklio
                        </Link>
                    </div>

                    {/* Make Money */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-400">Make Money With Us</h3>
                        <div className="h-px w-12 bg-blue-400 mx-auto sm:mx-0" />
                        <Link to="/auth/seller/login" className="block text-sm hover:text-blue-400 transition-colors">
                            Sell on Booklio
                        </Link>
                        <Link to="/auth/admin/login" className="block text-sm hover:text-blue-400 transition-colors">
                            Management Account
                        </Link>
                    </div>

                    {/* Help */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-400">Let Us Help You</h3>
                        <div className="h-px w-12 bg-blue-400 mx-auto sm:mx-0" />
                        <Link to="/user" className="block text-sm hover:text-blue-400 transition-colors">
                            Your Account
                        </Link>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-400">Connect With Us</h3>
                        <div className="h-px w-12 bg-blue-400 mx-auto sm:mx-0" />
                        <div className="flex justify-center sm:justify-start gap-4">
                            {/* ✅ Icon sizes fixed */}
                            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Facebook className="w-6 h-6 hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" aria-label="Github" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Github className="w-6 h-6 hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" aria-label="Gmail" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Mail className="w-6 h-6 hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Linkedin className="w-6 h-6 hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} Booklio. All rights reserved.</p>
                        <div className="flex gap-4">
                            <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="hover:text-blue-400 transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
