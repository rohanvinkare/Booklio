import { motion } from 'framer-motion';
import {
    BookOpen,
    ShoppingBag,
    Truck,
    Shield,
    Users,
    Store,
    CreditCard,
    HeartHandshake
} from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <BookOpen className="h-8 w-8" />,
            title: "Extensive Book Collection",
            description: "Access to millions of books across various genres, from bestsellers to rare finds."
        },
        {
            icon: <ShoppingBag className="h-8 w-8" />,
            title: "Easy Shopping",
            description: "User-friendly interface for seamless browsing and purchasing experience."
        },
        {
            icon: <Truck className="h-8 w-8" />,
            title: "Fast Delivery",
            description: "Quick and reliable shipping services to get your books to you as soon as possible."
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Secure Transactions",
            description: "Safe and encrypted payment processing for worry-free shopping."
        }
    ];

    const services = [
        {
            icon: <Users className="h-8 w-8" />,
            title: "Customer Support",
            description: "24/7 dedicated support team to assist you with any queries or concerns."
        },
        {
            icon: <Store className="h-8 w-8" />,
            title: "Seller Platform",
            description: "Platform for bookstores and individual sellers to reach a wider audience."
        },
        {
            icon: <CreditCard className="h-8 w-8" />,
            title: "Multiple Payment Options",
            description: "Various payment methods including credit cards, digital wallets, and more."
        },
        {
            icon: <HeartHandshake className="h-8 w-8" />,
            title: "Return Policy",
            description: "Hassle-free return and refund process for customer satisfaction."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Welcome to <span className="text-blue-500 font-unbounded">Booklio</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Your premier destination for discovering, buying, and selling books online.
                            We connect readers with their next favorite book and sellers with their perfect audience.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            To create a vibrant community where book lovers can easily access their favorite reads
                            while providing a platform for sellers to grow their business in the digital age.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Key Features</h2>
                        <p className="text-gray-400">Discover what makes Booklio special</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="bg-gray-800 p-6 rounded-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                            >
                                <div className="text-blue-500 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
                        <p className="text-gray-400">Comprehensive solutions for readers and sellers</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                className="bg-gray-900 p-6 rounded-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                            >
                                <div className="text-blue-500 mb-4">{service.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                <p className="text-gray-400">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-3xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-gray-400 mb-8">
                        Join our community of book lovers and sellers today. Whether you're looking to find your next read
                        or want to start selling books online, Booklio is here to help.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="/shop"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300"
                        >
                            Start Shopping
                        </a>
                        <a
                            href="/auth/seller/register"
                            className="px-6 py-3 border border-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors duration-300"
                        >
                            Become a Seller
                        </a>
                    </div>
                </motion.div>
            </section>

        </div>
    );
}

export default About;