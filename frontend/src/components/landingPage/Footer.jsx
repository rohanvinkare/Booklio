import { Facebook, Github, Mail, Linkedin, Users } from 'lucide-react';

import GradientText from '../ui/GradientText'

import { Link } from "react-router-dom";



export const Footer = () => {
    return (
        <footer className="bg-[#060606] text-gray-300 sticky">
            <div className="container mx-auto px-5 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 justify-items-center text-center">
                    {/* Brand Section - Full width on mobile, 2 cols on tablet, 1 col on desktop */}
                    <div className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">


                        <Link to="/" className="inline-block">
                            {/* <h2 className="font-unbounded text-4xl font-bold bg-blue-500 bg-clip-text text-transparent">
                                Booklio
                            </h2> */}

                            <GradientText
                                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                                animationSpeed={10}
                                showBorder={false}
                                // className="custom-class"
                                className="custom-class font-unbounded text-4xl font-bold bg-blue-500 bg-clip-text text-transparent"
                            >
                                Booklio
                            </GradientText>
                        </Link>


                        <Link to="/team"
                            className="flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group"
                        >
                            <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">Our Team</span>
                        </Link>

                    </div>

                    {/* Left column on tablet */}
                    <div className="space-y-4 order-1 sm:order-2 lg:order-none">
                        <h3 className="text-lg font-semibold text-blue-400">Get To Know Us</h3>
                        <div className="h-px w-12 bg-blue-400 mx-auto"></div>
                        <div className="space-y-2">
                            <Link to="/about"
                                className="block text-sm hover:text-blue-400 transition-colors"
                            >
                                About Booklio
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4 order-2 sm:order-3 lg:order-none">
                        <h3 className="text-lg font-semibold text-blue-400">Make Money With Us</h3>
                        <div className="h-px w-12 bg-blue-400 mx-auto"></div>
                        <div className="space-y-2">

                            <Link to="/auth/seller/login"
                                className="block text-sm hover:text-blue-400 transition-colors"
                            >
                                Sell on Booklio
                            </Link>

                            <Link to="/auth/admin/login"
                                className="block text-sm hover:text-blue-400 transition-colors"
                            >
                                Management Account
                            </Link>

                        </div>
                    </div>

                    {/* Right column on tablet */}
                    <div className="space-y-4 order-3 sm:order-4 lg:order-none">
                        <h3 className="text-lg font-semibold text-blue-400">Let Us Help You</h3>
                        <div className="h-px w-12 bg-blue-400 mx-auto"></div>
                        <div className="space-y-2">

                            <Link to="/user"
                                className="block text-sm hover:text-blue-400 transition-colors"
                            >
                                Your Account
                            </Link>

                        </div>
                    </div>

                    <div className="space-y-4 order-4 sm:order-5 lg:order-none">
                        <h3 className="text-lg font-semibold text-blue-400">Connect With Us</h3>
                        <div className="h-px w-12 bg-blue-400 mx-auto"></div>
                        <div className="flex gap-4 justify-center">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-6 w-6 hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="Github"
                            >
                                <Github className="h-6 w-6 hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="Gmail"
                            >
                                <Mail className="h-6 w-6 hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-6 w-6 hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Booklio. All rights reserved.
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500">
                            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}