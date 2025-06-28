// OtherSellersSection.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const OtherSellersSection = ({ sellers }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-12"
    >
        <h2 className="text-3xl font-bold text-white text-center mb-8">
            Other Sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
                {sellers.map((seller) => (
                    <SellerCard key={seller.sellerId} seller={seller} />
                ))}
            </AnimatePresence>
        </div>
    </motion.div>
);

const SellerCard = ({ seller }) => (
    <Dialog>
        <DialogTrigger asChild>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
            >
                <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="p-4">
                        <div className="flex flex-col items-center space-y-3">
                            <SellerImage seller={seller} />
                            <h3 className="text-lg font-semibold text-white text-center">
                                {seller.storeName}
                            </h3>
                            <p className="text-sm text-gray-400 text-center">
                                {seller.address.city}, {seller.address.state}
                            </p>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                                View Details
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </DialogTrigger>
        <SellerDetailsDialogContent seller={seller} />
    </Dialog>
);

const SellerImage = ({ seller }) => (
    <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
        <img
            src={seller.image}
            alt={seller.storeName}
            loading="lazy"
            decoding="async"
            className="relative w-20 h-20 object-cover rounded-full border-2 border-blue-500"
        />
    </div>
);

const SellerDetailsDialogContent = ({ seller }) => (
    <DialogContent className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 max-w-2xl">
        <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {seller.storeName}
            </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
            <div className="flex justify-center">
                <SellerLargeImage seller={seller} />
            </div>
            <div className="space-y-4">
                <InfoCard title="Seller" content={seller.name} />
                <InfoCard title="Description" content={seller.storeDescription} />
                <InfoCard
                    title="Location"
                    content={`${seller.address.street}, ${seller.address.city}, ${seller.address.state}, ${seller.address.zipCode}`}
                />
                <InfoCard title="Contact" content={seller.email} />
                <SocialMediaLinks seller={seller} />
                <Button
                    onClick={() => alert(`Contacting ${seller.name}`)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    Contact Seller
                </Button>
            </div>
        </div>
    </DialogContent>
);

const SellerLargeImage = ({ seller }) => (
    <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30"></div>
        <img
            src={seller.image}
            alt={seller.storeName}
            loading="lazy"
            decoding="async"
            className="relative w-32 h-32 object-cover rounded-full border-4 border-blue-500"
        />
    </div>
);

const SocialMediaLinks = ({ seller }) => (
    <div className="flex justify-center space-x-4">
        <SocialMediaIcon
            href={seller.socialMediaLinks?.facebook}
            icon={<FaFacebookF size={24} />}
            color="text-blue-500 hover:text-blue-400"
        />
        <SocialMediaIcon
            href={seller.socialMediaLinks?.instagram}
            icon={<FaInstagram size={24} />}
            color="text-pink-500 hover:text-pink-400"
        />
        <SocialMediaIcon
            href={seller.socialMediaLinks?.linkedin}
            icon={<FaLinkedin size={24} />}
            color="text-blue-400 hover:text-blue-300"
        />
    </div>
);

const SocialMediaIcon = ({ href, icon, color }) => (
    <motion.a
        whileHover={{ scale: 1.2, rotate: 10 }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${color} transition-colors duration-300`}
    >
        {icon}
    </motion.a>
);

const InfoCard = ({ title, content }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm">
        <p className="text-gray-300">
            <span className="font-semibold text-blue-400">{title}:</span> {content}
        </p>
    </div>
);

export default OtherSellersSection;