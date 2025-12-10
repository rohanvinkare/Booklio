import { motion } from "framer-motion";
import {
    BookOpen,
    ShoppingBag,
    Truck,
    Shield,
    Users,
    Store,
    CreditCard,
    HeartHandshake,
} from "lucide-react";
import { AuroraText } from "@/components/magicui/aurora-text";

const features = [
    {
        icon: <BookOpen className="h-8 w-8 group-hover:text-gradient" />,
        title: "Extensive Book Collection",
        description: "Access to millions of books across various genres, from bestsellers to rare finds.",
    },
    {
        icon: <ShoppingBag className="h-8 w-8 group-hover:text-gradient" />,
        title: "Easy Shopping",
        description: "User-friendly interface for seamless browsing and purchasing experience.",
    },
    {
        icon: <Truck className="h-8 w-8 group-hover:text-gradient" />,
        title: "Fast Delivery",
        description: "Quick and reliable shipping services to get your books to you as soon as possible.",
    },
    {
        icon: <Shield className="h-8 w-8 group-hover:text-gradient" />,
        title: "Secure Transactions",
        description: "Safe and encrypted payment processing for worry-free shopping.",
    },
];

const services = [
    {
        icon: <Users className="h-8 w-8 group-hover:text-gradient" />,
        title: "Customer Support",
        description: "24/7 dedicated support team to assist you with any queries or concerns.",
    },
    {
        icon: <Store className="h-8 w-8 group-hover:text-gradient" />,
        title: "Seller Platform",
        description: "Platform for bookstores and individual sellers to reach a wider audience.",
    },
    {
        icon: <CreditCard className="h-8 w-8 group-hover:text-gradient" />,
        title: "Multiple Payment Options",
        description: "Various payment methods including credit cards, digital wallets, and more.",
    },
    {
        icon: <HeartHandshake className="h-8 w-8 group-hover:text-gradient" />,
        title: "Return Policy",
        description: "Hassle-free return and refund process for customer satisfaction.",
    },
];

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#0e0a1f] to-black text-white font-sans">
            {/* Hero Section */}
            <section className="py-20 px-6 sm:px-10 lg:px-24">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <AuroraText className="text-4xl md:text-5xl font-bold mb-6">Welcome to Booklio</AuroraText>
                        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                            Your premier destination for discovering, buying, and selling books online.
                            We connect readers with their next favorite book and sellers with their perfect audience.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 px-6 sm:px-10 lg:px-24">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <AuroraText className="text-3xl font-bold mb-4">Our Mission</AuroraText>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            To create a vibrant community where book lovers can easily access their favorite reads,
                            while providing a platform for sellers to grow their business in the digital age.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6 sm:px-10 lg:px-24">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <AuroraText className="text-3xl font-bold mb-4">Key Features</AuroraText>
                        <p className="text-gray-400">Discover what makes Booklio special</p>
                    </motion.div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                className="bg-black/60 p-6 rounded-xl shadow-lg border border-[#1c1b29] group hover:shadow-[0_0_30px_5px_rgba(121,40,202,0.4)] transition-all"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                            >
                                <div className="mb-4">{f.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-400">{f.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 px-6 sm:px-10 lg:px-24">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <AuroraText className="text-3xl font-bold mb-4">Our Services</AuroraText>
                        <p className="text-gray-400">Comprehensive solutions for readers and sellers</p>
                    </motion.div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((s, i) => (
                            <motion.div
                                key={s.title}
                                className="bg-black/60 p-6 rounded-xl shadow-lg border border-[#1c1b29] group hover:shadow-[0_0_30px_5px_rgba(255,0,128,0.3)] transition-all"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                            >
                                <div className="mb-4">{s.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                                <p className="text-gray-400">{s.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 sm:px-10 lg:px-24">
                <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <AuroraText className="text-3xl font-bold mb-6">Ready to Start Your Journey?</AuroraText>
                    <p className="text-gray-400 mb-8">
                        Join our community of book lovers and sellers today. Whether you're looking to find your next read
                        or want to start selling books online, Booklio is here to help.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <a href="/shop" className="px-6 py-3 bg-gradient-to-r from-[#FF0080] via-[#7928CA] to-[#38bdf8] text-white rounded-lg font-semibold shadow-md hover:shadow-[0_0_10px_2px_rgba(255,0,128,0.4)] transition-all">
                            Start Shopping
                        </a>
                        <a href="/auth/seller/register" className="px-6 py-3 border border-[#7928CA] text-white rounded-lg hover:bg-[#7928ca1a] transition-all font-semibold">
                            Become a Seller
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
